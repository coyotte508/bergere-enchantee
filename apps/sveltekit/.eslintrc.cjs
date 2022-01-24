module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['svelte3', '@typescript-eslint', "prettier"],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	rules: {
		semi: ["error", "always"],
		"max-len": ["error", { "code": 120 }],
		quotes: ["error", "double", { "avoidEscape": true }]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
