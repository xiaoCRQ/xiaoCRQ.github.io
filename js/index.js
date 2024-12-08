async function AnimeResource(id, X, Y, Height, Width, Opacity) {
  // 获取目标元素
  const element = document.getElementById(id);
  if (!element) {
    console.error(`ID为 "${id}" 的元素不存在，无法应用动画。`);
    return;
  }

  // 设置初始值（如果提供）
  if (X && Array.isArray(X) && X[0] !== undefined) {
    element.style.transform = `translateX(${X[0]})`;
  }
  if (Y && Array.isArray(Y) && Y[0] !== undefined) {
    element.style.transform += ` translateY(${Y[0]})`;
  }
  if (Height && Array.isArray(Height) && Height[0]) {
    element.style.height = Height[0];
  }
  if (Width && Array.isArray(Width) && Width[0]) {
    element.style.width = Width[0];
  }

  // 返回一个 Promise，等待动画完成
  return new Promise((resolve) => {
    anime({
      targets: element,
      translateX: X ? X[1] : null,         // 动画到的目标 X
      translateY: Y ? Y[1] : null,         // 动画到的目标 Y
      height: Height ? Height[1] : null,   // 动画到的目标高度
      width: Width ? Width[1] : null,      // 动画到的目标宽度
      opacity: Opacity, // 透明
      easing: 'spring(0.5, 80, 10, 5)',    // 弹簧缓解
      complete: () => {
        resolve();                         // 动画完成后触发 Promise 的 resolve
      }
    });
  });
}


async function clearContent(id, useAnimation = true) {
  const element = document.getElementById(id);

  // 如果目标元素不存在，退出函数
  if (!element) {
    console.warn(`ID为 "${id}" 的元素不存在，无法清除内容。`);
    return;
  }

  // 克隆目标元素
  const clonedElement = element.cloneNode(true);

  // 为克隆元素生成一个新的唯一ID
  const clonedId = `${id}_clone_${Date.now()}`; // 使用时间戳生成唯一的ID
  clonedElement.id = clonedId; // 设置克隆元素的ID为唯一值

  // 设置克隆元素的样式使其脱离文档流
  clonedElement.style.position = 'absolute'; // 使用绝对定位
  clonedElement.style.top = `${element.getBoundingClientRect().top}vh`; // 保持位置
  clonedElement.style.left = `${element.getBoundingClientRect().left}vw`; // 保持位置
  clonedElement.style.zIndex = -1;

  // 将克隆的元素插入到目标元素的位置
  element.parentElement.appendChild(clonedElement);

  // 清空原始元素的内容
  if (element.innerHTML === '') {
    console.info(`ID为 "${id}" 的元素已经是空的.`);
  } else {
    element.innerHTML = ''; // 清空内容
  }

  // 如果启用了动画，则执行向上清除的动画
  if (useAnimation) {
    await AnimeResource(clonedId, ['0vh', '0vh'], ['0vh', '-100vh'], ['100vh', '100vh'], ['100%', '100%'], [1, 0]); // 向上滑出
  }

  // 如果启用了动画，复位位置
  if (useAnimation) {
    element.style.transform = 'translateY(0)';
  }

  // 在动画完成后，将克隆的元素移除
  if (useAnimation) {
    await new Promise(resolve => setTimeout(() => {
      clonedElement.remove(); // 移除克隆元素
      resolve();
    }, 300)); // 等待动画时间，300ms 与动画时长保持一致
  }
}

async function loadContent(id, path, useAnimation = true) {
  // 清空目标内容（包括动画）
  clearContent(id, useAnimation);
  const element = document.getElementById(id);

  // 如果目标元素不存在，退出函数
  if (!element) {
    console.error(`ID为 "${id}" 的元素不存在，无法插入内容。`);
    return;
  }

  try {
    const response = await fetch(path); // 使用 await 等待 fetch 完成
    const data = await response.text(); // 获取文本数据

    // 插入内容
    element.innerHTML = data;

    // 如果启用了动画，则执行从下至上的出现动画
    if (useAnimation) {
      await AnimeResource(id, ['0vh', '0vh'], ['100vh', '0vh'], ['100vh', '100vh'], ['10%', '100%'], [0, 1]); // 从下方滑入
    }
  } catch (error) {
    console.error('加载内容时出错:', error); // 错误处理
  }
}

// 动态替换指定元素内容为 SVG 文件
async function loadAndAnimateSVG(targetId) {
  // 获取目标元素
  const targetElement = document.getElementById(targetId);

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

  // 添加消失效果
  // anime({
  //   delay: 1250,
  //   targets: targetElement,
  //   filter: ['blur(0vh)', 'blur(2vh)'], // 从模糊到清晰
  //   opacity: [1, 0], // 从不透明到透明
  //   easing: 'easeInOutSine', // 设置缓动效果
  //   duration: 350, // 持续时间为
  // });
  return new Promise(resolve => setTimeout(resolve, 800));
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

// 函数调用

async function Define_Function() {
  await loadContent('Main_Title', './svg/XiaoCRQwrite.svg', false)
  await loadAndAnimateSVG('XiaoCRQ')
}

async function Options_Function() {
  const Me = document.getElementById('Me');
  const Blog = document.getElementById('Blog');
  const Github = document.getElementById('Github');
  Me.addEventListener('click', () => {
    loadContent('Main_Resource', './html/Me.html')
  });
  Blog.addEventListener('click', () => {
    loadContent('Main_Resource', './html/Blog.html')
  });
  Github.addEventListener('click', () => {
    loadContent('Main_Resource', './html/Github.html')
  });
}


Define_Function()
Options_Function()
animateNavMain()
