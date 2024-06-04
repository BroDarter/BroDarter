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

function addScore(player, number) {
    const points = scores[number];
    const scoreElement = document.getElementById(`player${player}-score`);
    const marksElement = document.getElementById(`player${player}-marks`);

    if (player === 1) {
        player1Score += points;
        player1Marks++;
        scoreElement.textContent = player1Score;
        marksElement.textContent = player1Marks;
    } else {
        player2Score += points;
        player2Marks++;
        scoreElement.textContent = player2Score;
        marksElement.textContent = player2Marks;
    }
}

function nextPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    alert(`Player ${currentPlayer}'s turn`);
}
