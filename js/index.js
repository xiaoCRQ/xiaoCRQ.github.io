// 动画资源函数
async function animeResource(id, X, Y, Height, Width, Opacity) {
  const element = document.getElementById(id);
  if (!element) {
    console.error(`ID为 "${id}" 的元素不存在，无法应用动画。`);
    return;
  }

  // 设置初始变换
  const initialTransform = [];
  if (X && X[0]) initialTransform.push(`translateX(${X[0]})`);
  if (Y && Y[0]) initialTransform.push(`translateY(${Y[0]})`);
  element.style.transform = initialTransform.join(' ');

  // 设置初始尺寸
  if (Height && Height[0]) element.style.height = Height[0];
  if (Width && Width[0]) element.style.width = Width[0];

  // 返回动画 Promise
  return new Promise((resolve) => {
    anime({
      targets: element,
      translateX: X ? X[1] : undefined,
      translateY: Y ? Y[1] : undefined,
      height: Height ? Height[1] : undefined,
      width: Width ? Width[1] : undefined,
      opacity: Opacity,
      easing: 'spring(0.5, 80, 10, 5)',
      complete: resolve
    });
  });
}

// 清除内容函数
async function clearContent(id, useAnimation = true) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`ID为 "${id}" 的元素不存在，无法清除内容。`);
    return;
  }

  // 克隆元素并设置样式
  const clonedElement = element.cloneNode(true);
  const clonedId = `${id}_clone_${Date.now()}`;
  clonedElement.id = clonedId;
  Object.assign(clonedElement.style, {
    position: 'absolute',
    top: `${element.getBoundingClientRect().top}vh`,
    left: `${element.getBoundingClientRect().left}vw`,
    zIndex: '-1'
  });

  element.parentElement.appendChild(clonedElement);

  // 清空原始元素内容
  if (element.innerHTML !== '') {
    element.innerHTML = '';
  } else {
    console.info(`ID为 "${id}" 的元素已经是空的.`);
  }

  // 执行动画（如果启用）
  if (useAnimation) {
    animeResource(clonedId, ['0vh', '0vh'], ['0vh', '-100vh'], ['100vh', '100vh'], ['100%', '100%'], 0);
    element.style.transform = 'translateY(0)';
    new Promise(resolve => setTimeout(() => {
      clonedElement.remove();
      resolve();
    }, 300));
  }
}

// 加载内容函数
async function loadContent(id, path, useAnimation = true) {
  await clearContent(id, useAnimation);
  const element = document.getElementById(id);
  if (!element) {
    console.error(`ID为 "${id}" 的元素不存在，无法插入内容。`);
    return;
  }

  try {
    const response = await fetch(path);
    const data = await response.text();
    element.innerHTML = data;

    if (useAnimation) {
      await animeResource(id, ['0vh', '0vh'], ['100vh', '0vh'], ['100vh', '100vh'], ['10%', '100%'], 1);
    }
  } catch (error) {
    console.error('加载内容时出错:', error);
  }
}

// 加载并动画化 SVG
async function loadAndAnimateSVG(targetId) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  // 设置 SVG 路径动画
  anime({
    targets: '.anime_path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 250,
    delay: (el, i) => i * 150,
    direction: 'alternate',
    loop: false
  });

  // 设置整体缩放动画
  anime({
    targets: targetElement,
    scale: [0.85, 1],
    filter: ['blur(10px)', 'blur(0px)'], // 模糊到清晰
    easing: 'easeInOutSine',
    duration: 1250,
  });

  return new Promise(resolve => setTimeout(resolve, 800));
}

// 动画化导航按钮
function animateNav() {
  const Nav = document.getElementById('Nav_Button');
  if (!Nav) return;

  Nav.style.transform = 'translateY(100vh)';

  // 导航按钮进入动画
  anime({
    delay: 1250,
    targets: Nav,
    translateY: [-100, 0],
    easing: 'spring(0.5, 80, 10, 5)',
  });

  // 鼠标悬停效果
  Nav.addEventListener('mouseenter', () => {
    anime({
      targets: Nav,
      height: '3vw',
      width: '40vw',
      easing: 'spring(0.5, 80, 10, 5)',
    });
    Options_Function();
  });

  // 鼠标离开效果
  Nav.addEventListener('mouseleave', () => {
    clearContent('Nav_Button');
    anime({
      targets: Nav,
      width: '2.5vw',
      height: '2.5vw',
      easing: 'spring(0.5, 80, 10, 5)',
    });
  });
}

// 定义主要功能
async function Define_Function() {
  await loadContent('Main_Title', './svg/XiaoCRQwrite.svg', false);
  await loadAndAnimateSVG('XiaoCRQ');
}

// 选项功能
async function Options_Function() {
  await loadContent('Nav_Button', './html/Nav_Options.html', false);
  const options = ['Home', 'Blog', 'Github'];

  options.forEach(option => {
    const element = document.getElementById(option);
    if (element) {
      // 设置选项动画
      anime({
        targets: element,
        delay: 100,
        opacity: [0, 1],
        scale: [0.85, 1],
        easing: 'spring(0.5, 80, 10, 5)',
      });

      // 添加点击事件
      element.addEventListener('click', () => {
        loadContent('Main_Resource', `./html/${option}.html`);
      });
    }
  });
}

// 初始化应用
function initializeApp() {
  Define_Function();
  animateNav();
}

// 启动应用
initializeApp();


