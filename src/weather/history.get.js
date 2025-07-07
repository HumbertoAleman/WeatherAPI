import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/history/{city}:
 *   get:
 *     tags:
 *       - Metereologia
 *     summary: Retrieve historical weather data for a specific city
 *     description: Fetches the weather history for the specified city. Returns an error if the city is not provided or if no records are found.
 *     parameters:
 *       - name: city
 *         in: path
 *         required: true
 *         description: The name of the city for which to retrieve weather history.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with weather history data.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "686059c7a40a9df9d20d9f2a"
 *                   id:
 *                     type: string
 *                     example: "clima-65536"
 *                   city:
 *                     type: string
 *                     example: "Caracas"
 *                   temperature:
 *                     type: number
 *                     format: float
 *                     example: 8.2
 *                   humidity:
 *                     type: number
 *                     format: float
 *                     example: 12.5
 *                   condition:
 *                     type: string
 *                     example: "Nublado"
 *       400:
 *         description: Bad request if the city parameter is undefined.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: No weather records found for the specified city.
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
const getWeatherHistoryByCity = async (req, res) => {
	const { city } = req.params;

	if (city === undefined)
		return res.status(400)
			.type('json')
			.send(JSON.stringify({ message: "Error: city cannot be undefined" }))

	let result
	try {
		result = await Weather.find({ city })
	} catch (e) {
		return res.status(500).json({ message: `Ha ocurrido un error ${e}` });
	}

	if (result.length === 0)
		return res.status(404)
			.type('json')
			.send(JSON.stringify({ message: "No hay registros climáticos" }))

	return res.status(200)
		.type('json')
		.send(JSON.stringify(result))
};

export default getWeatherHistoryByCity;
