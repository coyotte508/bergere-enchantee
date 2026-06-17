/**
 * Extracts the trailing integer index of a numbered key
 * (e.g. `realisation-11` -> 11, `coussin-3-titre` -> 3). Returns 0 when none.
 */
export function keyIndex(key: string): number {
	const match = key.match(/(\d+)(?:-[a-z]+)?$/i);
	return match ? parseInt(match[1], 10) : 0;
}

/** Comparator sorting numbered keys by their trailing index (2 before 11). */
export function byKeyIndex(a: string, b: string): number {
	return keyIndex(a) - keyIndex(b);
}
