/** @module Routes */

import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Pet} from "./db/models/pet";
import {faker} from "@faker-js/faker";
import {formatImagePath} from "./lib/helpers";
import {DatabaseAuthenticator, AppMetadata, UserMetadata} from "auth0";

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function pet_routes(app: FastifyInstance): Promise<void> {
	/**
	 * Root route to serve landing page of app
	 * @name get/root
	 * @function
	 * @returns {FastifyReply} TODO: Return description will be included after implementing react app
	 */
	app.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
		// TODO: This is a placeholder static html file until we implement and serve react front end
		// TODO: delete static index.html file public dir
		reply.code(200);
		await reply.sendFile("index.html");
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
	app.post("/pet", {
		onRequest: [app.authenticate]
	}, async (request: any, reply: FastifyReply) => {
		const data = await request.file();
		const {petName, submittedBy} = data.fields;


		if (data.mimetype.includes('image')) {
			const fileName = data.filename.split('.');
			const fileExtension = fileName[fileName.length - 1];
			const imageName = `${faker.animal.type()}${faker.datatype.uuid()}.${fileExtension}`;

			const pet = new Pet();
			pet.pet_name = petName.value;
			pet.image_name = imageName;
			pet.total_score = 0;
			pet.total_votes = 0;
			pet.submitted_by = submittedBy.value;
			await pet.save();

			// TODO: Pet image will be saved to MinIO file storage with new name once file storage implemented
			// data.file will contain the actual file we want to send to minio

			reply.code(201);
			await reply.send();
		} else {
			reply.code(500);
			await reply.send({error: "Incorrect file type was submitted, must be an image file"});
		}
	});

	/**
	 * Route to retrieve a random pet to display for rating
	 * @name get/pet
	 * @function
	 * @returns {FastifyReply} details of a randomly selected pet to be displayed to the user
	 */
	app.get("/pet", {
		onRequest: [app.authenticate]
	}, async (request: FastifyRequest, reply: FastifyReply) => {
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
	app.put("/pet-score", {
		onRequest: [app.authenticate]
	}, async (request: any, reply: FastifyReply) => {
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
	app.get("/pets/:submittedBy", {
		onRequest: [app.authenticate]
	}, async (request: any, reply: FastifyReply) => {
		const {submittedBy} = request.params;
		const dbResult = await app.db.pet.find({where: {submitted_by: submittedBy}});

		let pets:any[] = [];
		dbResult.forEach((pet) => {
			pets.push({
				pet_id: pet.id,
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
