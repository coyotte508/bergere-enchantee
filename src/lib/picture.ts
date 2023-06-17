import type { Picture } from './types/Picture';

export function pictureLink(picture: Picture) {
	return `/photos/raw/${picture._id}/format/${picture.storage.formats[0].width}`;
}
