import Weather from './weather.schema.js';

/**
 * @swagger
 * /weather/{source}:
 *   get:
 *     summary: Obtiene datos climáticos de una fuente
 *     description: >-
 *       Obtiene datos climáticos de una fuente específica. Si la fuente es 'local',
 *       busca en la base de datos por la ciudad especificada en el query param 'city'.
 *     tags:
 *       - Meteorología
 *     parameters:
 *       - name: source
 *         in: path
 *         required: true
 *         description: La fuente de los datos ('local' para la base de datos)
 *         schema:
 *           type: string
 *           enum: [local]
 *           example: local
 *       - name: city
 *         in: query
 *         required: true
 *         description: Ciudad para filtrar (mínimo 2 caracteres, solo letras y espacios)
 *         schema:
 *           type: string
 *           minLength: 2
 *           pattern: '^[a-zA-Z\s]+$'
 *           example: Caracas
 *     responses:
 *       '200':
 *         description: OK. Retorna array con registros climáticos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weather'
 *       '400':
 *         description: |
 *           Bad Request. Posibles errores:
 *           - Fuente no válida (solo 'local' permitido)
 *           - Parámetro city inválido (formato incorrecto)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El parámetro 'city' debe contener solo letras y espacios (mínimo 2 caracteres)"
 *       '404':
 *         description: Ciudad no encontrada
 *       '500':
 *         description: Error interno del servidor
 */
const getWeatherBySource = async (req, res) => {
    const { source } = req.params;
    const { city } = req.query;

    // Validación de source
    if (source.toLowerCase() !== 'local') {
        return res.status(400).json({ 
            message: "Fuente no válida. Solo se acepta 'local'",
            valid_sources: ["local"]
        });
    }

    // Validación robusta de city
    const cityRegex = /^[a-zA-Z\s]{2,}$/;
    if (!city || !cityRegex.test(city)) {
        return res.status(400).json({
            message: "Parámetro city inválido. Debe contener solo letras y espacios (mínimo 2 caracteres)",
            example: "Caracas",
            pattern: "/^[a-zA-Z\\s]{2,}$/"
        });
    }

    try {
        const sanitizedCity = city.trim().replace(/\s+/g, ' ');
        const weatherRecords = await Weather.find({ 
            city: new RegExp(`^${sanitizedCity}$`, 'i') 
        });

        if (weatherRecords.length === 0) {
            return res.status(404).json({ 
                message: `No se encontraron registros para la ciudad '${sanitizedCity}'`
            });
        }

        return res.status(200).json(weatherRecords);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        
        // Manejo especial para errores de base de datos
        if (error.name === 'MongoError') {
            return res.status(503).json({ 
                message: "Error temporal con la base de datos",
                suggestion: "Intente nuevamente más tarde"
            });
        }
        
        return res.status(500).json({ 
            message: "Error interno del servidor",
            error_code: "WEATHER_FETCH_ERROR"
        });
    }
};

export default getWeatherBySource;
