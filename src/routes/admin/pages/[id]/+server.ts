import { collections } from '$lib/server/db';
import { pages } from '$lib/server/db/page';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (input) => {
	const id = input.params.id;

	const body: { type: 'picture' | 'text'; key: string; value: string } = await input.request.json();

	if (!(id in pages)) {
		throw error(400, 'Mauvaise id de page: ' + id);
	}

	const type = body.type === 'picture' ? 'pictures' : body.type;

	const page = pages[id as keyof typeof pages];

	if (!(type in page) || !(body.key in page[type])) {
		throw error(400, 'Mauvaise clé');
	}

	await collections.pages.updateOne(
		{ _id: id },
		{
			$set: {
				[`${type}.${body.key}`]: String(body.value).replaceAll('\r', ''),
				updatedAt: new Date()
			},
			$setOnInsert: {
				createdAt: new Date()
			}
		},
		{ upsert: true }
	);

	return new Response();
};
