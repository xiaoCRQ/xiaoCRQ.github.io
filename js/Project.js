const ProjectResources = {
  main: null,
  canvas: {}, // canvas对象
  content: {}, // 2D上下文
  row_max: 8, // 图片排列的列数
  line_max: 6, // 图片排列的行数
  img_total: 48, // 总图片数量
  img_width: 280, // 图片宽度
  img_height: 400, // 图片高度
  img_margin: 100, // 图片间距
  total_width: 0, // 图片排列的总宽度
  total_height: 0, // 图片排列的总高度
  img_data: 0, // 用于存储图片数据
  if_movable: false, // 图片是否可移动
  ease: { x: 0, y: 0, damping: (v) => v * 0.965 }, // 动画的缓动效果
  animationFrameId: null, // 当前的动画帧ID，用于控制动画
  animationStatus: false, // 动画的状态
  sensitivity: 0.1, // 滑动灵敏度
  WheelMotion: -1.35, // 滚轮滑动方向和灵敏度

  // 点击活动
  projectmouse: false, // 点击触发
  projectopen: false, // 项目是否打开
  projectwindow: false, // 项目
  card: null,
  card_div: null,

  init() {
    // 初始化项目卡片
    this.projectwindow = document.getElementById("Project_Window");
    this.projectwindow.style.opacity = 0;
    this.card_div = document.getElementById("Project_Card");
    this.canvas = document.createElement('canvas')
    this.canvas.id = "Project_Canvas"; // 获取canvas元素
    this.main = document.getElementById("Project_Resource");
    this.main.appendChild(this.canvas)
    this.content = this.canvas.getContext("2d"); // 获取2D上下文
    if (MobileDevice === true) {
      this.row_max = 6
      this.line_max = 9
      this.img_total = this.row_max * this.line_max
      gsap.set(this.projectwindow, {
        y: '100vh',
        x: '0vw',
        width: '98vw',
        height: '60vh',
      });
    } else {
      gsap.set(this.projectwindow, {
        y: '0vh',
        x: '100vw',
        width: '60vw',
        height: '80vh',
      });
    }
    this.total_width = this.row_max * (this.img_width + this.img_margin) - this.img_margin; // 计算总宽度
    this.total_height = this.line_max * (this.img_height + this.img_margin) - this.img_margin; // 计算总高度
    this.resize(); // 调整canvas大小
    this.creat_events(); // 初始化事件
    this.creat_img_data(); // 创建图片数据
  },

  resize() {
    // 修改canvas宽高以填充页面
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // 计算画布中心与图片矩阵中心的偏移量
    this.offsetX = (this.canvas.width - this.total_width) / 2;
    this.offsetY = (this.canvas.height - this.total_height) / 2;

    // 修改canvas宽高后，清空画布内容并重新绘制图片
    if (this.img_data) this.move_imgs(0, 0);
  },


  creat_img_data() {
    // 确保ConfigData.ProjectConfig存在并且有数据
    if (!ConfigData.ProjectConfig || ConfigData.ProjectConfig.length === 0) {
      console.warn("No project configuration available.");
      return;
    }

    // 清空现有的img_data
    this.img_data = [];

    // 循环读取ConfigData.ProjectConfig的内容，直到达到img_total的数量
    for (let i = 0; i < this.img_total; i++) {
      // 使用取余运算符循环配置数组
      let project = ConfigData.ProjectConfig[i % ConfigData.ProjectConfig.length];

      let img = new Image();
      img.src = project.img; // 使用配置中的img路径
      img.onload = () => {
        // 计算图片所在的行列
        let col_index = i % this.row_max;
        let line_index = Math.floor(i / this.row_max);
        let x = col_index * (this.img_width + this.img_margin); // 计算x坐标

        // 如果是偶数列，让图片上升半个img高度
        let y = line_index * (this.img_height + this.img_margin); // 计算y坐标
        if (col_index % 2) {
          y -= this.img_height / 2; // 偶数列上升半个图片高度
        }

        // 将图片信息添加到img_data数组
        this.img_data.push({
          img,
          x,
          y,
          title: project.title,
          url: project.url,
        });

        // 图片加载完成后绘制到画布
        this.content.drawImage(img, x + this.offsetX, y + this.offsetY, this.img_width, this.img_height);
      };

      img.onerror = (err) => {
        console.error("Error loading image:", project.img, err);
      };
    }
  },

  creat_events() {
    // 窗口大小变化时调整canvas尺寸
    window.addEventListener("resize", () => {
      this.resize();
    });

    // 鼠标按下时启用图片移动
    this.canvas.addEventListener("mousedown", (e) => {
      this.if_movable = true;
      this.projectmouse = true;
    });

    // 鼠标弹起时停止移动，并检查点击位置的图片
    this.canvas.addEventListener("mouseup", (e) => {
      this.if_movable = false;
      if (this.projectmouse) {
        this.OpenProject(e.x, e.y);
      }
    });

    // 鼠标离开画布时停止移动
    this.canvas.addEventListener("mouseleave", () => {
      this.if_movable = false;
    });

    // 鼠标移动时触发图片移动动画
    this.canvas.addEventListener("mousemove", (e) => {
      if (!this.if_movable) return;
      this.projectmouse = false;
      if (this.projectopen) return;
      this.move_imgs(e.movementX, e.movementY); // 鼠标相对移动距离 
    });

    // 支持鼠标滚轮
    this.canvas.addEventListener("wheel", (e) => {
      if (this.projectopen) return;
      e.preventDefault(); // 阻止默认滚动行为
      let deltaX = this.WheelMotion * e.deltaX || 0;
      let deltaY = this.WheelMotion * e.deltaY || 0;

      // 使用滚轮灵敏度调整滑动量
      this.move_imgs(deltaX, deltaY);
    });

    // 触摸事件：开始、移动、结束
    this.canvas.addEventListener("touchstart", (e) => {
      e.preventDefault(); // 阻止触摸滚动行为
      const touch = e.touches[0]; // 获取第一个触摸点
      this.if_movable = true;
      this.projectmouse = true;
      this.touchStartX = touch.pageX;
      this.touchStartY = touch.pageY;
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (!this.if_movable) return;
      this.projectmouse = false;
      if (this.projectopen) return;

      e.preventDefault(); // 阻止触摸滚动行为
      const touch = e.touches[0]; // 获取第一个触摸点
      const deltaX = touch.pageX - this.touchStartX;
      const deltaY = touch.pageY - this.touchStartY;
      this.move_imgs(deltaX, deltaY);
      this.touchStartX = touch.pageX;
      this.touchStartY = touch.pageY;
    });

    this.canvas.addEventListener("touchend", (e) => {
      this.if_movable = false;
      const touch = e.changedTouches[0]; // 获取触摸结束的点
      if (this.projectmouse) {
        this.OpenProject(touch.pageX, touch.pageY);
      }
    });

    this.canvas.addEventListener("touchcancel", () => {
      this.if_movable = false;
    });
  },

  move_imgs(x, y) {
    // 应用灵敏度，乘以滑动灵敏度系数
    x *= this.sensitivity;
    y *= this.sensitivity;

    // 累加鼠标移动的距离
    this.ease.x += x;
    this.ease.y += y;

    // 如果当前有动画在进行，取消上一个动画帧
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // 启动新的动画帧
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  },

  animate() {
    // 清除画布并重新绘制所有图片
    this.content.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 遍历所有图片并更新它们的位置
    this.img_data.forEach((img) => {
      img.x += this.ease.x;
      img.y += this.ease.y;

      // 判断图片是否超出画布范围，若超出则重新调整到另一边
      if (img.x > this.total_width - this.img_width) img.x -= this.total_width + this.img_margin;
      if (img.x < -this.img_width) img.x += this.total_width + this.img_margin;
      if (img.y > this.total_height - this.img_height) img.y -= this.total_height + this.img_margin;
      if (img.y < -this.img_height) img.y += this.total_height + this.img_margin;

      // 绘制图片
      this.content.drawImage(img.img, img.x + this.offsetX, img.y + this.offsetY, this.img_width, this.img_height);
    });

    // 使用缓动函数减缓移动速度
    this.ease.x = this.ease.damping(this.ease.x);
    this.ease.y = this.ease.damping(this.ease.y);

    // 如果移动速度非常小，停止动画
    if (Math.abs(this.ease.x) < 0.1 && Math.abs(this.ease.y) < 0.1) {
      this.ease.x = 0;
      this.ease.y = 0;
      this.animationStatus = false;
      return;
    }

    // 如果动画仍在进行，继续请求下一帧动画
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    this.animationStatus = true;
  },

  OpenProject(x, y, closed = true) {
    // 判断当前状态是关闭还是打开
    if (this.projectopen) {
      // 如果是打开状态，点击任何地方将图片还原到原位置
      gsap.to(this.canvas, {
        ease: "expo.in",
        delay: 0.75,
        duration: 0.25,
        opacity: 1,
        onComplete: () => {
          this.projectwindow.src = ''; // 设置iframe的url
          this.projectwindow.style.opacity = 0;
          this.card_div.style.backgroundImage = ``;
          this.card_div.style.scale = 1;
          this.card = null;
          this.projectopen = false;  // 设置为关闭状态
        }
      });

      if (closed) {
        gsap.to(this.projectwindow, {
          ease: "expo.inOut",
          duration: 0.75,
          x: ProjectWindowX_Off,
          y: ProjectWindowY_Off,
        });
        gsap.to(this.card_div, {
          ease: "expo.inOut",
          duration: 0.75,
          x: this.card.x + this.offsetX + 'px',
          y: this.card.y + this.offsetY + 'px',
          scale: 1,
        })
      } else {
        gsap.to(this.card_div, {
          ease: "expo.inOut",
          duration: 0.75,
          scale: 1,
        })
      }
      return;
    }

    // 如果是关闭状态，检查当前点击的位置是否在图片范围内
    this.card = this.img_data.find(img =>
      x >= img.x + this.offsetX && x < img.x + this.img_width + this.offsetX &&
      y >= img.y + this.offsetY && y < img.y + this.img_height + this.offsetY
    );

    if (!this.card) return;  // 如果没有点击到图片，直接返回

    gsap.set(this.card_div, {
      x: this.card.x + this.offsetX + 'px',
      y: this.card.y + this.offsetY + 'px',
    })

    // 添加背景图片
    this.card_div.style.backgroundImage = `url(${this.card.img.src})`;
    this.projectwindow.src = this.card.url; // 设置iframe的url
    this.projectwindow.style.opacity = 1;
    this.move_imgs(0, 0)

    if (MobileDevice === true)
      gsap.to(this.card_div, {
        ease: "expo.inOut",
        delay: 0.25,
        duration: 0.75,
        x: vwToPx(50) - this.img_width / 2 + 'px',
        y: vhToPx(20) - this.img_height / 2 + 'px',
        scale: 1.5,
      })
    else
      gsap.to(this.card_div, {
        ease: "expo.inOut",
        delay: 0.25,
        duration: 0.75,
        x: vwToPx(20) - this.img_width / 2 + 'px',
        y: vhToPx(50) - this.img_height / 2 + 'px',
        scale: 1.5,
      })


    gsap.to(this.canvas, {
      ease: "expo.in",
      duration: 0.25,
      opacity: 0
    });

    gsap.to(this.projectwindow, {
      ease: "expo.inOut",
      delay: 0.25,
      duration: 0.75,
      x: ProjectWindowX,
      y: ProjectWindowY,
    });

    console.log(this.card);

    // this.content.drawImage(this.card.img, this.card.x + this.offsetX, this.card.y + this.offsetY, this.img_width, this.img_height);

    this.projectopen = true;  // 设置为打开状态
  },

  clear() {
    // 获取canvas元素
    this.canvas = document.getElementById("Project_Canvas");
    if (!this.canvas) {
      console.warn("Canvas element not found.");
      return;
    }

    // 清空图片数据
    this.img_data = [];

    // 重置图片移动相关的变量
    this.ease = { x: 0, y: 0, damping: (v) => v * 0.965 };

    // 重置动画状态
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.animationStatus = false;

    // 重置可移动标志和点击状态
    this.if_movable = false;
    this.projectmouse = false;
    this.projectopen = false;

    // 清除卡片数据
    this.card = null;

    ClearRemoveElement('Project_Canvas', true)
    this.canvas = null;
  },

  // 设置滑动灵敏度
  set_sensitivity(value) {
    this.sensitivity = value;
  }
};
