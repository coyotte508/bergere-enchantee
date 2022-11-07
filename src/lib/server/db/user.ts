import type { User } from '$lib/types/User';
import type { Collection, Db, MongoClient } from 'mongodb';

export function createUserCollection(db: Db, client: MongoClient): Collection<User> {
	const coll = db.collection<User>('users');

	client.on('open', () => {
		coll
			.createIndex(
				{
					email: 1
				},
				{
					collation: {
						locale: 'en',
						strength: 1
					}
				}
			)
			.catch(console.error);
	});

	return coll;
}
