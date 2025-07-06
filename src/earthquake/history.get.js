import Earthquake from './earthquake.schema.js';
import axios from 'axios';

/**
 * @swagger
 * /earthquakes/history/{source}/{country}:
 *   get:
 *     summary: Obtener historial de sismos por país
 *     description: >-
 *       Retorna todos los sismos reportados en un país específico, recuperando
 *       el historial completo desde la base de datos local o de fuentes externas.
 *     tags:
 *       - Sismología
 *     parameters:
 *       - name: source
 *         in: path
 *         required: true
 *         description: La fuente de los datos ('local', 'USGS', 'EMSC').
 *         schema:
 *           type: string
 *           enum: [local, USGS, EMSC]
 *           example: local
 *       - name: country
 *         in: path
 *         required: true
 *         description: El nombre del país para el cual se desea obtener el historial de sismos.
 *         schema:
 *           type: string
 *           example: Chile
 *     responses:
 *       '200':
 *         description: OK. Retorna un array de objetos de sismos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Earthquake'
 *       '204':
 *         description: No Content. No se encontraron registros sísmicos para el país especificado.
 *       '400':
 *         description: Bad Request. Fuente no válida.
 *       '500':
 *         description: Error interno del servidor.
 */

const getEarthquakeHistoryByCountry = async (req, res) => {
    const { source } = req.params;
    const { country } = req.params;

    try {
        let earthquakes;

        switch (source.toLowerCase()) {
            case 'local':
                // Buscar en la base de datos local (MongoDB)
                earthquakes = await Earthquake.find({ location: new RegExp(country, 'i') });
                break;

            case 'usgs':
                // Obtener datos de la API de USGS
                const usgsResponse = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventid=${country}`);
                earthquakes = usgsResponse.data.features.map(feature => ({
                    magnitude: feature.properties.mag,
                    location: feature.properties.place,
                    date: new Date(feature.properties.time),
                    depth: feature.geometry.coordinates[2],
                }));
                break;

            case 'emsc':
                // Obtener datos de la API de EMSC
                const emscResponse = await axios.get(`https://www.emsc-csem.org/Earthquake/earthquake.php?id=${country}`);
                // Aquí deberías procesar la respuesta de EMSC según su formato
                earthquakes = emscResponse.data; // Ajusta esto según la estructura de la respuesta
                break;

            default:
                return res.status(400).json({ message: "Fuente no válida. Las fuentes permitidas son: 'local', 'USGS', 'EMSC'." });
        }

        if (!earthquakes || earthquakes.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(earthquakes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export default getEarthquakeHistoryByCountry;
