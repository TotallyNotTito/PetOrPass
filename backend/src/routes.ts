/** @module Routes */

import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Pet} from "./db/models/pet";

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function pet_routes(app: FastifyInstance): Promise<void> {

	// Middleware
	app.use(cors());

	/**
	 * Root route to serve landing page of app
	 * @name get/root
	 * @function
	 */
	app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.code(200)
		// TODO: This is a placeholder static html file until we implement and serve react front end
		await reply.sendFile("index.html");
	});




	/**
	 * Route replying to /test path for test-testing
	 * @name get/test
	 * @function
	 */
	app.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.code(200)
		await reply.send("GET Test");
	});
}
