import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { isValidAccessKey } from '$lib/utils/generateAccessKey';

export const load: PageServerLoad = async ({ params }) => {
	const { orderNumber, accessKey } = params;

	// Validate access key format
	if (!isValidAccessKey(accessKey)) {
		throw error(404, 'Commande non trouvée');
	}

	// Parse order number
	const orderNum = parseInt(orderNumber, 10);
	if (isNaN(orderNum)) {
		throw error(404, 'Commande non trouvée');
	}

	// Find order by both order number and access key for security
	const order = await collections.orders.findOne({
		orderNumber: orderNum,
		accessKey: accessKey,
	});

	if (!order) {
		throw error(404, 'Commande non trouvée');
	}

	// Don't expose sensitive information to the client
	const publicOrder = {
		orderNumber: order.orderNumber,
		customer: order.customer,
		items: order.items,
		subtotal: order.subtotal,
		totalShipping: order.totalShipping,
		total: order.total,
		status: order.status,
		customerMessage: order.customerMessage,
		createdAt: order.createdAt,
		updatedAt: order.updatedAt,
	};

	return {
		order: publicOrder,
	};
};
