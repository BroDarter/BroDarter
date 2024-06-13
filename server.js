const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let gameState = {
    player1: { score: 0, marks: 0, name: 'Player 1' },
    player2: { score: 0, marks: 0, name: 'Player 2' },
    currentPlayer: 1,
    marks: {
        '20': [0, 0], '19': [0, 0], '18': [0, 0],
        '17': [0, 0], '16': [0, 0], '15': [0, 0],
        'Bull': [0, 0]
    }
};

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the initial game state to the connected client
    socket.emit('updateGameState', gameState);

    // Handle incoming score updates
    socket.on('updateScore', (data) => {
        // Update the game state with the new score
        gameState = { ...gameState, ...data };

        // Broadcast the updated game state to all clients
        io.emit('updateGameState', gameState);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
