import { error } from '@sveltejs/kit';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { RequestHandler } from './$types';
import { collections } from '$lib/server/database';
import { s3client } from '$lib/server/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { S3_BUCKET } from '$env/static/private';
import { sha256 } from '$lib/utils/sha256';

export const GET: RequestHandler = async ({ params, request }) => {
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

	// Todo: store an etag directly when uploading the image
	const etag = `"${await sha256(format.key)}"`;

	console.log('etag', etag, request.headers.get('if-none-match'), format.key);
	if (etag === request.headers.get('if-none-match')) {
		return new Response(null, { status: 304 });
	}

	const url = await getSignedUrl(
		s3client,
		new GetObjectCommand({
			Bucket: S3_BUCKET,
			Key: format.key,
			ResponseCacheControl: 'public, max-age=31536000',
		})
	);

	const res = await fetch(url);

	const headers = new Headers(res.headers);

	if (res.ok) {
		headers.set('Cache-Control', 'public, max-age=31536000');
		headers.set('ETag', etag);
	}

	return new Response(res.body, {
		status: res.status,
		headers,
	});
};
