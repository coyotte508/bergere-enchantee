import type { PageServerLoad, Actions } from './$types';
import { collections } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { z } from 'zod';
import { ORDER_STATUSES, type OrderStatus } from '$lib/types/Order';

export const load: PageServerLoad = async ({ params }) => {
	const order = await collections.orders.findOne({ _id: params.id });

	if (!order) {
		throw error(404, 'Commande non trouvée');
	}

	return {
		order,
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();

		const parsed = z
			.object({
				status: z.enum([ORDER_STATUSES[0], ...ORDER_STATUSES.slice(1)]),
			})
			.safeParse(Object.fromEntries(formData));

		if (!parsed.success) {
			return {
				error: 'Statut invalide',
			};
		}

		const { status } = parsed.data;

		const result = await collections.orders.findOneAndUpdate(
			{ _id: params.id },
			{
				$set: {
					status,
					updatedAt: new Date(),
				},
			},
			{ returnDocument: 'after' }
		);

		if (!result) {
			throw error(404, 'Commande non trouvée');
		}

		return { success: true };
	},

	updateNotes: async ({ request, params }) => {
		const formData = await request.formData();
		const adminNotes = formData.get('adminNotes') as string;

		const result = await collections.orders.findOneAndUpdate(
			{ _id: params.id },
			{
				$set: {
					adminNotes,
					updatedAt: new Date(),
				},
			},
			{ returnDocument: 'after' }
		);

		if (!result) {
			throw error(404, 'Commande non trouvée');
		}

		return { success: true };
	},
};
