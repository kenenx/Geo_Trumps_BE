const express = require('express');
const cors = require('cors');
const logger = require("./logger");

const app = express();
app.use(cors());
app.use(express.json())

app.use(logger);

const countries = require('./countries.json')

app.get('/', (req, res) => {
    res.send(`Welcome to the Geo Trumps API! There are ${countries.length} available.`);
})

app.get('/countries', (req, res) => {
    res.send(countries);
})

app.get('/countries/random', (req, res) => {
    const randId = Math.floor(Math.random() * countries.length);
    const country = countries.find(country => country.id == randId)

     res.send(country);
})

app.get('/countries/:country', (req, res) => {
    const name = req.params.country.toLowerCase()

    const country = countries.find(country => country.country.toLowerCase() == name)
    if (country === undefined) {
      res.status(404).send({ error: `Country: ${country} not found :(`})
    }
    res.send(country)
})


module.exports = app;