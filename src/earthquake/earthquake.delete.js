import Earthquake from './earthquake.schema.js'

/**
 * @swagger
 * /earthquake:
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
 *                 id:
 *                   type: string
 *                   example: "sismo-1"
 *                 magnitude:
 *                   type: number
 *                   format: float
 *                   example: 7.2
 *                 depth:
 *                   type: number
 *                   format: float
 *                   example: 10.2
 *                 location:
 *                   type: string
 *                   example: "Venezuela"
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-01"
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
