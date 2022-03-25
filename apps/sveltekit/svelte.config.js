import adapter from "@sveltejs/adapter-node";
import preprocess from "svelte-preprocess";
import presetUno from "@unocss/preset-uno";
import presetAttributify from "@unocss/preset-attributify";
import presetIcons from "@unocss/preset-icons";
import UnoCss from "unocss/vite";
import { extractorSvelte } from "@unocss/core";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		methodOverride: {
      allowed: ["PUT", "PATCH", "DELETE"]
    },

		vite: {
      plugins: [
        UnoCss({
          extractors: [extractorSvelte],
					presets: [
						presetUno(),
						presetAttributify(),
						presetIcons()
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
					shortcuts: {
						input: "w-full max-w-80 text-lg pl-2 border border-solid border-2 rounded-lg",
						link: "underline text-brunswick"
					},
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
