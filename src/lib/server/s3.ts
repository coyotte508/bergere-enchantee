import { env } from '$env/dynamic/private';
import { S3_KEY, S3_REGION, S3_SECRET, S3_ENDPOINT_URL, S3_BUCKET } from '$env/static/private';
import * as AWS from '@aws-sdk/client-s3';

console.log('region', S3_REGION, '..', env.S3_REGION);

const s3client = new AWS.S3({
	endpoint: S3_ENDPOINT_URL,
	region: S3_REGION,
	credentials: { accessKeyId: S3_KEY, secretAccessKey: S3_SECRET },
});

await s3client
	.send(
		new AWS.PutBucketCorsCommand({
			Bucket: S3_BUCKET,
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

export function secureDownloadLink(url: string) {
	if (['127.0.0.1', 'localhost'].includes(new URL(url).hostname)) {
		return url;
	}

	return url.replace('http:', 'https:');
}

export { s3client };
