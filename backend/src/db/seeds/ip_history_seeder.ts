/** @module Seeds/IPHistory */

import {faker} from "@faker-js/faker";
import {Seeder} from "../../lib/seed_manager";
import {IPHistory} from "../models/ip_history";
import {User} from "../models/user";
import {FastifyInstance} from "fastify";

// note here that using faker makes testing a bit...hard
// We can set a particular seed for faker, then use it later in our testing!
faker.seed(100);

/**
 * Seeds the ip_history table
 */
export class IPHistorySeeder extends Seeder {

	/**
   * Runs the IPHistory table's seed
   * @function
   * @param {FastifyInstance} app
   * @returns {Promise<void>}
   */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding IP Histories...");
		// Remove everything in there currently
		await app.db.ip.delete({});
		// get our users and make each a few IPs
		const users = await User.find();

		for (let i = 0; i < users.length; i++) {
	  let ip = new IPHistory();
	  ip.user = users[i];
	  ip.ip = faker.internet.ip();
	  await ip.save();

	  ip = new IPHistory();
	  ip.user = users[i];
	  ip.ip = faker.internet.ip();
	  const secondResult = await ip.save();
	  app.log.info("Finished seeding IP history pair for user: " + i);
		}
	}
}

export const IPHistorySeed = new IPHistorySeeder();

 
