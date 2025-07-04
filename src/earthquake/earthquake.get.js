import Earthquake from './earthquake.schema.js'; // Asegúrate de que la ruta a tu modelo sea correcta

/**
 * @swagger
 * paths:
 *   /earthquakes/history/{country}:
 *     get:
 *       summary: Obtener historial de sismos por país
 *       description: >-
 *         Retorna todos los sismos reportados en un país específico, recuperando
 *         el historial completo desde la base de datos local.
 *       tags:
 *         - Sismología
 *       parameters:
 *         - name: country
 *           in: path
 *           required: true
 *           description: El nombre del país para el cual se desea obtener el historial de sismos.
 *           schema:
 *             type: string
 *           example: Chile
 *       responses:
 *         '200':
 *           description: OK. La solicitud fue exitosa. Retorna un array de objetos de sismos.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64aa8b39a7b5e4b2e8e4a1c1"
 *                     magnitude:
 *                       type: number
 *                       example: 5.4
 *                     location:
 *                       type: string
 *                       example: "Coquimbo, Chile"
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-11-15T00:00:00.000Z"
 *                     depth:
 *                       type: number
 *                       example: 30
 *         '404':
 *           description: Not Found. No se encontraron registros sísmicos para el país especificado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "No hay registros sísmicos para ese país"
 *         '500':
 *           description: Internal Server Error. Ocurrió un error en el servidor al procesar la solicitud.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: "Error interno del servidor al buscar los sismos"
 */

export const getEarthquakesByCountry = async (req, res) => {
    try {
        const { country } = req.params;

        const earthquakes = await Earthquake.find({ location: new RegExp(country, 'i') });

        if (earthquakes.length === 0) {
            return res.status(404).json({ message: "No hay registros sísmicos para ese país" });
        }

        res.status(200).json(earthquakes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al buscar los sismos" });
    }
};

export default getEarthquakesByCountry;