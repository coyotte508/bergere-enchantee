import type { PageServerLoad } from './$types';
import { collections } from '$lib/server/database';

export const load: PageServerLoad = async () => {
	const products = await collections.products.find({ state: { $ne: 'draft' } }).toArray();
	const pictures = await collections.pictures
		.find({ productId: { $in: products.map((p) => p._id) } })
		.sort({ createdAt: 1 })
		.toArray();

	const byId = Object.fromEntries(products.map((p) => [p._id, p]));

	for (const picture of pictures) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		byId[picture.productId!].photos = [...(byId[picture.productId!].photos || []), picture];
	}

	return {
		published: products.filter((p) => p.state === 'published' && p.stock),
		retired: products.filter((p) => p.state === 'published' && !p.stock)
	};
};
