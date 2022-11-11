import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
	if (!event.locals.user) {
		throw redirect(303, `/connexion?suivant=${encodeURIComponent(event.url.href)}`);
	}

	return {};
};
