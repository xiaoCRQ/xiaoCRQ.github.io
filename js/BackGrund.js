const CanvasBackGrund = document.getElementById('backgroundCanvas');
const CtxBackGrund = CanvasBackGrund.getContext('2d');

// 设置画布大小为窗口大小
function resizeCanvasBackGrund() {
  CanvasBackGrund.width = window.innerWidth + 20;
  CanvasBackGrund.height = window.innerHeight;
}

resizeCanvasBackGrund();

// 小球参数
const ballRadius = 0.1; // 小球基础半径，单位vh
const maxRadiusIncrement = 0.15; // 最大半径增量，单位vh
const baseSpacing = 5; // 基础间隔，单位vh
const mouseRadiusEffect = 80; // 鼠标影响范围（单位像素）
const mouseExtraRadius = 0.15; // 鼠标附近小球放大效果的增量（单位vh）

// 鼠标位置和画布偏移
let mouseX = CanvasBackGrund.width / 2; // 鼠标位置x
let mouseY = CanvasBackGrund.height / 2; // 鼠标位置y
let offsetX = 0; // 画布x方向的晃动偏移
let offsetY = 0; // 画布y方向的晃动偏移

// 计算矩阵大小
let matrixWidth, matrixHeight;

function updateMatrixSize() {
  matrixWidth = Math.ceil(CanvasBackGrund.width / vhToPx(baseSpacing)) + 1;
  matrixHeight = Math.ceil(CanvasBackGrund.height / vhToPx(baseSpacing)) + 1;
}

updateMatrixSize();

// 动画参数
let xOffset = 0;
const speed = 0; // 每帧移动的vh单位数


// 绘制小球
function drawBall(x, y, isMouseEffect) {
  // 计算距离最近边界的距离（仅 x 轴）
  const distanceToXEdge = Math.min(x, CanvasBackGrund.width - x);

  // x 轴影响范围设定为 25% 的画布宽度
  const maxXDistance = CanvasBackGrund.width * 0.25;

  // 计算 x 轴上的半径增量
  const xRadiusIncrement = (1 - distanceToXEdge / maxXDistance) * vhToPx(maxRadiusIncrement);

  // 鼠标距离计算
  const distanceToMouse = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
  const mouseEffectIncrement = distanceToMouse < mouseRadiusEffect
    ? vhToPx(mouseExtraRadius) * (1 - distanceToMouse / mouseRadiusEffect)
    : 0;

  // 最终半径，结合边界和鼠标的增量
  const radius = vhToPx(ballRadius) + Math.max(0, xRadiusIncrement) + mouseEffectIncrement;

  CtxBackGrund.beginPath();
  CtxBackGrund.arc(x, y, radius, 0, Math.PI * 2);
  CtxBackGrund.fillStyle = isMouseEffect ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255,255,255,0.25)'; // 鼠标影响区域加点透明效果
  CtxBackGrund.fill();
}

// 绘制矩阵
function drawMatrix() {
  CtxBackGrund.clearRect(0, 0, CanvasBackGrund.width, CanvasBackGrund.height);

  for (let row = 0; row < matrixHeight; row++) {
    for (let col = 0; col < matrixWidth; col++) {
      const baseX = col * vhToPx(baseSpacing) + offsetX; // 添加画布晃动偏移
      const baseY = row * vhToPx(baseSpacing) + offsetY; // 添加画布晃动偏移

      const x = (baseX - xOffset + CanvasBackGrund.width) % CanvasBackGrund.width;
      const y = baseY;

      drawBall(x, y, Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2) < mouseRadiusEffect);
    }
  }

  xOffset += vhToPx(speed);
  if (xOffset >= vhToPx(baseSpacing)) {
    xOffset = 0;
  }

  requestAnimationFrame(drawMatrix);
}

// 鼠标移动事件监听
window.addEventListener('mousemove', (event) => {

  if (isMobileDevice()) return;

  const maxOffset = 50; // 最大偏移量
  mouseX = event.clientX;
  mouseY = event.clientY;

  // 根据鼠标位置调整画布整体偏移
  offsetX = ((mouseX / CanvasBackGrund.width) - 0.5) * maxOffset;
  offsetY = ((mouseY / CanvasBackGrund.height) - 0.5) * maxOffset;
});

// 监听设备方向变化
window.addEventListener('deviceorientation', (event) => {
  const maxOffset = 50; // 最大偏移量

  // 设备的alpha, beta, gamma值（分别对应绕z, x, y轴的旋转角度）
  const alpha = event.alpha; // 绕z轴旋转
  const beta = event.beta;   // 绕x轴旋转
  const gamma = event.gamma; // 绕y轴旋转

  // 将设备的旋转角度映射到画布的偏移量
  // alpha (0-360°) 映射到 -maxOffset 到 +maxOffset
  offsetX = (gamma / 90) * maxOffset * 2; // gamma 值控制x轴偏移
  offsetY = (beta / 90) * maxOffset * 2;  // beta 值控制y轴偏移
});

// 开始动画
drawMatrix();

// 窗口大小改变时调整画布大小和矩阵
window.addEventListener('resize', () => {
  resizeCanvasBackGrund();
  updateMatrixSize();
});

// 监听页面缩放
window.addEventListener('zoom', () => {
  resizeCanvasBackGrund();
  updateMatrixSize();
});

// 监听设备方向变化（用于移动设备）
window.addEventListener('orientationchange', () => {
  resizeCanvasBackGrund();
  updateMatrixSize();
});

