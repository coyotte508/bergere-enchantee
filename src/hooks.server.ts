import { collections } from '$lib/server/database';
import { initPagesPromise } from '$lib/server/page';
import type { Handle, HandleServerError } from '@sveltejs/kit';
import { addYears } from 'date-fns';
import { ObjectId } from 'mongodb';
import { ZodError } from 'zod';

export const handleError = (({ error, event }) => {
	console.error('handleError', error);
	if (typeof error === 'object' && error) {
		collections.errors
			.insertOne({
				_id: new ObjectId(),
				url: event.url.href,
				method: event.request.method,
				...error
			})
			.catch();
	}

	if (error instanceof ZodError) {
		event.locals.status = 422;
		const formattedError = error.format();

		if (formattedError._errors.length) {
			return { message: formattedError._errors[0], status: 422 };
		}

		return {
			message: Object.entries(formattedError)
				.map(([key, val]) => {
					if (typeof val === 'object' && val && '_errors' in val && Array.isArray(val._errors)) {
						return `${key}: ${val._errors[0]}`;
					}
				})
				.filter(Boolean)
				.join(', '),
			status: 422
		};
	}
}) satisfies HandleServerError;

export const handle: Handle = async ({ event, resolve }) => {
	await initPagesPromise;

	const token = event.cookies.get('bergereToken');

	event.locals.sessionId = token || crypto.randomUUID();

	// Refresh cookie expiration date
	event.cookies.set('bergereToken', event.locals.sessionId, {
		path: '/',
		sameSite: 'lax',
		secure: true,
		httpOnly: true,
		expires: addYears(new Date(), 1)
	});

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

	// Work around handleError which does not allow setting the header
	const status = event.locals.status;
	if (status) {
		const contentType = response.headers.get('Content-Type');
		return new Response(response.body, {
			...response,
			headers: {
				...Object.fromEntries(response.headers.entries()),
				'content-type': contentType?.includes('html') ? contentType : 'application/json'
			},
			status
		});
	}

	return response;
};
