import { MONGODB_URL } from '$env/static/private';
import { MongoClient } from 'mongodb';
import { createPageCollection } from './page';
// import { createPictureCollections } from './picture';
// import { createProductCollection } from './product';
// import { createUserCollection } from './user';

const client = new MongoClient(MONGODB_URL, {
	directConnection: true
});

export const connectPromise = client.connect().catch(console.error);

const db = client.db('bergere');

const pages = createPageCollection(db, client);
// const users = createUserCollection(db, client);
// const Products = createProductCollection(db);
// const { Pictures, PicturesFs } = createPictureCollections(db, client);

export { client, db, pages /* users, Pictures, PicturesFs, Products */ };