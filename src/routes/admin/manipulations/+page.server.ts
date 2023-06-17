import { PutObjectCommand } from '@aws-sdk/client-s3';
import { collections } from '$lib/server/db';
import { picturePrefix } from '$lib/server/photo';
import { s3client } from '$lib/server/s3';
import { S3_BUCKET } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const actions = {
	migrateImages: async () => {
		for await (const picture of collections.pictures.find({ version: 0 })) {
			console.log('Migrating', picture._id);
			const storage = picture.storage as any as Array<{
				_id: string;
				width: number;
				height: number;
				size: number;
			}>;

			for (const format of storage) {
				const fs = await collections.picturesFs.findOne({ _id: format._id });

				if (!fs) {
					console.log('Missing fs for', format._id);
					throw error(500, 'Missing fs for ' + format._id);
				}

				const path = picturePrefix(picture.productId) + format._id + '.webp';

				await s3client.send(
					new PutObjectCommand({
						Bucket: S3_BUCKET,
						Key: path,

						Body: new Uint8Array(fs.data.buffer, 0, fs.data.buffer.byteLength),
						ContentType: 'image/webp'
					})
				);
			}

			const newStorage = storage.map((format) => ({
				width: format.width,
				height: format.height,
				size: format.size,
				key: picturePrefix(picture.productId) + format._id + '.webp'
			}));

			await collections.pictures.updateOne(
				{
					_id: picture._id
				},
				{
					$set: {
						storage: {
							original: newStorage[0],
							formats: newStorage
						}
					},
					$unset: {
						version: ''
					}
				}
			);
		}

		console.log('Done');
	}
};
