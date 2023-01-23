import { client, collections } from '$lib/server/db';
import type { Product } from '$lib/types/Product';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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
		product
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
				description: (formData.get('description') as string).replaceAll('\r', '')
			}),
			...(formData.get('price') && { price: Number(formData.get('price')) }),
			...(formData.get('stock') && { stock: Number(formData.get('stock')) }),
			updatedAt: new Date()
		};

		const product = await collections.products.findOneAndUpdate(
			{ _id: params.id },
			{ $set: update },
			{ returnDocument: 'after' }
		);

		if (!product.value) {
			throw error(404, 'Produit non trouvé');
		}

		return {};
	},

	delete: async ({ params }) => {
		await client.withSession(async (session) => {
			const product = await collections.products.findOneAndDelete({ _id: params.id });

			if (!product.value) {
				throw error(404);
			}

			const pictures = await collections.pictures
				.find({ productId: params.id }, { session })
				.toArray();

			await collections.pictures.deleteMany(
				{ _id: { $in: pictures.map((p) => p._id) } },
				{ session }
			);
			await collections.picturesFs.deleteMany(
				{
					_id: { $in: pictures.flatMap((p) => p.storage.map((s) => s._id)) }
				},
				{ session }
			);
		});

		throw redirect(303, '/admin/produits');
	}
};
