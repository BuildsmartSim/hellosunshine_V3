import { supabaseAdmin } from './supabaseAdmin';

export const inventory = {
    /**
     * Checks availability for a specific tier (price_id).
     * Returns true if available, false if sold out.
     */
    async checkAvailability(priceId: string): Promise<{ available: boolean; remaining: number; productId?: string; productName?: string; priceAmountPence?: number }> {
        try {
            // 1. Get Product Details
            const { data: product, error: productError } = await supabaseAdmin
                .from('products')
                .select('id, stock_limit, name, price_amount_pence')
                .eq('price_id', priceId)
                .single();

            if (productError || !product) {
                console.error(`Inventory check failed for ${priceId} (Product lookup):`, productError);
                // If product doesn't exist in DB yet, assume unlimited? Or closed?
                // Safety first: Closed.
                return { available: false, remaining: 0 };
            }

            // 2. Count Active Tickets for this Product
            const fifteenMinsAgo = new Date(Date.now() - 15 * 60000).toISOString();

            // We use standard Postgres syntax for OR condition via Supabase .or()
            const { count, error: countError } = await supabaseAdmin
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .eq('product_id', product.id)
                .or(`status.in.(active,used),and(status.eq.pending,created_at.gte.${fifteenMinsAgo})`);

            if (countError) {
                console.error(`Inventory check failed for ${priceId} (Ticket count):`, countError);
                return { available: false, remaining: 0 };
            }

            const sold = count || 0;
            const limit = product.stock_limit || 0; // If null, maybe unlimited? Assuming 0 for safety based on SQL
            const remaining = Math.max(0, limit - sold);

            return {
                available: remaining > 0,
                remaining,
                productId: product.id,
                productName: product.name,
                priceAmountPence: product.price_amount_pence || 0
            };
        } catch (err) {
            console.error('Inventory check exception:', err);
            return { available: false, remaining: 0 };
        }
    },

    /**
     * Get public inventory status for an array of price IDs.
     */
    async getBatchInventory(priceIds: string[]) {
        const results: Record<string, { remaining: number; soldOut: boolean }> = {};

        // This could be optimized into a single complex query, but loop is fine for < 20 items.
        // Parallelizing for speed.
        await Promise.all(priceIds.map(async (id) => {
            const status = await this.checkAvailability(id);
            results[id] = {
                remaining: status.remaining,
                soldOut: !status.available
            };
        }));

        return results;
    }
};
