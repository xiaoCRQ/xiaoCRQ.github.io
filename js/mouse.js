// 检测是否为移动设备
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(navigator.userAgent);
}

// 如果是移动设备，不执行后续代码
if (!isMobileDevice()) {
  // 获取canvas元素
  const canvas = document.getElementById('Mouse');
  const ctx = canvas.getContext('2d');

  // 设置初始鼠标位置
  let mouseX = 0;
  let mouseY = 0;

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
  function updateBallPosition() {
    ball.x = mouseX;
    ball.y = mouseY;
  }

  // 绘制小球
  function drawBall() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.globalAlpha = ball.opacity;
    ctx.fill();
    ctx.closePath();
  }

  // 动画循环
  function animate() {
    updateBallPosition();
    drawBall();
    requestAnimationFrame(animate);
  }

  // 鼠标移动事件监听
  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    // 直接更新和绘制，以降低延迟
    updateBallPosition();
    drawBall();
  });

  // 窗口大小变化事件监听
  window.addEventListener('resize', () => {
    adjustCanvasResolution();
    updateBallPosition();
    drawBall();
  });

  // 为Nav_Button添加鼠标悬停效果
  const navButton = document.getElementById('Nav_Button');
  navButton.addEventListener('mouseenter', () => {
    ball.color = '#FFFFFF';
    drawBall(); // 立即重绘以更新颜色
  });
  navButton.addEventListener('mouseleave', () => {
    ball.color = '#100C08';
    drawBall(); // 立即重绘以更新颜色
  });

  // 初始化
  adjustCanvasResolution();
  animate();
}

