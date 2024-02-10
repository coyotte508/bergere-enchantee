import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		event.cookies.delete('bergereToken', { path: '/' });
		throw redirect(303, event.request.headers.get('referer') ?? '/');
	},
};
