import type { LayoutServerLoad } from './$types';
import '$lib/server/database';
import { pages } from '$lib/server/page';
import type { Picture } from '$lib/types/Picture';
import { filterNullish } from '$lib/utils/filterNullish';
import { collections } from '$lib/server/database';

export const load: LayoutServerLoad = async (input) => {
	const pageId = input.url.pathname;

	if (pageId in pages) {
		const pageData = pages[pageId as keyof typeof pages];

		const pictureIds = filterNullish(Object.values(pageData.pictures));
		const pics = await collections.pictures.find({ _id: { $in: pictureIds } }).toArray();

		return {
			pageData,
			pictures: pics,
			user: input.locals.user
				? {
						email: input.locals.user.email,
						admin: input.locals.user.authority === 'admin',
					}
				: null,
		};
	}

	return {
		pageData: null,
		pictures: [] as Picture[],
		user: input.locals.user
			? {
					email: input.locals.user.email,
					admin: input.locals.user.authority === 'admin',
				}
			: null,
	};
};
