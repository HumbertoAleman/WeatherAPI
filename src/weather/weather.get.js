import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/{id}:
 * get:
 * summary: Obtener un registro climático por ID
 * description: Retorna un registro climático específico por su ID. El ID debe seguir el formato `clima_{{number}}`.
 * tags:
 * - Meteorología
 * parameters:
 * - name: id
 * in: path
 * required: true
 * description: El ID del registro climático a obtener.
 * schema:
 * type: string
 * pattern: '^clima_\\d+$'
 * example: "clima_12345"
 * responses:
 * '200':
 * description: OK. Retorna el registro climático encontrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: string
 * example: "clima_12345"
 * city:
 * type: string
 * example: "Caracas"
 * temperature:
 * type: number
 * example: 25.0
 * humidity:
 * type: number
 * example: 80
 * condition:
 * type: string
 * example: "Soleado"
 * '404':
 * description: Not Found. No se encontró el registro climático.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "No se encontró el registro climático"
 * '500':
 * description: Internal Server Error.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Error interno del servidor al buscar el registro climático"
 */
const getWeatherById = async (req, res) => {
    try {
        const { id } = req.params;
        // Se busca por el campo 'id' personalizado, no por '_id'
        const weatherRecord = await Weather.findOne({ id: id });

        if (!weatherRecord) {
            return res.status(404).json({ message: "No se encontró el registro climático" });
        }

        res.status(200).json(weatherRecord);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al buscar el registro climático" });
    }
};

module.exports = {
    getWeatherById
};