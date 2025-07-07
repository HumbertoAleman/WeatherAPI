import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

describe('GET /weather/:id', () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
	});

	beforeEach(async () => {
		await mongoose.connection.db.collection('weathers').deleteMany({});
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});

	const sampleItem = {
		id: "clima_1",
		city: "Caracas",
		temperature: 30.7,
		humidity: 82,
		condition: "Soleado"
	};

	it('Should return the most recent weather record from the DB', async () => {
		await request(app)
			.post('/weather')
			.send(sampleItem)
			.expect(201);

		const response = await request(app)
			.get(`/weather/local?city=${sampleItem.city}`)
			.expect(200)

		expect(response.body).toHaveProperty('_id');
		expect(response.body.id).toBe(sampleItem.id);
		expect(response.body.city).toBe(sampleItem.city);
		expect(response.body.temperature).toBe(sampleItem.temperature);
		expect(response.body.condition).toBe(sampleItem.condition);
	});

	it('Should return a WeatherAPI response', async () => {
		const response = await request(app)
			.get(`/weather/WeatherAPI?city=Caracas`)
			.expect(200)
		expect(response.body).toHaveProperty('location')
		expect(response.body).toHaveProperty('current')
	})

	it('Should return a OpenWeatherMap response', async () => {
		const response = await request(app)
			.get(`/weather/OpenWeatherMap?city=Caracas`)
			.expect(200)
		expect(response.body).toHaveProperty("coord");
		expect(response.body).toHaveProperty("weather");
		expect(response.body).toHaveProperty("base");
		expect(response.body).toHaveProperty("main");
		expect(response.body).toHaveProperty("visibility");
		expect(response.body).toHaveProperty("wind");
		expect(response.body).toHaveProperty("clouds");
		expect(response.body).toHaveProperty("dt");
		expect(response.body).toHaveProperty("sys");
		expect(response.body).toHaveProperty("timezone");
		expect(response.body).toHaveProperty("id");
		expect(response.body).toHaveProperty("name");
		expect(response.body).toHaveProperty("cod");
	})

	it('Should return 400 when selecting an invalid source', async () => {
		const response = await request(app)
			.get('/weather/something_else?city=Caracas')
			.expect(400)
		expect(response.body).toHaveProperty('message')
	})

	it('Should return 404 when the weather id does not exist', async () => {
		const response = await request(app)
			.get('/weather/local?city=Dubai')
			.expect(404);
		expect(response.body).toHaveProperty('message');
	});
});
