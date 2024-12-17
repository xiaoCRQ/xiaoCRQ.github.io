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
  let ElementIDLast = null;
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
        ease: "expo.inOut",
        opacity: 1,
        duration: 0.75
      })
      gsap.to(Nav, {
        width: '48vh',
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
        duration: 0.75
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
        duration: 0.75
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
        }, 150);
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


async function HeadSVG() {
  return;
}

let pathAnimation
async function OpeWebSite() {
  // 获取 Anime 容器
  const AnimeContainer = document.getElementById('Anime');

  // 创建 Square_Up 和 Square_Down 元素
  const Square_Up = document.createElement('div');
  Square_Up.id = 'Square_Up';
  const Square_Down = document.createElement('div');
  Square_Down.id = 'Square_Down';

  Square_Up.style.height = Square_Down.style.height = '50%';
  Square_Up.style.width = Square_Down.style.width = '100%';
  Square_Up.style.backgroundColor = Square_Down.style.backgroundColor = '#100C08';

  // 将元素添加到 Anime 容器
  AnimeContainer.appendChild(Square_Up);
  AnimeContainer.appendChild(Square_Down);


  // 先运行 anime.js 动画并等待它完成
  await new Promise((resolve) => {
    pathAnimation = anime({
      targets: '.anime_path',
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 180,
      delay: (el, i) => i * 150,
      direction: 'alternate',
      loop: true,
      complete: resolve // 动画完成时触发 resolve，保证顺序
    });

    loadMultipleFiles(ConfigData.FileLoadConfig)
      .then(() => {
        pathAnimation.pause();
        anime({
          targets: '.anime_path',
          strokeDashoffset: [anime.setDashoffset, 0],
          easing: 'easeInOutSine',
          duration: 180,
          delay: (el, i) => i * 150,
          direction: 'alternate',
          loop: false,
          complete: resolve // 动画完成时触发 resolve，保证顺序
        });
      })

  });


  // 然后运行 Square_Up 和 Square_Down 的第一组 gsap 动画
  await Promise.all([
    gsap.to(Square_Up, {
      duration: 1.15,
      y: '-100vh',
      ease: "power4.in",
    }),
    gsap.to(Square_Down, {
      duration: 1.15,
      y: '100vh',
      ease: "power4.in",
    })
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

  ClearRemoveElement('XiaoCRQ', true)

  // 接下来运行 Square_Up 和 Square_Down 的第二组 gsap 动画
  await Promise.all([
    gsap.to(Square_Up, {
      duration: 0.45,
      y: 0,
      ease: "power4.in",
    }),
    gsap.to(Square_Down, {
      duration: 0.45,
      y: 0,
      ease: "power4.in",
    })
  ]);

  // 然后运行 Square_Up 和 Square_Down 的第三组 gsap 动画
  await Promise.all([
    gsap.to(Square_Up, {
      duration: 0.45,
      y: '100vh',
      ease: "power4.out",
    }),
    gsap.to(Square_Down, {
      duration: 0.45,
      y: '-100vh',
      ease: "power4.out",
    })
  ]);

  // 删除 Square_Up 和 Square_Down 元素
  AnimeContainer.removeChild(Square_Up);
  AnimeContainer.removeChild(Square_Down);

  return;
}



async function init() {
  await loadConfig("config.json");
  await OpeWebSite()
  await NavAnime()
}

const cursor = new MouseFollower({
  speed: 0.35,
  skewing: 5,
});

init()
