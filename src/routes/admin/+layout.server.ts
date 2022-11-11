import type { LayoutServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = (event) => {
	if (!event.locals.user) {
		throw redirect(303, `/connexion?suivant=${encodeURIComponent(event.url.href)}`);
	}

	if (event.locals.user.authority !== 'admin') {
		throw error(403);
	}
};
