const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timer = 60;
let circle = null;
let gameStarted = false;
let circles = [];
let timeIntervalId = null; // Changed variable name 1

function createCircle() {
    const max_x = canvas.width - 50; // Adjusted for the circle to fit
    const max_y = canvas.height - 50;
    const radius = Math.floor(Math.random() * 30) + 10; // Range of radii, not just 25

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
    ctx.fillStyle = circle.clicked ? 'gray' : 'blue';
    ctx.fill();
  }
}


function handleCanvasClick(event) {
    if (!gameStarted) return;

  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  if (circle && !circle.clicked) {
    const dx = clickX - circle.x;
    const dy = clickY - circle.y;
    if (dx * dx + dy * dy < circle.radius * circle.radius) {
      circle.clicked = true;
      score++;
      updateScore();
      createCircle(); // Create a new one!
      drawCircle();
    }
  }
}

function updateScore() {
    scoreDisplay.textContent = `Счёт: ${score}`;
}

function updateTimer() {
    timer--;
    timerDisplay.textContent = `Время: ${timer}`;
    if (timer <= 0) {
        gameOver();
    }
}

function gameOver() {
  clearInterval(timeIntervalId);
  gameStarted = false;
  alert(`Игра окончена! Ваш счёт: ${score}`);
}

function startGameLoop() {
  gameStarted = true;
  score = 0;
  updateScore(); // Initialize the score
  timer = 60;
  updateTimer();
  createCircle();
  drawCircle();
  timeIntervalId = setInterval(updateTimer, 1000); // Updated interval
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', handleCanvasClick);
document.getElementById('playButton').addEventListener('click', startGameLoop); // Corrected event listener

drawCircle(); // Initial draw
