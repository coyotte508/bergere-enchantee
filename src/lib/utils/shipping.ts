import type { Product } from '$lib/types/Product';
import type { Address } from '$lib/types/Order';

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

// DOM-TOM postal codes (overseas territories)
const DOM_TOM_POSTAL_CODES = [
	'971', // Guadeloupe
	'972', // Martinique
	'973', // Guyane
	'974', // La Réunion
	'975', // Saint-Pierre-et-Miquelon
	'976', // Mayotte
	'977', // Saint-Barthélemy
	'978', // Saint-Martin
	'986', // Wallis-et-Futuna
	'987', // Polynésie française
	'988', // Nouvelle-Calédonie
];

/**
 * Check if a postal code is in DOM-TOM
 */
export function isDomTom(zipCode: string): boolean {
	const prefix = zipCode.substring(0, 3);
	return DOM_TOM_POSTAL_CODES.includes(prefix);
}

/**
 * Check if shipping is free based on postal code (Finistère = 29)
 */
export function isFreeShipping(zipCode: string): boolean {
	return zipCode.startsWith('29');
}

/**
 * Validate shipping address
 */
export function validateShippingAddress(address: Address): { valid: boolean; error?: string } {
	// Force country to be France
	if (address.country.toLowerCase() !== 'france') {
		return {
			valid: false,
			error: 'Les livraisons sont uniquement disponibles en France métropolitaine.',
		};
	}

	// Block DOM-TOM
	if (isDomTom(address.zipCode)) {
		return {
			valid: false,
			error: 'Les livraisons vers les DOM-TOM ne sont pas disponibles actuellement.',
		};
	}

	return { valid: true };
}

/**
 * Calculate shipping cost for cart items
 * If items can be grouped, only the highest shipping cost is applied
 * If items cannot be grouped, all shipping costs are summed
 * Free shipping for Finistère (29)
 */
export function calculateShippingCost(
	items: CartItemWithProduct[],
	shippingAddress?: Address
): number {
	if (!items.length) return 0;

	// Free shipping for Finistère (29)
	if (shippingAddress && isFreeShipping(shippingAddress.zipCode)) {
		return 0;
	}

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
export function calculateTotalWithShipping(
	items: CartItemWithProduct[],
	shippingAddress?: Address
): {
	subtotal: number;
	shipping: number;
	total: number;
} {
	const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
	const shipping = calculateShippingCost(items, shippingAddress);
	const total = subtotal + shipping;

	return { subtotal, shipping, total };
}
