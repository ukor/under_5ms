import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
	dts: true,

	entry: ["src/*.ts", "src/**/*.ts"],
	format: "cjs",
	target: "es2022",
	esbuildOptions(options: any) {
		options.banner = {
			js: '"use client"',
		};
		options.tsconfig = "./tsconfig.json";
	},
	minify: true,
	...options,
}));
