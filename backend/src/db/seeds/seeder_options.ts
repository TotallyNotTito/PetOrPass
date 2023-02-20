/** @module SeedManager */
import {PetSeed} from "./pet_seeder";
import {Seeder} from "../../lib/seed_manager";

export type SeederOptionsType = {
	seeds: Array<Seeder>;
}

/**
 * Options bag for configuring which seeds to run during `pnpm seed`
 */
const SeederOptions: any = {
	seeds: [
		PetSeed
	]
};

export default SeederOptions;
