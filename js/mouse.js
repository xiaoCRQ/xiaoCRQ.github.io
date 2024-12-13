const Mouse = document.getElementById('Mouse');
const ctx = Mouse.getContext('2d');

Mouse.width = window.innerWidth;
Mouse.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;

// 初始鼠标位置
window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// 获取 1vh 对应的像素值
function getVhValue(vh) {
  return (vh / 100) * window.innerHeight;
}

// 创建一个小球对象
const ball = {
  x: mouseX,
  y: mouseY,
  radius: getVhValue(1), // 初始半径，转换 1vh 为像素值
  color: '#100C08', // 初始颜色
  opacity: 1, // 确保透明度为 1
};

// 更新小球的位置和动画
function updateBall() {
  ball.x += (mouseX - ball.x) * 0.1;
  ball.y += (mouseY - ball.y) * 0.1;
}

// 绘制小球
function drawBall() {
  ctx.clearRect(0, 0, Mouse.width, Mouse.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.globalAlpha = ball.opacity;
  ctx.fill();
  ctx.closePath();
}

// 动画循环
function animate() {
  updateBall();
  drawBall();
  requestAnimationFrame(animate);
}

// 修改小球颜色的函数
function setMouseColor(color) {
  ball.color = color;
}

// 各个元素的悬停变化
const Nav = document.getElementById('Nav_Button');
Nav.addEventListener('mouseenter', () => {
  setMouseColor('#FFFFFF');
});
Nav.addEventListener('mouseleave', () => {
  setMouseColor('#100C08');
});

function adjustCanvasResolution(canvas, context) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.scale(dpr, dpr);
}

// 监听窗口大小变化时，重新设置画布尺寸和小球位置
window.addEventListener('resize', () => {
  adjustCanvasResolution(Mouse, ctx);
  ball.radius = getVhValue(1); // 动态更新小球的半径
});


adjustCanvasResolution(Mouse, ctx); // 初始调整分辨率
animate();// 启动动画

// const observer = new MutationObserver(() => {
//   const Main = document.getElementById('Page');
//   if (Main) {
//     // 如果元素存在，则绑定事件监听器
//     Main.addEventListener('mouseenter', () => {
//       setMouseColor('#100C08');
//     });
//     Main.addEventListener('mouseleave', () => {
//       setMouseColor('#FFFFFF');
//     });
//   }
// });
//
// // 配置观察器
// observer.observe(document.body, { childList: true, subtree: true });
