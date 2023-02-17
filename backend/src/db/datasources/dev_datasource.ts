// We need dotenv here because our datasources are processed from CLI in addition to vite
import dotenv from "dotenv";
import {DataSource} from 'typeorm';
// Similar reasoning as above, we need to add the file extensions to this file's imports for CLI usage
import {User} from "../models/user";
import {IPHistory} from "../models/ip_history";
import {Initialize1676281754950} from "../migrations/1676281754950-Initialize";

dotenv.config();

// @ts-ignore
const env = process.env;

export const AppDataSource = new DataSource({
	type: "postgres",
	host: env.VITE_DB_HOST,
	port: Number(env.VITE_DB_PORT),
	username: env.VITE_DB_USER,
	password: env.VITE_DB_PASS,
	database: env.VITE_DB_NAME,
	// entities are used to tell TypeORM which tables to create in the database
	entities: [
		User,
		IPHistory,
	],
	migrations: [
		Initialize1676281754950,

	],
	// DANGER DANGER our convenience will nuke production data!
	synchronize: false
});
