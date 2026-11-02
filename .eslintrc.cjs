module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	plugins: ['@typescript-eslint', 'svelte'],
	ignorePatterns: ['*.cjs'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			// eslint-plugin-svelte 3 exposes flat configs; retain the legacy ESLint 8
			// setup by applying their rules with the parser and processor explicitly.
			rules: {
				...Object.assign(
					{},
					...require('eslint-plugin-svelte').configs.recommended.map((config) => config.rules)
				),
				// This site is deployed at the domain root (no kit.paths.base).
				'svelte/no-navigation-without-resolve': 'off',
			},
			processor: 'svelte/svelte',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-non-null-assertion': 'error',
	},
};
