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

describe('POST /weather', () => {
	it('Should create a weather record', async () => {
		const newItem = {
			id: "clima_1",
            city: "Caracas",
			temperature: 30.7,
			humidity: 82,
			condition: "Soleado"
		};

		const response = await request(app)
			.post('/weather')
			.send(newItem)
			.expect(201)

		expect(response.body).toHaveProperty('_id');
		expect(response.body.id).toBe(newItem.id);
		expect(response.body.city).toBe(newItem.city);
		expect(response.body.temperature).toBe(newItem.temperature);
		expect(response.body.humidity).toBe(newItem.humidity);
        expect(response.body.condition).toBe(newItem.condition);
	})

	it('Should return 400 for missing properties', async () => {
		const cases = [
			{ temperature: 30.7, humidity: 82, city: "Caracas", condition: "Soleado"},      // Missing id
			{ id: "clima_1", humidity: 82, city: "Caracas", condition: "Soleado"},          // Missing temperature
			{ id: "clima_1", temperature: 30.7, city: "Caracas", condition: "Soleado"},     // Missing humidity
			{ id: "clima_1", temperature: 30.7, humidity: 82, condition: "Soleado"},        // Missing city
			{ id: "clima_1", temperature: 30.7, humidity: 82, city: "Caracas" }             // Missing condidition
		]
		for (const n of cases) {
			const response = await request(app)
				.post('/weather')
				.send(n)
				.expect(400)
			expect(response.body).toHaveProperty('message');
		}
	})

	// Check for valid condicion value
	it('Should return 400 for invalid condition format', async () => {
		const invalidItem = {
			id: "clima_1",
            city: "Caracas",
			temperature: 30.7,
			humidity: 82,
			condition: "Feliz" // INCORRECT
		};

		const response = await request(app)
			.post('/weather')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

	it('Should return 400 for invalid id format', async () => {
		const invalidItem = {
			id: "1_clima", // INCORRECT
            city: "Caracas",
			temperature: 30.7,
			humidity: 82,
			condition: "Soleado"
		};

		const response = await request(app)
			.post('/weather')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

    it('Should return 400 for negative number in humidity', async () => {
		const invalidItem = {
			id: "1_clima", 
            city: "Caracas",
			temperature: 30.7,
			humidity: -82, // INCORRECT
			condition: "Soleado"
		};

		const response = await request(app)
			.post('/weather')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

    it('Should return 400 for repeated id', async () => {
		const newItem = {
			id: "clima_1",
            city: "Caracas",
			temperature: 30.7,
			humidity: 82,
			condition: "Soleado"
		};

		await request(app)
			.post('/weather')
			.send(newItem)
		
		const invalidItem = {
			id: "clima_1", // INCORRECT
            city: "Caracas",
			temperature: 30.7,
			humidity: 82,
			condition: "Soleado"
		};

		const response = await request(app)
			.post('/weather')
			.send(invalidItem)
			.expect(400);

		expect(response.body).toHaveProperty('message');
	});

})
