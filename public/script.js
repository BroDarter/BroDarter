let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let player1Marks = 0;
let player2Marks = 0;
let latestState = {}; // To store the latest state
let turnActions = []; // To store the actions taken during the current turn
let turnMarkCount = 0; // Count of marks in the current turn
let totalMarks = { 1: [], 2: [] }; // To track total marks per turn for each player

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

function fetchGameState() {
    fetch('/gameState')
        .then(response => response.json())
        .then(state => {
            gameState = state;
            updateDisplay();
        });
}

function sendScoreUpdate(data) {
    fetch('/updateScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(state => {
        gameState = state;
        updateDisplay();
    });
}
// Set the player names in the HTML
document.addEventListener('DOMContentLoaded', (event) => {
    const popupWidth = 400;
    const popupHeight = 275;
    const left = (window.innerWidth / 2) - (popupWidth / 2);
    const top = (window.innerHeight / 2) - (popupHeight / 2);

    let namePopup = window.open("", "Enter Player Names", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
    namePopup.document.write(`
        <div style="text-align:center; font-family: 'Permanent Marker', cursive;">
            <h2>Enter Player Names</h2>
            <input type="text" id="player1" placeholder="Player 1" style="margin:10px; padding:10px; font-size:18px;font-family: 'Permanent Marker', cursive;">
            <br>
            <input type="text" id="player2" placeholder="Player 2" style="margin:10px; padding:10px; font-size:18px;font-family: 'Permanent Marker', cursive;">
            <br>
            <button onclick="opener.setPlayerNames(document.getElementById('player1').value, document.getElementById('player2').value); window.close();" style="margin:10px; padding:10px; font-size:18px; background-color:#007bff; color:white; border:none; border-radius:8px;font-family: 'Permanent Marker', cursive;">Submit</button>
        </div>
    `);
        // Start polling for game state updates every 2 seconds
    setInterval(fetchGameState, 2000);
});

function setPlayerNames(player1, player2) {
    gameState.player1.name = player1 || "Player 1";
    gameState.player2.name = player2 || "Player 2";
    document.getElementById('player1-name').textContent = gameState.player1.name;
    document.getElementById('player2-name').textContent = gameState.player2.name;
    document.getElementById('currentPlayer').textContent = `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s turn`;
    askWhoGoesFirst(); // Ensure to call askWhoGoesFirst after setting names
}

   // askWhoGoesFirst();

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

function askWhoGoesFirst() {
    const popupWidth = 400;
    const popupHeight = 165;
    const left = (window.innerWidth / 2) - (popupWidth / 2);
    const top = ((window.innerHeight / 2) - (popupHeight / 2))-50;

    let popup = window.open("", "Which player goes first?", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
    popup.document.write(`
        <div style="text-align:center; font-family: 'Permanent Marker', cursive;">
            <h2>Who should go first?</h2>
            <button onclick="opener.setFirstPlayer(1);window.close();" style="margin:10px; padding:15px; font-size:25px;font-family: 'Permanent Marker'; background-color:#007bff; color:white; border:none; border-radius:8px;">${player1Name}</button>
            <button onclick="opener.setFirstPlayer(2);window.close();" style="margin:10px; padding:15px; font-size:25px; font-family: 'Permanent Marker'; background-color:#007bff; color:white; border:none; border-radius:8px;">${player2Name}</button>
        </div>
    `);
}

function askHowManyDarts() {
    const popupWidth = 400;
    const popupHeight = 225;
    const left = (window.innerWidth / 2) - (popupWidth / 2);
    const top = ((window.innerHeight / 2) - (popupHeight / 2))-50;

    let dartsPopup = window.open("", "Darts Thrown", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
    dartsPopup.document.write(`
        <div style="text-align:center; font-family: 'Permanent Marker', cursive;">
            <h2>Player ${currentPlayer} won!</h2>
            <p>How many darts in the final round?</p>
            <button onclick="opener.calculateStats(1);window.close();" style="margin:10px; font-family: 'Permanent Marker', cursive; padding:15px; font-size:25px; width: 50px; background-color:#007bff; color:white; border:none; border-radius:8px;">1</button>
            <button onclick="opener.calculateStats(2);window.close();" style="margin:10px; font-family: 'Permanent Marker', cursive; padding:15px; font-size:25px; width: 50px; background-color:#007bff; color:white; border:none; border-radius:8px;">2</button>
            <button onclick="opener.calculateStats(3);window.close();" style="margin:10px; font-family: 'Permanent Marker', cursive; padding:15px; font-size:25px; width: 50px; background-color:#007bff; color:white; border:none; border-radius:8px;">3</button>
        </div>
    `);
    
}

function setFirstPlayer(player) {
    gameState.currentPlayer = player;
    document.getElementById('currentPlayer').textContent = `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s turn`;
}

function saveLatestState() {
    latestState = {
        currentPlayer: gameState.currentPlayer,
        player1Score: gameState.player1.score,
        player2Score: gameState.player2.score,
        player1Marks: gameState.player1.marks,
        player2Marks: gameState.player2.marks,
        marks: JSON.parse(JSON.stringify(gameState.marks)) // Deep copy of marks
    };
}

function restoreLatestState() {
    if (Object.keys(latestState).length > 0) { // Ensure there's a saved state
        gameState.player1.score = latestState.player1Score;
        gameState.player2.score = latestState.player2Score;
        gameState.player1.marks = latestState.player1Marks;
        gameState.player2.marks = latestState.player2Marks;
        Object.assign(gameState.marks, latestState.marks);

        updateDisplay();
        turnMarkCount = 0; // Reset the turn mark count
    }
}

function addScore(number) {
    if (turnMarkCount > 9) {
        alert('Only 9 marks possible per round, please try again.');
        clickUndo(); // Treat "Ok" as "Undo"
        return;
    }
    
    saveTurnAction(); // Save state before making changes
    turnMarkCount++; // Increment the count of marks in the current turn
    const points = scores[number];
    const scoreElement = document.getElementById(`player${gameState.currentPlayer}-score`);
    const playerMarksElement = document.getElementById(`player${gameState.currentPlayer}-${number}-marks`);
    const opponentMarksElement = document.getElementById(`player${gameState.currentPlayer === 1 ? 2 : 1}-${number}-marks`);

    let playerMarks = gameState.marks[number][gameState.currentPlayer - 1];
    let opponentMarks = gameState.marks[number][gameState.currentPlayer === 1 ? 1 : 0];

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
        gameState.marks[number][gameState.currentPlayer - 1] = playerMarks;
    } else if (playerMarks >= 3 && opponentMarks < 3) {
        if (gameState.currentPlayer === 1) {
            gameState.player1.score += points;
            scoreElement.textContent = gameState.player1.score;
        } else {
            gameState.player2.score += points;
            scoreElement.textContent = gameState.player2.score;
        }
    }

    if (playerMarks < 3 || (playerMarks === 3 && opponentMarks < 3)) {
        if (gameState.currentPlayer === 1) {
            gameState.player1.marks++;
        } else {
            gameState.player2.marks++;
        }
    }

    updateMarks();
    sendScoreUpdate(gameState);
}

function updateMarks() {
    document.getElementById('player1-marks').textContent = gameState.player1.marks;
    document.getElementById('player2-marks').textContent = gameState.player2.marks;
}

function updateMPR() {
    const totalMarksPlayer1 = totalMarks[1].reduce((sum, marks) => sum + marks, 0);
    const totalMarksPlayer2 = totalMarks[2].reduce((sum, marks) => sum + marks, 0);

    const dartsThrownPlayer1 = totalMarks[1].length * 3;
    const dartsThrownPlayer2 = totalMarks[2].length * 3;

    const mprPlayer1 = dartsThrownPlayer1 > 0 ? ((totalMarksPlayer1 / dartsThrownPlayer1) * 3).toFixed(2) : '0.00';
    const mprPlayer2 = dartsThrownPlayer2 > 0 ? ((totalMarksPlayer2 / dartsThrownPlayer2) * 3).toFixed(2) : '0.00';

    document.getElementById('mpr-player1').textContent = mprPlayer1;
    document.getElementById('mpr-player2').textContent = mprPlayer2;
}

function nextPlayer() {
    if (turnMarkCount > 9) {
        alert('Only 9 marks possible per round, please try again.');
        clickUndo(); // Treat "Ok" as "Undo"
        return;
    }

    totalMarks[gameState.currentPlayer].push(turnMarkCount); // Save the marks for this turn

    if (checkWinCondition()) {
        askHowManyDarts();
        calculateStats(dartsThrown);
        return;
    }

    // Check if the player scored 7 or 8 marks in this turn
    if (turnMarkCount === 7 || turnMarkCount === 8) {
        showPopupGif();
    }

    if (turnMarkCount === 9) {
        showPopupGif2();
    }

    saveLatestState(); // Save state at the beginning of the next player's turn
    gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
    turnMarkCount = 0; // Reset the turn mark count
    turnActions = []; // Clear actions for the new turn
    document.getElementById('currentPlayer').textContent = `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s turn`;

    updateMPR();
    sendScoreUpdate(gameState);
}

function checkWinCondition() {
    const playerClosedAll = (playerMarks) => Object.values(gameState.marks).every(([p1Marks, p2Marks], index) => {
        return gameState.currentPlayer === 1 ? p1Marks >= 3 : p2Marks >= 3;
    });

    if (playerClosedAll(gameState.marks[gameState.currentPlayer - 1])) {
        if (gameState.currentPlayer === 1 && gameState.player1.score >= gameState.player2.score) {
            return true;
        } else if (gameState.currentPlayer === 2 && gameState.player2.score >= gameState.player1.score) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    askWhoGoesFirst();
    gameState.currentPlayer = 1;
    gameState.player1.score = 0;
    gameState.player2.score = 0;
    gameState.player1.marks = 0;
    gameState.player2.marks = 0;
    latestState = {};
    turnActions = [];
    turnMarkCount = 0; // Reset the turn mark count
    totalMarks = { 1: [], 2: [] }; // Reset total marks

    for (const number in gameState.marks) {
        gameState.marks[number][0] = 0;
        gameState.marks[number][1] = 0;
    }

    updateMPR();
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
    document.getElementById('currentPlayer').textContent = `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s turn`;
}

function saveTurnAction() {
    const state = {
        player1Score: gameState.player1.score,
        player2Score: gameState.player2.score,
        player1Marks: gameState.player1.marks,
        player2Marks: gameState.player2.marks,
        marks: JSON.parse(JSON.stringify(gameState.marks)) // Deep copy of marks
    };
    turnActions.push(state);
}

function restoreTurnAction(state) {
    gameState.player1.score = state.player1Score;
    gameState.player2.score = state.player2Score;
    gameState.player1.marks = state.player1Marks;
    gameState.player2.marks = state.player2Marks;
    Object.assign(gameState.marks, state.marks);

    updateDisplay();
}


function updateDisplay() {
    document.getElementById('player1-score').textContent = gameState.player1.score;
    document.getElementById('player2-score').textContent = gameState.player2.score;
    document.getElementById('currentPlayer').textContent = `${gameState.currentPlayer === 1 ? gameState.player1.name : gameState.player2.name}'s turn`;

    for (const number in gameState.marks) {
        const player1MarksElement = document.getElementById(`player1-${number}-marks`);
        const player2MarksElement = document.getElementById(`player2-${number}-marks`);
        const player1MarkCount = gameState.marks[number][0];
        const player2MarkCount = gameState.marks[number][1];

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

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        clearStats();
    }
});

function clearStats() {
    localStorage.removeItem('gameStats');
    alert("Game stats cleared. You can start a new game.");
}

function calculateStats(dartsThrown) {
    const totalMarksPlayer1 = totalMarks[1].reduce((sum, marks) => sum + marks, 0);
    const totalMarksPlayer2 = totalMarks[2].reduce((sum, marks) => sum + marks, 0);

    const dartsThrownPlayer1 = totalMarks[1].length * 3 + (gameState.currentPlayer === 1 ? parseInt(dartsThrown) - 3 : 0);
    const dartsThrownPlayer2 = totalMarks[2].length * 3 + (gameState.currentPlayer === 2 ? parseInt(dartsThrown) - 3 : 0);

    const mprPlayer1 = ((totalMarksPlayer1 / dartsThrownPlayer1) * 3).toFixed(2);
    const mprPlayer2 = ((totalMarksPlayer2 / dartsThrownPlayer2) * 3).toFixed(2);

    const bestRoundPlayer1 = Math.max(...totalMarks[1]);
    const bestRoundPlayer2 = Math.max(...totalMarks[2]);

    const comebackPlayer1 = calculateComeback(totalMarks[1], totalMarks[2]);
    const comebackPlayer2 = calculateComeback(totalMarks[2], totalMarks[1]);

    const gameNumber = JSON.parse(localStorage.getItem('gameStats'))?.length + 1 || 1;
    const headerColors = ['#ff9999','#66b3ff','#99ff99','#ffcc99','#c2c2f0','#ffb3e6'];
    const randomColor = headerColors[Math.floor(Math.random() * headerColors.length)];

    const currentGameStats = `
    <table border="1" style="width:100%; border-collapse: collapse; text-align:center;font-family: 'Permanent Marker', cursive;">
        <tr>
            <th colspan="14" style="text-align:center; background-color:${randomColor};">Game ${gameNumber}</th>
        </tr>
        <tr style="background-color: #007bff; color: white; ">
            <th style="width:10.5%;">&nbsp;</th>
            <th style="width:5.5%;font-weight:normal;">20</th>
            <th style="width:5.5%;font-weight:normal;">19</th>
            <th style="width:5.5%;font-weight:normal;">18</th>
            <th style="width:5.5%;font-weight:normal;">17</th>
            <th style="width:5.5%;font-weight:normal;">16</th>
            <th style="width:5.5%;font-weight:normal;">15</th>
            <th style="width:5.5%;font-weight:normal;">Bull</th>
            <th style="width:8.33%;font-weight:normal;">Score</th>
            <th style="width:8.33%;font-weight:normal;">MPR</th>
            <th style="width:8.33%;font-weight:normal;">Best</th>
            <th style="width:10.5%;font-weight:normal;">Comeback</th>
            <th style="width:10.5%;font-weight:normal;">Marks</th>
            <th style="width:10.5%;font-weight:normal;">Thrown</th>
        </tr>
        <tr>
            <td style="width:10.5%; text-align:center;">${gameState.player1.name}</td>
            ${Object.keys(scores).map(number => `<td style="width:6%; text-align:center;">${getMarkSymbol(gameState.marks[number][0])}</td>`).join('')}
            <td style="width:8.33%; text-align:center;">${gameState.player1.score}</td>
            <td style="width:8.33%; text-align:center;">${mprPlayer1}</td>
            <td style="width:8.33%; text-align:center;">${bestRoundPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${comebackPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${totalMarksPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${dartsThrownPlayer1}</td>
        </tr>
        <tr>
            <td style="width:10.5%; text-align:center;">${gameState.player2.name}</td>
            ${Object.keys(scores).map(number => `<td style="width:6%; text-align:center;">${getMarkSymbol(gameState.marks[number][1])}</td>`).join('')}
            <td style="width:8.33%; text-align:center;">${gameState.player2.score}</td>
            <td style="width:8.33%; text-align:center;">${mprPlayer2}</td>
            <td style="width:8.33%; text-align:center;">${bestRoundPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${comebackPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${totalMarksPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${dartsThrownPlayer2}</td>
        </tr>
    </table>
`;

    let gameStats = JSON.parse(localStorage.getItem('gameStats')) || [];
    gameStats.push(currentGameStats);
    localStorage.setItem('gameStats', JSON.stringify(gameStats));

    let allGameStats = gameStats.join('<br><br>');

    setTimeout(() => {
        const popupWidth = 900;
        const popupHeight = 600;
        const left = (window.innerWidth / 2) - (popupWidth / 2);
        const top = (window.innerHeight / 2) - (popupHeight / 2);

        let statsPopup = window.open("", "Stats", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
        statsPopup.document.write(allGameStats);
        statsPopup.document.close();
    }, 100);

    resetGame();
}

function calculateComeback(playerMarks, opponentMarks) {
    let maxDeficit = 0;
    let playerTotal = 0;
    let opponentTotal = 0;
    let inDeficit = false;
    let currentDeficit = 0;

    for (let i = 0; i < playerMarks.length; i++) {
        playerTotal += playerMarks[i];
        opponentTotal += opponentMarks[i];
        if (playerTotal < opponentTotal) {
            inDeficit = true;
            currentDeficit = Math.max(currentDeficit, opponentTotal - playerTotal);
        } else if (playerTotal >= opponentTotal && inDeficit) {
            maxDeficit = Math.max(maxDeficit, currentDeficit);
            inDeficit = false;
            currentDeficit = 0;
        }
    }

    return maxDeficit;
}

function showPopupGif() {
    const popup = document.getElementById('popup-gif');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 1000);
}

function showPopupGif2() {
    const popup = document.getElementById('popup-gif2');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 5000);
}
