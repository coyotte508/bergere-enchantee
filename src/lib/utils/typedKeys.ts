export function typedKeys<K extends string>(x: Record<K, any>): K[] {
	return Object.keys(x) as K[];
}
