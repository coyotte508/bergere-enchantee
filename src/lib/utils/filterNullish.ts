export function filterNullish<T>(arr: (T | null | undefined)[]): T[] {
	return arr.filter((x): x is T => x !== undefined && x !== null);
}
