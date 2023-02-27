// @ts-ignore - supertest is not a module, it's a global
import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {buildApp} from "../src/server";
import SeedManager from "../src/lib/seed_manager";
import SeederOptions from "../src/db/seeds/seeder_options";

// This is the app we'll use for testing, created at file-level scope
let app;

// called once before all tests run, used to prepare server for tests
beforeAll(async () => {
	// Build our app ONLY -- no listening
	app = await buildApp(true);
	// https://www.fastify.io/docs/latest/Reference/Server/#ready
	// This does everything BUT listen -- all of Fastify's internal setup
	await app.ready();
	// set up database for testing
	await SeedManager.seedAll(app, SeederOptions);
});

// Called once after all tests finish, used for cleanup
afterAll(async () => {
	// Reset database to default
	await SeedManager.seedAll(app, SeederOptions);
	// Notify fastify it can clean itself up
	await app.close();
});

// Note this testing is for API or integration testing
// Unit tests belong in-source, in the same file as the code they test
describe("testing the test framework itself", () => {
	it("performs vitest injection requests properly", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/test",
		});

		expect(response.statusCode)
			.toBe(200);
		expect(response.payload)
			.toBe("GET Test");
	});
});

describe("Route testing", () => {
	it("logs into application", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/login",
		});

		// TODO: This is a placeholder test until authentication microservice implemented

		expect(response.statusCode)
			.toBe(200);
	});

	it("logs out of application", async () => {
		const response = await app.inject({
			method: "GET",
			url: "/logout",
		});

		// TODO: This is a placeholder test until authentication microservice implemented

		expect(response.statusCode)
			.toBe(200);
	});

	it("retrieves random pet from database", async () => {
		const petNames = ['Karianne', 'Brandon', 'Georgianna', 'Amalia', 'Leanne', 'Wilburn', 'Mae', 'Amelia', 'Tyra', 'Amparo']
		const response = await app.inject({
			method: "GET",
			url: "/pet",
		});

		expect(response.statusCode)
			.toBe(200);
		const data = JSON.parse(response.payload);
		expect(petNames).toContain(data.pet_name);
	});

	it("Creates new pet in database and file storage", async () => {


		// TODO: This is a placeholder test until MinIO file storage and frontend implemented

		expect(true)
			.toBe(true);
	});
});
