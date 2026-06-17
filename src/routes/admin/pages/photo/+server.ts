import { collections } from '$lib/server/database';
import { generatePicture } from '$lib/server/photo';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import type { RequestHandler } from './$types';

// Turns a freshly-uploaded file (pending upload) into a Picture available to the
// pages editor, and returns the created document so the client can show it.
export const POST: RequestHandler = async ({ request }) => {
	const { photoId } = z.object({ photoId: z.string().min(1) }).parse(await request.json());

	await generatePicture(photoId);

	const picture = await collections.pictures.findOne({ _id: photoId });

	if (!picture) {
		throw error(500, "La photo n'a pas pu être créée");
	}

	return json(picture);
};
