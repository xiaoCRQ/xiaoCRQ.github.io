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
  return new Promise(resolve => setTimeout(resolve, 1250));
}


async function OpenDoor() {
  const Door = document.getElementById('Door');
  const Door_Up = document.getElementById('Door_Up');
  const Door_Down = document.getElementById('Door_Down');

  // 同时运行 Door_Up 和 Door_Down 的第一组动画
  await Promise.all([
    anime({
      duration: 750,
      targets: Door_Up,
      translateY: '-100vh',
      easing: 'easeInOutSine',
    }).finished, // 使用 anime 的 finished 返回 Promise
    anime({
      duration: 750,
      targets: Door_Down,
      translateY: '100vh',
      easing: 'easeInOutSine',
    }).finished,
  ]);

  // 修改 `#Door` 的对齐方式
  Door.style.flexDirection = 'row'; // 改为水平对齐
  Door.style.alignItems = 'center'; // 垂直居中
  Door.style.justifyContent = 'center'; // 水平居中
  Door.style.zIndex = '1';

  // 修改 `#Door_Up` 和 `#Door_Down` 的样式
  Door_Up.style.width = '50%';
  Door_Up.style.height = '100%';

  Door_Down.style.width = '50%';
  Door_Down.style.height = '100%';

  // 同时运行 Door_Up 和 Door_Down 的第二组动画
  await Promise.all([
    anime({
      duration: 375,
      targets: Door_Up,
      translateY: [100, 0],
      easing: 'easeInOutSine',
    }).finished,
    anime({
      duration: 375,
      targets: Door_Down,
      translateY: [-100, 0],
      easing: 'easeInOutSine',
    }).finished,
  ]);

  // 修改 Main_Title 和 XiaoCRQ 的样式
  const Main_Title = document.getElementById('Main_Title');
  const XiaoCRQ = document.getElementById('XiaoCRQ');
  XiaoCRQ.style.transform = 'translateY(-15vh)';
  Main_Title.style.width = '50vw';
  Main_Title.style.left = 'auto';
  Main_Title.style.right = '0';
  Main_Title.style.background = '#F5F5F5';

  // 执行其他操作
  updateAnimePathElements('#100C08');
  loadAndAnimateSVG('XiaoCRQ');
  setBackgroundImage('img/back.png');

  // 同时运行 Door_Up 和 Door_Down 的第三组动画
  await Promise.all([
    anime({
      duration: 375,
      targets: Door_Up,
      translateY: [0, -100],
      easing: 'easeInOutSine',
    }).finished,
    anime({
      duration: 375,
      targets: Door_Down,
      translateY: [0, 100],
      easing: 'easeInOutSine',
    }).finished,
  ]);

  return new Promise(resolve => setTimeout(resolve, 1250));
}


// 动画化导航按钮
function animateNav() {
  const Nav = document.getElementById('Nav_Button');
  if (!Nav) return;

  // 导航按钮进入动画
  anime({
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


function updateAnimePathElements(color) {
  const elements = document.querySelectorAll('.anime_path');
  elements.forEach(element => {
    element.style.stroke = color; // 设置 stroke 属性
  });
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

function setBackgroundImage(imageUrl) {
  const divElement = document.getElementById('Img_Back');

  if (!divElement) {
    console.error('无法找到 ID 为 "Img_Back" 的元素');
    return;
  }

  // 设置背景图片
  divElement.style.backgroundImage = `url('${imageUrl}')`;
  divElement.style.backgroundSize = 'cover'; // 根据需求调整背景图片的显示方式
  divElement.style.backgroundPosition = 'center'; // 居中显示
  divElement.style.backgroundRepeat = 'no-repeat'; // 防止图片重复
}


// 定义主要功能
async function Define_Function() {
  await loadContent('Main_Title', './svg/XiaoCRQwrite.svg', false);
  await loadAndAnimateSVG('XiaoCRQ');
  await OpenDoor()
  animateNav();
}


// 初始化应用
async function initializeApp() {
  Define_Function();
}

// 启动应用
initializeApp();
