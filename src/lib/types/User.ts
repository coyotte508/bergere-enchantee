import type { Timestamps } from './Timestamps';

export interface User extends Timestamps {
	email: string;
	hash: string;
	token?: string;
	authority?: 'admin';
}
