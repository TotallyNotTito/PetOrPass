/** @module Seeds/Pet */

import {Pet} from "../models/pet";
import {Seeder} from "../../lib/seed_manager";
import {FastifyInstance} from "fastify";
import {faker} from "@faker-js/faker";

faker.seed(100);

/**
 * Seeds the pets database table
 */
export class PetSeeder extends Seeder {

	/**
     * Runs the Pets table's seed
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
			pet.image_name = `${faker.animal.type()}${faker.datatype.uuid()}.jpg`;
			pet.total_score = Math.floor(Math.random() * 91) + 10;
			pet.total_votes = Math.floor(Math.random() * 10) + 1;
			pet.submitted_by = `fake_auth_id_${faker.datatype.number({ min: 1, max: 5})}`;
			await pet.save();
			app.log.info("Seeded pet " + i);
		}
	}
}

export const PetSeed = new PetSeeder();
