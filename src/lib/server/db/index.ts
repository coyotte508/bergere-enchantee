import { MONGODB_URL } from '$env/static/private';
import { MongoClient, type WithSessionCallback } from 'mongodb';
import { createPageCollection } from './page-collection';
import { createPictureCollections } from './picture-collection';
import { createProductCollection } from './product-collection';
import { createUserCollection } from './user-collection';

const client = new MongoClient(MONGODB_URL, {
	directConnection: true
});

export const connectPromise = client.connect().catch(console.error);

const db = client.db('bergere');

const pages = createPageCollection(db, client);
const users = createUserCollection(db, client);
const products = createProductCollection(db);
const pictures = createPictureCollections(db);

export { client, db };
export const collections = { products, pictures, pages, users };

export async function withTransaction(cb: WithSessionCallback) {
	await client.withSession((session) => session.withTransaction(cb));
}
