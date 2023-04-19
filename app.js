const express = require('express');
const cors = require('cors');
const logger = require("./logger");

const app = express();
app.use(cors());
app.use(express.json())

app.use(logger);

const countries = require('./countries.json')
const players = require('./players.json')

app.get('/', (req, res) => {
    res.send(`Welcome to the Geo Trumps API! There are ${countries.length} available.`);
})

app.get('/countries', (req, res) => {
    res.send(countries);
})

app.get('/countries/random', (req, res) => {
    const randId = Math.floor(Math.random() * countries.length);
    const country = countries[randId]

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

app.get('/players', (req, res) => {
    res.send(players);
})

app.put("/players/:user", (req, res) => {
    let newPlayer = players.find(
        playername => playername.user.toLowerCase() === req.params.user.toLowerCase()
    );
    if (newPlayer !== undefined) {
        res.send(newPlayer)
    } else {
        newPlayer = {
            user: req.params.user,
            password: "password",
            score: 0,
            id: ++players.length,
        };
        players.push(newPlayer);
        players.splice((players.length - 2),1) 


        res.status(200).send(newPlayer);
    }
});

app.get('/players/:user', (req, res) => {
    const user = req.params.user.toLowerCase()

    const player = players.find(player => player.user.toLowerCase() == user)
    if (player === undefined) {
      res.status(404).send({ error: `Player: ${user} not found :(`})
    }
    res.send(player)
})


module.exports = app;