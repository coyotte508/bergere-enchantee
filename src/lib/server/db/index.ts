import { MONGODB_URL } from '$env/static/private';
import { MongoClient, type WithSessionCallback } from 'mongodb';
import { createPageCollection } from './page';
import { createPictureCollections } from './picture';
import { createProductCollection } from './product';
import { createUserCollection } from './user';

const client = new MongoClient(MONGODB_URL, {
	directConnection: true
});

export const connectPromise = client.connect().catch(console.error);

const db = client.db('bergere');

const pages = createPageCollection(db, client);
const users = createUserCollection(db, client);
const products = createProductCollection(db);
const { pictures, picturesFs } = createPictureCollections(db);

export { client, db };
export const collections = { products, pictures, pages, users, picturesFs };

export async function withTransaction(cb: WithSessionCallback) {
	await client.withSession((session) => session.withTransaction(cb));
}
