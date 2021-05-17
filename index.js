const express = require('express');
const { Server } = require('socket.io');
const http = require('https');
const fs = require('fs')

const app = express();
let players = [];
let minPlayers = 2;

const key = fs.readFileSync(__dirname + '/selfsigned.key');
const cert = fs.readFileSync(__dirname + '/selfsigned.crt');
const options = {
    key,
    cert
};

const server = http.createServer(options, app);
const io = new Server(server);
const names = Object.create(null);

app.use(express.static('public'));

let generateNextNumber = generateGenerateNextNumber();

io.on('connection', socket => {
    console.log("client connected")

    players.push(socket.id);

    socket.on('player-name', playerName => {
        names[socket.id] = playerName;
    });

    setTimeout(() => {
        io.emit('min-players', minPlayers);
    }, 50);

    if (players.length >= minPlayers) {
        io.emit('ready');
    }

    readyForNextNumber[socket.id] = false;

    socket.on('disconnect', () => {
        console.log("client disconnected")
        players = players.filter(x => x !== socket.id);

        if (players.length < minPlayers) {
            io.emit('player-disconnect');
            generateNextNumber = generateGenerateNextNumber();
        }
    });

    socket.on('message', text => 
        io.emit('message', {name: names[socket.id], text})
    );

    socket.on('min-player-change', x => {
        console.log(`minPlayers = ${x}`);
        minPlayers = x;

        io.emit('min-players', minPlayers);

        if (players.length >= minPlayers) {
            io.emit('ready');
        }

        if (players.length < minPlayers) {
            io.emit('player-disconnect');
        }
    });

});

setInterval(() => {
    if (players.length >= minPlayers)
        io.emit('next-number', generateNextNumber())
}, 5000);

let readyForNextNumber = Object.create(null);
server.listen(443, '0.0.0.0', () => {
    console.log('listening');
});

function generateGenerateNextNumber() {
    const generatedNumbers = [];

    return function generateNextNumber() {
        let generated;
        do {
            generated = Math.ceil(Math.random() * 99);
        } while (generatedNumbers.includes(generated));

        generatedNumbers.push(generated);

        return generated;
    };
}