import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/history/{city}:
 * get:
 * summary: Obtener historial climático por ciudad
 * description: Retorna todos los registros climáticos históricos de una ciudad específica almacenados en la base de datos local.
 * tags:
 * - Meteorología
 * parameters:
 * - name: city
 * in: path
 * required: true
 * description: La ciudad para la cual se desea obtener el historial climático.
 * schema:
 * type: string
 * example: "Lima"
 * responses:
 * '200':
 * description: OK. Retorna un array con los registros climáticos de la ciudad.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * type: object
 * properties:
 * id:
 * type: string
 * example: "clima_12345"
 * city:
 * type: string
 * example: "Lima"
 * temperature:
 * type: number
 * example: 22.5
 * humidity:
 * type: number
 * example: 78
 * condition:
 * type: string
 * example: "Nublado"
 * '404':
 * description: Not Found. No se encontraron registros para la ciudad especificada.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "No hay registros climáticos para esa ciudad"
 * '500':
 * description: Internal Server Error. Error interno del servidor.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Error interno del servidor al buscar el historial climático"
 */
const getWeatherHistoryByCity = async (req, res) => {
    try {
        const { city } = req.params;
        const weatherHistory = await Weather.find({ city: new RegExp(city, 'i') });

        if (weatherHistory.length === 0) {
            return res.status(404).json({ message: "No hay registros climáticos para esa ciudad" });
        }

        res.status(200).json(weatherHistory);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al buscar el historial climático" });
    }
};

module.exports = {
    getWeatherHistoryByCity
};
