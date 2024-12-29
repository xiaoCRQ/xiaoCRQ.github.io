const ProjectResources = {
  canvas: {}, // canvas对象
  content: {}, // 2D上下文
  img_total: 28, // 总图片数量
  row_max: 7, // 图片排列的列数
  line_max: 4, // 图片排列的行数
  img_width: Math.floor(700 / 2), // 图片宽度
  img_height: Math.floor(1000 / 2), // 图片高度
  img_margin: 20, // 图片间距
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
  projectopen: false, // 项目是否打开

  // 暂时未启用
  max_sensitivity: 0.2,  // 最大灵敏度差值
  max_sensitivity_motion: true,  //差值作用范围 true - 列 | false - 行 

  init() {
    this.canvas = document.getElementById("Project_Resources"); // 获取canvas元素
    this.content = this.canvas.getContext("2d"); // 获取2D上下文
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
        let y = line_index * (this.img_height + this.img_margin); // 计算y坐标

        // 将图片信息添加到img_data数组
        this.img_data.push({
          img,
          x,
          y,
          title: project.title,
          url: project.url,
        });

        // 图片加载完成后绘制到画布
        // this.content.drawImage(img, x, y, this.img_width, this.img_height);
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
    });

    // 鼠标弹起时停止移动，并检查点击位置的图片
    this.canvas.addEventListener("mouseup", (e) => {
      this.if_movable = false;
      this.check_img(e.x, e.y);
    });

    // 鼠标离开画布时停止移动
    this.canvas.addEventListener("mouseleave", () => {
      this.if_movable = false;
    });

    // 鼠标移动时触发图片移动动画
    this.canvas.addEventListener("mousemove", (e) => {
      if (!this.if_movable) return;
      this.move_imgs(e.movementX, e.movementY); // 调用move_imgs处理图片移动
    });

    // 支持鼠标滚轮
    this.canvas.addEventListener("wheel", (e) => {
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
      this.touchStartX = touch.pageX;
      this.touchStartY = touch.pageY;
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (!this.if_movable) return;
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
      this.check_img(touch.pageX, touch.pageY);
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

  check_img(x, y) {
    // 检查当前鼠标点击的位置是否在图片范围内
    let img = this.img_data.find(img =>
      x >= img.x && x < img.x + this.img_width &&
      y >= img.y && y < img.y + this.img_height
    );
    if (img && this.projectopen === false) {
      this.projectopen = true;
      console.log(img, img.img); // 如果点击到图片，则输出该图片
    }
    else
      this.projectopen = false;
  },

  // 设置滑动灵敏度
  set_sensitivity(value) {
    this.sensitivity = value;
  }
};

// 初始化
ProjectResources.init();

