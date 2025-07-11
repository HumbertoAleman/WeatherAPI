import Earthquake from './earthquake.schema.js'

/**
 * @swagger
 * /earthquakes:
 *   post:
 *     summary: Create a new earthquake record
 *     description: This endpoint allows you to create a new record of an earthquake, including its magnitude, depth, location, and date.
 *     tags:
 *       - Sismologia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "sismo-65536"
 *               magnitude:
 *                 type: number
 *                 format: float
 *                 example: 8.2
 *               depth:
 *                 type: number
 *                 format: float
 *                 example: 12.5
 *               location:
 *                 type: string
 *                 example: "Venezuela"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-01"
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
 *                   description: MongoID string of the earthquake record.
 *                   example: 507f1f77bcf86cd799439011
 *                 id:
 *                   type: string
 *                   description: Internal ID of the earthquake record.
 *                   example: sismo_32290
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The date of the earthquake record.
 *                   example: 2025-06-07
 *                 depth:
 *                   type: number
 *                   format: float
 *                   description: The depth of the earthquake.
 *                   example: 32.1
 *                 magnitude:
 *                   type: number
 *                   format: float
 *                   description: The magnitude of the earthquake.
 *                   example: 8.2
 *                 location:
 *                   type: string
 *                   description: The location of the earthquake.
 *                   example: Caracas
 *       400:
 *         description: Bad request, invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not create record, incorrect id format, HINT: Correct format sismo_{{number}}"
 *       500:
 *         description: Internal server error
 */
export default async function earthquakePost(req, res) {
	const body = req.body
	if (!/^sismo_\d+$/.test(body.id)) {
		return res.status(400)
			.type('json')
			.send({ message: 'Could not create record, incorrect id format, HINT: Correct format sismo_{{number}}' })
	}

	const newEarthquake = new Earthquake({ ...body })

	let savedEarthquake
	try {
		savedEarthquake = await newEarthquake.save()
	} catch (e) {
		return res.status(400)
			.type("json")
			.send({ message: e })
	}

	return res.status(201)
		.type("json")
		.send(JSON.stringify(savedEarthquake))
}
