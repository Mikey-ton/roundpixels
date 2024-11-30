const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let score = 0;
let timer = 60;
let circle = null;
let gameIntervalId = null;
let gameStarted = false;

function createCircle() {
  const radius = 25;
  const max_x = canvas.width - 2 * radius;
  const max_y = canvas.height - 2 * radius;
  circle = {
    x: Math.random() * max_x + radius,
    y: Math.random() * max_y + radius,
    radius: radius,
    clicked: false,
  };
}

function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.clicked ? 'lightgray' : 'blue';
    ctx.fill();
  }
}

function handleCanvasClick(event) {
  if (!gameStarted || circle.clicked) return; // Prevent clicks after game over or on an already-clicked circle

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const distance = Math.sqrt(
    Math.pow(clickX - circle.x, 2) + Math.pow(clickY - circle.y, 2)
  );

  if (distance < circle.radius) {
    circle.clicked = true;
    score++;
    updateScore();
    createCircle();
    drawCircle();
  }
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateTimer() {
  timer--;
  timerDisplay.textContent = `Time: ${timer}`;
  if (timer <= 0) {
    gameOver();
  }
}

function gameOver() {
  clearInterval(gameIntervalId);
  gameStarted = false;
  finalScoreDisplay.textContent = score;
  gameOverScreen.style.display = 'block';
  canvas.style.display = 'none';
}

function startGame() {
  gameStarted = true;
  score = 0;
  updateScore();
  timer = 60;
  updateTimer();
  createCircle();
  drawCircle();
  gameIntervalId = setInterval(updateTimer, 1000);
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', handleCanvasClick);
restartButton.addEventListener('click', restartGame);

startGame(); // Start the game automatically