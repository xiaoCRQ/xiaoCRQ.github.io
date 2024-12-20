(function () {
  // 创建FPS显示器类
  class FPSMonitor {
    constructor() {
      this.last = Date.now();
      this.ticks = 0;
      this.fpsElement = null;

      this.init();
    }

    init() {
      // 创建并设置FPS显示器的样式
      this.fpsElement = document.createElement('div');
      this.fpsElement.style.position = 'fixed';
      this.fpsElement.style.top = '10px';
      this.fpsElement.style.left = '10px';
      this.fpsElement.style.zIndex = '9999';
      this.fpsElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      this.fpsElement.style.color = '#fff';
      this.fpsElement.style.padding = '5px 10px';
      this.fpsElement.style.borderRadius = '5px';
      this.fpsElement.style.fontFamily = 'Arial, sans-serif';
      this.fpsElement.style.pointerEvents = 'none';
      document.body.appendChild(this.fpsElement);

      // 开始请求动画帧
      requestAnimationFrame(this.rafLoop.bind(this));
    }

    rafLoop() {
      this.ticks += 1;
      if (this.ticks >= 30) {
        const now = Date.now();
        const diff = now - this.last;
        const fps = Math.round(1000 / (diff / this.ticks));
        this.last = now;
        this.ticks = 0;

        // 更新FPS显示
        this.fpsElement.textContent = `FPS: ${fps}`;
      }
      requestAnimationFrame(this.rafLoop.bind(this));
    }
  }

  // 实例化FPS监视器
  new FPSMonitor();
})();
