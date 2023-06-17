import type { Picture } from '$lib/types/Picture';
import type { Collection, Db } from 'mongodb';

export function createPictureCollections(db: Db): Collection<Picture> {
	return db.collection<Picture>('pictures');
}
