// @ts-ignore - supertest is not a module, it's a global
import {afterAll, beforeAll, describe, expect, it} from "vitest";
import {buildApp} from "../src/server";
import SeedManager from "../src/lib/seed_manager";
import SeederOptions from "../src/db/seeds/seeder_options";
import {formatImagePath} from "../src/lib/helpers";

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
	it("retrieves random pet from database", async () => {
		const petNames = ['Karianne', 'Celestino', 'Alfreda', 'Shayna', 'Francisco', 'Etha', 'Leonie', 'Mauricio', 'Kristofer', 'Miguel'];
		const imageNames = [formatImagePath("cow4668d202-12a3-4d72-991e-938281034ffc.jpg"),
			formatImagePath("catd44a6bfa-de54-4295-a084-ac2099796176.jpg"),
			formatImagePath("cetaceane0fc08e6-98bf-4a29-90d3-18dcd4140d0f.jpg"),
			formatImagePath("bird3c4b3d28-f0fe-495b-8541-e708a178ff76.jpg"),
			formatImagePath("horsec2c258a0-844e-4165-b79a-145a53ea4c3c.jpg"),
			formatImagePath("dog4bb0d9a0-fdf7-4280-921e-bf63050864f7.jpg"),
			formatImagePath("crocodilia8ab78c0b-6b77-46b5-9887-a1549f707034.jpg"),
			formatImagePath("cow50915e5c-2c3a-4098-a699-1a523e8f69f6.jpg"),
			formatImagePath("cetaceanfbfdf51f-af86-427f-a33f-89f206931679.jpg"),
			formatImagePath("lion784f917f-5b5d-43b7-87fe-4bfca6c57a1b.jpg")];

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

	it("retrieves list of all pets submitted by a user", async () => {
		const petNames = ['Karianne', 'Shayna', 'Leonie']
		const imageNames = [formatImagePath("cow4668d202-12a3-4d72-991e-938281034ffc.jpg"),
			formatImagePath("cow50915e5c-2c3a-4098-a699-1a523e8f69f6.jpg"),
			formatImagePath("dog4bb0d9a0-fdf7-4280-921e-bf63050864f7.jpg")];
		const response = await app.inject({
			method: "GET",
			url: "/pets/fake_email_address_1@test.com"
		});

		expect(response.statusCode)
			.toBe(200);
		const data = JSON.parse(response.payload);
		expect(data)
			.toHaveLength(3);
		for (let i = 0; i < 2; i++) {
			expect(data[i].pet_name)
				.toEqual(petNames[i]);
			expect(data[i].image_name)
				.toEqual(imageNames[i]);
			expect(data[i].submitted_by)
				.toEqual('fake_email_address_1@test.com');
		}
		expect(data[3])
			.toBeUndefined();
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

		// TODO: This is a placeholder test for the POST /pet route until MinIO file storage and frontend implemented

		expect(true)
			.toBe(true);
	});
});
