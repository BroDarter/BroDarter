const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());
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

app.get('/gameState', (req, res) => {
    res.json(gameState);
});

app.post('/updateScore', (req, res) => {
    gameState = { ...gameState, ...req.body };
    res.json(gameState);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
