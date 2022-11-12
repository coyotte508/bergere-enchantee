import type { Actions } from './$types';
import busboy from 'busboy';
import { pipeline } from 'node:stream';
import { streamToBuffer } from '$lib/server/utils/streamToBuffer';
import { generatePicture } from '$lib/server/photo';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (input) => {
		let buffer: Buffer;
		let name = '';
		let productId = '';

		// eslint-disable-next-line no-async-promise-executor
		await new Promise<void>(async (resolve, reject) => {
			try {
				const bb = busboy({
					headers: {
						'content-type': input.request.headers.get('content-type') ?? undefined
					}
				});
				bb.on('file', async (name, file, info) => {
					// const { filename, encoding, mimeType } = info;
					buffer = await streamToBuffer(file);
					resolve();
				});
				bb.on('field', (_name, val) => {
					if (_name === 'name') {
						name = val;
					} else if (_name === 'productId') {
						productId = val;
					}
				});

				await pipeline(input.request.body as any, bb, () => {});
			} catch (err) {
				reject(err);
			}
		});

		await generatePicture(buffer, name, { productId: productId || undefined });

		if (productId) {
			throw redirect(303, '/admin/produits/' + productId);
		}

		throw redirect(303, '/admin/photos');
	}
};
