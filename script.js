let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Marks = 0;
let player2Marks = 0;

const scores = {
    '20': 20,
    '19': 19,
    '18': 18,
    '17': 17,
    '16': 16,
    '15': 15,
    'Bull': 25
};

const marks = {
    '20': [0, 0],  // [Player 1 marks, Player 2 marks]
    '19': [0, 0],
    '18': [0, 0],
    '17': [0, 0],
    '16': [0, 0],
    '15': [0, 0],
    'Bull': [0, 0]
};

function addScore(number) {
    const points = scores[number];
    const scoreElement = document.getElementById(`player${currentPlayer}-score`);
    const playerMarksElement = document.getElementById(`player${currentPlayer}-${number}-marks`);
    const opponentMarksElement = document.getElementById(`player${currentPlayer === 1 ? 2 : 1}-${number}-marks`);

    let playerMarks = marks[number][currentPlayer - 1];
    let opponentMarks = marks[number][currentPlayer === 1 ? 1 : 0];

    if (playerMarks >= 3 && opponentMarks >= 3) {
        // Both players have closed this number, do not increment marks
        return;
    }

    if (playerMarks < 3) {
        playerMarks++;
        if (playerMarks === 1) {
            playerMarksElement.textContent = "\\";
        } else if (playerMarks === 2) {
            playerMarksElement.textContent = "X";
        } else if (playerMarks === 3) {
            playerMarksElement.textContent = "[X]";
        }
        marks[number][currentPlayer - 1] = playerMarks;
    } else if (playerMarks >= 3 && opponentMarks < 3) {
        if (currentPlayer === 1) {
            player1Score += points;
            scoreElement.textContent = player1Score;
        } else {
            player2Score += points;
            scoreElement.textContent = player2Score;
        }
    }

    if (playerMarks < 3 || (playerMarks === 3 && opponentMarks < 3)) {
        if (currentPlayer === 1) {
            player1Marks++;
        } else {
            player2Marks++;
        }
    }

    updateMarks();
}

function updateMarks() {
    document.getElementById('player1-marks').textContent = player1Marks;
    document.getElementById('player2-marks').textContent = player2Marks;
}

function nextPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('currentPlayer').textContent = `Player ${currentPlayer}'s turn`;
}

function clickUndo() {
    // Implement undo functionality if needed
}
