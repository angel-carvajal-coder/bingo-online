const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
let players = [];
let minPlayers = 2;

app.use(express.static('public'));


io.on('connection', socket => {
    console.log("client connected")

    players.push(socket.id);

    setTimeout(() =>
        io.emit('min-players', minPlayers), 50);

    if (players.length >= minPlayers) {
        io.emit('ready');
    }

    socket.on('disconnect', () => {
        console.log("client disconnected")
        players = players.filter(x => x !== socket.id);

        if (players.length < minPlayers) {
            io.emit('player-disconnect');
        }
    });

    socket.on('min-player-change', x => {
        console.log(`minPlayers = ${x}`);
        minPlayers = x;

        socket.broadcast.emit('min-players', minPlayers);

        if (players.length >= minPlayers) {
            io.emit('ready');
        }

        if (players.length < minPlayers) {
            io.emit('player-disconnect');
        }
    });
});

server.listen(80, '0.0.0.0', () => {
    console.log('listening');
});