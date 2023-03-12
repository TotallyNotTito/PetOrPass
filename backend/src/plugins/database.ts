/** @module DatabasePlugin */
import "reflect-metadata";
import fp from "fastify-plugin";
import {DataSource, Repository} from "typeorm";
import {Pet} from "../db/models/pet";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {AppDataSource} from "../db/datasources/dev_datasource";

/** This is AWESOME - we're telling typescript we're adding our own "thing" to base 'app', so we get FULL IDE/TS support */
declare module 'fastify' {
	interface FastifyInstance {
		db: DBConfigOpts
	}
}

interface DBConfigOpts {
	pet: Repository<Pet>,
	connection: DataSource,
}

/**
 * Connects and decorates fastify with our Database connection
 * @function
 */
const DbPlugin = fp(async (app: FastifyInstance, options: FastifyPluginOptions, done: any) => {

	const dataSourceConnection = AppDataSource;

	await dataSourceConnection.initialize();


	// this object will be accessible from any fastify server instance
	// app.status(200).send()
	// app.db.pet
	app.decorate("db", {
		connection: dataSourceConnection,
		pet: dataSourceConnection.getRepository(Pet)
	});

	done();
}, {
	name: "database-plugin"
});

export default DbPlugin;
