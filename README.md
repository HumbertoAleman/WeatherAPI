# WeatherAPI

WeatherAPI is a project for the course "Topicos Esceciales para la Programacion" it intends to serve informacion about weather and earthquake through varios endpoints, and store information in the API's database for future collection;

## Members

- Aleman, Humberto 30.142.718
- Carnevali, Cristina 30.395.024
- Noriega, Jesus 29.651.090

## Dependencies

- **Docker**: Containerization Software
- **Docker Compose**: Managing multiple containers
- **Node.js 24 alpine**: Javascript Runtime
- **Mongo DB**: Base de Datos
- **Mongoose**: ODM Library
- **Jest**: Testing
- **Supertest**: HTTP Testing
- **Swagger** Documentation

## Running the API

> NOTE
> Before running the API you must ensure that the .env file has the following environment variables set

```bash
MONGO_INITDB_ROOT_USERNAME= # MongoDB user to initialize the database with
MONGO_INITDB_ROOT_PASSWORD= # MongoDB user password
DATABASE_URL=               # MongoDB connection url to use outside of container enviroment
DOCKER_DATABASE_URL=        # MongoDB connection url to use in container environment
PORT=                       # Port to which the API will bind to
OPEN_WEATHER_MAP_API_KEY=   # OpenWeatherMap API key to utilize
WEATHER_API_API_KEY=        # WeatherAPI API key to utilize
```

To run the API one may run the command

```bash
docker compose up
```

And the API will bind to [localhost:3000](127.0.0.1:3000)

## Available Routes

### Weather

- **GET** /weather/:source?city=\[city_name\]
  - Retrieves weather data from sources like OpenWeatherMap, WeatherAPI, or the local database. If there are no local data, it returns "No weather records."
- **POST** /weather
  - Saves a custom weather report in the local database. Requires fields such as city, temperature, humidity, and condition (Sunny/Cloudy/Rainy/Storm).
- **GET** /weather/history/:city
  - Returns all historical weather records of a specific city stored in the local database.
- **DELETE** /weather/:id
  - Deletes a weather record from the local database using its unique identifier.

### Earthquake

- **GET** /earthquakes/:source?country=[country]
  - Retrieves seismic data from sources like the USGS Earthquake API, EMSC, or the local database. If there are no data, it returns "No seismic records."
- **POST** /earthquakes
  - Saves a custom seismic report in the local database. Required fields include magnitude, depth, location, and date.
- **GET** /earthquakes/history/:country
  - Returns all reported earthquakes in a specific country, retrieving the complete history from the local database.
- **DELETE** /earthquakes/:id
  - Deletes a specific seismic record from the local database using its unique identifier.

## Use Example

To fetch earthquake data from the endpoint `/earthquakes/{source}`, you can use the following `curl` command:

```bash
curl -X GET "https://api.example.com/earthquakes/sismo_32290" -H "Accept: application/json"
# Returns:
# {
#   "_id": "507f1f77bcf86cd799439011",
#   "id": "sismo_32290",
#   "date": "2025-06-07",
#   "depth": 32.1,
#   "magnitude": 8.2,
#   "location": "Caracas"
# }
```

## Developing

First clone the repository somewhere in your computer, and enter it

```bash
git clone https://github.com/HumbertoAleman/WeatherAPI.git
cd ./WeatherAPI
```

Then, install all dependencies for Node.js

```bash
npm i --legacy-peer-deps
```

Finally, run the container with the steps detailed in the section titled [Running the API](#Running-the-API)

## Testing

To run the test suite of the API, run the command

> NOTE
> You must ensure that a database instance of MongoDB is running for the tests to properly functions, since these use the database connection to implement the funcitonality

```bash
npm test
```

