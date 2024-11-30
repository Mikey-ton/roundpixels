// DOM elements
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
let isGameRunning = false;

// Event Listeners
playButton.addEventListener('click', startGame);
ratingButton.addEventListener('click', showResults);
canvas.addEventListener('click', handleGameClick);
canvas.addEventListener('touchstart', handleGameClick);


function startGame() {
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
  updateTimer(); //Initialize timer

  gameIntervalId = setInterval(gameLoop, 30); // Start game loop
  scores = []; //Clear scores for new game
}


function gameLoop() {
  if (!isGameRunning) return;

  const elapsedTime = Date.now() - gameStartTime;
  if (elapsedTime >= 60000) {
    clearInterval(gameIntervalId);
    gameOver();
    return;
  }


  updateTimer(); //Update timer within the loop
  if (!currentCircle) {
    createCircle();
  } else if (Date.now() - circleStartTime >= 3000) {
    currentCircle = null; //Clear the circle if the timeout has passed
    createCircle();
  }

  drawCircles();
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
}


function drawCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (currentCircle) {
    ctx.beginPath();
    ctx.arc(currentCircle.x, currentCircle.y, currentCircle.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }
}


function handleGameClick(event) {
  if (!isGameRunning || !currentCircle) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  const dx = clickX - currentCircle.x;
  const dy = clickY - currentCircle.y;

  if (dx * dx + dy * dy < currentCircle.size * currentCircle.size) {
    score++;
    currentCircle = null;
    updateScore();
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateTimer() {
  const currentTime = Math.max(0, 60 - Math.floor((Date.now() - gameStartTime) / 1000));
  timerDisplay.textContent = `Time: ${currentTime}`;
}

function gameOver() {
  isGameRunning = false;
  storeScore(score);
  showResults();
}

function storeScore(newScore) {
  scores.push({ score: newScore });
  scores.sort((a, b) => b.score - a.score);
}

function showResults() {
  resultsScreen.innerHTML = `<h1>Leaderboard</h1><ol>${scores.map(entry => `<li>${entry.score}</li>`).join('')}</ol><button id="backToMenuButton">Back to Menu</button>`;
  resultsScreen.style.display = 'block';
  mainMenu.style.display = 'none';
  gameScreen.style.display = 'none';

  const backButton = document.getElementById('backToMenuButton');
  backButton.addEventListener('click', () => {
    resultsScreen.style.display = 'none';
    mainMenu.style.display = 'block';
    gameScreen.style.display = 'none'; //Added
  });
}

//Initial setup, no need for this now.
