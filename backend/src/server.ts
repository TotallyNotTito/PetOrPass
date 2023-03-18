/** @module Server */

import cors from "@fastify/cors";
import staticFiles from "@fastify/static";
import multipart from "@fastify/multipart";
import Fastify, {FastifyInstance} from "fastify";
import path from "path";
import {getDirName} from "./lib/helpers";
import logger from "./lib/logger";
import {pet_routes} from "./routes";
import DbPlugin from "./plugins/database";
import fastifyAuth0 from 'fastify-auth0-verify';
import dotenv from "dotenv";

dotenv.config();

/**
 * This is our main "Create App" function.  Note that it does NOT start the server, this only creates it
 * @function
 * @param useLogging Whether to log or not
 * @return  Promise<FastifyInstance>
 */
export async function buildApp(useLogging: boolean) {
	const app = useLogging ?
		Fastify({
			// enables fancy logs and disabling them during tests
			logger,
		})
		: Fastify({logger: false});

	try {
		// add support for cors
		await app.register(cors, {
			origin: (origin, cb) => {
				cb(null, true);
			}
		});

		// add support for multipart content type
		await app.register(multipart, {limits: {fileSize: 2000000000}});

		// add static file handling
		await app.register(staticFiles, {
			root: path.join(getDirName(import.meta), "../public"),
			prefix: "/public/",
		});

		// adding auth protection to the routes
		app.log.info("Registering Auth0...");
		await app.register(fastifyAuth0, {
			domain: import.meta.env.VITE_AUTH0_DOMAIN,
			audience: import.meta.env.VITE_AUTH0_CLIENT_ID
		});

		// Adds all of our Router's routes to the app
		app.log.info("Registering routes...");
		await app.register(pet_routes);

		// Connects to postgres
		app.log.info("Connecting to Database...");
		await app.register(DbPlugin);

		app.log.info("App built successfully.");
	} catch (err) {
		console.error(err);
		await process.exit(1);
	}

	return app;
}

/**
 * This is what actively starts the server listening on a port
 *
 * @param app: FastifyInstance main server instance created in buildApp()
 * @return  Promise<void> When server closes
 */
export async function listen(app: FastifyInstance) {
	try {

		let host = import.meta.env.VITE_IP_ADDR;
		let port = Number(import.meta.env.VITE_PORT);

		console.log(`In listen with host:port: ${host}:${port}`);
		await app.listen({ // Config object is optional and defaults to { host: 'localhost', port: 3000 }
			host,
			port,
		}, (err: any) => {  // Listen handler doesn't need to do much except report errors!

			if (err) {
				console.log("1");
				app.log.error(err);
			}
		});
	} catch (err) { // This will catch any errors that further bubble up from listen(), should be unnecessary
		console.log("2");
		app.log.error(err);
	}
}
