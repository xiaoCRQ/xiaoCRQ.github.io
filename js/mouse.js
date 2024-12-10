const Mouse = document.getElementById('Mouse');
const ctx = Mouse.getContext('2d');

Mouse.width = window.innerWidth;
Mouse.height = window.innerHeight;

let mouseX = window.innerWidth * 0.5;
let mouseY = window.innerHeight * 0.04;

// 记录是否是第一次移动
let isFirstMove = true;

// 创建一个小球对象
const ball = {
  x: mouseX,
  y: mouseY,
  radius: 5, // 初始半径
  maxRadius: 10, // 最大半径
  opacity: 0, // 初始透明度
  color: '#F5F5F5', // 初始颜色
};

// 更新小球的位置和动画
function updateBall() {
  // 平滑跟随鼠标
  ball.x += (mouseX - ball.x) * 0.1;
  ball.y += (mouseY - ball.y) * 0.1;

  // 小球渐变动画：渐显且从小到大
  if (ball.radius < ball.maxRadius) {
    ball.radius += 0.5; // 小球半径逐渐增大
  }
  if (ball.opacity < 1) {
    ball.opacity += 0.01; // 小球透明度逐渐增加
  }
}

// 绘制小球
function drawBall() {
  ctx.clearRect(0, 0, Mouse.width, Mouse.height); // 清除画布
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color; // 使用小球的颜色属性
  ctx.globalAlpha = ball.opacity; // 设置透明度
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

  // 如果是第一次移动，改变小球颜色
  if (isFirstMove) {
    setMouseColor('#100C08');
    isFirstMove = false; // 标记为已经移动过
  }
});

// 启动动画的延迟执行
setTimeout(() => {
  animate(); // 延迟1秒后启动动画
}, 4800);

// 修改小球颜色的函数
function setMouseColor(color) {
  ball.color = color; // 更新小球的颜色属性
}

// ---------------------------------------------
// 各个元素的悬停变化
const Nav = document.getElementById('Nav_Button');
// 鼠标悬停时的动画
Nav.addEventListener('mouseenter', () => {
  // 修改小球颜色的函数
  setMouseColor('#F5F5F5');
});
Nav.addEventListener('mouseleave', () => {
  // 修改小球颜色的函数
  setMouseColor('#100C08');
});

// 监听窗口大小变化时，重新设置画布尺寸和小球位置
window.addEventListener('resize', () => {
  Mouse.width = window.innerWidth;
  Mouse.height = window.innerHeight;

  // 重置小球的起始位置
  mouseX = Mouse.width / 2;
  mouseY = Mouse.height / 2;

  // 重置小球的动画状态
  ball.radius = 10; // 小球半径恢复初始值
  ball.opacity = 0; // 小球透明度恢复初始值
});

// const observer = new MutationObserver(() => {
//   const Main = document.getElementById('Page');
//   if (Main) {
//     // 如果元素存在，则绑定事件监听器
//     Main.addEventListener('mouseenter', () => {
//       setMouseColor('#100C08');
//     });
//     Main.addEventListener('mouseleave', () => {
//       setMouseColor('#F5F5F5');
//     });
//   }
// });
//
// // 配置观察器
// observer.observe(document.body, { childList: true, subtree: true });

