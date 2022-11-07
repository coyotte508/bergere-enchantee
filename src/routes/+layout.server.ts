import type { LayoutServerLoad } from './$types';
import '$lib/server/db';
import { pages } from '$lib/server/db/page';
import type { Picture } from '$lib/types/Picture';

export const load: LayoutServerLoad = async (input) => {
	const pageId = input.url.pathname;

	if (pageId in pages) {
		return {
			pageData: pages[pageId as keyof typeof pages],
			pictures: [] as Picture[]
		};
	}

	return {
		pageData: null,
		pictures: [] as Picture[]
	};
};
