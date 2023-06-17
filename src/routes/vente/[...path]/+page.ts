import { redirect } from '@sveltejs/kit';

export function load(event) {
	throw redirect(302, event.url.pathname.replace('/vente', '/e-shop'));
}
