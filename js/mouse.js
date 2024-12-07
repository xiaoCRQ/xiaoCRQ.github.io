const Mouse = document.getElementById('Mouse');
const ctx = Mouse.getContext('2d');

Mouse.width = window.innerWidth;
Mouse.height = window.innerHeight;

let mouseX = Mouse.width / 2;
let mouseY = Mouse.height / 2;

// 创建一个小球对象
const ball = {
  x: mouseX,
  y: mouseY,
  radius: 10,
  color: '#FFFFFF', // 初始颜色为白色
};

// 更新小球的位置
function updateBall() {
  ball.x += (mouseX - ball.x) * 0.1; // 平滑跟随鼠标
  ball.y += (mouseY - ball.y) * 0.1; // 平滑跟随鼠标
}

// 绘制小球
function drawBall() {
  ctx.clearRect(0, 0, Mouse.width, Mouse.height); // 清除画布
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color; // 使用小球的颜色属性
  ctx.fill();
  ctx.closePath();
}

// 动画循环
function animate() {
  updateBall();
  drawBall();
  requestAnimationFrame(animate);
}

// 鼠标移动事件
document.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

// 启动动画的延迟执行
setTimeout(() => {
  animate(); // 延迟1秒后启动动画
}, 1250);

// 修改小球颜色的函数
function setMouseColor(color) {
  ball.color = color; // 更新小球的颜色属性
}

// 各个元素的悬停变化
const navMain = document.getElementById('Nav_Main');
// 鼠标悬停时的动画
navMain.addEventListener('mouseenter', () => {
  // 修改小球颜色的函数
  setMouseColor('#100C08')
});
navMain.addEventListener('mouseleave', () => {
  // 修改小球颜色的函数
  setMouseColor('#F5F5F5')
});

