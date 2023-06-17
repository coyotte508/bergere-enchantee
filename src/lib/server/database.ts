import { MONGODB_URL } from '$env/static/private';
import { MongoClient, ObjectId, type WithSessionCallback } from 'mongodb';
import type { Page } from '$lib/types/Page';
import type { User } from '$lib/types/User';
import type { Product } from '$lib/types/Product';
import type { Picture } from '$lib/types/Picture';
import type { Cart } from '$lib/types/Cart';

const client = new MongoClient(MONGODB_URL, {
	directConnection: true
});

export const connectPromise = client.connect().catch(console.error);

const db = client.db('bergere');

const pages = db.collection<Page>('pages');
const users = db.collection<User>('users');
const products = db.collection<Product>('products');
const pictures = db.collection<Picture>('pictures');
const carts = db.collection<Cart>('carts');
const errors = db.collection<unknown & { _id: ObjectId; url: string; method: string }>('errors');

client.on('open', () => {
	carts.createIndex({ sessionId: 1 }, { unique: true }).catch(console.error);
	users
		.createIndex(
			{ email: 1 },
			{
				unique: true,
				collation: { locale: 'en', strength: 1 }
			}
		)
		.catch(console.error);
});

export { client, db };
export const collections = { products, pictures, pages, users, carts, errors };

export async function withTransaction(cb: WithSessionCallback) {
	await client.withSession((session) => session.withTransaction(cb));
}
