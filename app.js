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

app.put("/players/:user/:password", (req, res) => {
    let newPlayer = players.find(
        playername => playername.user.toLowerCase() === req.params.user.toLowerCase()
    );
    console.log(req.params.password)
    if (newPlayer !== undefined) {
        if  (newPlayer.password === req.params.password){
        res.send(newPlayer)
        } else {
        res.status(404).send({ error: `Password incorrect :(`})}
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

app.patch("/players/:user", (req,res) => {
    let playerScore = players.find(
        playername => playername.user.toLowerCase() === req.params.user.toLowerCase()
    );
    if (playerScore === undefined) {
        return res.status(404).send({ error: `Player: ${playerScore.user} not found :(`})
    } else {
        playerScore = {
            user: playerScore.user,
            password: playerScore.password,
            score: (playerScore.score + 1),
            id: playerScore.id
        };
        const idx = playerScore.id
        players[idx - 1]= playerScore
        res.status(200).send(playerScore)
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