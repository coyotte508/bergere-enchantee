import { collections } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('bergereToken');

	if (token) {
		event.locals.user = await collections.users.findOne({ token });
	}

	const response = await resolve(event);

	return response;
};
