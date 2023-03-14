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

let numPlayersReady = 0;

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
    console.log("Nuevo jugador conectado");

    socket.on("login", (name) => {
        console.log(`El jugador ${name} se ha conectado`);

        // Redirigir a la página del juego
        socket.emit("redirect", "/game?nombre=" + name);
    });

    socket.on('select-character', (player) => {
        if (player1Id == null) {
            player1Id = socket.id;
            player1Character = player.character;
            player1Nombre = player.playerName;
            console.log(`Player 1 (${player1Id}) connected with character ${player.character}`);
        } else {
            // Si hay un jugador 1, asignar este socket como jugador 2
            player2Id = socket.id;
            player2Character = player.character;
            player2Nombre = player.playerName;
            console.log(`Player 2 (${player2Id}) connected with character ${player.character}`);

            // Notificar a ambos jugadores que la partida ha comenzado
        }

        numPlayersReady++;

        if (numPlayersReady === 2) {
            // Emitir el evento "game-start" a ambos jugadores
            io.to(player1Id).emit('game-start', { player: 1 });
            io.to(player2Id).emit('game-start', { player: 2 });
            // Redirigir a ambos jugadores a la página "play.html"
            io.to(player1Id).emit('redirect', '/play.html?player1=' + player1Character + '&player2=' + player2Character + '&player1Nombre=' + player1Nombre + '&player2Nombre=' + player2Nombre);
            io.to(player2Id).emit('redirect', '/play.html?player1=' + player1Character + '&player2=' + player2Character + '&player1Nombre=' + player1Nombre + '&player2Nombre=' + player2Nombre);

        }

        // if (player1Character && player2Character) {
        //     console.log('Iniciando juego...')
        //     const url = '/play?player1=' + player1Character + '&player2=' + player2Character;
        //     window.location.replace(url);
        // }


        // socket.on('disconnect', () => {
        //     console.log(`Socket ${socket.id} disconnected`);

        //     // Si el jugador 1 se desconecta, reiniciar la partida
        //     if (socket.id === player1Id) {
        //         console.log('Player 1 disconnected');
        //         player1Id = null;
        //         player2Id = null;
        //         io.emit('game-reset');
        //     }
        //     // Si el jugador 2 se desconecta, notificar al jugador 1 que ha ganado
        //     else if (socket.id === player2Id) {
        //         console.log('Player 2 disconnected');
        //         io.to(player1Id).emit('game-end', { winner: 1 });
        //     }
        // });





    });
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + '/public/game.html');
});

// Creo que esto no es necesario, pero lo dejo por si acaso 
app.get('/play', (req, res) => {
    const player1Character = req.query.player1;
    const player2Character = req.query.player2;
    res.render('play', { player1Character, player2Character });
    console.log('Player 1: ' + player1Character);
    console.log('Player 2: ' + player2Character);
});