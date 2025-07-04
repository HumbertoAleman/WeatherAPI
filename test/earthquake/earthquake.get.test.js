import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

// Muestra de datos para las pruebas
const sampleItem1 = {
    id: "sismo_1",
    magnitude: 5.4,
    depth: 30,
    location: "Chile",
    date: "2023-11-15"
};

const sampleItem2 = {
    id: "sismo_2",
    magnitude: 6.1,
    depth: 45,
    location: "Chile",
    date: "2024-01-20"
};

const sampleItem3 = {
    id: "sismo_3",
    magnitude: 4.8,
    depth: 20,
    location: "Peru",
    date: "2023-12-10"
};


beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {

    await mongoose.connection.db.collection('earthquakes').deleteMany({});
});

afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});



describe('GET /earthquakes/history/:country', () => {
    it('Should return all earthquake records for a specific country', async () => {

        await request(app).post('/earthquakes').send(sampleItem1);
        await request(app).post('/earthquakes').send(sampleItem2);
        await request(app).post('/earthquakes').send(sampleItem3);


        const response = await request(app)
            .get(`/earthquakes/history/${sampleItem1.location}`)
            .expect(200);


        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2); // Deben haber 2 sismos de Chile
        expect(response.body[0].location).toBe(sampleItem1.location);
        expect(response.body[1].location).toBe(sampleItem2.location);
    });

    it('Should return 404 when no records are found for a country', async () => {
        const response = await request(app)
            .get('/earthquakes/history/Uruguay')
            .expect(404);

        expect(response.body).toHaveProperty('message', 'No hay registros sísmicos para ese país');
    });
});