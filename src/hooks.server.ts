import { collections } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('bergereToken');

	if (token) {
		event.locals.user = await collections.users.findOne({ token });
	}

	if (event.url.pathname.startsWith('/admin') && event.locals.user?.authority !== 'admin') {
		return new Response('', {
			status: 303,
			headers: { location: `${event.url.protocol}//${event.url.host}` }
		});
	}

	const response = await resolve(event);

	return response;
};
