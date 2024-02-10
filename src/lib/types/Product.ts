import type { Picture } from './Picture';
import type { Timestamps } from './Timestamps';

export interface Product extends Timestamps {
	_id: string;
	name: string;
	description: string;
	price: number;
	kind: ProductKind;
	state: 'draft' | 'published';
	stock: number;

	photos: Picture[];
}

export const PRODUCT_KINDS = ['armchair', 'cushion', 'chair', 'couch', 'tufting'] as const;
export type ProductKind = (typeof PRODUCT_KINDS)[number];
