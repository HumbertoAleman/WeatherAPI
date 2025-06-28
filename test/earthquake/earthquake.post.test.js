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

