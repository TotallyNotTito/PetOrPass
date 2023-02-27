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
		const petNames = ['Karianne', 'Brandon', 'Georgianna', 'Amalia', 'Leanne', 'Wilburn', 'Mae', 'Amelia', 'Tyra', 'Amparo'];
		const imageNames = ['http://PLACEHOLDER/my_bucket/cow4668d202-12a3-4d72-991e-938281034ffc.jpg',
			'http://PLACEHOLDER/my_bucket/snake1d44a6bf-ade5-4429-9208-4ac209979617.jpg',
			'http://PLACEHOLDER/my_bucket/cetacean07e0fc08-e698-4bfa-a910-d318dcd4140d.jpg',
			'http://PLACEHOLDER/my_bucket/horse5ea50915-e5c2-4c3a-8982-6991a523e8f6.jpg',
			'http://PLACEHOLDER/my_bucket/horse625b3c4b-3d28-4f0f-a95b-8541e708a178.jpg',
			'http://PLACEHOLDER/my_bucket/horse7635ec2c-258a-4084-8e16-5779a145a53e.jpg',
			'http://PLACEHOLDER/my_bucket/bearc3cd904b-b0d9-4a0f-9f72-80d21ebf6305.jpg',
			'http://PLACEHOLDER/my_bucket/crocodilia64f71b88-ab78-4c0b-ab77-6b5d887a1549.jpg',
			'http://PLACEHOLDER/my_bucket/insect07034c97-fbfd-4f51-baf8-627fa33f89f2.jpg',
			'http://PLACEHOLDER/my_bucket/cetacean931679bb-5784-4f91-bf5b-5d3b747fe4bf.jpg'];

		const response = await app.inject({
			method: "GET",
			url: "/pet",
		});

		expect(response.statusCode)
			.toBe(200);
		const data = JSON.parse(response.payload);
		expect(petNames).toContain(data.pet_name);
		expect(imageNames).toContain(data.image_name);
	});

	it("updates a pet's score", async () => {
		const testPet = await app.db.pet.findOneBy({});
		const newScore = ((testPet.total_score + 10) / (testPet.total_votes + 1)).toFixed(2);

		const response = await app.inject({
			method: "PUT",
			url: "/pet-score",
			payload: {
				petId: testPet.id,
				petRating: 10
			}
		});

		expect(response.statusCode)
			.toBe(200);
		const data = JSON.parse(response.payload);
		expect(data.avgScore).toEqual(newScore);
	});

	it("Creates new pet in database and file storage", async () => {


		// TODO: This is a placeholder test until MinIO file storage and frontend implemented

		expect(true)
			.toBe(true);
	});
});
