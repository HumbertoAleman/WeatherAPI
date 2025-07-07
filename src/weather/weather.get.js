import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/{source}:
 *   get:
 *     tags:
 *       - Metereologia
 *     summary: Retrieve weather information by source
 *     description: Fetches weather data for a specified city from a designated source.
 *     parameters:
 *       - name: source
 *         in: path
 *         required: true
 *         description: The source from which to fetch weather data. Valid sources are 'local', 'OpenWeatherMap', and 'WeatherAPI'.
 *         schema:
 *           type: string
 *           enum: [local, OpenWeatherMap, WeatherAPI]
 *       - name: city
 *         in: query
 *         required: true
 *         description: The name of the city for which to retrieve weather data.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response containing weather data.
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
 *       '400':
 *         description: Bad request due to invalid source or missing city parameter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 valid_sources:
 *                   type: array
 *                   items:
 *                     type: string
 *       '404':
 *         description: No weather records found for the specified city.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error due to an unexpected issue.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const getWeatherBySource = async (req, res) => {
	const { source } = req.params;
	const { city } = req.query;


	async function getFromDatabase(city) {
		try {
			return await Weather.findOne({ city });
		} catch (e) {
			throw new Exception(e);
		}
	}

	async function getFromOpenWeatherMap(city) {
		const { OPEN_WEATHER_MAP_API_KEY } = process.env
		try {
			return await (await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPEN_WEATHER_MAP_API_KEY}`)).json()
		} catch (e) {
			throw new Exception(e);
		}
	}

	async function getFromWeatherAPI(city) {
		const { WEATHER_API_API_KEY } = process.env
		try {
			return await (await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_API_KEY}&q=${city}`)).json()
		} catch (e) {
			throw new Exception(e);
		}
	}

	const validSources = {
		'local': getFromDatabase,
		'OpenWeatherMap': getFromOpenWeatherMap,
		'WeatherAPI': getFromWeatherAPI
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
		item = await validSources[source](city)
	} catch (e) {
		return res.status(500).json({ message: `Ha ocurrido un error ${e}` });
	}

	if ((item ?? undefined) === undefined) {
		return res.status(404).json({
			message: 'No hay registros climáticos'
		});
	}

	return res.status(200)
		.type("json")
		.send(JSON.stringify(item))
};


export default getWeatherBySource;
