// DOM elements 1
const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');
const playButton = document.getElementById('playButton');
const ratingButton = document.getElementById('ratingButton');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let timer = 60;
let currentCircle = null;
let circleStartTime = null;
let gameStartTime = null;
let gameIntervalId = null;
let scores = [];
let playerName = null;
let isGameRunning = false;

// Event Listeners
playButton.addEventListener('click', startGame);
ratingButton.addEventListener('click', showResults);
canvas.addEventListener('click', handleGameClick);
canvas.addEventListener('touchstart', handleGameClick);


// Game Functions
function startGame() {
  playerName = prompt("Введите ваше имя пользователя Telegram:");
  if (!playerName) return;

  mainMenu.style.display = 'none';
  gameScreen.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  score = 0;
  timer = 60;
  currentCircle = null;
  gameStartTime = Date.now();
  isGameRunning = true;
  updateScore();
  gameIntervalId = setInterval(gameLoop, 30);
}


function gameLoop() {
  if (!isGameRunning) return;

  const elapsedGameTime = Date.now() - gameStartTime;
  if (elapsedGameTime >= 60000) {
    clearInterval(gameIntervalId);
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
  updateTimer();
}


function createCircle() {
  const minSize = 20;
  const maxSize = 50;
  let size, x, y;

  do {
    size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    const maxAllowedSize = Math.min(canvas.width, canvas.height) / 2 - 50;
    size = Math.min(size, maxAllowedSize);
    x = Math.random() * (canvas.width - 2 * size) + size;
    y = Math.random() * (canvas.height - 2 * size) + size;
    currentCircle = { x, y, size, clicked: false };
  } while (x - size < 0 || x + size > canvas.width || y - size < 0 || y + size > canvas.height);

  circleStartTime = Date.now();
  console.log("Circle created: x =", currentCircle.x, "y =", currentCircle.y, "size =", currentCircle.size);
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

function handleGameClick(event) {
  if (!currentCircle || currentCircle.clicked || !isGameRunning) return;

  const rect = canvas.getBoundingClientRect();
  const x = event.type === 'touchstart' ? event.touches[0].clientX - rect.left : event.offsetX;
  const y = event.type === 'touchstart' ? event.touches[0].clientY - rect.top : event.offsetY;

  const dx = x - currentCircle.x;
  const dy = y - currentCircle.y;

  if (dx * dx + dy * dy < currentCircle.size * currentCircle.size) {
    score++;
    currentCircle.clicked = true;
    updateScore();
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
