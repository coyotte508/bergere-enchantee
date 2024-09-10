import { collections } from '$lib/server/database';
import { generatePicture } from '$lib/server/photo';
import { PRODUCT_KINDS } from '$lib/types/Product';
import { generateId } from '$lib/utils/generateId';
import { z } from 'zod';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const { name, description, kind, price, photoId } = z
			.object({
				description: z.string().trim(),
				kind: z.enum([PRODUCT_KINDS[0], ...PRODUCT_KINDS.slice(1)]),
				name: z.string().min(1),
				price: z.number({ coerce: true }).int().positive(),
				photoId: z.string(),
			})
			.parse(Object.fromEntries(formData));

		const productId = generateId(name);

		await generatePicture(photoId, {
			productId,
			cb: async (session) => {
				await collections.products.insertOne(
					{
						_id: productId,
						createdAt: new Date(),
						updatedAt: new Date(),
						description: description.replaceAll('\r', ''),
						kind,
						name,
						price,
						photos: [],
						stock: 1,
						state: 'draft',
					},
					{ session }
				);
			},
		});

		throw redirect(303, '/admin/produits/' + productId);
	},
};
