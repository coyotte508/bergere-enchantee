import { kebabCase } from 'lodash';
import { nanoid } from 'nanoid';

export function generateId(name: string): string {
	return kebabCase(name.replace(/&/g, '-and-')) + '-' + nanoid(6);
}
