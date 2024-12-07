// 动态替换指定元素内容为 SVG 文件
function loadAndAnimateSVG(targetId, svgPath) {
  // 获取目标元素
  const targetElement = document.getElementById(targetId);

  // 加载 SVG 文件内容
  fetch(svgPath)
    .then(response => {
      if (!response.ok) throw new Error('SVG 文件加载失败');
      return response.text();
    })
    .then(svgContent => {
      // 替换目标元素内容为加载的 SVG
      targetElement.innerHTML = svgContent;

      // 初始化 Anime.js 动画
      anime({
        targets: '.anime_path', // 动画目标集合
        strokeDashoffset: [anime.setDashoffset, 0], // 设置路径的描边偏移动画，从初始值(使用 anime.js 自动计算的偏移量)到 0
        easing: 'easeInOutSine', // 设置动画的缓动效果为 “正弦曲线缓动”
        duration: 275, // 单个动画的持续时间为 275 毫秒
        delay: (el, i) => { return i * 250 }, // 每个动画的延迟为索引值 `i` 乘以 250 毫秒
        direction: 'alternate', // 动画方向为交替(动画完成后反向播放)
        autoplay: true, // 自动播放
        loop: true // 动画循环播放
      });
    })
    .catch(error => console.error(error));
}

// 调用函数，替换 ID 为 XiaoCRQ 的元素内容为指定 SVG，并动画显示
loadAndAnimateSVG('XiaoCRQ', 'svg/xiaoCRQwrite.svg');
