// 获取canvas元素
const canvas = document.getElementById('Mouse');
const ctx = canvas.getContext('2d');

// 设置初始鼠标和触摸位置
let mouseX = 0;
let mouseY = 0;
const touchPoints = []; // 记录触摸点

// 创建小球对象
const ball = {
  x: 0,
  y: 0,
  radius: 0,
  color: '#100C08',
  opacity: 1
};

// 获取1vh的像素值
function getVhValue(vh) {
  return (vh / 100) * window.innerHeight;
}

// 调整画布分辨率
function adjustCanvasResolution() {
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;

  ctx.scale(dpr, dpr);

  // 更新小球半径
  ball.radius = getVhValue(1);
}

// 更新小球位置
function updateBallPosition(x, y) {
  ball.x = x;
  ball.y = y;
}

// 绘制小球
function drawBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制鼠标或第一个触摸点的小球
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.globalAlpha = ball.opacity;
  ctx.fill();
  ctx.closePath();

  // 绘制其他触摸点的小球
  touchPoints.forEach(({ x, y }) => {
    ctx.beginPath();
    ctx.arc(x, y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.globalAlpha = ball.opacity * 0.7; // 较低透明度
    ctx.fill();
    ctx.closePath();
  });
}

// 动画循环
function animate() {
  drawBall();
  requestAnimationFrame(animate);
}

// 鼠标移动事件监听
window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  updateBallPosition(mouseX, mouseY);
});

// 触摸事件监听
canvas.addEventListener('touchstart', (event) => {
  touchPoints.length = 0; // 清除之前的触摸点
  for (let touch of event.touches) {
    touchPoints.push({ x: touch.clientX, y: touch.clientY });
  }
  if (touchPoints.length > 0) {
    updateBallPosition(touchPoints[0].x, touchPoints[0].y);
  }
});

canvas.addEventListener('touchmove', (event) => {
  touchPoints.length = 0;
  for (let touch of event.touches) {
    touchPoints.push({ x: touch.clientX, y: touch.clientY });
  }
  if (touchPoints.length > 0) {
    updateBallPosition(touchPoints[0].x, touchPoints[0].y);
  }
});

canvas.addEventListener('touchend', (event) => {
  touchPoints.length = 0;
  for (let touch of event.touches) {
    touchPoints.push({ x: touch.clientX, y: touch.clientY });
  }
  if (touchPoints.length > 0) {
    updateBallPosition(touchPoints[0].x, touchPoints[0].y);
  }
});

// 窗口大小变化事件监听
window.addEventListener('resize', () => {
  adjustCanvasResolution();
});

// 为Nav_Button添加鼠标悬停效果
const navButton = document.getElementById('Nav_Button');
navButton.addEventListener('mouseenter', () => {
  ball.color = '#FFFFFF';
});
navButton.addEventListener('mouseleave', () => {
  ball.color = '#100C08';
});

// 初始化
adjustCanvasResolution();
animate();
