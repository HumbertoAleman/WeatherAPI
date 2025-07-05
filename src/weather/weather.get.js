import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/{source}:
 * get:
 * summary: Obtiene datos climáticos de una fuente
 * description: >-
 * Obtiene datos climáticos de una fuente específica. Si la fuente es 'local',
 * busca en la base de datos por la ciudad especificada en el query param 'city'.
 * tags:
 * - Meteorología
 * parameters:
 * - name: source
 * in: path
 * required: true
 * description: La fuente de los datos ('local' para la base de datos).
 * schema:
 * type: string
 * example: local
 * - name: city
 * in: query
 * required: true
 * description: La ciudad para filtrar los resultados cuando la fuente es 'local'.
 * schema:
 * type: string
 * example: Caracas
 * responses:
 * '200':
 * description: OK. Retorna un array con los registros climáticos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Weather'
 * '204':
 * description: No Content. No se encontraron registros para los parámetros especificados.
 */
import Weather from './weather.schema.js';

const getWeatherBySource = async (req, res) => {
    const { source } = req.params;
    const { city } = req.query;

    if (source.toLowerCase() !== 'local') {
        return res.status(400).json({ message: "Fuente no válida. Por ahora, solo se acepta 'local'." });
    }

    try {
        const weatherRecords = await Weather.find({ city: new RegExp(city, 'i') });

        if (weatherRecords.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(weatherRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export default getWeatherBySource;