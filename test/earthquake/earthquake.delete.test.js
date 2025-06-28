import dotenv from 'dotenv/config'
import app from '../../src/index.js'
import request from 'supertest'
import mongoose from 'mongoose'

const sampleItem = {
	id: "sismo_1",
	magnitude: 5.4,
	depth: 30,
	location: "Chile",
	date: "2023-11-15"
};

beforeAll(async () => {
	await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

	await request(app)
		.post('/earthquakes')
		.send(sampleItem)
		.expect(201)
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

describe('DELETE /earthquakes/:id', () => {
	it('Should delete an earthquake record', async () => {
		const response = await request(app)
			.delete(`/earthquakes/${sampleItem.id}`)
			.expect(200)

		expect(response.body).toHaveProperty('_id');
		expect(response.body.id).toBe(sampleItem.id);
		expect(response.body.magnitude).toBe(sampleItem.magnitude);
		expect(response.body.depth).toBe(sampleItem.depth);
		expect(response.body.location).toBe(sampleItem.location);
		expect(new Date(response.body.date).toISOString()).toBe(new Date(sampleItem.date).toISOString());
	})

	it('Should return 204 when no content is found', async () => {
		await request(app)
			.delete(`/earthquakes/sismo_23`)
			.expect(204)
	})
})
