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
	 * @returns {FastifyReply} TODO: Return description will be included after implementing react app
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
	 * @returns {FastifyReply} TODO: Return description will be included after implementing authentication
	 */
	app.get("/login", async (request: FastifyRequest, reply: FastifyReply) => {
		// TODO: This is a placeholder reply until authentication microservice implemented
		reply.code(200);
		await reply.send("PLACEHOLDER for Login via Authentication Microservice");
	});

	/**
	 * Route to redirect to the authentication microservice and log out user
	 * @name get/logout
	 * @function
	 * @returns {FastifyReply} TODO: Return description will be included after implementing authentication
	 */
	app.get("/logout", async (request: FastifyRequest, reply: FastifyReply) => {
		// TODO: This is a placeholder reply until authentication microservice implemented
		reply.code(200);
		await reply.send("PLACEHOLDER for Logout via Authentication Microservice");
	});

	/**
	 * Route to create new pet details in database and store pet image in file storage
	 * @name post/pet
	 * @function
	 * @param {string} petName - name of submitted pet
	 * @param {image file} imageFile - image of submitted pet
	 * @param {string} submittedBy - auth ID of user that submitted pet
	 * @returns {FastifyReply} 201 status code to indicate that the submitted pet was successfully stored
	 */
	app.post("/pet", async (request: any, reply: FastifyReply) => {
		const {petName, submittedBy} = request.body;
		const imageData = await request.file();
		const imageName = `${faker.animal.type()}${faker.datatype.uuid()}.${imageData.mimetype}`;

		const pet = new Pet();
		pet.pet_name = petName;
		pet.image_name = imageName;
		pet.total_score = 0;
		pet.total_votes = 0;
		pet.submitted_by = submittedBy;
		await pet.save();

		// TODO: Pet image will be saved to MinIO file storage with new name once file storage implemented

		reply.code(201);
		await reply.send();
	});

	/**
	 * Route to retrieve a random pet to display for rating
	 * @name get/pet
	 * @function
	 * @returns {FastifyReply} details of a randomly selected pet to be displayed to the user
	 */
	app.get("/pet", async (request: FastifyRequest, reply: FastifyReply) => {
		let statusCode = 200;

		const pet = await app.db.pet.findOneByOrFail({}).catch((err) => {
			// TODO: UI needed to display simple error message when database is empty
			statusCode = 404;
			return {error: err};
		});

		reply.code(statusCode);
		await reply.send(JSON.stringify(pet));
	});


	// });
	// /**
	//  * Route to create new pet details in database and store pet image in file storage
	//  * @name get/pet-score
	//  * @function
	//  * @param {number} pet_id - name of submitted pet
	//  */
	// app.put("/pet-score", async (request: FastifyRequest, reply: FastifyReply) => {
	//
	// });
	// /**
	//  * Route to create new pet details in database and store pet image in file storage
	//  * @name get/pets
	//  * @function
	//  */
	// app.get("/pets", async (request: FastifyRequest, reply: FastifyReply) => {
	//
	// });

	/**
	 * Route replying to /test path for test-testing
	 * @name get/test
	 * @function
	 */
	app.get("/test", async (request: FastifyRequest, reply: FastifyReply) => {
		reply.code(200);
		await reply.send("GET Test");
	});
}
