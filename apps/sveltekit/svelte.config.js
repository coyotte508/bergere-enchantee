import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
import UnoCss from "unocss/vite";
import { extractorSvelte } from "@unocss/core";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: "#svelte", 

		vite: {
      plugins: [
        UnoCss({
          extractors: [extractorSvelte],
					presets: [
						presetUno(),
						presetAttributify()
					],
					rules: [
						[/^text-(.*)$/, ([, c], { theme }) => {
							if (theme.colors[c])
								return { color: theme.colors[c] };
						}], 
						[/^bg-(.*)$/, ([, c], { theme }) => {
							if (theme.colors[c])
								return { "background-color": theme.colors[c] };
						}]
					],
          theme: {
						colors: {
							"oxford": "#0a274c",
							"sunray": "#d3a95a",
							"brunswick": "#1e4832"
						},
					}
        })
      ]
    }
	}
};

export default config;
