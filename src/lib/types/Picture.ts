import { IndexDescription } from 'mongodb';
import type { Timestamps } from './Timestamps';

export interface Picture extends Timestamps {
	_id: string;
	productId?: string;
	name: string;

	storage: {
		original: ImageData;
		formats: ImageData[];
	};
}

export const pictureIndexes: IndexDescription[] = [
	{
		key: { productId: 1, createdAt: -1 },
	},
];

export interface ImageData {
	key: string;
	width: number;
	height: number;
	size: number;
}
