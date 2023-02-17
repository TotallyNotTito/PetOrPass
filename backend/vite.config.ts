// @ts-nocheck
// noinspection JSUnusedGlobalSymbols

import * as path from "path";
import {loadEnv} from "vite";
import {VitePluginNode} from "vite-plugin-node";
import {configDefaults, defineConfig, UserConfig as VitestUserConfigInterface} from "vitest/config";
import {getDirName} from "./src/lib/helpers";
import dts from "vite-plugin-dts";

// Gets us fancy typing/intellisense during dev
const vitestConfig: VitestUserConfigInterface = {
	test: {
		globals: true,
		exclude: [...configDefaults.exclude, "packages/template/*"],
		reporters: "verbose",
		include: ["./test/**/*.{test,spec}.{ts,mts,cts,tsx}"],
		includeSource: ["src/**/*.ts", "src/"],
		onConsoleLog(_log, _type) {
			return true;
		}
	},
};

// our .env file isn't loaded until AFTER this config, so if we want to use it
// we need to use a loadEnv helper.
// https://vitejs.dev/config/#environment-variables
const env = loadEnv("development", process.cwd(), "");

export default defineConfig({
	test: vitestConfig.test,
	// Keeps track of which tests have failed on prior run, then executes them first on the next run
	cache: true,
	build: {
		emptyOutDir: true,
		outDir: "build",
		target: "modules",
		rollupOptions: {

			output: {
				manualChunks: {

				}
			}
		}
	},
	// For html/css/etc files that get copied as-is, rather than compiled, during a build
	publicDir: "./public",
	server: {
		// vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
		port: env.VITE_PORT,
	},
	plugins: [
		//dts(), // this will force-generate .d.ts files in build dir, occasionally useful for debugging
		...VitePluginNode({
			// Nodejs native Request adapter
			adapter: "fastify",

			// tell the plugin where is your project entry
			appPath: "./src/index.ts",

			// Optional, default: 'viteNodeApp'
			// the name of named export of you app from the appPath file
			// this has to match the last line in src/server.ts where we export our final app
			exportName: "doggr",

			// Optional, default: 'esbuild', using swc for TypeORM support
			tsCompiler: "swc",
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(getDirName(import.meta), "./src"),
		},
	},
});
