// 将vh单位转换为像素
function vhToPx(vh) {
  return (vh * window.innerHeight) / 100;
}

// 将vw单位转换为像素
function vwToPx(vw) {
  return (vw * window.innerWidth) / 100;
}

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

      applyUpwardForceToTop('Emoji')

      if (ElementIDLast && ElementIDLast) {
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

  const Square = document.createElement('div');
  Square.id = 'Square';
  const Progress = document.createElement('div');
  Progress.id = 'Progress';

  Progress.className = 'Page'
  Progress.style.height = '0vh';
  Progress.style.width = '0vh';
  Progress.style.borderRadius = '5vw';
  Progress.style.backgroundColor = 'black'
  Progress.style.opacity = 0

  // 将元素添加到 Anime 容器
  AnimeContainer.appendChild(Progress);

  await loadFileContent('Progress', 'html/Icon.html')
  let Icon = document.getElementById('Icon')

  await gsap.to(Progress, {
    duration: 0.75,
    opacity: 1,
    ease: "expo.inOut",
    width: '35vw',
    height: '35vw',
  });

  await Promise.all([
    gsap.to(Progress, {
      duration: 1,
      ease: "expo.inOut",
      borderRadius: '1.5vw',
      width: '2vw',
      height: '2vw',
      rotation: 360,
    }),
    gsap.to(Icon, {
      duration: 0.95,
      opacity: 0,
      ease: "expo.inOut",
    })
  ]);

  await ClearRemoveElement('Progress')

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
    height: '0vh',
  });

  gsap.set(Progress, {
    y: '100vh',
    width: '100vw',
    height: '100vh',
    color: 'white',
    fontSize: '10vw',
    borderRadius: 0,
  })

  Progress.innerHTML = "你好，陌生人！"

  await gsap.to(Progress, {
    duration: 1,
    ease: "expo.inOut",
    y: '0vh',
  });

  Square.className = 'Page'
  Square.style.position = 'fixed';
  Square.style.top = Square.style.left = 0;
  Square.style.zIndex = 1;

  AnimeContainer.appendChild(Square);
  await loadFileContent('Square', 'html/Icon.html')
  Icon = document.getElementById('Icon')
  Icon.style.mixBlendMode = 'exclusion'
  Icon.style.width = '45%'
  Square.style.backgroundColor = 'white';

  await gsap.fromTo(Square, {
    y: '100vh'
  }, {
    duration: 0.5,
    ease: "expo.in",
    y: '0vh',
  })

  AnimeContainer.removeChild(Progress);

  const Home = document.getElementById('Home_Resource');

  AnimeContainer.style.backgroundColor = 'rgba(255,255,255,0)'

  gsap.set(Home, {
    y: '0vh',
  })

  setTimeout(() => {
    applyUpwardForceToTop('Emoji')
  }, 0);

  await gsap.to(Square, {
    duration: 0.5,
    ease: "expo.out",
    y: '-100vh'
  })

  AnimeContainer.removeChild(Square);
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
