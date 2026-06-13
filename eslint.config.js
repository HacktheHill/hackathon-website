import tsParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import importPlugin from "eslint-plugin-import";

const extensions = [
	".js",
	".jsx",
	".mjs",
	".cjs",
	".ts",
	".tsx",
	".astro",
	".json",
	".svg",
	".png",
	".jpg",
	".jpeg",
	".webp",
	".avif",
	".gif",
	".css",
	".ttf",
	".otf",
	".woff",
	".woff2",
];

const importResolutionConfig = {
	plugins: {
		import: importPlugin,
	},
	settings: {
		"import/extensions": extensions,
		"import/resolver": {
			typescript: {
				project: "./tsconfig.json",
				extensions,
			},
			node: {
				extensions,
			},
		},
	},
	rules: {
		"import/no-unresolved": ["error", { commonjs: true, caseSensitive: true }],
	},
};

export default [
	{
		ignores: [".astro/**", "build/**", "dist/**", "node_modules/**"],
	},
	{
		files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		...importResolutionConfig,
	},
	{
		files: ["**/*.astro"],
		languageOptions: {
			parser: astroParser,
			parserOptions: {
				ecmaVersion: "latest",
				extraFileExtensions: [".astro"],
				parser: tsParser,
				sourceType: "module",
			},
		},
		...importResolutionConfig,
	},
];
