import type { Actions } from './$types';
import { generatePicture } from '$lib/server/photo';
import { redirect } from '@sveltejs/kit';
import { z } from 'zod';

export const actions: Actions = {
	default: async (input) => {
		const formData = await input.request.formData();

		const { productId, name, file } = z
			.object({
				productId: z.string().optional(),
				name: z.string(),
				file: z.instanceof(File),
			})
			.parse(Object.fromEntries(formData));

		await generatePicture(Buffer.from(await file.arrayBuffer()), name, {
			productId: productId || undefined,
		});

		if (productId) {
			throw redirect(303, '/admin/produits/' + productId);
		}

		throw redirect(303, '/admin/photos');
	},
};
