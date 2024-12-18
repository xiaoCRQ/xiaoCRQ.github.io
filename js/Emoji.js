// 配置对象，用于自定义表情雨的行为
const config = {
  emojiList: ['😀', '😂', '🤣', '😍', '🥳', '😎', '🤔', '🤯', '👍', '🎉'],
  emojiCount: 25,
  emojiSize: 50,
  minSpeed: 0.5,
  maxSpeed: 2,
  // backgroundColor: 'rgba(255, 255, 255, 0.1)'  // 半透明背景
};

// 获取画布和上下文
const CanvasEmoji = document.getElementById('emojiCanvas');
const CtxEmoji = CanvasEmoji.getContext('2d');

// 调整画布大小以填满窗口
function resizeCanvasEmoji() {
  CanvasEmoji.width = window.innerWidth;
  CanvasEmoji.height = window.innerHeight;
}

// 创建表情对象
function createEmoji() {
  return {
    x: Math.random() * CanvasEmoji.width,
    y: -config.emojiSize,
    speed: config.minSpeed + Math.random() * (config.maxSpeed - config.minSpeed),
    emoji: config.emojiList[Math.floor(Math.random() * config.emojiList.length)]
  };
}

// 初始化表情数组
let emojis = Array.from({ length: config.emojiCount }, createEmoji);

// 绘制单个表情
function drawEmoji(emoji) {
  CtxEmoji.font = `${config.emojiSize}px Arial`;
  CtxEmoji.fillText(emoji.emoji, emoji.x, emoji.y);
}

// 更新表情位置
function updateEmojis() {
  emojis.forEach(emoji => {
    emoji.y += emoji.speed;
    if (emoji.y > CanvasEmoji.height) {
      Object.assign(emoji, createEmoji());
    }
  });
}

// 动画循环
function animate() {
  // 清除画布，使用半透明背景创造拖尾效果
  CtxEmoji.fillStyle = config.backgroundColor;
  CtxEmoji.fillRect(0, 0, CanvasEmoji.width, CanvasEmoji.height);

  // 更新和绘制所有表情
  updateEmojis();
  emojis.forEach(drawEmoji);

  // 继续动画循环
  requestAnimationFrame(animate);
}

// 初始化函数
function init() {
  resizeCanvasEmoji();
  animate();
}

// 监听窗口大小变化
window.addEventListener('resize', resizeCanvasEmoji);

init();
