export function upperFirst(s: string): string {
	if (!s) {
		return s;
	}
	return s[0].toLocaleUpperCase() + s.slice(1);
}
