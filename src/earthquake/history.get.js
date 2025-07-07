import Earthquake from './earthquake.schema.js';

/**
 * @swagger
 * /earthquake/history/{country}:
 *   get:
 *     tags:
 *       - Sismologia
 *     summary: Retrieve historical earthquake data for a specific country
 *     description: Fetches the earthquake history for the specified country. Returns an error if the country is not provided or if no records are found.
 *     parameters:
 *       - name: country
 *         in: path
 *         required: true
 *         description: The name of the country for which to retrieve earthquake history.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with earthquake history data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: MongoID string of the earthquake record.
 *                     example: 507f1f77bcf86cd799439011
 *                   id:
 *                     type: string
 *                     description: Internal ID of the earthquake record.
 *                     example: sismo_32290
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date of the earthquake record.
 *                     example: 2025-06-07
 *                   depth:
 *                     type: number
 *                     format: float
 *                     description: The depth of the earthquake.
 *                     example: 32.1
 *                   magnitude:
 *                     type: number
 *                     format: float
 *                     description: The magnitude of the earthquake.
 *                     example: 8.2
 *                   location:
 *                     type: string
 *                     description: The location of the earthquake.
 *                     example: Caracas
 *       400:
 *         description: Bad request if the country parameter is undefined.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No earthquake records found for the specified country.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error if an error occurs while fetching data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
