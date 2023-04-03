import { collections, withTransaction } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const picture = await collections.pictures.findOne({ _id: params.id });

	if (!picture) {
		throw error(404, 'Photo non trouvée');
	}

	return {
		photo: picture
	};
};

export const actions: Actions = {
	update: async function (input) {
		const name = String((await input.request.formData()).get('name'));
		await collections.pictures.updateOne(
			{ _id: input.params.id },
			{
				$set: {
					name,
					updatedAt: new Date()
				}
			}
		);

		return {};
	},
	delete: async function ({ params }) {
		const picture = await collections.pictures.findOne({ _id: params.id });

		await withTransaction(async (session) => {
			const res = await collections.pictures.deleteOne({ _id: params.id }, { session });

			if (!res.deletedCount) {
				throw new Error('Conflict during picture deletion');
			}

			await collections.picturesFs.deleteMany({ picture: params.id }, { session });
		});

		if (!picture) {
			throw error(404);
		}

		throw redirect(
			303,
			picture?.productId ? '/admin/produits/' + picture.productId : '/admin/photos'
		);
	}
};
