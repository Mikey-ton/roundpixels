const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timer = 60;
let circle = null;
let gameIntervalId = null;

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
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  if (circle && !circle.clicked) {
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
  alert(`Game Over! Your score: ${score}`);
}

function startGame() {
  createCircle();
  drawCircle();
  gameIntervalId = setInterval(updateTimer, 1000);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', handleCanvasClick);

startGame(); // Start the game automatically
