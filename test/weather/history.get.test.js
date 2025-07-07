import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

describe('GET /weather/history/:city', () => {
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

	const sampleItem1 = {
		id: "clima_1",
		city: "Caracas",
		temperature: 30.7,
		humidity: 82,
		condition: "Soleado"
	};

	const sampleItem2 = {
		id: "clima_2",
		city: "Maracaibo",
		temperature: 35.1,
		humidity: 90,
		condition: "Soleado"
	};

	const sampleItem3 = {
		id: "clima_3",
		city: "Caracas",
		temperature: 28.5,
		humidity: 75,
		condition: "Nublado"
	};

	it('Should return all weather records for a specific city', async () => {
		await request(app).post('/weather').send(sampleItem1).expect(201);
		await request(app).post('/weather').send(sampleItem2).expect(201);
		await request(app).post('/weather').send(sampleItem3).expect(201);

		const response = await request(app)
			.get(`/weather/history/${sampleItem1.city}`)
			.expect(200);

		expect(response.body).toBeInstanceOf(Array);
		expect(response.body.length).toBe(2);
		expect(response.body[0].city).toBe(sampleItem1.city);
		expect(response.body[1].city).toBe(sampleItem3.city);
	});

	it('Should return 404 when no records are found for a city', async () => {
		const response = await request(app)
			.get('/weather/history/Valencia')
			.expect(404);

		expect(response.body).toHaveProperty('message');
	});
});
