import dotenv from 'dotenv/config'
import app from '../../src/index.js'
import request from 'supertest'
import mongoose from 'mongoose'

beforeAll(async () => {
	const connection_url = process.env.DATABASE_URL
	await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true })
});

beforeEach(async () => {
	await mongoose.connection.dropDatabase();
})

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

describe('POST /earthquakes', () => {
	it('Should create an earthquake record', async () => {
		const newItem = {
			id: "sismo_1",
			magnitude: 5.4,
			depth: 30,
			location: "Chile",
			date: "2023-11-15"
		};

		const response = await request(app)
			.post('/earthquakes')
			.send(newItem)
			.expect(201)

		expect(response.body).toHaveProperty('_id');
		expect(response.body.id).toBe(newItem.id);
		expect(response.body.magnitude).toBe(newItem.magnitude);
		expect(response.body.depth).toBe(newItem.depth);
		expect(response.body.location).toBe(newItem.location);
		expect(new Date(response.body.date).toISOString()).toBe(new Date(newItem.date).toISOString());
	})

	it('Should return 400 for missing properties', async () => {
		const cases = [
			{ magnitude: 5.4, depth: 30, location: "Chile", date: "2023-11-15" },     // Missing id
			{ id: "sismo_1", depth: 30, location: "Chile", date: "2023-11-15" },      // Missing magnitude
			{ id: "sismo_1", magnitude: 5.4, location: "Chile", date: "2023-11-15" }, // Missing depth
			{ id: "sismo_1", magnitude: 5.4, depth: 30, date: "2023-11-15" },         // Missing location
			{ id: "sismo_1", magnitude: 5.4, depth: 30, location: "Chile" }           // Missing date
		]
		for (const n of cases) {
			const response = await request(app)
				.post('/earthquakes')
				.send(n)
				.expect(400)
			expect(response.body).toHaveProperty('message');
		}
	})

	it('Should return 400 for invalid date format', async () => {
		const invalidItem = {
			id: "sismo_1",
			magnitude: 5.4,
			depth: 30,
			location: "Chile",
			date: "15-11-2023" // INCORRECT
		};

		const response = await request(app)
			.post('/earthquakes')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

	it('Should return 400 for invalid id format', async () => {
		const invalidItem = {
			id: "1_sismo", // INCORRECT
			magnitude: 5.4,
			depth: 30,
			location: "Chile",
			date: "2023-11-15"
		};

		const response = await request(app)
			.post('/earthquakes')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

	it('Should return 400 for negative numbers', async () => {
		const cases = [
			{ id: "sismo_1", magnitude: -5.4, depth: 30, location: "Chile", date: "2023-11-15" },
			{ id: "sismo_2", magnitude: 5.4, depth: -30, location: "Chile", date: "2023-11-15" }
		];

		for (const n of cases) {
			const response = await request(app)
				.post('/earthquakes')
				.send(n)
				.expect(400)
			expect(response.body).toHaveProperty('message');
		}
	})

	it('Should return 400 for repeated ids', async () => {
		const newItem = { id: "sismo_1", magnitude: 5.4, depth: 30, location: "Chile", date: "2023-11-15" };
		await request(app)
			.post('/earthquakes')
			.send(newItem)
		const identicalItem = { id: "sismo_1", magnitude: 5.4, depth: 30, location: "Chile", date: "2023-11-15" };
		const newResponse = await request(app)
			.post('/earthquakes')
			.send(identicalItem)
			.expect(400)
		expect(newResponse.body).toHaveProperty('message');
	})
})
