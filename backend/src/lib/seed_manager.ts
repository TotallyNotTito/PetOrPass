/** @module SeedManager */
import {FastifyInstance} from "fastify";
import {SeederOptionsType} from "../db/seeds/seeder_options";

/**
 * Base Abstract Seeder class meant to be implemented by derived seeds
 */
export abstract class Seeder {
	/** Abstract run function that performs a Seed action
	 * Note here we do NOT make the abstract async!  No need to force it on our users, though we *can and will* use async
	 *
	 * @param {} app Fastify Instance
	 * @returns {Promise<void>}
	 */
	abstract run(app: FastifyInstance): Promise<void>;
}

/**
 * Class that manages all Seeder-related duties.
 * Right now, simply runs every Seeder's seed sequentially
 */
class SeedMgr {
	/**
	 * Performs seed on all Seeder files
	 */
	async seedAll(app: FastifyInstance, options: SeederOptionsType) {
		// Go through every seeder included in our options (See index.ts)
		for (let i = 0; i < options.seeds.length; i++) {
			// Runs each seeder's "run" method (See db/seeds/user_seeder.ts)
			await options.seeds[i].run(app);
		}
	}
}

const SeedManager = new SeedMgr();
export default SeedManager;
