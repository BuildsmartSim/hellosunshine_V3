'use server';

import { inventory } from '@/lib/inventory';

export async function checkInventoryAction(priceIds: string[]) {
    try {
        return await inventory.getBatchInventory(priceIds);
    } catch (error) {
        console.error('Failed to fetch inventory:', error);
        return {};
    }
}
