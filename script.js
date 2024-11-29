const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const playButton = document.getElementById('playButton');
const ratingButton = document.getElementById('ratingButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let timer = 60;
let currentCircle = null;
let circleStartTime;
let gameStartTime;
let intervalId;
let scores = [];
let playerName = null;


playButton.addEventListener('click', () => {
    playerName = prompt("Enter your Telegram username:"); 
    if (playerName) {
        mainMenu.style.display = 'none';
        gameScreen.style.display = 'block';
        startGame();
    }
});

ratingButton.addEventListener('click', showResults);

function startGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    score = 0;
    timer = 60;
    currentCircle = null;
    gameStartTime = Date.now();
    updateScore();
    intervalId = setInterval(gameLoop, 10);
}

function gameLoop() {
    if (Date.now() - gameStartTime >= 60000) {
        clearInterval(intervalId);
        gameOver();
        return;
    }

    if (!currentCircle || currentCircle.clicked) {
        createCircle();
    } else if (Date.now() - circleStartTime >= 1000) {
        currentCircle.clicked = true;
        createCircle();
    }
    drawCircles();
}

function createCircle() {
    const size = Math.floor(Math.random() * 11) + 5;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    currentCircle = { x, y, size, clicked: false };
    circleStartTime = Date.now();
}

function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentCircle && !currentCircle.clicked) {
        ctx.beginPath();
        ctx.arc(currentCircle.x, currentCircle.y, currentCircle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (currentCircle && !currentCircle.clicked &&
        Math.sqrt((x - currentCircle.x)**2 + (y - currentCircle.y)**2) < currentCircle.size) {
        score++;
        currentCircle.clicked = true;
        updateScore();
        currentCircle = null;
    }
});

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateTimer() {
    timerDisplay.textContent = Math.max(0, 60 - Math.floor((Date.now() - gameStartTime) / 1000));
}

function gameOver() {
    gameScreen.style.display = 'none';
    storeScore(score);
    showResults();
}

function storeScore(newScore) {
    scores.push({ name: playerName, score: newScore }); 
    scores.sort((a, b) => b.score - a.score); 
}

function showResults() {
    const resultsScreen = document.createElement('div');
    resultsScreen.id = 'resultsScreen';
    resultsScreen.style.display = 'block';
    resultsScreen.innerHTML = `<h1>Leaderboard</h1><ol>${scores.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('')}</ol><button id="backToMenuButton">Back to Menu</button>`;
    document.body.appendChild(resultsScreen);

    const backButton = document.getElementById('backToMenuButton');
    backButton.addEventListener('click', () => {
        document.body.removeChild(resultsScreen);
        mainMenu.style.display = 'block';
    });
}

setInterval(updateTimer, 100);
window.addEventListener('resize', startGame);