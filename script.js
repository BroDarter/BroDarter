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

document.querySelectorAll('.mark').forEach(mark => {
    mark.addEventListener('click', () => {
        const number = mark.getAttribute('data-number');
        addScore(currentPlayer, number);
    });
});

function addScore(player, number) {
    const points = scores[number];
    const scoreElement = document.getElementById(`player${player}-score`);
    const marksElement = document.getElementById(`${number}-marks`);

    let playerMarks = marks[number][player - 1];
    let opponentMarks = marks[number][player === 1 ? 1 : 0];

    if (playerMarks < 3) {
        playerMarks++;
        if (playerMarks === 1) {
            marksElement.textContent = "\\";
        } else if (playerMarks === 2) {
            marksElement.textContent = "X";
        } else if (playerMarks === 3) {
            marksElement.textContent = "[X]";
        }
        marks[number][player - 1] = playerMarks;
    } else if (playerMarks >= 3 && opponentMarks < 3) {
        if (player === 1) {
            player1Score += points;
            scoreElement.textContent = player1Score;
        } else {
            player2Score += points;
            scoreElement.textContent = player2Score;
        }
    }

    if (player === 1) {
        player1Marks++;
    } else {
        player2Marks++;
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
    alert(`Player ${currentPlayer}'s turn`);
}

updateMarks();

