import type { PictureFs, Picture } from '$lib/types/Picture';
import type { Collection, Db } from 'mongodb';

export function createPictureCollections(db: Db): {
	pictures: Collection<Picture>;
	picturesFs: Collection<PictureFs>;
} {
	const coll = db.collection<Picture>('pictures');
	const fs = db.collection<PictureFs>('pictures.fs');

	return { pictures: coll, picturesFs: fs };
}
