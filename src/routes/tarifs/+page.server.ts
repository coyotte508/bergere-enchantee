import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	// Page masquée au public : accessible uniquement aux administrateurs.
	if (locals.user?.authority !== 'admin') {
		throw error(404, 'Page introuvable');
	}

	return {};
};
