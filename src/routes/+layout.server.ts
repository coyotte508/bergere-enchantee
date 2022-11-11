import type { LayoutServerLoad } from './$types';
import '$lib/server/db';
import { pages } from '$lib/server/db/page';
import type { Picture } from '$lib/types/Picture';
import { filterNullish } from '$lib/utils/filterNullish';
import { pictures } from '$lib/server/db';

export const load: LayoutServerLoad = async (input) => {
	const pageId = input.url.pathname;

	if (pageId in pages) {
		const pageData = pages[pageId as keyof typeof pages];

		const pictureIds = filterNullish(Object.values(pageData.pictures));
		const pics = await pictures.find({ _id: { $in: pictureIds } }).toArray();

		return {
			pageData,
			pictures: pics,
			user: input.locals.user
				? {
						email: input.locals.user.email,
						admin: input.locals.user.authority === 'admin'
				  }
				: null
		};
	}

	return {
		pageData: null,
		pictures: [] as Picture[],
		user: input.locals.user
			? {
					email: input.locals.user.email,
					admin: input.locals.user.authority === 'admin'
			  }
			: null
	};
};
