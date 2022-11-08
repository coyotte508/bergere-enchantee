import type { PageServerLoad } from './$types';
import '$lib/server/db';
import { collections } from '$lib/server/db';

export const load: PageServerLoad = async () => {
	const products = await collections.products.find({ state: { $ne: 'draft' } }).toArray();
	const pictures = await collections.pictures
		.find({ productId: { $in: products.map((p) => p._id) } })
		.sort({ createdAt: 1 })
		.toArray();

	const byId = Object.fromEntries(products.map((p) => [p._id, p]));

	for (const picture of pictures) {
		byId[picture.productId!].photos = [...(byId[picture.productId!].photos || []), picture];
	}

	return {
		published: products.filter((p) => p.state === 'published'),
		retired: products.filter((p) => p.state === 'retired')
	};
};
