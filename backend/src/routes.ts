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
	// TODO: Refactor this in favor of fastify-cors
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
	 * @param {string} submittedBy - email address of user that submitted pet
	 * @returns {FastifyReply} 201 status code to indicate that the submitted pet was successfully stored
	 */
	app.post("/pet", async (request: any, reply: FastifyReply) => {
		console.log(`Request BODY: ${request.body}`)
		const {petName, submittedBy} = request.body;
		const imageData = await request.file();
		const imageName = `${faker.animal.type()}${faker.datatype.uuid()}.${imageData.mimetype}`;
		console.log('Yay you made it to the backend ROUTE!')
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
		let pet, statusCode;
		const dbResult = await app.db.pet.createQueryBuilder('pet')
			.select()
			.orderBy("RANDOM()")
			.getOne();

		if (dbResult === null) {
			statusCode = 404;
			pet = {error: "No pets have been added to the Pets table"};
		} else {
			statusCode = 200;
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
	 * @param {number} petId - id of pet that received user rating
	 * @param {number} petRating - user rating received by pet
	 * @returns {FastifyReply} updated average score for pet
	 */
	app.put("/pet-score", async (request: any, reply: FastifyReply) => {
		const {petId, petRating} = request.body;
		// We do not explicitly handle the case where a petId does not exist in the database because
		// 		this route can only be called on the front end by pets that are verified to exist as the
		//			app does not offer the option to delete a pet
		const pet = await app.db.pet.findOneOrFail({where: {id: petId}});

		pet.total_score += petRating;
		pet.total_votes += 1;
		await pet.save();

		const ratingResult = {avgScore: (pet.total_score / pet.total_votes).toFixed(2)};

		reply.code(200);
		await reply.send(JSON.stringify(ratingResult));
	});

	/**
	 * Route to retrieve list of all pets in Pets table that were submitted by a specific user
	 * @name get/pets
	 * @function
	 * @param {string} submittedBy - email address of user who submitted pets
	 * @returns {FastifyReply} list of all pets in Pets table that were submitted by a specific user
	 */
	app.get("/pets/:submittedBy", async (request: any, reply: FastifyReply) => {
		const {submittedBy} = request.params;
		const dbResult = await app.db.pet.find({where: {submitted_by: submittedBy}});

		let pets:any[] = [];
		dbResult.forEach((pet) => {
			pets.push({
				pet_name: pet.pet_name,
				image_name: formatImagePath(pet.image_name),
				total_score: pet.total_score,
				total_votes: pet.total_votes,
				submitted_by: pet.submitted_by
			});
		});

		let statusCode;
		if (pets.length === 0) {
			statusCode = 404;
			pets = [{error: 'No pets have been added to the Pets table by this user'}];
		} else {
			statusCode = 200;
		}

		reply.code(statusCode);
		await reply.send(JSON.stringify(pets));
	});

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
