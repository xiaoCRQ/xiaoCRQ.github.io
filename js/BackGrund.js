const canvas = document.getElementById("backgroundCanvas")
const ctx = canvas.getContext("2d")

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

let circles = [];

// const colors = ["#836fff", "#15f5ba", "#69f2ff"];
// const colors = ["#1F3C88", "#5893D4", "#070D59"];
const colors = ["#3FC1C9", "#FC5185", "#364F6B"];

function initCircles() {
  circles = [];
  let circleCount = window.innerWidth / 100;

  for (let i = 0; i < circleCount; i++) {
    let radiux = window.innerWidth / 4;
    let x = randomBetween(radiux, canvas.width - radiux);
    let y = randomBetween(radiux, canvas.height - radiux);
    let dx = randomBetween(window.innerWidth / -2000, window.innerWidth / 2000);
    let dy = randomBetween(window.innerWidth / -2000, window.innerWidth / 2000);
    let color = colors[Math.floor(Math.random() * colors.length)]
    circles.push({ x, y, dx, dy, radiux, color });
  }
}

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radiux, 0, Math.PI * 2, false);
  ctx.fillStyle = circle.color;
  ctx.fill();
  ctx.closePath();
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {

    if (circle.x + circle.radiux > canvas.width || circle.x - circle.radiux < 0) {
      circle.dx = -circle.dx;
    }

    if (circle.y + circle.radiux > canvas.height || circle.y - circle.radiux < 0) {
      circle.dy = -circle.dy;
    }
    circle.x += circle.dx;
    circle.y += circle.dy;
    drawCircle(circle);
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 1.5;
  canvas.height = window.innerHeight * 1.5;
  initCircles();
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

initCircles();

animate();
