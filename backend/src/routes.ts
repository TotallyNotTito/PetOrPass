/** @module Routes */

import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Pet} from "./db/models/pet";
import {faker} from "@faker-js/faker";

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
		// TODO: This is a placeholder static html file until we implement and serve react front end
		reply.code(200);
		await reply.sendFile("index.html");
	});

	/**
	 * Route to redirect to the authentication microservice and log in user
	 * @name get/login
	 * @function
	 */
	app.get("/login", async (request: FastifyRequest, reply: FastifyReply) => {
		// TODO: This is a placeholder reply until authentication microservice implemented
		reply.code(200)
		await reply.send("PLACEHOLDER for Login via Authentication Microservice");
	});

	/**
	 * Route to redirect to the authentication microservice and log out user
	 * @name get/logout
	 * @function
	 */
	app.get("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		// TODO: This is a placeholder reply until authentication microservice implemented
		reply.code(200)
		await reply.send("PLACEHOLDER for Logout via Authentication Microservice");
	});

	/**
	 * Route to create new pet details in database and store pet image in file storage
	 * @name post/pet
	 * @function
	 * @param {string} pet_name - name of submitted pet
	 * @param {image file} image_file - image of submitted pet
	 * @param {string} submitted_by - auth ID of user that submitted pet
	 */
	app.post("/pet", async (request: FastifyRequest, reply: FastifyReply) => {
		const {pet_name, submitted_by} = req.body;
		const image_data = await request.file();
		const image_name = `${faker.animal.type()}${faker.datatype.uuid()}.${data.mimetype}`;

		const pet = new Pet();
		pet.pet_name = pet_name;
		pet.image_name = image_name;
		pet.total_score = 0;
		pet.total_votes = 0;
		pet.submitted_by = submitted_by;
		await pet.save();

		// TODO: Pet image will be saved to MinIO file storage with new name once file storage implemented

		reply.code(201)
		await reply.send();
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
