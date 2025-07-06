import Weather from './weather.schema.js';
import axios from 'axios';

/**
 * @swagger
 * /weather/history/{source}/{city}:
 *   get:
 *     summary: Obtener historial climático por ciudad
 *     description: >-
 *       Retorna todos los registros climáticos históricos de una ciudad específica
 *       almacenados en la base de datos local o de fuentes externas.
 *     tags:
 *       - Meteorología
 *     parameters:
 *       - name: source
 *         in: path
 *         required: true
 *         description: La fuente de los datos ('local', 'USGS', 'EMSC').
 *         schema:
 *           type: string
 *           enum: [local, USGS, EMSC]
 *           example: local
 *       - name: city
 *         in: path
 *         required: true
 *         description: La ciudad para la cual se desea obtener el historial climático.
 *         schema:
 *           type: string
 *           example: Lima
 *     responses:
 *       '200':
 *         description: OK. Retorna un array con los registros climáticos de la ciudad.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weather'
 *       '204':
 *         description: No Content. No se encontraron registros para la ciudad especificada.
 *       '400':
 *         description: Bad Request. Fuente no válida.
 *       '500':
 *         description: Error interno del servidor.
 */

const getWeatherHistoryByCity = async (req, res) => {
    const { source } = req.params;
    const { city } = req.params;

    try {
        let weatherHistory;

        switch (source.toLowerCase()) {
            case 'local':
                // Buscar en la base de datos local (MongoDB)
                weatherHistory = await Weather.find({ city: new RegExp(city, 'i') });
                break;

            case 'usgs':
                // Obtener datos de la API de USGS
                const usgsResponse = await axios.get(`https://api.weather.com/v3/wx/conditions/historical?city=${city}&apiKey=YOUR_API_KEY`);
                weatherHistory = usgsResponse.data.map(record => ({
                    temperature: record.temperature,
                    description: record.weather,
                    date: record.date,
                }));
                break;

            case 'emsc':
                // Obtener datos de la API de EMSC
                const emscResponse = await axios.get(`https://api.emsc-csem.org/v1/weather?city=${city}`);
                // Aquí deberías procesar la respuesta de EMSC según su formato
                weatherHistory = emscResponse.data; // Ajusta esto según la estructura de la respuesta
                break;

            default:
                return res.status(400).json({ message: "Fuente no válida. Las fuentes permitidas son: 'local', 'USGS', 'EMSC'." });
        }

        if (!weatherHistory || weatherHistory.length === 0) {
            return res.status(204).send();
        }

        return res.status(200).json(weatherHistory);
    } catch (error) {
        console.error('Error fetching weather history:', error);
        
        // Manejo especial para errores de base de datos
        if (error.name === 'MongoError') {
            return res.status(503).json({ 
                message: "Error temporal con la base de datos",
                suggestion: "Intente nuevamente más tarde"
            });
        }
        
        return res.status(500).json({ 
            message: "Error interno del servidor",
            error_code: "WEATHER_HISTORY_FETCH_ERROR"
        });
    }
};

export default getWeatherHistoryByCity;
