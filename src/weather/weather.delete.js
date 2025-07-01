import Weather from './weather.schema.js'

/**
 * @swagger
 * /weathers:
 *   delete:
 *     summary: Delete an weather record
 *     description: Deletes an weather record by its ID. The ID must follow the format `clima_{{number}}`.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the weather record to delete.
 *         schema:
 *           type: string
 *           pattern: '^sismo_\\d+$'
 *     responses:
 *       '200':
 *         description: Successfully deleted the weather record.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
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
 *       '204':
 *         description: No content. The weather record was not found.
 *       '400':
 *         description: Bad request. The ID format is incorrect or an error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Could not create record, incorrect id format, HINT: Correct format clima_{{number}}"
 */
export default async function weatherDelete(req, res) {
	const id = req.params.id
	if (!/^clima_\d+$/.test(id)) {
		return res.status(400)
			.type('json')
			.send({ message: 'Could not create record, incorrect id format, HINT: Correct format clima_{{number}}' })
	}

	let foundWeather
	try {
		foundWeather = await Weather.findOneAndDelete({ id });
		if ((foundWeather ?? undefined) === undefined)
			return res.status(204).send()
	} catch (e) {
		return res.status(400)
			.type('json')
			.send({ message: e })
	}

	return res.status(200)
		.type('json')
		.send(foundWeather)
} 
