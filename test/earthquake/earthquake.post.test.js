import dotenv from 'dotenv/config'
import app from '../../src/index.js'
import request from 'supertest'
import mongoose from 'mongoose'

beforeAll(async () => {
	const connection_url = process.env.DATABASE_URL
	await mongoose.connect(connection_url, { useNewUrlParser: true, useUnifiedTopology: true });
});

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
})
