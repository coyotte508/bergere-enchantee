import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/database';

export const load: PageServerLoad = async () => {
	const orders = await collections.orders
		.find({})
		.sort({ createdAt: -1 })
		.toArray();

	// Group orders by status for better organization
	const pendingOrders = orders.filter(order => order.status === 'pending');
	const confirmedOrders = orders.filter(order => order.status === 'confirmed');
	const processingOrders = orders.filter(order => order.status === 'processing');
	const shippedOrders = orders.filter(order => order.status === 'shipped');
	const deliveredOrders = orders.filter(order => order.status === 'delivered');
	const cancelledOrders = orders.filter(order => order.status === 'cancelled');

	return {
		orders,
		pendingOrders,
		confirmedOrders,
		processingOrders,
		shippedOrders,
		deliveredOrders,
		cancelledOrders,
	};
};
