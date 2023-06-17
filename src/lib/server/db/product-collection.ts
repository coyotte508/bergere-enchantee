import type { Product } from '$lib/types/Product';
import type { Collection, Db } from 'mongodb';

export function createProductCollection(db: Db): Collection<Product> {
	const coll = db.collection<Product>('products');

	return coll;
}
