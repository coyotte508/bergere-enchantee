import { env } from '$env/dynamic/private';
import { MongoClient, ObjectId, type Db, type WithSessionCallback } from 'mongodb';
import type { Page } from '$lib/types/Page';
import type { User } from '$lib/types/User';
import type { Product } from '$lib/types/Product';
import { pictureIndexes, type Picture } from '$lib/types/Picture';
import type { Cart } from '$lib/types/Cart';
import type { PendingUpload } from '$lib/types/PendingUpload';
import type { Order } from '$lib/types/Order';
import type { RuntimeConfig } from '$lib/types/RuntimeConfig';

let _client: MongoClient | undefined;
let _connectPromise: Promise<MongoClient | void> | undefined;

export function getClient(): MongoClient {
	if (!_client) {
		const url = env.MONGODB_URL;
		if (!url) {
			throw new Error('MONGODB_URL is not set');
		}

		_client = new MongoClient(url, {
			directConnection: true,
		});

		const database = _client.db('bergere');

		_client.on('open', () => {
			database
				.collection<Cart>('carts')
				.createIndex({ sessionId: 1 }, { unique: true })
				.catch(console.error);
			database
				.collection<Order>('orders')
				.createIndex({ 'customer.email': 1 })
				.catch(console.error);
			database.collection<Order>('orders').createIndex({ status: 1 }).catch(console.error);
			database.collection<Order>('orders').createIndex({ createdAt: -1 }).catch(console.error);
			database
				.collection<Order>('orders')
				.createIndex({ orderNumber: 1 }, { unique: true })
				.catch(console.error);
			database
				.collection<Order>('orders')
				.createIndex({ accessKey: 1 }, { unique: true })
				.catch(console.error);
			database
				.collection<User>('users')
				.createIndex(
					{ email: 1 },
					{
						unique: true,
						collation: { locale: 'en', strength: 1 },
					}
				)
				.catch(console.error);
			database.collection<Picture>('pictures').createIndexes(pictureIndexes).catch(console.error);
		});

		_connectPromise = _client.connect().catch(console.error);
	}

	return _client;
}

export function getConnectPromise(): Promise<MongoClient | void> {
	getClient();
	return _connectPromise!;
}

export function getDb(): Db {
	return getClient().db('bergere');
}

export const collections = {
	get products() {
		return getDb().collection<Product>('products');
	},
	get pictures() {
		return getDb().collection<Picture>('pictures');
	},
	get pages() {
		return getDb().collection<Page>('pages');
	},
	get users() {
		return getDb().collection<User>('users');
	},
	get carts() {
		return getDb().collection<Cart>('carts');
	},
	get orders() {
		return getDb().collection<Order>('orders');
	},
	get runtimeConfig() {
		return getDb().collection<RuntimeConfig>('runtimeConfig');
	},
	get errors() {
		return getDb().collection<unknown & { _id: ObjectId; url: string; method: string }>('errors');
	},
	get pendingUploads() {
		return getDb().collection<PendingUpload>('pendingUploads');
	},
};

export async function withTransaction(cb: WithSessionCallback) {
	await getClient().withSession((session) => session.withTransaction(cb));
}
