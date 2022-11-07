import type { Timestamps } from './Timestamps';

export interface Picture extends Timestamps {
	_id: string;
	productId?: string;
	name: string;

	storage: Array<{
		_id: string;
		width: number;
		height: number;
		size: number;
	}>;
}

export interface PictureFs extends Timestamps {
	_id: string;
	data: Buffer;
	size: number;
	picture: string;
}
