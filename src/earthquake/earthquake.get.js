import Earthquake from './earthquake.schema.js';

/**
 * @swagger
 * /earthquakes/{source}:
 *   get:
 *     summary: Retrieve earthquake data by source
 *     description: Fetches earthquake information based on the specified source and country. Supports multiple sources including local database, USGS, and EMSC.
 *     tags:
 *       - Sismologia
 *     parameters:
 *       - name: source
 *         in: path
 *         required: true
 *         description: The source of the earthquake data. Valid options are 'local', 'USGS', and 'EMSC'.
 *         schema:
 *           type: string
 *           enum: [local, USGS, EMSC]
 *       - name: country
 *         in: query
 *         required: true
 *         description: The name of the country for which to retrieve earthquake data.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved earthquake data.
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
 *         description: Invalid source provided.
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
 *         description: An error occurred while processing the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const getEarthquakesBySource = async (req, res) => {
	const { source } = req.params;
	const { country } = req.query;

	async function getFromDatabase(country) {
		try {
			return await Earthquake.findOne({ location: country });
		} catch (e) {
			throw new Exception(e);
		}
	}

	async function getFromUSGS(country) {
		const [info] = await (await fetch(`https://restcountries.com/v3.1/name/${country}`)).json()
		if (info === undefined)
			throw new Exception("Error when requesting country from restcountries");
		const [latitude, longitude] = info.latlng
		if (latitude === undefined || longitude === undefined)
			throw new Exception("Error when requesting latitude, longitude and max radius from restcountries");
		const maxRadius = 180
		try {
			return await (await fetch(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&latitude=${latitude}&longitude=${longitude}&maxradius=${maxRadius}`)).json()
		} catch (e) {
			throw new Exception(e)
		}
	}

	async function getFromEMSC(country) {
		const [info] = await (await fetch(`https://restcountries.com/v3.1/name/${country}`)).json()
		if (info === undefined)
			throw new Exception("Error when requesting country from restcountries");
		const [latitude, longitude] = info.latlng
		if (latitude === undefined || longitude === undefined)
			throw new Exception("Error when requesting latitude, longitude and max radius from restcountries");
		const maxRadius = 180
		try {
			return await (await fetch(`http://www.seismicportal.eu/testimonies-ws/api/search?lat=${latitude}&lon=${longitude}&minradius=0.1&maxradius=${maxRadius}&format=json&limit=10`)).json()
		} catch (e) {
			throw new Exception(e);
		}
	}

	const validSources = {
		'local': getFromDatabase,
		'USGS': getFromUSGS,
		'EMSC': getFromEMSC
	};

	if (!(source in validSources)) {
		return res.status(400)
			.type('json')
			.send(JSON.stringify({
				message: `Fuente no válida. Las fuentes permitidas son: ${Object.keys(validSources)}`,
			}));
	}

	let item
	try {
		item = await validSources[source](country)
	} catch (e) {
		return res.status(500).json({ message: `Ha ocurrido un error ${e}` });
	}

	if ((item ?? undefined) === undefined) {
		return res.status(404).json({
			message: 'No hay registros sismicos'
		});
	}

	return res.status(200)
		.type("json")
		.send(JSON.stringify(item))
};

export default getEarthquakesBySource;
