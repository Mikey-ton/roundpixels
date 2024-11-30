const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.createElement('div'); //Создаём элемент для отображения счёта
scoreDisplay.id = 'score';
scoreDisplay.textContent = 'Счёт: 0';
document.body.appendChild(scoreDisplay); // Добавляем его в body

let score = 0;
let circle = { x: 0, y: 0, radius: 25, clicked: false }; //Circle properties

function createCircle() {
    const radius = 25;
    const max_x = canvas.width - 2*radius;
    const max_y = canvas.height - 2*radius;
    circle = {
        x: Math.random() * max_x + radius,
        y: Math.random() * max_y + radius,
        radius: radius,
        clicked: false
    };
}

function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.clicked ? 'gray' : 'blue';
  ctx.fill();
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const dx = clickX - circle.x;
    const dy = clickY - circle.y;
    if (dx * dx + dy * dy < circle.radius * circle.radius) {
        circle.clicked = true;
        score++;
        updateScore();
        createCircle(); // Создаём новый круг после клика
        drawCircle();
    }
}

function updateScore() {
  scoreDisplay.textContent = `Счёт: ${score}`;
}

canvas.addEventListener('click', handleCanvasClick);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

createCircle(); // Создаём начальный круг
drawCircle();
