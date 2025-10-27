import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

const config: UserConfig = {
	server: {
		port: process.env.PORT ? parseInt(process.env.PORT) : 4201,
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
	],
};

export default config;
