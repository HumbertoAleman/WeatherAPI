import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

describe('GET /earthquake/:id', () => {
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
		id: "sismo_1",
		magnitude: 5.4,
		depth: 30,
		location: "Chile",
		date: "2023-11-15"
	};

	it('Should return the most recent seismic record from the DB', async () => {
		await request(app)
			.post('/earthquakes')
			.send(sampleItem)
			.expect(201);

		const response = await request(app)
			.get(`/earthquakes/local?country=${sampleItem.location}`)
			.expect(200)

		expect(response.body).toHaveProperty('_id');
		expect(response.body.id).toBe(sampleItem.id);
		expect(response.body.magnitude).toBe(sampleItem.magnitude);
		expect(response.body.depth).toBe(sampleItem.depth);
		expect(response.body.location).toBe(sampleItem.location);
		expect(new Date(response.body.date).toISOString()).toBe(new Date(sampleItem.date).toISOString());
	});

	it('Should return a USGS Earthquake API response', async () => {
		await request(app)
			.get(`/earthquakes/USGS?country=Venezuela`)
			.expect(200)
	})

	it('Should return a EMSC response', async () => {
		await request(app)
			.get(`/earthquakes/EMSC?country=Venezuela`)
			.expect(200)
	})

	it('Should return 400 when selecting an invalid source', async () => {
		const response = await request(app)
			.get('/earthquakes/something_else?country=Venezuela')
			.expect(400)
		expect(response.body).toHaveProperty('message')
	})

	it('Should return 404 when the earthquake location does not exist in the database', async () => {
		const response = await request(app)
			.get('/earthquakes/local?country=Fish_Island')
			.expect(404);
		expect(response.body).toHaveProperty('message');
	});
});
