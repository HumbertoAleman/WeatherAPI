import Earthquake from './earthquake.schema.js'

/**
 * @swagger
 * /earthquakes:
 *   delete:
 *     summary: Delete an earthquake record
 *     description: Deletes an earthquake record by its ID. The ID must follow the format `sismo_{{number}}`.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the earthquake record to delete.
 *         schema:
 *           type: string
 *           pattern: '^sismo_\\d+$'
 *     tags:
 *       - Sismologia
 *     responses:
 *       '200':
 *         description: Successfully deleted the earthquake record.
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
 *       '204':
 *         description: No content. The earthquake record was not found.
 *       '400':
 *         description: Bad request. The ID format is incorrect or an error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not create record, incorrect id format, HINT: Correct format sismo_{{number}}"
 */
export default async function earthquakeDelete(req, res) {
	const id = req.params.id
	if (!/^sismo_\d+$/.test(id)) {
		return res.status(400)
			.type('json')
			.send({ message: 'Could not create record, incorrect id format, HINT: Correct format sismo_{{number}}' })
	}

	let foundEarthquake
	try {
		foundEarthquake = await Earthquake.findOneAndDelete({ id });
		if ((foundEarthquake ?? undefined) === undefined)
			return res.status(204).send()
	} catch (e) {
		return res.status(400)
			.type('json')
			.send({ message: e })
	}

	return res.status(200)
		.type('json')
		.send(foundEarthquake)
} 
