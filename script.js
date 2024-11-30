const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');
const playButton = document.getElementById('playButton');
const ratingButton = document.getElementById('ratingButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let timer = 60;
let currentCircle = null;
let circleStartTime = null;
let gameStartTime = null;
let intervalId = null;
let scores = [];
let playerName = null;
let isGameRunning = false;

playButton.addEventListener('click', () => {
    playerName = prompt("Введите ваше имя пользователя Telegram:");
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
    isGameRunning = true;
    updateScore();
    canvas.addEventListener('touchstart', handleGameClick, false);
    canvas.addEventListener('click', handleGameClick);
    intervalId = setInterval(gameLoop, 10);
}

function gameLoop() {
    if (!isGameRunning) return;

    if (Date.now() - gameStartTime >= 60000) {
        clearInterval(intervalId);
        gameOver();
        return;
    }

    if (!currentCircle || currentCircle.clicked) {
        createCircle();
    } else if (circleStartTime && Date.now() - circleStartTime >= 3000) {
        currentCircle.clicked = true;
        createCircle();
    }
    drawCircles();
}

function createCircle() {
    const minSize = 20;
    const maxSize = 50;
    let size = Math.floor(Math.random() * (maxSize - minSize)) + minSize;
    size = Math.min(size, canvas.width / 2 - 50, canvas.height / 2 - 50); // Увеличенный отступ до 50px
    const x = Math.random() * (canvas.width - 2 * size) + size;
    const y = Math.random() * (canvas.height - 2 * size) + size;
    currentCircle = { x, y, size, clicked: false };
    circleStartTime = Date.now();
}

function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentCircle && !currentCircle.clicked) {
        ctx.beginPath();
        ctx.arc(currentCircle.x + currentCircle.size, currentCircle.y + currentCircle.size, currentCircle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

function handleGameClick(event) {
    if (currentCircle && !currentCircle.clicked && isGameRunning) {
        let x = event.offsetX;
        let y = event.offsetY;

        if (event.type === 'touchstart') {
            const rect = canvas.getBoundingClientRect();
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        }

        const dx = x - (currentCircle.x + currentCircle.size);
        const dy = y - (currentCircle.y + currentCircle.size);
        if (dx * dx + dy * dy < currentCircle.size * currentCircle.size) {
            score++;
            currentCircle.clicked = true;
            updateScore();
            currentCircle = null;
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = `Счёт: ${score}`;
}

function updateTimer() {
    timerDisplay.textContent = Math.max(0, 60 - Math.floor((Date.now() - gameStartTime) / 1000));
}

function gameOver() {
    isGameRunning = false;
    gameScreen.style.display = 'none';
    storeScore(score);
    showResults();
}

function storeScore(newScore) {
    scores.push({ name: playerName, score: newScore });
    scores.sort((a, b) => b.score - a.score);
}

function showResults() {
    resultsScreen.innerHTML = `<h1>Таблица лидеров</h1><ol>${scores.map(entry => `<li>${entry.name}: ${entry.score}</li>`).join('')}</ol><button id="backToMenuButton">В меню</button>`;
    resultsScreen.style.display = 'block';
    mainMenu.style.display = 'none';
    gameScreen.style.display = 'none';

    const backButton = document.getElementById('backToMenuButton');
    backButton.addEventListener('click', () => {
        resultsScreen.style.display = 'none';
        mainMenu.style.display = 'block';
    });
}

setInterval(updateTimer, 100);
