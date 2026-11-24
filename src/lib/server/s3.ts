import { env } from '$env/dynamic/private';
import { building } from '$app/environment';
import * as AWS from '@aws-sdk/client-s3';

let _s3client: AWS.S3 | undefined;

export function getS3Client(): AWS.S3 {
	if (!_s3client) {
		const accessKeyId = env.S3_KEY;
		const secretAccessKey = env.S3_SECRET;
		const region = env.S3_REGION;
		const endpoint = env.S3_ENDPOINT_URL;

		if (!accessKeyId || !secretAccessKey || !region || !endpoint) {
			throw new Error(
				'S3 configuration is incomplete (S3_KEY, S3_SECRET, S3_REGION, S3_ENDPOINT_URL)'
			);
		}

		_s3client = new AWS.S3({
			endpoint,
			region,
			credentials: { accessKeyId, secretAccessKey },
		});

		if (!building && env.S3_BUCKET) {
			_s3client
				.send(
					new AWS.PutBucketCorsCommand({
						Bucket: env.S3_BUCKET,
						CORSConfiguration: {
							CORSRules: [
								{
									AllowedMethods: ['PUT'],
									// todo: change to production domain
									AllowedOrigins: ['*'],
									AllowedHeaders: ['*'],
									ID: 'CORSRule1',
								},
							],
						},
					})
				)
				.catch((err) => console.error('S3 CORS error: ', err));
		}
	}

	return _s3client;
}

export function secureDownloadLink(url: string) {
	if (['127.0.0.1', 'localhost'].includes(new URL(url).hostname)) {
		return url;
	}

	return url.replace('http:', 'https:');
}
