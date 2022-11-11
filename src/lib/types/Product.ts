import type { Picture } from './Picture';
import type { Timestamps } from './Timestamps';

export interface Product extends Timestamps {
	_id: string;
	name: string;
	description: string;
	price: number;
	kind: 'armchair' | 'cushion';
	state: 'draft' | 'published' | 'retired';

	photos: Picture[];
}