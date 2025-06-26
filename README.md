# WeatherAPI

WeatherAPI is a project for the course "Topicos Esceciales para la Programacion" it intends to serve informacion about weather and earthquake through varios endpoints, and store information in the API's database for future collection;

## Members

- Aleman, Humberto 30.142.718
- Carnevali, Cristina 30.395.024
- Jesus Noriega 29651090

## Dependencies

- Docker: Containerization Software
- Docker Compose: Managing multiple containers
- Node.js 24 alpine: Javascript Runtime
- Mongo DB: Base de Datos
- Mongoose: ODM Library
- Jest: Testing
- Supertest: HTTP Testing
- Swagger: Documentation

## Running the API

To run the API one may run the command

```bash
docker compose up
```

And the API will bind to [localhost:3000](127.0.0.1:3000)

## Available Routes

### Weather

- **GET** /weather/:source?city=\[city_name\] - Jesus
  - Retrieves weather data from sources like OpenWeatherMap, WeatherAPI, or the local database. If there are no local data, it returns "No weather records."
- **POST** /weather - Cris
  - Saves a custom weather report in the local database. Requires fields such as city, temperature, humidity, and condition (Sunny/Cloudy/Rainy/Storm).
- **GET** /weather/history/:city - Jesus
  - Returns all historical weather records of a specific city stored in the local database.
- **DELETE** /weather/:id - Cris
  - Deletes a weather record from the local database using its unique identifier.

### Earthquake

- **GET** /earthquakes/:source?country=[country] - Jesus
  - Retrieves seismic data from sources like the USGS Earthquake API, EMSC, or the local database. If there are no data, it returns "No seismic records."
- **POST** /earthquakes - Humberto
  - Saves a custom seismic report in the local database. Required fields include magnitude, depth, location, and date.
- **GET** /earthquakes/history/:country - Jesus
  - Returns all reported earthquakes in a specific country, retrieving the complete history from the local database.
- **DELETE** /earthquakes/:id - Humberto
  - Deletes a specific seismic record from the local database using its unique identifier.

## Developing

First clone the repository somewhere in your computer, and enter it

```bash
git clone https://github.com/HumbertoAleman/WeatherAPI.git
cd ./WeatherAPI
```

Then, install all dependencies for Node.js

```bash
npm i
```

Finally, run the container with the steps detailed in the section titled [Running the API](#Running-the-API)
