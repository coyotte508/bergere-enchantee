import type { PageServerLoad } from './$types';
import { pages } from '$lib/server/page';
import type { ContactPage } from '$lib/types/Page';

export const load: PageServerLoad = async () => {
	const contact = pages['/contact'] as ContactPage;

	return {
		horaires: {
			lundi: contact.text['horaires-lundi'],
			mardi: contact.text['horaires-mardi'],
			mercredi: contact.text['horaires-mercredi'],
			jeudi: contact.text['horaires-jeudi'],
			vendredi: contact.text['horaires-vendredi'],
		},
	};
};
