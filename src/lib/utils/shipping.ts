import type { Product } from '$lib/types/Product';

export interface CartItemWithProduct {
	productId: string;
	quantity: number;
	product: {
		name: string;
		price: number;
		stock: number;
		description: string;
		shippingPrice?: number;
		canGroupShipping?: boolean;
	};
}

/**
 * Calculate shipping cost for cart items
 * If items can be grouped, only the highest shipping cost is applied
 * If items cannot be grouped, all shipping costs are summed
 */
export function calculateShippingCost(items: CartItemWithProduct[]): number {
	if (!items.length) return 0;

	// Separate items that can be grouped from those that cannot
	const groupableItems = items.filter((item) => item.product.canGroupShipping);
	const nonGroupableItems = items.filter((item) => !item.product.canGroupShipping);

	let totalShipping = 0;

	// For groupable items, take only the highest shipping cost
	if (groupableItems.length > 0) {
		const maxGroupableShipping = Math.max(
			...groupableItems.map((item) => item.product.shippingPrice || 0)
		);
		totalShipping += maxGroupableShipping;
	}

	// For non-groupable items, sum all shipping costs
	for (const item of nonGroupableItems) {
		totalShipping += item.product.shippingPrice || 0;
	}

	return totalShipping;
}

/**
 * Calculate total cost including products and shipping
 */
export function calculateTotalWithShipping(items: CartItemWithProduct[]): {
	subtotal: number;
	shipping: number;
	total: number;
} {
	const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
	const shipping = calculateShippingCost(items);
	const total = subtotal + shipping;

	return { subtotal, shipping, total };
}
