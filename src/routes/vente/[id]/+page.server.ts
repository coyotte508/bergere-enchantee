import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (input) => {
	const product = await collections.products.findOne({
		_id: input.params.id,
		state: { $ne: 'draft' }
	});

	if (!product) {
		throw error(404, 'Produit non trouvé');
	}

	product.photos = await collections.pictures
		.find({ productId: input.params.id })
		.sort({ createdAt: 1 })
		.toArray();

	return {
		product,
		title: `${product.name} - ${product.price} €`,
		description: product.description,
		pictures: product.photos,
		type: 'og:product',
		price: product.price
	};
};
