import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'WeatherAPI',
			version: '1.0.0',
			description: 'API documentation for WeatherAPI',
		},
		servers: [{ url: 'http://127.0.0.1:3000' }],
	},
	apis: ['./src/earthquake/*.js', './src/weather/*.js' ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;

