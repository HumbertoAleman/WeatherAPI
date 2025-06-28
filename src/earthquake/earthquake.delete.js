import Earthquake from './earthquake.schema.js'

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
