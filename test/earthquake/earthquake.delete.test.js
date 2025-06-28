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
