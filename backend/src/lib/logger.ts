/** @module Logger */
import fs from "fs";

const logDir = import.meta.env["VITE_LOGS_DIR"];

// Create directory to store logs if it doesn't exist
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, {recursive: true});
}

/**
 * Set logger options such that dev logs are pretty,
 * and prod logs are warn level saved to file
 */
const logger = import.meta.env.DEV
	? {
		transport: {

			target: "pino-pretty",
			options: {
				translateTime: "HH:MM:ss.l",
				ignore: "pid,hostname",
			},
		},
		file: logDir + "/dev-logs.log",
	}
	: {
		level: "warn",
		file: logDir + "/warn-logs.log",
	};

export default logger;

// in-source testing
if (import.meta.vitest) {
	const {describe, it, expect} = import.meta.vitest;

	describe("logger", () => {
		it("creates log config object", () => {
			expect(logger)
				.toBeDefined();
		});
	});
}
