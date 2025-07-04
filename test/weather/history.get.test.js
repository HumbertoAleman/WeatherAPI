import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

// Muestra de datos para las pruebas
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

// --- Configuración de la Base de Datos para Pruebas ---
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
// --- Fin de la Configuración ---


describe('GET /weather/history/:city', () => {
    it('Should return all weather records for a specific city', async () => {
        // 1. Insertar datos de prueba
        await request(app).post('/weather').send(sampleItem1);
        await request(app).post('/weather').send(sampleItem2);
        await request(app).post('/weather').send(sampleItem3);

        // 2. Realizar la petición GET para "Caracas"
        const response = await request(app)
            .get(`/weather/history/${sampleItem1.city}`)
            .expect(200);

        // 3. Verificar la respuesta
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2); // Deben haber 2 registros de Caracas
        expect(response.body[0].city).toBe(sampleItem1.city);
        expect(response.body[1].city).toBe(sampleItem3.city);
    });

    it('Should return 404 when no records are found for a city', async () => {
        const response = await request(app)
            .get('/weather/history/Valencia')
            .expect(404);

        expect(response.body).toHaveProperty('message', 'No hay registros climáticos para esa ciudad');
    });
});