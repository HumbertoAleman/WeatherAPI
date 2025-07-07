import Weather from './weather.schema.js'

/**
 * @swagger
 * /weather:
 *   post:
 *     tags:
 *       - Metereologia
 *     summary: Create a new weather record
 *     description: This endpoint allows you to create a new record of an weather, including its temperature, humidity, city, and condition.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "clima-65536"
 *               city:
 *                 type: string
 *                 example: "Caracas"
 *               temperature:
 *                 type: number
 *                 format: float
 *                 example: 8.2
 *               humidity:
 *                 type: number
 *                 format: float
 *                 example: 12.5
 *               condition:
 *                 type: string
 *                 example: "Nublado"
 *     responses:
 *       201:
 *         description: The created record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "686059c7a40a9df9d20d9f2a"
 *                 id:
 *                   type: string
 *                   example: "clima-65536"
 *                 city:
 *                   type: string
 *                   example: "Caracas"
 *                 temperature:
 *                   type: number
 *                   format: float
 *                   example: 8.2
 *                 humidity:
 *                   type: number
 *                   format: float
 *                   example: 12.5
 *                 condition:
 *                   type: string
 *                   example: "Nublado"
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not create record, incorrect id format, HINT: Correct format clima_{{number}}"
 *       500:
 *         description: Internal server error
 */
export default async function weatherPost(req, res) {
	const body = req.body
	if (!/^clima_\d+$/.test(body.id)) {
		return res.status(400)
			.type('json')
			.send({ message: 'Could not create record, incorrect id format, HINT: clima format clima_{{number}}' })
	}

	const newWeather = new Weather({ ...body })

	let savedWeather
	try {
		savedWeather = await newWeather.save()
	} catch (e) {
		return res.status(400)
			.type("json")
			.send({ message: e })
	}

	return res.status(201)
		.type("json")
		.send(JSON.stringify(savedWeather))
}
