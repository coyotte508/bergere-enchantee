import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	if (event.locals.user) {
		throw redirect(303, '/');
	}

	return {};
};
