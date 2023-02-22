/** @module Routes */

import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Pet} from "./db/models/pet";
import {faker} from "@faker-js/faker";
import {formatImagePath} from "./lib/helpers";

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
		let pet;
		let statusCode = 200;
		const dbResult = await app.db.pet.createQueryBuilder('pet').select().orderBy("RANDOM()").getOne();

		if (dbResult === null) {
			statusCode = 404;
			pet = { error: "No pets have been added to the Pets table" };
		} else {
			pet = {
				pet_name: dbResult.pet_name,
				image_name: formatImagePath(dbResult.image_name),
				total_score: dbResult.total_score,
				total_votes: dbResult.total_votes,
				submitted_by: dbResult.submitted_by
			};
		}

		reply.code(statusCode);
		await reply.send(JSON.stringify(pet));
	});

	/**
	 * Route to update pet's score with new score submitted by user
	 * @name put/pet-score
	 * @function
	 * @param {number} petId - name of pet that received user rating
	 * @param {number} petRating - name of pet that received user rating
	 */
	app.put("/pet-score", async (request: any, reply: FastifyReply) => {
		const {petId, petRating} = request.body;
		const pet = await app.db.pet.findOne({where: {id: petId}});

		pet.total_score += petRating;
		pet.total_votes += 1;
		pet.save();

		const ratingResult = {avgScore: (pet.total_score / pet.total_votes).toFixed(2)};

		reply.code(200);
		await reply.send(JSON.stringify(ratingResult));
	});


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
