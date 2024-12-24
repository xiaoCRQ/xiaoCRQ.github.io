const ProjectResources = {
  // canvas对象容器
  canvas: {},
  // canvas 2d上下文
  content: {},
  // 背景块的总数
  img_total: 12,
  // 背景块排列的总列数
  row_max: 3,
  // 背景块宽度和高度，用作占位符，单位为vh
  img_width: 45,
  img_height: 65,
  // 背景块间距，单位为vh
  img_margin: 12,
  // 所有背景块纵横排列之后的总宽高，用作超出范围的界限判定
  total_width: 0,
  total_height: 0,
  // 背景块数据，用以储存每块的xy坐标位置
  img_data: [],
  // 当前画布是否可以移动
  if_movable: false,
  // 初始化
  init() {
    this.canvas = document.getElementById("Project_Resources");
    this.content = this.canvas.getContext("2d");
    // 使用vh转换为像素
    const col_width = vhToPx(this.img_width + this.img_margin);
    const row_height = vhToPx(this.img_height + this.img_margin);
    this.total_width = this.row_max * col_width - vhToPx(this.img_margin);
    this.total_height = Math.ceil(this.img_total / this.row_max) * row_height - vhToPx(this.img_margin);
    this.resize();
    this.creat_events();
    this.creat_background(); // 初始化背景数据
  },


  creat_background() {
    this.img_data = []; // 初始化为一个空数组

    // 计算居中偏移量
    const col_width = vhToPx(this.img_width + this.img_margin);
    const row_height = vhToPx(this.img_height + this.img_margin);
    const x_offset = (this.canvas.width - this.total_width) / 2; // 水平居中偏移
    const y_offset = (this.canvas.height - this.total_height) / 2; // 垂直居中偏移

    for (let i = 0; i < this.img_total; i++) {
      // 计算该序号背景处于第几行第几列
      let col_index = i % this.row_max;
      let line_index = Math.floor(i / this.row_max);

      // 中间列的Y轴偏移
      const middle_col_offset = col_index === Math.floor(this.row_max / 2)
        ? row_height / 2
        : 0;

      // 通过行列序号算出xy坐标，并加上偏移量
      let x = vhToPx(col_index * (this.img_width + this.img_margin)) + x_offset;
      let y = vhToPx(line_index * (this.img_height + this.img_margin)) + y_offset + middle_col_offset;

      // 将背景数据添加到img_data中
      this.img_data.push({ x, y });

      // 绘制背景块
      this.content.fillStyle = "#ffffff"; // 设置背景颜色为白色
      this.content.fillRect(x, y, vhToPx(this.img_width), vhToPx(this.img_height));
    }
  },


  resize() {
    // 修改canvas宽高以填充满页面
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;

    // 重新计算居中布局的总宽高
    const col_width = vhToPx(this.img_width + this.img_margin);
    const row_height = vhToPx(this.img_height + this.img_margin);
    this.total_width = this.row_max * col_width - vhToPx(this.img_margin);
    this.total_height = Math.ceil(this.img_total / this.row_max) * row_height - vhToPx(this.img_margin);

    // 修改canvas宽高之后，画布内容会被清除，故需要调用一次creat_background函数，重新布局
    this.creat_background();
  },


  // 绑定所有监听事件
  creat_events() {
    window.addEventListener("resize", () => {
      this.resize();
    });
    // 当鼠标按下时，才可以移动所有背景
    this.canvas.addEventListener("mousedown", () => {
      this.if_movable = true;
    });
    // 当鼠标弹起时，背景无法被移动
    this.canvas.addEventListener("mouseup", () => {
      this.if_movable = false;
    });
    // 当鼠标离开选区时，背景无法被移动
    this.canvas.addEventListener("mouseleave", () => {
      this.if_movable = false;
    });
    // 当鼠标移动时，调用move_imgs函数，只允许y轴拖动
    this.canvas.addEventListener("mousemove", (e) => {
      if (!this.if_movable) return;
      this.move_imgs(0, e.movementY);
    });
    // 鼠标滚轮事件，上下滚动背景
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault(); // 禁止默认滚动行为
      this.move_imgs(0, e.deltaY < 0 ? 50 : -50); // 根据滚轮方向移动
    });
  },

  // 移动所有背景
  move_imgs(x, y) {
    // 清除content，重新进行绘制
    this.content.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 遍历所有背景，对每一个背景进行移动，并进行判断
    this.img_data.forEach((img) => {
      img.y += y;
      // 当背景块超出总高度范围时，将其移到最上方
      if (img.y > (this.total_height - vhToPx(this.img_height)))
        img.y -= this.total_height + vhToPx(this.img_margin);
      // 当背景块小于负的高度范围时，将其移到最下方
      if (img.y < -vhToPx(this.img_height))
        img.y += this.total_height + vhToPx(this.img_margin);
      this.content.fillRect(img.x, img.y, vhToPx(this.img_width), vhToPx(this.img_height));
    });
  }
};

// 初始化
ProjectResources.init();

