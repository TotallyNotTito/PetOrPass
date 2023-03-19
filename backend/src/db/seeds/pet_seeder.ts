/** @module Seeds/Pet */

import {Pet} from "../models/pet";
import {Seeder} from "../../lib/seed_manager";
import {FastifyInstance} from "fastify";
import {faker} from "@faker-js/faker";
import {v4 as uuidv4} from 'uuid';

faker.seed(100);

/**
 * Seeds the pets database table
 */
export class PetSeeder extends Seeder {

	/**
     * Runs the Pets table's seed
	 * Seeder should only be used for backend testing as-is,
	 * 		but to use seeder for frontend testing, images with names that match the seeded image names must be manually input into MinIO instance
     * @function
     * @param {FastifyInstance} app
     * @returns {Promise<void>}
     */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Pets...");
		// Remove everything in there currently
		await app.db.pet.delete({});

		for (let i = 0; i < 10; i++) {
			let pet = new Pet();
			pet.pet_name = faker.name.firstName();
			pet.image_name = `${uuidv4()}-${Date.now()}.jpg`;
			pet.total_score = Math.floor(Math.random() * 91) + 10;
			pet.total_votes = Math.floor(Math.random() * 10) + 1;
			pet.submitted_by = `fake_email_address_${faker.datatype.number({ min: 1, max: 5})}@test.com`;
			await pet.save();
			app.log.info("Seeded pet " + i);
		}
	}
}

export const PetSeed = new PetSeeder();
