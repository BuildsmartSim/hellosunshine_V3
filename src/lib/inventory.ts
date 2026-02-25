import { supabaseAdmin } from './supabaseAdmin';

export const inventory = {
    /**
     * Checks availability for a specific tier (price_id).
     * Returns true if available, false if sold out.
     */
    async checkAvailability(priceId: string): Promise<{ available: boolean; remaining: number; productId?: string; productName?: string; priceAmountPence?: number }> {
        try {
            console.log(`[INVENTORY DEBUG] Checking availability for priceId: ${priceId}`);
            // 1. Get Product Details
            const { data: product, error: productError } = await supabaseAdmin
                .from('products')
                .select('id, stock_limit, name')
                .eq('price_id', priceId)
                .single();

            console.log(`[INVENTORY DEBUG] Product query result for ${priceId}:`, product);

            if (productError || !product) {
                console.error(`Inventory check failed for ${priceId} (Product lookup):`, productError);
                // If product doesn't exist in DB yet, assume unlimited? Or closed?
                // Safety first: Closed.
                return { available: false, remaining: 0 };
            }

            // 2. Count Active Tickets for this Product
            const fifteenMinsAgo = new Date(Date.now() - 15 * 60000).toISOString();

            // Simplified query dropping 'pending' status to support unmigrated local databases
            const { data: activeTickets, error: countError } = await supabaseAdmin
                .from('tickets')
                .select('id, status, created_at')
                .eq('product_id', product.id)
                .in('status', ['active', 'used']);

            if (countError) {
                console.error(`Inventory check failed for ${priceId} (Ticket count):`, countError);
                return { available: false, remaining: 0 };
            }

            // Manually filter
            const validTickets = activeTickets?.filter((t: any) => t.status === 'active' || t.status === 'used') || [];

            const sold = validTickets.length;
            const limit = product.stock_limit || 0; // If null, maybe unlimited? Assuming 0 for safety based on SQL
            const remaining = Math.max(0, limit - sold);

            return {
                available: remaining > 0,
                remaining,
                productId: product.id,
                productName: product.name
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
