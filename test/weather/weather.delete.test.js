import dotenv from 'dotenv/config'
import app from '../../src/index.js'
import request from 'supertest'
import mongoose from 'mongoose'

const sampleItem = {
    id: "clima_1",
    city: "Caracas",
    temperature: 30.7,
    humidity: 82,
    condition: "Soleado"
};

beforeAll(async () => {
	await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

	await request(app)
		.post('/weather')
		.send(sampleItem)
		.expect(201)
});

afterAll(async () => {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
});

describe('DELETE /weather/:id', () => {
	it('Should delete an weather record', async () => {
		const response = await request(app)
			.delete(`/weather/${sampleItem.id}`)
			.expect(200)

            expect(response.body).toHaveProperty('_id');
            expect(response.body.id).toBe(newItem.id);
            expect(response.body.city).toBe(newItem.city);
            expect(response.body.temperature).toBe(newItem.temperature);
            expect(response.body.humidity).toBe(newItem.humidity);
            expect(response.body.condition).toBe(newItem.condition);
	})

	it('Should return 204 when no content is found', async () => {
		await request(app)
			.delete(`/weather/clima_23`)
			.expect(204)
	})

	it('Should return 400 when id is malformed', async () => {
		const response = await request(app)
			.delete(`/weather/incorrect_format`)
			.expect(400)
		expect(response.body).toHaveProperty('message');
	})
})
