// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

import type { User } from '$lib/types/User';

declare global {
	declare namespace App {
		interface Locals {
			user: null | User;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
