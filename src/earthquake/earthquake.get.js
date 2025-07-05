import Earthquake from './earthquake.schema.js';

/**
 * @swagger
 * /earthquakes/{source}:
 * get:
 * summary: Obtiene datos sísmicos de una fuente
 * description: >-
 * Obtiene datos sísmicos de una fuente específica. Si la fuente es 'local',
 * busca en la base de datos por el país especificado en el query param 'country'.
 * tags:
 * - Sismología
 * parameters:
 * - name: source
 * in: path
 * required: true
 * description: La fuente de los datos ('local' para la base de datos).
 * schema:
 * type: string
 * example: local
 * - name: country
 * in: query
 * required: true
 * description: El país para filtrar los resultados cuando la fuente es 'local'.
 * schema:
 * type: string
 * example: Chile
 * responses:
 * '200':
 * description: OK. Retorna un array con los registros sísmicos.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Earthquake'
 * '204':
 * description: No Content. No se encontraron registros para los parámetros especificados.
 */
import Earthquake from './earthquake.schema.js';

const getEarthquakesBySource = async (req, res) => {
    const { source } = req.params;
    const { country } = req.query;

    if (source.toLowerCase() !== 'local') {
        return res.status(400).json({ message: "Fuente no válida. Por ahora, solo se acepta 'local'." });
    }

    try {
        const earthquakes = await Earthquake.find({ location: new RegExp(country, 'i') });

        if (earthquakes.length === 0) {
            return res.status(204).send();
        }

        res.status(200).json(earthquakes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export default getEarthquakesBySource;