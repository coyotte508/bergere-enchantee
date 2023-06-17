import { collections } from '$lib/server/database';
import { pages } from '$lib/server/page';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		pages: Object.values(pages),
		photos: await collections.pictures.find({ productId: { $exists: false } }).toArray()
	};
};
