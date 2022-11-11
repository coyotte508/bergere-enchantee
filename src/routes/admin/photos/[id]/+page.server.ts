import type { Picture } from '$lib/types/Picture';
import { client, pictures, picturesFs } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const picture = await pictures.findOne({ _id: params.id });

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
		await pictures.updateOne(
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
		let picture: Picture | null = null;

		await client.withSession(async (session) => {
			picture = (await pictures.findOneAndDelete({ _id: params.id }, { session })).value;
			await picturesFs.deleteMany({ picture: params.id }, { session });
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