import { Timestamps } from './Timestamps';

export interface PendingUpload extends Timestamps {
	_id: string;
	name: string;

	storage: {
		key: string;
		bucket: string;
		size: number;
	};
}
