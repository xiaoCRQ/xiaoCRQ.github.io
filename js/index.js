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
// 动画资源函数
async function animeResource(id, X, Y, Height, Width, Opacity, Easing = 'spring(0.5, 80, 10, 5)', Duration = 250, Delay = 0) {
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
      easing: Easing,
      duration: Duration,
      delay: Delay,
      complete: resolve
    });
  });
}

// 清除元素
async function clearContent(id, useAnimation = true) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`ID为 "${id}" 的元素不存在，无法清除内容。`);
    return;
  }

  const AnimeContainer = document.getElementById('Anime');
  if (!AnimeContainer) {
    console.error('未找到 Anime 容器，无法完成动画。');
    return;
  }

  // 如果启用了动画，则克隆元素并设置样式
  let clonedElement;
  if (useAnimation) {
    clonedElement = element.cloneNode(true);
    const clonedId = `${id}_clone_${Date.now()}`;
    clonedElement.id = clonedId;
    Object.assign(clonedElement.style, {
      position: 'absolute',
      top: `${element.getBoundingClientRect().top + window.scrollY}px`, // 修正视口偏移
      left: `${element.getBoundingClientRect().left + window.scrollX}px`,
      width: `${element.offsetWidth}px`,
      height: `${element.offsetHeight}px`,
      zIndex: '1',
      pointerEvents: 'none', // 防止克隆元素干扰交互
    });

    // 将克隆元素添加到 Anime 容器中
    AnimeContainer.appendChild(clonedElement);
  }

  // 清空原始元素内容
  if (element.innerHTML !== '') {
    element.innerHTML = '';
  } else {
    console.info(`ID为 "${id}" 的元素已经是空的.`);
  }

  // 执行动画（如果启用）
  if (useAnimation && clonedElement) {
    animeResource(
      clonedElement.id, // 动画目标为克隆元素
      ['0vw', '0vw'], // 动画起始位置
      ['0vh', '-100vh'], // 动画结束位置
      [], // 高度
      [], // 宽度
      [1, 0], // 动画透明度
      'easeOutSine'
    );

    await new Promise(resolve => setTimeout(() => {
      clonedElement.remove(); // 动画结束后移除克隆元素
      resolve();
    }, 350));
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

    // 动态执行其中的 <script> 标签
    const scripts = element.getElementsByTagName('script');
    for (let script of scripts) {
      const newScript = document.createElement('script');
      newScript.text = script.textContent;
      document.body.appendChild(newScript);
      document.body.removeChild(newScript); // 执行完后移除
    }

    if (useAnimation) {
      animeResource(id, ['0vh'], ['100vh', '0vh'], ['100vh'], ['100%'], [0, 1], 'easeInSine');
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
    // scale: [0.85, 1],
    // filter: ['blur(10px)', 'blur(0px)'], // 模糊到清晰
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



async function Open() {
  // 获取 Anime 容器
  const AnimeContainer = document.getElementById('Anime');

  // 创建 Square_Up 和 Square_Down 元素
  const Square_Up = document.createElement('div');
  Square_Up.id = 'Square_Up';
  const Square_Down = document.createElement('div');
  Square_Down.id = 'Square_Down';

  Square_Up.style.height = Square_Down.style.height = '50%'
  Square_Up.style.width = Square_Down.style.width = '100%'
  Square_Up.style.backgroundColor = Square_Down.style.backgroundColor = '#100C08'

  // 将元素添加到 Anime 容器
  AnimeContainer.appendChild(Square_Up);
  AnimeContainer.appendChild(Square_Down);

  await loadAndAnimateSVG('XiaoCRQ');

  // 同时运行 Square_Up 和 Square_Down 的第一组动画
  await Promise.all([
    anime({
      duration: 750,
      targets: Square_Up,
      translateY: '-100vh',
      easing: 'easeInSine',
    }).finished,
    anime({
      duration: 750,
      targets: Square_Down,
      translateY: '100vh',
      easing: 'easeInSine',
    }).finished,
  ]);

  // 修改 Anime 容器的样式
  AnimeContainer.style.display = 'flex';
  AnimeContainer.style.flexDirection = 'row'; // 水平对齐
  AnimeContainer.style.alignItems = 'center'; // 垂直居中
  AnimeContainer.style.justifyContent = 'center'; // 水平居中
  AnimeContainer.style.zIndex = '1';

  // 修改 Square_Up 和 Square_Down 的样式
  Square_Up.style.width = '50%';
  Square_Up.style.height = '100%';

  Square_Down.style.width = '50%';
  Square_Down.style.height = '100%';

  // 同时运行 Square_Up 和 Square_Down 的第二组动画
  await Promise.all([
    anime({
      duration: 375,
      targets: Square_Up,
      translateY: [100, 0],
      easing: 'easeInSine',
    }).finished,
    anime({
      duration: 375,
      targets: Square_Down,
      translateY: [-100, 0],
      easing: 'easeInSine',
    }).finished,
  ]);

  await loadContent('Main_Title', 'html/Main_Title.html', false);

  // 同时运行 Square_Up 和 Square_Down 的第三组动画
  await Promise.all([
    anime({
      duration: 375,
      targets: Square_Up,
      translateY: [0, -100],
      easing: 'easeOutSine',
    }).finished,
    anime({
      duration: 375,
      targets: Square_Down,
      translateY: [0, 100],
      easing: 'easeOutSine',
    }).finished,
  ]);

  // 删除 Square_Up 和 Square_Down 元素
  AnimeContainer.removeChild(Square_Up);
  AnimeContainer.removeChild(Square_Down);

  return new Promise(resolve => setTimeout(resolve, 350));
}

// 选项功能
async function Options_Function() {
  await loadContent('Nav_Main_Options', './html/Nav_Options.html', false);
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
        // 特殊事件
        if (option === 'Home') {
          anime({
            targets: document.getElementById('Main_Title'), // 获取 Main_Title 元素
            easing: 'easeOutSine',
            filter: 'blur(0vh)',
            duration: 250,
          })
        }
        else {
          anime({
            targets: document.getElementById('Main_Title'), // 获取 Main_Title 元素
            easing: 'easeInSine',
            filter: 'blur(2vh)',
            duration: 250,
            delay: 350,
          })
        }
        loadContent('Main_Resource', `./html/${option}.html`);
      });
    }
  });
}

