import { collections, withTransaction } from '$lib/server/database';
import type { Product } from '$lib/types/Product';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getS3Client } from '$lib/server/s3';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ params }) => {
	const product = await collections.products.findOne({ _id: params.id });

	if (!product) {
		throw error(404, 'Produit non trouvé');
	}

	const pictures = await collections.pictures
		.find({ productId: params.id })
		.sort({ createdAt: 1 })
		.toArray();
	product.photos = pictures;

	return {
		product,
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();

		const update = {
			...(formData.get('name') && { name: formData.get('name') as string }),
			...(formData.get('state') && { state: formData.get('state') as Product['state'] }),
			...(formData.get('kind') && { kind: formData.get('kind') as Product['kind'] }),
			...(formData.get('description') && {
				description: (formData.get('description') as string).replaceAll('\r', ''),
			}),
			...(formData.get('price') && { price: Number(formData.get('price')) }),
			...(formData.get('stock') && { stock: Number(formData.get('stock')) }),
			...(formData.get('shippingPrice') !== null && {
				shippingPrice: Number(formData.get('shippingPrice')),
			}),
			canGroupShipping: formData.get('canGroupShipping') === 'on',
			updatedAt: new Date(),
		};

		const product = await collections.products.findOneAndUpdate(
			{ _id: params.id },
			{ $set: update },
			{ returnDocument: 'after' }
		);

		if (!product) {
			throw error(404, 'Produit non trouvé');
		}

		return {};
	},

	delete: async ({ params }) => {
		await withTransaction(async (session) => {
			const product = await collections.products.findOneAndDelete({ _id: params.id });

			if (!product) {
				throw error(404);
			}

			const pictures = await collections.pictures
				.find({ productId: params.id }, { session })
				.toArray();

			await collections.pictures.deleteMany(
				{ _id: { $in: pictures.map((p) => p._id) } },
				{ session }
			);
			const bucket = env.S3_BUCKET;
			if (!bucket) {
				throw new Error('S3_BUCKET is not set');
			}
			const s3client = getS3Client();

			for (const key of pictures.flatMap((p) => [
				p.storage.original.key,
				...p.storage.formats.map((s) => s.key),
			])) {
				await s3client.deleteObject({ Key: key, Bucket: bucket });
			}
		});

		throw redirect(303, '/admin/produits');
	},
};
