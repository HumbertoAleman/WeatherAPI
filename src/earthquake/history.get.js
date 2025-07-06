import Earthquake from './earthquake.schema.js';

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
	const { country } = req.params;

	if (country === undefined)
		return res.status(400)
			.type('json')
			.send(JSON.stringify({ message: "Error: country cannot be undefined" }))

	let result
	try {
		result = await Earthquake.find({ location: country })
	} catch (e) {
		return res.status(500).json({ message: `Ha ocurrido un error ${e}` });
	}

	if (result.length === 0)
		return res.status(404)
			.type('json')
			.send(JSON.stringify({ message: "No hay registros sismicos" }))

	return res.status(200)
		.type('json')
		.send(JSON.stringify(result))
};

export default getEarthquakeHistoryByCountry;
