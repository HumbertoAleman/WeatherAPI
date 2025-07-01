import Weather from './weather.schema.js'

export default async function weatherPost(req, res) {
	const body = req.body
	if (!/^clima_\d+$/.test(body.id)) {
		return res.status(400)
			.type('json')
			.send({ message: 'Could not create record, incorrect id format, HINT: clima format sismo_{{number}}' })
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