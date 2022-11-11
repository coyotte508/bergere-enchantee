import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from './$types';

export const load: ServerLoad = (event) => {
	if (!event.locals.user) {
		throw redirect(303, `/connexion?suivant=${encodeURIComponent(event.url.href)}`);
	}

	return {};
};
