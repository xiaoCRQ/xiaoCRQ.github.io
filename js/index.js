function loadContent(id, path) { //
  // 使用fetch API获取指定路径的内容
  fetch(path)
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应有问题');
      }
      return response.text(); // 解析为文本
    })
    .then(data => {
      // 将获取的内容插入到指定id的元素中
      document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
      console.error('获取内容时出错:', error);
    });
}

function clearContent(id) {
  // 获取指定id的元素
  const element = document.getElementById(id);

  // 检查元素是否存在
  if (element) {
    // 清空元素的内容
    element.innerHTML = '';
  } else {
    console.warn(`ID为 "${id}" 的元素不存在.`);
  }
}

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
        duration: 250, // 单个动画的持续时间为 275 毫秒
        delay: (el, i) => { return i * 150 }, // 每个动画的延迟为索引值 `i` 乘以 250 毫秒
        direction: 'alternate', // 动画方向为交替(动画完成后反向播放)
        autoplay: true, // 自动播放
        loop: false // 动画循环播放
      });

      // 添加进入时放大的效果
      anime({
        targets: targetElement,
        scale: [0.85, 1], // 从 0.85 放大到 1
        easing: 'easeInOutSine', // 设置缓动效果
        duration: 1250, // 持续时间为
      });

      // // 添加消失效果
      // anime({
      //   delay: 1250,
      //   targets: targetElement,
      //   filter: ['blur(0vh)', 'blur(2vh)'], // 从模糊到清晰
      //   opacity: [1, 0], // 从不透明到透明
      //   easing: 'easeInOutSine', // 设置缓动效果
      //   duration: 350, // 持续时间为
      // });
    })
    .catch(error => console.error(error));
}

// 动画下方导航窗口栏的函数
function animateNavMain() {
  const navMain = document.getElementById('Nav_Main');
  const nav_Line_1 = document.getElementById('Nav_Line_1');

  // 初始状态
  navMain.style.transform = 'translateY(100vh)'; // 从视口下方开始

  // 使用 anime.js 创建进入动画
  anime({
    delay: 1250,// 延迟
    targets: navMain,
    translateY: [0, -4], // 从下方移动到目标位置
    easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    duration: 275, // 动画持续时间（毫秒）
  });

  // 鼠标悬停时的动画
  navMain.addEventListener('mouseenter', () => {
    anime({
      targets: navMain,
      width: '40vw',
      translateY: '-6vh',
      easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    });
    anime({
      targets: nav_Line_1,
      opacity: [0.35, 0],
      easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    });
  });

  navMain.addEventListener('mouseleave', () => {
    anime({
      targets: navMain,
      width: '35vw',
      translateY: '-4vh',
      easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    });

    anime({
      targets: nav_Line_1,
      opacity: [0, 0.35],
      easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    });
  });

  // 鼠标点击时的动画
  navMain.addEventListener('click', () => {
    anime({
      targets: navMain,
      width: '85vw',
      translateY: '-95vh',
      easing: 'spring(0.5, 80, 10, 5)', // 弹簧缓解
    });
  });
}


// 调用函数，替换 ID 为 XiaoCRQ 的元素内容为指定 SVG，并动画显示
loadAndAnimateSVG('XiaoCRQ', './svg/XiaoCRQwrite.svg');
animateNavMain();
