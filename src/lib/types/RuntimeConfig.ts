import type { Timestamps } from './Timestamps';

export interface RuntimeConfig extends Timestamps {
	_id: string; // Config key (e.g., 'orderCounter')
	value: number | string | boolean; // Config value
	description?: string; // Optional description of what this config does
}

// Specific type for order counter
export interface OrderCounterConfig extends RuntimeConfig {
	_id: 'orderCounter';
	value: number;
}
