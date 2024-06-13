const socket = io('https://bro-darter.vercel.app/');

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

socket.on('updateGameState', (state) => {
    gameState = state;
    updateDisplay();
});

function sendScoreUpdate(data) {
    socket.emit('updateScore', data);
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
});

function setPlayerNames(player1, player2) {
    player1Name = player1 || "Player 1";
    player2Name = player2 || "Player 2";
    document.getElementById('player1-name').textContent = player1Name;
    document.getElementById('player2-name').textContent = player2Name;
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn`;
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
    currentPlayer = player;
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn`;
}

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
    if (turnMarkCount > 9) {
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
    sendScoreUpdate(gameState);
}

function updateMarks() {
    document.getElementById('player1-marks').textContent = player1Marks;
    document.getElementById('player2-marks').textContent = player2Marks;
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

    totalMarks[currentPlayer].push(turnMarkCount); // Save the marks for this turn

    if (checkWinCondition()) {
        askHowManyDarts();
        calculateStats(dartsThrown);
        return;
    }
     // Check if the player scored 7 or 8 marks in this turn
     if (turnMarkCount === 7 || turnMarkCount === 8) {
        showPopupGif();
    }

    if (turnMarkCount === 9 ) {
        showPopupGif2();
    }

    saveLatestState(); // Save state at the beginning of the next player's turn
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnMarkCount = 0; // Reset the turn mark count
    turnActions = []; // Clear actions for the new turn
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn`;

    updateMPR(); 
    sendScoreUpdate(gameState);

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

    mprPlayer1 = 0.00
    mprPlayer2 = 0.00

    askWhoGoesFirst();
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    player1Marks = 0;
    player2Marks = 0;
    latestState = {};
    turnActions = [];
    turnMarkCount = 0; // Reset the turn mark count
    totalMarks = { 1: [], 2: [] }; // Reset total marks

 
    for (const number in marks) {
        marks[number][0] = 0;
        marks[number][1] = 0;
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
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn`;
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
    document.getElementById('currentPlayer').textContent = `${currentPlayer === 1 ? player1Name : player2Name}'s turn`;

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

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.code === 'KeyC') {
        clearStats();
    }
});

function clearStats() {
    localStorage.removeItem('gameStats');
    alert("Game stats cleared. You can start a new game.");
}

// Function to calculate and display stats
function calculateStats(dartsThrown) {
    const totalMarksPlayer1 = totalMarks[1].reduce((sum, marks) => sum + marks, 0);
    const totalMarksPlayer2 = totalMarks[2].reduce((sum, marks) => sum + marks, 0);

    const dartsThrownPlayer1 = totalMarks[1].length * 3 + (currentPlayer === 1 ? parseInt(dartsThrown) - 3 : 0);
    const dartsThrownPlayer2 = totalMarks[2].length * 3 + (currentPlayer === 2 ? parseInt(dartsThrown) - 3 : 0);

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
            <td style="width:10.5%; text-align:center;">${player1Name}</td>
            ${Object.keys(scores).map(number => `<td style="width:6%; text-align:center;">${getMarkSymbol(marks[number][0])}</td>`).join('')}
            <td style="width:8.33%; text-align:center;">${player1Score}</td>
            <td style="width:8.33%; text-align:center;">${mprPlayer1}</td>
            <td style="width:8.33%; text-align:center;">${bestRoundPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${comebackPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${totalMarksPlayer1}</td>
            <td style="width:10.5%; text-align:center;">${dartsThrownPlayer1}</td>
        </tr>
        <tr>
            <td style="width:10.5%; text-align:center;">${player2Name}</td>
            ${Object.keys(scores).map(number => `<td style="width:6%; text-align:center;">${getMarkSymbol(marks[number][1])}</td>`).join('')}
            <td style="width:8.33%; text-align:center;">${player2Score}</td>
            <td style="width:8.33%; text-align:center;">${mprPlayer2}</td>
            <td style="width:8.33%; text-align:center;">${bestRoundPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${comebackPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${totalMarksPlayer2}</td>
            <td style="width:10.5%; text-align:center;">${dartsThrownPlayer2}</td>
        </tr>
    </table>
`;

    // Store the current game stats in localStorage
    let gameStats = JSON.parse(localStorage.getItem('gameStats')) || [];
    gameStats.push(currentGameStats);
    localStorage.setItem('gameStats', JSON.stringify(gameStats));

    // Combine all game stats for display
    let allGameStats = gameStats.join('<br><br>');

    setTimeout(() => {
        const popupWidth = 900;
        const popupHeight = 600;
        const left = (window.innerWidth / 2) - (popupWidth / 2);
        const top = (window.innerHeight / 2) - (popupHeight / 2);

        let statsPopup = window.open("", "Stats", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
        statsPopup.document.write(allGameStats);
        statsPopup.document.close();
    }, 100); // Delay the opening of stats by 100ms

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
    }, 1000); // Display the gif for 1 second
}

function showPopupGif2() {
    const popup = document.getElementById('popup-gif2');
    popup.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
    }, 5900); // Display the gif for 5 second
}

