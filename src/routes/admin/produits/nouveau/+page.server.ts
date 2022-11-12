import { collections } from '$lib/server/db';
import { generatePicture } from '$lib/server/photo';
import type { Product } from '$lib/types/Product';
import { generateId } from '$lib/utils/generateId';
import type { Actions } from './$types';
import { pipeline } from 'node:stream';
import busboy from 'busboy';
import { streamToBuffer } from '$lib/server/utils/streamToBuffer';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		let buffer: Buffer;

		const fields = {
			name: '',
			description: '',
			price: 100,
			kind: 'armchair'
		};

		// eslint-disable-next-line no-async-promise-executor
		await new Promise<void>(async (resolve, reject) => {
			try {
				const bb = busboy({
					headers: {
						'content-type': request.headers.get('content-type') ?? undefined
					}
				});
				bb.on('file', async (name, file, info) => {
					// const { filename, encoding, mimeType } = info;
					buffer = await streamToBuffer(file);
					resolve();
				});
				bb.on('field', (name, val) => {
					if (name in fields) {
						fields[name] = val;
					}
				});

				await pipeline(request.body as any, bb, () => {});
			} catch (err) {
				reject(err);
			}
		});

		const productId = generateId(fields.name);

		await generatePicture(buffer, fields.name, {
			productId,
			cb: async (session) => {
				await collections.products.insertOne(
					{
						_id: productId,
						createdAt: new Date(),
						updatedAt: new Date(),
						description: fields.description.replaceAll('\r', ''),
						kind: fields.kind as Product['kind'],
						name: fields.name,
						price: +fields.price,
						photos: [],
						state: 'draft'
					},
					{ session }
				);
			}
		});

		throw redirect(303, '/admin/produits/' + productId);
	}
};
