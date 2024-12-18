function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(navigator.userAgent);
}

async function NavPage(ElementID, Motion = true) {
  const Element = document.getElementById(ElementID)
  if (Motion)
    gsap.to(Element, {
      y: '0vh',
      // ease: "elastic.out(1, 0.85)",
      ease: "expo.inOut",
      duration: 0.75
    });
  else {
    await gsap.to(Element, {
      y: '-100vh',
      // ease: "elastic.in(1, 0.85)",
      ease: "expo.inOut",
      duration: 0.75
    });
    await gsap.set(Element, { y: '100vh' })
  }
}

async function NavAnime() {
  let isExpanded = false;
  let ElementIDLast = "Home_Resource";
  const Nav = document.getElementById('Nav_Button');
  const Nav_Line = document.getElementById('Nav_Line');
  const Nav_Line_1 = document.getElementById('Nav_Line_1');
  const Nav_Line_2 = document.getElementById('Nav_Line_2');
  const Nav_Option = document.getElementById('Nav_Main_Options');

  const Home = document.getElementById('Home')
  const Blog = document.getElementById('Blog')
  const Github = document.getElementById('Github')
  const Thanks = document.getElementById('Thanks')

  if (!Nav || !Nav_Line || !Nav_Line_1 || !Nav_Line_2 || !Nav_Option) return;

  gsap.to(Nav, {
    y: '0vh',
    ease: "elastic.out(1,0.65)",
    duration: 1.5
  });

  Nav_Line.addEventListener('click', () => {
    if (!isExpanded) {
      isExpanded = true;
      Nav_Option.style.pointerEvents = 'auto'
      gsap.to(Nav_Option, {
        ease: "expo.in",
        opacity: 1,
        duration: 0.45
      })
      gsap.to(Nav, {
        width: '45vh',
        ease: "expo.inOut",
        duration: 0.75
      });
      gsap.to(Nav_Line_1, {
        y: '0.645vh',
        rotation: 45,
        ease: "power3.inOut",
        duration: 0.75
      });
      gsap.to(Nav_Line_2, {
        y: '-0.645vh',
        rotation: -45,
        ease: "power3.inOut",
        duration: 0.75
      });
    } else {
      isExpanded = false;
      Nav_Option.style.pointerEvents = 'none';
      gsap.to(Nav_Option, {
        ease: "expo.inOut",
        opacity: 0,
        duration: 0.65
      })
      gsap.to(Nav, {
        width: '5vh',
        height: '5vh',
        ease: "expo.inOut",
        duration: 0.75
      });
      gsap.to([Nav_Line_1, Nav_Line_2], {
        y: '0vh',
        rotation: 0,
        ease: "power3.inOut",
        duration: 0.75
      });
    }
  });

  const NavPageFunction = (ElementIDNew) => {
    // 执行跳转操作
    if (ElementIDNew && ElementIDNew != ElementIDLast) {
      isExpanded = false;
      Nav_Option.style.pointerEvents = 'none';
      gsap.to(Nav_Option, {
        ease: "expo.inOut",
        opacity: 0,
        duration: 0.65
      })
      gsap.to(Nav, {
        width: '5vh',
        height: '5vh',
        ease: "expo.inOut",
        duration: 0.75
      });
      gsap.to([Nav_Line_1, Nav_Line_2], {
        y: '0vh',
        rotation: 0,
        ease: "power3.inOut",
        duration: 0.75
      });

      if (ElementIDLast) {
        NavPage(ElementIDLast, false);
        setTimeout(() => {
          NavPage(ElementIDNew);
        }, 350);
      }
      else NavPage(ElementIDNew);
      ElementIDLast = ElementIDNew;
    }
  };

  Home.addEventListener('click', () => NavPageFunction("Home_Resource"));
  Blog.addEventListener('click', () => NavPageFunction("Blog_Resource"));
  Github.addEventListener('click', () => NavPageFunction("Github_Resource"));
  Thanks.addEventListener('click', () => NavPageFunction("Thanks_Resource"));
}


async function OpeWebSite() {
  // 获取 Anime 容器
  const AnimeContainer = document.getElementById('Anime');
  AnimeContainer.style.backgroundColor = '#FFFFFF'

  // 创建 Square_Up 和 Square_Down 元素
  const Square_Up = document.createElement('div');
  Square_Up.id = 'Square_Up';
  const Square_Down = document.createElement('div');
  Square_Down.id = 'Square_Down';
  const Progress = document.createElement('div');
  Progress.id = 'Progress';

  Square_Up.style.height = Square_Down.style.height = '50%';
  Square_Up.style.width = Square_Down.style.width = '100%';
  Square_Up.style.backgroundColor = Square_Down.style.backgroundColor = '#100C08';

  Progress.style.height = '0vh';
  Progress.style.width = '0vh';
  Progress.style.borderRadius = '5vh';
  Progress.style.backgroundColor = '#100C08'
  Progress.style.opacity = 0

  // 将元素添加到 Anime 容器
  AnimeContainer.appendChild(Progress);

  await loadFileContent('Progress', 'html/Icon.html')
  const Icon = document.getElementById('Icon')

  await gsap.to(Progress, {
    duration: 0.75,
    opacity: 1,
    ease: "expo.inOut",
    width: '45vh',
    height: '45vh',
  });

  // 然后运行 Square_Up 和 Square_Down 的第一组 gsap 动画
  await Promise.all([
    gsap.to(Progress, {
      duration: 1,
      ease: "expo.inOut",
      borderRadius: '1.5vh',
      width: '2vh',
      height: '2vh',
      rotation: 360,
    }),
    gsap.to(Icon, {
      duration: 0.95,
      opacity: 0,
      ease: "expo.inOut",
    })
  ]);

  // 宽度动画
  const widthAnimation = gsap.to(Progress, {
    width: '60vw',  // 结束宽度
    duration: 10,  // 动画持续时间
    ease: "expo.inOut",  // 缓动效果
    paused: false   // 初始时不暂停
  });

  // 等待 loadMultipleFiles 执行完毕
  await loadMultipleFiles(ConfigData.FileLoadConfig)

  // 在 loadMultipleFiles 完成后暂停宽度动画
  widthAnimation.pause();

  await gsap.to(Progress, {
    duration: 1,
    ease: "expo.in",
    width: '110vw',
    height: '0.5vh'
  });

  await gsap.to(Progress, {
    duration: 1,
    ease: "expo.inOut",
    height: '100vh'
  });

  AnimeContainer.removeChild(Progress);
  AnimeContainer.appendChild(Square_Up);
  AnimeContainer.appendChild(Square_Down);
  AnimeContainer.style.backgroundColor = ' rgba(0, 0, 0, 0)'

  const Home = document.getElementById('Home_Resource');

  gsap.set(Home, {
    y: '0vh',
  })

  // 然后运行 Square_Up 和 Square_Down 的第一组 gsap 动画
  await Promise.all([
    gsap.to(Square_Up, {
      duration: 1,
      y: '-100vh',
      ease: "expo.inOut",
    }),
    gsap.to(Square_Down, {
      duration: 1,
      y: '100vh',
      ease: "expo.inOut",
    })
  ]);

  // 删除 Square_Up 和 Square_Down 元素
  AnimeContainer.removeChild(Square_Up);
  AnimeContainer.removeChild(Square_Down);

  return;
}

async function CursorDefine() {
  if (isMobileDevice())
    return
  const cursor = new MouseFollower({
    speed: 0.35,
    skewing: 5,
  });
}


async function init() {
  await loadConfig("config.json");
  await OpeWebSite()
  await CursorDefine()
  await NavAnime()
}


init()
