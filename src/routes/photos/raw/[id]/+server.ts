import { picturesFs } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const fs = await picturesFs.findOne({ _id: params.id });

	if (!fs) {
		throw error(404, 'Image non trouvée');
	}
	return new Response(new Uint8Array(fs.data.buffer, 0, fs.data.buffer.byteLength), {
		headers: { 'Content-Type': 'image/webp' }
	});
};
