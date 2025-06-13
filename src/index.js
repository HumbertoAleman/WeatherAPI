import express from 'express'

import earthquakeDelete from './earthquake/earthquake.delete.js'
import earthquakeGet from './earthquake/earthquake.get.js'
import earthquakeHistory from './earthquake/history.get.js'
import earthquakePost from './earthquake/earthquake.post.js'
import weatherDelete from './weather/weather.delete.js'
import weatherGet from './weather/weather.get.js'
import weatherHistory from './weather/history.get.js'
import weatherPost from './weather/weather.post.js'

const app = express()
const port = 3000

app.get('/weather/:source', weatherGet)
app.post('/weather', weatherPost)
app.get('/weather/history/:city', weatherHistory)
app.delete('/weather/:id', weatherDelete)

app.get('/earthquakes/:source', earthquakeGet)
app.post('/earthquakes', earthquakePost)
app.get('/earthquakes/history/:country', earthquakeHistory)
app.delete('/earthquakes/:id', earthquakeDelete)

app.listen(port, _ => {
	console.log(`WeatherAPI listening on port ${port}`)
})
