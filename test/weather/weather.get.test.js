import dotenv from 'dotenv/config';
import app from '../../src/index.js';
import request from 'supertest';
import mongoose from 'mongoose';

const sampleItem = {
    id: "clima_1",
    city: "Caracas",
    temperature: 30.7,
    humidity: 82,
    condition: "Soleado"
};

// --- Configuración de la Base de Datos para Pruebas ---
beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
    // Limpia la colección antes de cada prueba
    await mongoose.connection.db.collection('weathers').deleteMany({});
});

afterAll(async () => {
    // Limpia y cierra la conexión al final
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});
// --- Fin de la Configuración ---


describe('GET /weather/:id', () => {
    it('Should return a single weather record by its custom id', async () => {
        // 1. Insertar un dato de prueba
        await request(app)
            .post('/weather')
            .send(sampleItem)
            .expect(201);

        // 2. Realizar la petición GET para ese ID
        const response = await request(app)
            .get(`/weather/${sampleItem.id}`)
            .expect(200);

        // 3. Verificar que la respuesta contiene los datos correctos
        expect(response.body).not.toBeInstanceOf(Array);
        expect(response.body.id).toBe(sampleItem.id);
        expect(response.body.city).toBe(sampleItem.city);
        expect(response.body.temperature).toBe(sampleItem.temperature);
        expect(response.body.condition).toBe(sampleItem.condition);
    });

    it('Should return 404 when the weather id does not exist', async () => {
        const response = await request(app)
            .get('/weather/clima_nonexistent')
            .expect(404);

        expect(response.body).toHaveProperty('message', 'No se encontró el registro climático');
    });
});