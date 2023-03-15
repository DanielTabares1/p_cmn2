// index.js

const { Console } = require("console");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let player1Character;
let player2Character;

let player1Id = null;
let player2Id = null;

let playerNames = [];
let playerCharactersName = []
let turnIndex = 0;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    console.log("Nuevo jugador conectado");

    socket.on("login", (name) => {
        console.log(`El jugador ${socket.id} se ha conectado`);
        
        // Redirigir a la página del juego
        socket.emit("redirect", "/game?nombre=" + name);
    });

    socket.on('select-character', (player) => {
        if (player1Id == null) {
            player1Id = socket.id;
            player1Character = player.character;
            player1Nombre = player.playerName;
            
            playerNames.push(player1Nombre);
            playerCharactersName.push(player1Character);

            console.log(`Player 1 (${player1Id}) connected with character ${player.character}`);
        } else {
            // Si hay un jugador 1, asignar este socket como jugador 2
            player2Id = socket.id;
            player2Character = player.character;
            player2Nombre = player.playerName;

            playerCharactersName.push(player2Character);
            playerNames.push(player2Nombre);

            console.log(`Player 2 (${player2Id}) connected with character ${player.character}`);
            
            // Notificar a ambos jugadores que la partida ha comenzado
        }

        if (playerNames.length == 2) {            
            // Redirigir a ambos jugadores a la página "play.html"
            let url = '/play.html?player1=' + player1Character + '&player2=' + player2Character + '&player1Nombre=' + player1Nombre + '&player2Nombre=' + player2Nombre
            io.to(player1Id).emit('redirect', url + '&turno=true');
            io.to(player2Id).emit('redirect', url + '&turno=false');
            player1Id = null;
            playerNames = [];
        }
    });    

    socket.on('actualizar', (turno) => {
        io.emit('actualizar-nuevo-turno', turno);
    });

    socket.on('win', (winnner) => { 
        io.emit('game-over', winnner);
    })
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});