// 动画化导航按钮
function animateNav() {
  let isExpanded = false; // 追踪当前状态（是否展开）
  const Nav = document.getElementById('Nav_Button');
  const Nav_Line = document.getElementById('Nav_Line')
  const Nav_Line_1 = document.getElementById('Nav_Line_1')
  const Nav_Line_2 = document.getElementById('Nav_Line_2')

  if (!Nav) return;

  // 导航按钮进入动画
  anime({
    targets: Nav,
    translateY: [-100, 0],
    easing: 'spring(0.5, 80, 10, 5)',
  });

  // 鼠标点击效果
  Nav_Line.addEventListener('click', () => {
    if (!isExpanded) {
      // 展开动画
      anime({
        targets: Nav,
        width: '35vh',
        easing: 'spring(0.5, 80, 10, 5)',
      });
      anime({
        targets: Nav_Line_1,
        easing: 'spring(0.5, 80, 10, 5)',
        translateY: '0.645vh',
        rotate: 45, // 顺时针旋转 45 度
      });
      anime({
        targets: Nav_Line_2,
        easing: 'spring(0.5, 80, 10, 5)',
        translateY: '-0.645vh',
        rotate: -45, // 逆时针旋转 45 度
      });

      Options_Function();

      isExpanded = true; // 更新状态
    } else {
      // 收缩动画
      clearContent('Nav_Main_Options', false); // 清除内容
      anime({
        targets: Nav,
        width: '5vh',
        height: '5vh',
        easing: 'spring(0.5, 80, 10, 5)',
      });
      anime({
        targets: [Nav_Line_1, Nav_Line_2],
        easing: 'spring(0.5, 80, 10, 5)',
        translateY: '0vh',
        rotate: 0,
      });

      isExpanded = false; // 更新状态
    }
  });

  // 鼠标悬停效果
  Nav.addEventListener('mouseenter', () => {
    // anime({
    //   targets: Nav,
    //   width: '35vh',
    //   easing: 'spring(0.5, 80, 10, 5)',
    // });
    // anime({
    //   targets: Nav_Line_1,
    //   easing: 'spring(0.5, 80, 10, 5)',
    //   translateY: '0.645vh',
    //   rotate: 45, // 顺时针旋转 45 度
    // });
    // anime({
    //   targets: Nav_Line_2,
    //   easing: 'spring(0.5, 80, 10, 5)',
    //   translateY: '-0.645vh',
    //   rotate: -45, // 逆时针旋转 45 度
    // });
    //
    // Options_Function();
    //
    // isExpanded = true; // 更新状态  
  });

  // 鼠标离开效果
  Nav.addEventListener('mouseleave', () => {
    clearContent('Nav_Main_Options', false);
    anime({
      targets: Nav,
      width: '5vh',
      height: '5vh',
      easing: 'spring(0.5, 80, 10, 5)',
    });
    anime({
      targets: [Nav_Line_1, Nav_Line_2],
      easing: 'spring(0.5, 80, 10, 5)',
      translateY: '0vh',
      rotate: 0
    });
    isExpanded = false; // 更新状态
  });
}


