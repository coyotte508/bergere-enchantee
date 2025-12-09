import type { Timestamps } from './Timestamps';
import type { Product } from './Product';

export interface OrderItem {
	productId: string;
	quantity: number;
	// Product details at time of order (full product snapshot)
	productSnapshot: Product;
	// Calculated totals for this item
	itemSubtotal: number; // price * quantity
	itemShipping: number; // shipping cost for this item
}

export interface Address {
	name: string;
	street: string;
	additionalInfo?: string;
	city: string;
	zipCode: string;
	country: string;
}

export interface OrderCustomer {
	email: string;
	phone?: string;
	billingAddress: Address;
	shippingAddress: Address;
}

export interface Order extends Timestamps {
	_id: string;
	orderNumber: number; // Sequential numeric order number
	accessKey: string; // Secure key for customer access to order

	// Customer information
	customer: OrderCustomer;

	// Order items with product snapshots
	items: OrderItem[];

	// Order totals
	subtotal: number;
	totalShipping: number;
	total: number;

	// Order status
	status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

	// Additional information
	customerMessage?: string;
	adminNotes?: string;

	// Session information
	sessionId: string;
}

export const ORDER_STATUSES = [
	'pending',
	'confirmed',
	'processing',
	'shipped',
	'delivered',
	'cancelled',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Helper function to get status display name in French
export function getOrderStatusDisplay(status: OrderStatus): string {
	const statusMap: Record<OrderStatus, string> = {
		pending: 'En attente',
		confirmed: 'Confirmée',
		processing: 'En préparation',
		shipped: 'Expédiée',
		delivered: 'Livrée',
		cancelled: 'Annulée',
	};
	return statusMap[status];
}

// Helper function to get status color
export function getOrderStatusColor(status: OrderStatus): string {
	const colorMap: Record<OrderStatus, string> = {
		pending: 'bg-yellow-100 text-yellow-800',
		confirmed: 'bg-blue-100 text-blue-800',
		processing: 'bg-purple-100 text-purple-800',
		shipped: 'bg-indigo-100 text-indigo-800',
		delivered: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
	};
	return colorMap[status];
}
