/** @module Helpers */
import {dirname} from 'path';
import {fileURLToPath} from 'url';

/**
 * DIY __dirname since it's removed from ES Modules:
 * https://codingbeautydev.com/blog/javascript-dirname-is-not-defined-in-es-module-scope/
 * @function
 * @param {ImportMeta} meta Fastify-provided import meta
 */
export function getDirName(meta: ImportMeta) {
	const __filename = fileURLToPath(meta.url);

	return dirname(__filename);
}

/**
 * Determines which mode to start Doggr backend in
 */
export enum RunMode {
	LISTEN,
	SEED
}

/**
 * Gets execution mode from command line args
 * @returns {RunMode.LISTEN | RunMode.SEED}
 */
export function getModeFromArgs() {
	if (process.argv[2] === "-seed") {
		return RunMode.SEED;
	} else {
		return RunMode.LISTEN;
	}
}

// in-source testing
if (import.meta.vitest) {
	const {describe, it, expect} = import.meta.vitest;

	describe("helpers", () => {
		it("is an always-passing example test for verifying in-source testing functions", () => {
			let thing = 0;
			expect(thing)
				.toBe(0);
		});

		it("gets Directory Name properly", () => {
			let dirName = getDirName(import.meta);
			expect(dirName)
				.toContain("backend");
		});
	});
}

