import { collections } from '$lib/server/db';
import type { Product } from '$lib/types/Product';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { omit } from 'lodash';

export const load: PageServerLoad = async ({ params }) => {
	const product = await collections.products.findOne({ _id: params.id });

	if (!product) {
		throw error(404, 'Produit non trouvé');
	}

	const pictures = await collections.pictures
		.find({ productId: params.id })
		.sort({ createdAt: 1 })
		.toArray();
	product.photos = pictures;

	return {
		product
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();

		const update = {
			...(formData.get('name') && { name: formData.get('name') as string }),
			...(formData.get('state') && { state: formData.get('state') as Product['state'] }),
			...(formData.get('kind') && { kind: formData.get('kind') as Product['kind'] }),
			...(formData.get('description') && {
				description: (formData.get('description') as string).replaceAll('\r', '')
			}),
			...(formData.get('price') && { price: Number(formData.get('price')) }),
			updatedAt: new Date()
		};

		const product = await collections.products.findOneAndUpdate(
			{ _id: params.id },
			{ $set: update },
			{ returnDocument: 'after' }
		);

		if (!product.value) {
			throw error(404, 'Produit non trouvé');
		}

		return {};
	}
};
