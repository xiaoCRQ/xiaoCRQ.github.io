/**
 * 等待指定资源加载完成，支持 CSS、JS、图片和 HTML 页面资源。
 * @param {string} resourceUrl - 资源的 URL 路径
 * @param {number} timeout - 等待超时时间（毫秒），默认为 10,000ms
 * @returns {Promise<void>} - 成功时解析，失败时拒绝
 */
async function waitForResource(resourceUrl, timeout = 10000) {
  // 先检查资源是否已加载或已缓存
  if (isResourceLoaded(resourceUrl)) {
    console.log(`资源已加载或已缓存: ${resourceUrl}`);
    return;
  }

  if (resourceUrl.endsWith('.css') || resourceUrl.endsWith('.js')) {
    return waitForResourceUsingTag(resourceUrl, timeout); // 加载 CSS/JS
  } else if (resourceUrl.endsWith('.svg') || resourceUrl.endsWith('.png') || resourceUrl.endsWith('.jpg') || resourceUrl.endsWith('.jpeg')) {
    return waitForImage(resourceUrl, timeout); // 加载图片
  } else if (resourceUrl.endsWith('.html')) {
    return waitForHTMLPage(resourceUrl, timeout); // 加载 HTML 页面
  } else {
    throw new Error(`未知的资源类型: ${resourceUrl}`);
  }
}

/**
 * 检查资源是否已经加载或已缓存
 * @param {string} resourceUrl - 资源的 URL 路径
 * @returns {boolean} - 如果资源已加载或缓存返回 true，否则返回 false
 */
function isResourceLoaded(resourceUrl) {
  // 检查 CSS 文件是否已加载
  const isCSS = resourceUrl.endsWith('.css');
  if (isCSS) {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    return Array.from(links).some(link => link.href === resourceUrl);
  }

  // 检查 JS 文件是否已加载
  const isJS = resourceUrl.endsWith('.js');
  if (isJS) {
    const scripts = document.querySelectorAll('script');
    return Array.from(scripts).some(script => script.src === resourceUrl);
  }

  // 检查图片和 SVG 是否已经加载或存在于 DOM 中
  const isImage = resourceUrl.endsWith('.svg') || resourceUrl.endsWith('.png') || resourceUrl.endsWith('.jpg') || resourceUrl.endsWith('.jpeg');
  if (isImage) {
    const images = document.querySelectorAll('img');
    return Array.from(images).some(img => img.src === resourceUrl);
  }

  // 检查 HTML 页面资源是否已加载
  const isHTML = resourceUrl.endsWith('.html');
  if (isHTML) {
    return document.readyState === 'complete';
  }

  return false; // 默认返回 false，表示没有加载
}

/**
 * 使用 <script> 或 <link> 标签检测资源加载（适用于 CSS 和 JS）。
 * @param {string} resourceUrl - 资源的 URL 路径
 * @param {number} timeout - 等待超时时间（毫秒）
 * @returns {Promise<void>} - 成功时解析，失败时拒绝
 */
function waitForResourceUsingTag(resourceUrl, timeout) {
  return new Promise((resolve, reject) => {
    const isCSS = resourceUrl.endsWith('.css');
    const isJS = resourceUrl.endsWith('.js');

    // 根据资源类型创建对应的标签
    let element;
    if (isCSS) {
      element = document.createElement('link');
      element.rel = 'stylesheet';
      element.href = resourceUrl;
    } else if (isJS) {
      element = document.createElement('script');
      element.src = resourceUrl;
    }

    if (!element) {
      reject(new Error(`不支持的资源类型: ${resourceUrl}`));
      return;
    }

    // 设置加载成功和失败的回调
    element.onload = () => {
      console.log(`资源已加载: ${resourceUrl}`);
      resolve();
    };
    element.onerror = () => {
      reject(new Error(`资源加载失败: ${resourceUrl}`));
    };

    // 将标签添加到 <head> 中以开始加载
    document.head.appendChild(element);

    // 设置超时处理
    setTimeout(() => {
      reject(new Error(`资源 ${resourceUrl} 加载超时`));
    }, timeout);
  });
}

/**
 * 使用 Image 对象检测图片资源加载（适用于 PNG、JPEG、SVG 等）。
 * @param {string} resourceUrl - 图片资源的 URL 路径
 * @param {number} timeout - 等待超时时间（毫秒）
 * @returns {Promise<void>} - 成功时解析，失败时拒绝
 */
