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

export interface ImageData {
	key: string;
	width: number;
	height: number;
	size: number;
}
