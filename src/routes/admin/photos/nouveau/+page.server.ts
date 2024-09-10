import type { Actions } from './$types';
import { generatePicture } from '$lib/server/photo';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { collections } from '$lib/server/database';
import { s3client } from '$lib/server/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const actions: Actions = {
	default: async (input) => {
		const formData = await input.request.formData();

		const { productId, photoId } = z
			.object({
				productId: z.string().optional(),
				photoId: z.string(),
			})
			.parse(Object.fromEntries(formData));

		const pendingUpload = await collections.pendingUploads.findOne({ _id: photoId });

		if (!pendingUpload) {
			throw error(404, 'Fichier non trouvé');
		}

		const url = await getSignedUrl(
			s3client,
			new GetObjectCommand({
				Bucket: pendingUpload.storage.bucket,
				Key: pendingUpload.storage.key,
			})
		);

		const res = await fetch(url);

		if (!res.ok) {
			throw error(500, 'Erreur lors de la récupération du fichier');
		}

		await generatePicture(Buffer.from(await res.arrayBuffer()), pendingUpload.name, {
			productId: productId || undefined,
		});

		if (productId) {
			throw redirect(303, '/admin/produits/' + productId);
		}

		throw redirect(303, '/admin/photos');
	},
};
