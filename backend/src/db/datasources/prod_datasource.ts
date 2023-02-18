// import dotenv from "dotenv";
// import {DataSource} from 'typeorm';
// import {Pet} from "../models/pet";
// import {Initialize1676281754950} from "../migrations/1676281754950-Initialize.ts";
//
// dotenv.config();
//
// // @ts-ignore
// const env = process.env;
//
// export const AppDataSource = new DataSource(
// 	{
// 		type: "postgres",
// 		host: env.VITE_DB_HOST,
// 		port: Number(env.VITE_DB_PORT),
// 		username: env.VITE_DB_USER,
// 		password: env.VITE_DB_PASS,
// 		database: env.VITE_DB_NAME,
// 		// entities are used to tell TypeORM which tables to create in the database
// 		entities: [
// 			Pet,
// 		],
// 		migrations: [
// 			Initialize1676281754950
// 		],
// 		// DANGER DANGER our convenience will nuke production data!
// 		synchronize: false,
// 	}
// );
