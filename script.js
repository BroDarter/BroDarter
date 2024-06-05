let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Marks = 0;
let player2Marks = 0;
let latestState = {}; // To store the latest state
let turnActions = []; // To store the actions taken during the current turn
let turnMarkCount = 0; // Count of marks in the current turn

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

function saveLatestState() {
    latestState = {
        currentPlayer,
        player1Score,
        player2Score,
        player1Marks,
        player2Marks,
        marks: JSON.parse(JSON.stringify(marks)) // Deep copy of marks
    };
}

function restoreLatestState() {
    if (Object.keys(latestState).length > 0) { // Ensure there's a saved state
        player1Score = latestState.player1Score;
        player2Score = latestState.player2Score;
        player1Marks = latestState.player1Marks;
        player2Marks = latestState.player2Marks;
        Object.assign(marks, latestState.marks);

        updateDisplay();
        turnMarkCount = 0; // Reset the turn mark count
    }
}

function addScore(number) {
    if (turnMarkCount >= 9) {
        alert('Only 9 marks possible per round, please try again.');
        clickUndo(); // Treat "Ok" as "Undo"
        return;
    }
    
    saveTurnAction(); // Save state before making changes
    turnMarkCount++; // Increment the count of marks in the current turn
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
    if (turnMarkCount > 9) {
        alert('Only 9 marks possible per round, please try again.');
        clickUndo(); // Treat "Ok" as "Undo"
        return;
    }

    if (checkWinCondition()) {
        alert(`Player ${currentPlayer} won!`);
        resetGame();
        return;
    }
    saveLatestState(); // Save state at the beginning of the next player's turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnMarkCount = 0; // Reset the turn mark count
    turnActions = []; // Clear actions for the new turn
    document.getElementById('currentPlayer').textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinCondition() {
    const playerClosedAll = (playerMarks) => Object.values(marks).every(([p1Marks, p2Marks], index) => {
        return currentPlayer === 1 ? p1Marks >= 3 : p2Marks >= 3;
    });

    if (playerClosedAll(marks[currentPlayer - 1])) {
        if (currentPlayer === 1 && player1Score >= player2Score) {
            return true;
        } else if (currentPlayer === 2 && player2Score >= player1Score) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    player1Marks = 0;
    player2Marks = 0;
    latestState = {};
    turnActions = [];
    turnMarkCount = 0; // Reset the turn mark count

    for (const number in marks) {
        marks[number][0] = 0;
        marks[number][1] = 0;
    }

    updateDisplay();
    saveLatestState();
}

function clickUndo() {
    if (turnActions.length > 0) {
        const lastAction = turnActions.pop(); // Remove the last action
        restoreTurnAction(lastAction); // Restore the game state to the previous action
        turnMarkCount--; // Decrement the turn mark count
    } else {
        restoreLatestState(); // Restore to the state before the turn started
    }
    // Ensure display is updated correctly without changing the player
    document.getElementById('currentPlayer').textContent = `Player ${currentPlayer}'s turn`;
}

function saveTurnAction() {
    const state = {
        player1Score,
        player2Score,
        player1Marks,
        player2Marks,
        marks: JSON.parse(JSON.stringify(marks)) // Deep copy of marks
    };
    turnActions.push(state);
}

function restoreTurnAction(state) {
    player1Score = state.player1Score;
    player2Score = state.player2Score;
    player1Marks = state.player1Marks;
    player2Marks = state.player2Marks;
    Object.assign(marks, state.marks);

    updateDisplay();
}

function updateDisplay() {
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
    document.getElementById('currentPlayer').textContent = `Player ${currentPlayer}'s turn`;

    for (const number in marks) {
        const player1MarksElement = document.getElementById(`player1-${number}-marks`);
        const player2MarksElement = document.getElementById(`player2-${number}-marks`);
        const player1MarkCount = marks[number][0];
        const player2MarkCount = marks[number][1];

        player1MarksElement.textContent = getMarkSymbol(player1MarkCount);
        player2MarksElement.textContent = getMarkSymbol(player2MarkCount);
    }
}

function getMarkSymbol(count) {
    if (count === 0) return "";
    if (count === 1) return "\\";
    if (count === 2) return "X";
    if (count === 3) return "[X]";
}

// Initialize the game state
saveLatestState();
updateDisplay();
