import Earthquake from './earthquake.schema.js';

/**
 * @swagger
 * /earthquakes/history/{country}:
 *   get:
 *     summary: Obtener historial de sismos por país
 *     description: >-
 *       Retorna todos los sismos reportados en un país específico, recuperando
 *       el historial completo desde la base de datos local.
 *     tags:
 *       - Sismología
 *     parameters:
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
 */

const getEarthquakeHistoryByCountry = async (req, res) => {
    try {
        const { country } = req.params;
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

export default getEarthquakeHistoryByCountry;