function updateAnimePathElements(color) {
  const elements = document.querySelectorAll('.anime_path');
  elements.forEach(element => {
    element.style.stroke = color; // 设置 stroke 属性
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

  anime({
    targets: divElement,
    scale: 1.05,
    // filter: ['blur(2px)', 'blur(0px)'], // 模糊到清晰
    easing: 'easeInOutSine',
    duration: 1250,
  });

  // 鼠标悬停时的放大效果
  // divElement.addEventListener('mouseenter', function () {
  //   anime({
  //     targets: divElement,
  //     scale: 1.08,  
  //     easing: 'easeInOutSine',
  //     duration: 1250  // 动画持续时间
  //   });
  // });
  //
  //  鼠标移开时恢复原状
  // divElement.addEventListener('mouseleave', function () {
  //   anime({
  //     targets: divElement,
  //     scale: 1.05,  // 恢复至原来的大小
  //     easing: 'easeInOutSine',
  //     duration: 1250  // 动画持续时间
  //   });
  // });
}

// ----------------------------------------
// 渲染markdown

/**
 * Function to render Markdown content into an element with a specific id.
 * @param {string} id - The id of the HTML element to render the content into.
 * @param {string} path - The path to the Markdown file.
 */
async function renderMarkdownById(id, path) {
  try {
    // Fetch the Markdown file from the provided path
    const response = await fetch(path);

    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }

    // Get the markdown content as text
    const markdownContent = await response.text();

    // Get the element by id
    const element = document.getElementById(id);
    if (element) {
      // Render the markdown content using marked.parse() (not marked())
      element.innerHTML = marked.parse(markdownContent);
    } else {
      console.error(`Element with id '${id}' not found.`);
    }
  } catch (error) {
    console.error('Error rendering markdown:', error);
    const element = document.getElementById(id);
    if (element) {
      element.textContent = 'Failed to load content.';
    }
  }
}

// ----------------------------------------
// 文字动画

// 划过背景出现
function animateElement(id) {
  const element = document.getElementById(id);

  if (!element) {
    console.error(`元素 ${id} 未找到`);
    return;
  }

  // 保存原有的CSS属性
  const originalStyles = {
    color: element.style.color,
    background: element.style.background,
    backgroundSize: element.style.backgroundSize,
    backgroundPosition: element.style.backgroundPosition,
    // 可以根据需要添加更多的属性
  };

  // 添加黑色背景并从右到左划过
  element.style.background = 'linear-gradient(to right, #100C08, #100C08) no-repeat right bottom';
  element.style.backgroundSize = '0 100%';

  // 动画 1: 从左到右划过黑色背景
  anime({
    targets: element,
    backgroundSize: ['0 100%', '100% 100%'],  // 背景从右侧拉到左侧
    duration: 1000,  // 动画时间
    easing: 'easeInOutSine',
    complete: function () {
      // 动画 2: 从左到右划过消失背景
      element.style.background = 'linear-gradient(to right, #FFFFFF, #FFFFFF) no-repeat right bottom';

      anime({
        targets: element,
        backgroundSize: ['100% 100%', '0 100%'],  // 背景逐渐消失
        duration: 1000,
        easing: 'easeInOutSine',
        complete: function () {
          // 动画 3: 移除背景并恢复文本颜色
          element.style.background = 'none';  // 移除背景
          element.style.color = '#000';  // 设置文本颜色为黑色

          // 恢复原有的CSS属性
          element.style.background = originalStyles.background;
          element.style.backgroundSize == originalStyles.backgroundSize;
          // 可以根据需要添加更多的属性恢复
        }
      });
    }
  });
}

// ----------------------------------------

// 初始化应用
async function initializeApp() {
  // loadContent('Main_Title', 'svg/XiaoCRQ_slim.svg',false)
  await loadContent('Main_Title', './svg/XiaoCRQwrite.svg', false);
  await Open()
  animateNav();
}

const resources = [
  'img/Computer_Background.png',
  'html/Blog.html',
  'html/Home.html',
  'html/Github.html',
  'html/Nav_Options.html',
];

// 启动应用
initializeApp();

