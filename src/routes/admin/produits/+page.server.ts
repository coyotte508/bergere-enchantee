import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/database';
import type { Picture } from '$lib/types/Picture';
import type { SetRequired } from 'type-fest';

export const load: PageServerLoad = async () => {
	const products = await collections.products.find({}).toArray();
	const pictures = await collections.pictures
		.find<SetRequired<Picture, 'productId'>>({ productId: { $in: products.map((p) => p._id) } })
		.sort({ createdAt: 1 })
		.toArray();

	const byId = Object.fromEntries(products.map((p) => [p._id, p]));

	for (const picture of pictures) {
		byId[picture.productId].photos = [...(byId[picture.productId].photos || []), picture];
	}

	return {
		products,
	};
};
