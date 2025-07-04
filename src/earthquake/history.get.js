import Earthquake from './earthquake.schema.js';

/**
 * @swagger
 * /earthquakes/{id}:
 * get:
 * summary: Obtener un sismo por su ID personalizado
 * description: Retorna un registro de sismo específico desde la base de datos local utilizando su ID único y personalizado (ej. sismo_12345).
 * tags:
 * - Sismología
 * parameters:
 * - name: id
 * in: path
 * required: true
 * description: El ID personalizado del registro del sismo que se desea obtener.
 * schema:
 * type: string
 * example: "sismo_67890"
 * responses:
 * '200':
 * description: OK. Retorna el objeto del sismo encontrado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id:
 * type: string
 * example: "sismo_67890"
 * magnitude:
 * type: number
 * example: 5.4
 * location:
 * type: string
 * example: "Coquimbo, Chile"
 * date:
 * type: string
 * format: date-time
 * example: "2023-11-15T00:00:00.000Z"
 * depth:
 * type: number
 * example: 30
 * '404':
 * description: Not Found. No se encontró ningún sismo con el ID proporcionado.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "No se encontró el sismo"
 * '500':
 * description: Internal Server Error. Error interno del servidor.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message:
 * type: string
 * example: "Error interno del servidor al buscar el sismo"
 */
const getEarthquakeById = async (req, res) => {
    try {
        const { id } = req.params;
        // Se busca por el campo 'id' personalizado, no por '_id'
        const earthquake = await Earthquake.findOne({ id: id });

        if (!earthquake) {
            return res.status(404).json({ message: "No se encontró el sismo" });
        }

        res.status(200).json(earthquake);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al buscar el sismo" });
    }
};

module.exports = {
    getEarthquakeById
};