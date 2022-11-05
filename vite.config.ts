import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import Unocss from 'unocss/vite'

const config: UserConfig = {
	plugins: [sveltekit(), Unocss({
		rules: [
			[/^text-(.*)$/, ([, c], { theme }) => {
				if (c in theme.colors)
					return { color: theme.colors[c as keyof typeof theme.colors] };
			}], 
			[/^bg-(.*)$/, ([, c], { theme }) => {
				if (c in theme.colors)
					return { "background-color": theme.colors[c as keyof typeof theme.colors] };
			}],
		],
		shortcuts: {
			input: "w-full max-w-80 text-lg pl-2 border border-solid border-2 rounded-xl",
			link: "underline text-brunswick",
			btn: "text-white bg-oxford px-4 py-2 rounded-3xl font-bold border-0",
			"btn-sunray": "text-white bg-sunray px-4 py-2 rounded-3xl font-bold border-0",
		},
		theme: {
			colors: {
				"oxford": "#0a274c",
				"sunray": "#d3a95a",
				"brunswick": "#1e4832"
			},
		}
	})]
};

export default config;
