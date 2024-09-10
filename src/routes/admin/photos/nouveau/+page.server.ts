import type { Actions } from './$types';
import { generatePicture } from '$lib/server/photo';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

export const actions: Actions = {
	default: async (input) => {
		const formData = await input.request.formData();

		const { productId, photoId } = z
			.object({
				productId: z.string().optional(),
				photoId: z.string(),
			})
			.parse(Object.fromEntries(formData));

		await generatePicture(photoId, {
			productId: productId || undefined,
		});

		if (productId) {
			throw redirect(303, '/admin/produits/' + productId);
		}

		throw redirect(303, '/admin/photos');
	},
};
