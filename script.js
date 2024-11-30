const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let score = 0;
let timer = 60;
let circle = null; // Changed variable
let gameStarted = false;
let timeIntervalId = null;

function createCircle() {
    const radius = 25; // Fixed radius
    let x, y;

    do {
        x = Math.random() * (canvas.width - 2 * radius) + radius;
        y = Math.random() * (canvas.height - 2 * radius) + radius;
        circle = { x, y, radius, clicked: false }; // Initialize circle object
    } while (
        x < 0 ||
        x > canvas.width ||
        y < 0 ||
        y > canvas.height
    );


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

  if (circle) {
    const dx = clickX - circle.x;
    const dy = clickY - circle.y;
    if (dx * dx + dy * dy < circle.radius * circle.radius) {
      circle.clicked = !circle.clicked; // Toggle clicked state
      score++;
      updateScore();
      createCircle();
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
    updateScore();
    timer = 60;
    updateTimer();
    createCircle(); // Create initial circle
    drawCircle();

    timeIntervalId = setInterval(updateTimer, 1000);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


canvas.addEventListener('click', handleCanvasClick);

document.getElementById('playButton').addEventListener('click', startGameLoop); //Corrected

drawCircle();
