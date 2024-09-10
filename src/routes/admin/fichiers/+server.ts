import { z } from 'zod';
import { json } from '@sveltejs/kit';
import { generateId } from '$lib/utils/generateId';
import { s3client, secureDownloadLink } from '$lib/server/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET } from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { collections } from '$lib/server/database.js';

export const POST = async (event) => {
	const { size, name, mimeType } = z
		.object({
			size: z.number().min(1).int().max(20_000_000),
			name: z.string().min(1).max(255),
			mimeType: z.string().min(1).max(255),
		})
		.parse(await event.request.json());

	const _id = generateId(name);

	const path = `fichiers-temporaires/${_id}`;

	const url = secureDownloadLink(
		await getSignedUrl(
			s3client,
			new PutObjectCommand({
				Bucket: S3_BUCKET,
				Key: path,
				ContentLength: size,
				ContentType: mimeType,
			}),
			{ expiresIn: 24 * 3600 }
		)
	);

	await collections.pendingUploads.insertOne({
		createdAt: new Date(),
		_id,
		name,
		updatedAt: new Date(),
		storage: {
			bucket: S3_BUCKET,
			key: path,
			size,
		},
	});

	return json({
		url,
		_id,
	});
};