function waitForImage(resourceUrl, timeout) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = resourceUrl;

    // 设置加载成功和失败的回调
    img.onload = () => {
      console.log(`图片加载成功: ${resourceUrl}`);
      resolve();
    };
    img.onerror = () => {
      reject(new Error(`图片加载失败: ${resourceUrl}`));
    };

    // 设置超时处理
    setTimeout(() => {
      reject(new Error(`图片 ${resourceUrl} 加载超时`));
    }, timeout);
  });
}

/**
 * 等待 HTML 页面加载完成。
 * @param {string} resourceUrl - HTML 资源的 URL 路径
 * @param {number} timeout - 等待超时时间（毫秒）
 * @returns {Promise<void>} - 成功时解析，失败时拒绝
 */
function waitForHTMLPage(resourceUrl, timeout) {
  return new Promise((resolve, reject) => {
    // 如果页面已经加载完成，则直接解析
    if (document.readyState === 'complete') {
      console.log(`HTML 页面已加载: ${resourceUrl}`);
      resolve();
    } else {
      // 设置 window.onload 事件回调
      window.addEventListener('load', () => {
        console.log(`HTML 页面已加载: ${resourceUrl}`);
        resolve();
      });

      // 设置超时处理
      setTimeout(() => {
        // 如果页面在指定时间内没有加载完成，拒绝 Promise
        if (document.readyState !== 'complete') {
          reject(new Error(`HTML 页面加载超时: ${resourceUrl}`));
        }
      }, timeout);
    }
  });
}
// -------------------------------------------------------------------------------------------

/**
 * 判断访问IP是否来自中国，只有中国IP时才转接到指定地址
 * @param {string} targetUrl - 转接地址，只有当IP为中国时才会进行转接
 */
async function checkIPAndRedirect(targetUrl) {
  try {
    // 获取用户的 IP 地址和位置信息
    const response = await fetch('https://ip-api.com/json');
    const data = await response.json();

    // 输出 IP 信息，供调试使用
    console.log('IP 信息:', data);

    // 判断是否为中国IP
    if (data.country === 'China') {
      // 如果是中国IP，重定向到目标地址
      console.log(`访问来自中国，重定向到 ${targetUrl}`);
      window.location.href = targetUrl;
    } else {
      // 如果不是中国IP，正常访问
      console.log('访问不来自中国，继续访问原网站');
    }
  } catch (error) {
    console.error('获取IP信息失败:', error);
  }
}

// -------------------------------------------------------------------------------------------

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

async function loadAndAnimateSVG(targetId) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  // 设置 SVG 路径动画，加载期间处于 loop: true 状态
  const pathAnimation = anime({
    targets: '.anime_path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 180,
    delay: (el, i) => i * 150,
    direction: 'alternate',
    loop: true // 加载期间 loop 为 true
  });

  // 设置整体缩放动画
  const scaleAnimation = anime({
    targets: targetElement,
    scale: [0.85, 1],
    filter: ['blur(10px)', 'blur(0px)'], // 模糊到清晰
    easing: 'easeInOutSine',
    duration: 1250,
  });

  // 等待所有资源加载完成
  // 使用 Promise.all 等待资源加载完成
  await Promise.all(resources.map(resource => waitForResource(resource)));
  console.log('所有资源加载成功');

  // 停止路径动画的 loop，使用 pause() 来暂停动画
  pathAnimation.pause();
  pathAnimation.loop = false;

  anime({
    targets: '.anime_path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 180,
    delay: (el, i) => i * 150,
    direction: 'alternate',
    loop: false
  });

  // 等待动画完成
  await new Promise(resolve => setTimeout(resolve, 1250));

  // 返回完成的结果
  return;
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


// 初始化应用
async function initializeApp() {
  await checkIPAndRedirect()
  await loadContent('Main_Title', './svg/XiaoCRQwrite.svg', false);
  await loadAndAnimateSVG('XiaoCRQ');
  await OpenDoor()
  animateNav();
}

const resources = [
  'img/back.png',
  'html/Blog.html',
  'html/Home.html',
  'html/Github.html',
  'html/Nav_Options.html',
];

// 启动应用
initializeApp();
