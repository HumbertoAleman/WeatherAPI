import Earthquake from './earthquake.schema.js'

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
