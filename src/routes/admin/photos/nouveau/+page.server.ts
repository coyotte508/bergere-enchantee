import type { Actions } from './$types';
import busboy from 'busboy';
import { pipeline } from 'node:stream/promises';
import { streamToBuffer } from '$lib/server/utils/streamToBuffer';
import { generatePicture } from '$lib/server/photo';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (input) => {
		let name = '';
		let productId = '';

		// eslint-disable-next-line no-async-promise-executor
		const buffer = await new Promise<Buffer>(async (resolve, reject) => {
			try {
				const bb = busboy({
					headers: {
						'content-type': input.request.headers.get('content-type') ?? undefined,
					},
				});
				bb.on('file', async (name, file) => {
					// const { filename, encoding, mimeType } = info;
					resolve(await streamToBuffer(file));
				});
				bb.on('field', (_name, val) => {
					if (_name === 'name') {
						name = val;
					} else if (_name === 'productId') {
						productId = val;
					}
				});

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await pipeline(input.request.body as any, bb);
			} catch (err) {
				reject(err);
			}
		});

		await generatePicture(buffer, name, { productId: productId || undefined });

		if (productId) {
			throw redirect(303, '/admin/produits/' + productId);
		}

		throw redirect(303, '/admin/photos');
	},
};
