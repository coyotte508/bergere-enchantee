import { pictures } from '$lib/server/db';
import { pages } from '$lib/server/db/page';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		pages: Object.values(pages),
		photos: await pictures.find({ productId: { $exists: false } }).toArray()
	};
};
