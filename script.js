const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let circle = { x: 150, y: 100, radius: 25, clicked: false }; // Initial circle properties

function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fillStyle = circle.clicked ? 'gray' : 'blue'; // Change color on click
  ctx.fill();
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  const dx = clickX - circle.x;
  const dy = clickY - circle.y;
  if (dx * dx + dy * dy < circle.radius * circle.radius) {
    circle.clicked = !circle.clicked;
  }
  drawCircle();
}

canvas.addEventListener('click', handleCanvasClick);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

drawCircle(); // Initial draw
