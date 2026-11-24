import { error } from '@sveltejs/kit';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { RequestHandler } from './$types';
import { collections } from '$lib/server/database';
import { getS3Client, secureDownloadLink } from '$lib/server/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ params }) => {
	const picture = await collections.pictures.findOne({
		_id: params.id,
		'storage.formats.width': +params.width,
	});

	if (!picture) {
		throw error(404);
	}

	const format = picture.storage.formats.find((f) => f.width === +params.width);

	if (!format) {
		throw error(500, "Impossible de trouver le format d'image demandé");
	}

	const bucket = env.S3_BUCKET;
	if (!bucket) {
		throw new Error('S3_BUCKET is not set');
	}

	const s3Url = await getSignedUrl(
		getS3Client(),
		new GetObjectCommand({
			Bucket: bucket,
			Key: format.key,
			ResponseCacheControl: 'public, max-age=31536000, immutable',
		})
	);

	const passThrough: boolean = true;
	if (passThrough) {
		const res = await fetch(s3Url);

		// Until we handle/store ETag properly
		const headers = new Headers([...res.headers.entries()].filter(([k]) => k !== 'etag'));

		return new Response(res.body, {
			status: res.status,
			headers,
		});
	} else {
		// Doesn't cache on Firefox
		return new Response(null, {
			status: 302,
			headers: {
				'Cache-Control': 'public, max-age=31536000, immutable',
				location: secureDownloadLink(s3Url),
			},
		});
	}
};
