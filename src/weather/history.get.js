import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/history/{city}:
 * get:
 * summary: Obtener historial climático por ciudad
 * description: >-
 * Retorna todos los registros climáticos históricos de una ciudad específica
 * almacenados en la base de datos local.
 * tags:
 * - Meteorología
 * parameters:
 * - name: city
 * in: path
 * required: true
 * description: La ciudad para la cual se desea obtener el historial climático.
 * schema:
 * type: string
 * example: Lima
 * responses:
 * '200':
 * description: OK. Retorna un array con los registros climáticos de la ciudad.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Weather'
 * '204':
 * description: No Content. No se encontraron registros para la ciudad especificada.
 */
export const getWeatherHistoryByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const weatherHistory = await Weather.find({ city: new RegExp(city, 'i') });

        if (weatherHistory.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(weatherHistory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};