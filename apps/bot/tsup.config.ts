import { relative } from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
	clean: true,
	format: ["cjs"],
	keepNames: true,
	minify: false,
	shims: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	target: "esnext",
	treeshake: true,
	silent: true,
	dts: false,
	bundle: true,
	splitting: true,
	entry: ["src/**/*.ts", "!src/**/*.d.ts"],
	tsconfig: relative(__dirname, "./src/tsconfig.json"),
	noExternal: ["@zeyr/redis"]
});
