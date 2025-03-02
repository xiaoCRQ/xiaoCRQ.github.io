let MobileDevice = false
let NavMove = '45vh'
let BlogNavMove = '48vh'
let ProjectWindowX = '18vw'
let ProjectWindowY = '0vh'
let ProjectWindowX_Off = '100vw'
let ProjectWindowY_Off = '0vh'

// 将vh单位转换为像素
function vhToPx(vh) {
  return (vh * window.innerHeight) / 100;
}

// 将vw单位转换为像素
function vwToPx(vw) {
  return (vw * window.innerWidth) / 100;
}

function delayReturn(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isMobileDevice() {
  const Project = document.getElementById('Project_Web');
  MobileDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|webOS/i.test(navigator.userAgent)
  if (MobileDevice) {
    BlogNavMove = '100vw';
    NavMove = '98vw';
    ProjectWindowX = ProjectWindowX_Off = '0vw';
    ProjectWindowY = '18vh';
    ProjectWindowY_Off = '100vh';
  }
  return MobileDevice;
}

async function loadIcon(Motion = true) {
  const Anime = document.getElementById('Square');
  if (Motion) {
    await gsap.fromTo(Anime, {
      y: '100vh',
    }, {
      y: '0vh',
      ease: "expo.inOut",
      duration: 0.75
    });
  }
  else {
    await gsap.fromTo(Anime, {
      y: '0vh',
    }, {
      y: '-100vh',
      ease: "expo.inOut",
      duration: 0.75
    });
  }
}

async function BlogNav(Motion = true) {
  const Nav = document.getElementById('Blog_Nav')
  if (Motion) {
    await gsap.to(Nav, {
      color: 'black',
      width: BlogNavMove,
      ease: "expo.inOut",
      duration: 0.65
    })
  }
  else {
    await gsap.to(Nav, {
      color: 'rgba(255,255,255,0)',
      width: '0vh',
      ease: "expo.inOut",
      duration: 0.85
    })
  }
}

async function NavPage(ElementID, Motion = true) {
  const Element = document.getElementById(ElementID)
  if (Motion) {
    await gsap.to(Element, {
      y: '0vh',
      // ease: "elastic.out(1, 0.85)",
      ease: "expo.inOut",
      duration: 0.75
    });
  }
  else {
    await gsap.to(Element, {
      y: '-100vh',
      // ease: "elastic.in(1, 0.85)",
      ease: "expo.inOut",
      duration: 0.75
    });
    gsap.set(Element, { y: '100vh' })
  }
}

let isExpanded = false;
async function NavAnimes(Motion = true) {
  const Nav = document.getElementById('Nav_Button');
  const Nav_Line = document.getElementById('Nav_Line');
  const Nav_Line_1 = document.getElementById('Nav_Line_1');
  const Nav_Line_2 = document.getElementById('Nav_Line_2');
  const Nav_Option = document.getElementById('Nav_Main_Options');
  if (!Nav || !Nav_Line || !Nav_Line_1 || !Nav_Line_2 || !Nav_Option) return;

  isExpanded = Motion;
  if (Motion) {
    Nav_Option.style.pointerEvents = 'auto'
    gsap.to(Nav_Option, {
      ease: "expo.in",
      opacity: 1,
      duration: 0.45,
      delay: 0.25
    })
    gsap.to(Nav, {
      width: NavMove,
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
  }
  else {
    Nav_Option.style.pointerEvents = 'none';
    gsap.to(Nav_Option, {
      ease: "expo.inOut",
      opacity: 0,
      duration: 0.45
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
}

async function NavAnime() {
  let ElementLast = null;
  let ElementIDLast = "Home_Resource";
  let delay = 0;
  const Nav = document.getElementById('Nav_Button');
  const Back = document.getElementById('BackGrund');

  const Home = document.getElementById('Home')
  const Blog = document.getElementById('Blog')
  const Project = document.getElementById('Project')
  const Thanks = document.getElementById('Thanks')

  gsap.to(Nav, {
    y: '0vh',
    ease: "elastic.out(1,0.65)",
    duration: 1.5
  });

  Nav_Line.addEventListener('click', () => {
    if (!isExpanded) {
      NavAnimes();
      if (ElementIDLast === 'Blog_Resource')
        BlogNav()

    } else {
      NavAnimes(false);
      if (ElementIDLast === 'Blog_Resource')
        BlogNav(false)
    }

  });

  const NavPageFunction = (ElementIDNew) => {
    // 执行跳转操作
    if (ElementIDNew && ElementIDNew != ElementIDLast) {
      NavAnimes(false);

      applyUpwardForceToTop('Emoji')


      if (ElementIDLast && ElementIDLast) {
        NavPage(ElementIDLast, false);

        if (ElementIDNew === "Thanks_Resource") {
          delay = 1500;
          loadIcon(true);
          UseFunction_Emoji = 2
          WorldRefresh()
          setTimeout(() => {
            // Back.style.backgroundColor = 'white'
            loadIcon(false);
          }, 750)
          setTimeout(() => {
            applyUpwardForceToTop('Emoji')
          }, 800)
        } else
          UseFunction_Emoji = 1;

        if (ElementIDLast === "Thanks_Resource") {
          delay = 0;
          loadIcon(true);
          WorldRefresh()
          setTimeout(() => {
            // Back.style.backgroundColor = 'black'
            loadIcon(false);
          }, 750)
          setTimeout(() => {
            applyUpwardForceToTop('Emoji')
          }, 800)
        }

        setTimeout(() => {
          NavPage(ElementIDNew);
          ElementIDLast = ElementIDNew;
        }, 0);
      }
      else {
        NavPage(ElementIDNew);
        ElementIDLast = ElementIDNew;
      }


      if (ElementIDLast === 'Blog_Resource') {
        BlogNav(false)
      }

      if (ElementIDNew === 'Blog_Resource') {
        LenisDefine('Blog_Page')
        lenis.resize()
        lenis.scrollTo(0)
      } else if (ElementIDNew === 'Home_Resource') {
        // LenisDefine('Home_Main')
        // lenis.resize()
        // lenis.scrollTo(0)
      }

      if (ElementIDNew === 'Project_Resource' || ElementIDNew === 'Blog_Resource') {
        UseFunction_Emoji = 0
        setTimeout(() => {
          clearWorlds()
        }, 150)
      } else if (ElementIDLast === 'Project_Resource' || ElementIDLast === 'Blog_Resource') {
        WorldRefresh()
        // setTimeout(() => {
        //   applyUpwardForceToTop('Emoji')
        // }, 150)
      }

      if (ElementIDNew === 'Project_Resource') {
        ProjectResources.init();
      } else if (ElementIDLast === 'Project_Resource') {
        if (ProjectResources.projectopen) ProjectResources.OpenProject(0, 0, false)
        setTimeout(() => {
          ProjectResources.clear();
        }, 750)
      }
    }
  };

  Home.addEventListener('click', () => { NavPageFunction("Home_Resource") });
  Blog.addEventListener('click', () => { NavPageFunction("Blog_Resource") });
  Project.addEventListener('click', () => { NavPageFunction("Project_Resource") });
  Thanks.addEventListener('click', () => { NavPageFunction("Thanks_Resource") });
}


async function OpeWebSite() {
  // 获取 Anime 容器
  const AnimeContainer = document.getElementById('Anime');

  const Square = document.createElement('div');
  Square.id = 'Square';
  const Progress = document.createElement('div');
  Progress.id = 'Progress';

  Progress.className = 'Page'
  Progress.style.width = '0vw';
  Progress.style.height = '0vw';
  Progress.style.borderRadius = '5vw';
  Progress.style.backgroundColor = 'black'

  // 将元素添加到 Anime 容器
  AnimeContainer.appendChild(Progress);

  await loadFileContent('Progress', 'html/Icon.html')
  let Icon = document.getElementById('Icon')

  await gsap.to(Progress, {
    duration: 0.75,
    ease: "expo.inOut",
    width: '35vw',
    height: '35vw',
  });

  await Promise.all([
    gsap.to(Progress, {
      duration: 1,
      ease: "expo.inOut",
      borderRadius: '1.5vw',
      width: '1vw',
      height: '1vw',
      rotation: 0,
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
    width: '75vw',  // 结束宽度
    duration: 5,  // 动画持续时间
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
    fontSize: '14vw',
    borderRadius: 0,
  })

  Progress.innerHTML = "Hey!"

  await gsap.to(Progress, {
    duration: 1,
    ease: "expo.inOut",
    y: '0vh',
  });

  Square.className = 'Page'
  Square.style.position = 'fixed';
  Square.style.top = Square.style.left = 0;
  Square.style.zIndex = 1;
  Square.style.fontSize = '14vw';
  Square.style.color = 'black';
  Square.style.backgroundColor = 'white';
  Square.innerHTML = "I'm...";

  AnimeContainer.appendChild(Square);
  await Promise.all([
    gsap.fromTo(Square, {
      y: '-100vh'
    }, {
      duration: 1,
      ease: "expo.inOut",
      y: '0vh',
    }),
    gsap.to(Progress, {
      duration: 1,
      ease: "expo.inOut",
      y: '100vh',
    })
  ]);

  AnimeContainer.removeChild(Progress);

  const Home = document.getElementById('Home_Resource');

  AnimeContainer.style.backgroundColor = 'rgba(255,255,255,0)'

  setTimeout(() => {
    applyUpwardForceToTop('Emoji')
  }, 350);

  await Promise.all([
    gsap.to(Square, {
      duration: 1,
      ease: "expo.inOut",
      y: '-100vh'
    }),
    gsap.to(Home, {
      duration: 1,
      ease: "expo.inOut",
      y: '0vh',
    })
  ]);

  gsap.set(Square, {
    // borderRadius: '1.5vh',
    // width: '98vw',
    // height: '96vh',
    y: '100vh'
  })

  // Square.style.top = '2vh';
  // Square.style.left = '1vw';

  await loadFileContent('Square', 'html/Icon.html')
  Icon = document.getElementById('Icon')
  Icon.style.mixBlendMode = 'exclusion'
  Icon.style.width = '45%'

  gsap.to(Icon, {
    rotation: 360,
    duration: 3.5,
    repeat: -1,
    ease: "expo.inOut",
  });

}

async function CursorDefine() {
  const cursor = new MouseFollower({
    speed: 0.35,
    skewing: 5,
    stateDetection: {
      '-pointer': 'a,button,code',
      '-hidden': 'iframe'
    },
  });
}

let lenis; // 全局变量，用于存储 Lenis 实例

async function LenisDefine(id) {
  const Element = document.getElementById(id);

  // 如果 lenis 已经存在，则先清除
  if (lenis) {
    lenis.destroy(); // 假设 Lenis 类有一个 destroy 方法来清理实例
  }

  // 创建新的 Lenis 实例
  lenis = new Lenis({
    wrapper: Element,
    wheelMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  lenis.on("scroll", () => {
    // console.log(lenis.progress)
  })

  requestAnimationFrame(raf);

  // console.log(`切换平滑滚动对象为 ${id}`);
}

async function init() {
  await loadConfig("config.json");
  await OpeWebSite()
  if (MobileDevice === false)
    await CursorDefine()
  await NavAnime()
  await loadMarkdownTitles('Blog_Nav')
  // await LenisDefine('Home_Main')
}

isMobileDevice()
init()
