import { randomBytes } from 'crypto';

/**
 * Generates a secure random access key for orders
 * @param length The length of the key in bytes (default: 32)
 * @returns A URL-safe base64 encoded string
 */
export function generateAccessKey(length: number = 32): string {
	return randomBytes(length)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

/**
 * Validates that an access key has the correct format
 * @param key The access key to validate
 * @returns True if the key format is valid
 */
export function isValidAccessKey(key: string): boolean {
	// Check if it's a valid URL-safe base64 string of expected length
	const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
	return base64UrlPattern.test(key) && key.length >= 40; // ~32 bytes base64 encoded
}
