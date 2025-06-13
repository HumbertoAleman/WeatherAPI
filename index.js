const express = require('express')
const app = express()
const port = 3000

app.get('/weather/:source', (req, res) => {
	const source = req.params.source
	const city = req.query.city

	res.send(`From: ${source} to ${city}`)
})

app.post('/weather', (req, res) => {
	res.send(`Inserted into ...`)
})

app.get('/weather/history/:city', (req, res) => {
	const city = req.params.city

	res.send(`From: ${city}`)
})

app.delete('/weather/:id', (req, res) => {
	const id = req.params.id

	res.send(`From: ${id}`)
})

app.get('/earthquakes/:source', (req, res) => {
	const source = req.params.source
	const country = req.query.coutry

	res.send(`From: ${source} to ${country}`)
})

app.post('/earthquakes', (req, res) => {
	res.send(`Inserted into ...`)
})

app.get('/earthquakes/history/:country', (req, res) => {
	const country = req.params.country

	res.send(`From: ${country}`)
})

app.delete('/earthquakes/:id', (req, res) => {
	const id = req.params.id

	res.send(`From: ${id}`)
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
