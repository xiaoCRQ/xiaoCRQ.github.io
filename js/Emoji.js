// 全局变量
const physicsWorlds = {};
const emojis = ['😀', '😂', '🤣', '😊', '😍', '🤩', '😎', '🤔', '🤯', '🥳', '😴', '🤑', '🤠', '👻', '👽', '🤖', '🎃', '🦄', '🐶', '🐱', '🚀', '🌟', '🎉',
  '🥰',
  '😘',
  '🫠',
  '🤗',
  '😶‍🌫️',
  '😪',
  '😵‍💫',
  '😵',
  '😎',
  '🧐',
  '😻',
];

// 当前渲染模式
let UseFunction_Emoji = 1

// Matter.js 模块
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint,
  Vector = Matter.Vector,
  Body = Matter.Body,
  Events = Matter.Events;


function initWorld(elementId, options = {}) {
  const element = document.getElementById(elementId);
  if (!element) return null;

  const engine = Engine.create();
  const world = engine.world;

  const render = Render.create({
    element: element,
    engine: engine,
    options: {
      width: element.clientWidth,
      height: element.clientHeight,
      wireframes: false,
      background: options.background || '#ffffff'
    }
  });

  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  // 添加鼠标控制
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(world, mouseConstraint);
  render.mouse = mouse;

  let MouseUse = false;
  let Scale = 3;
  let previousAngularVelocity = {}; // 存储每个物体的之前角速度

  // 添加鼠标点击事件监听器
  Events.on(mouseConstraint, 'mousedown', function (event) {
    const mousePosition = event.mouse.position;
    const bodiesAtMousePosition = Composite.allBodies(world).filter(body =>
      Matter.Bounds.contains(body.bounds, mousePosition)
    );

    if (bodiesAtMousePosition.length > 0 && UseFunction_Emoji === 2) {
      const clickedBody = bodiesAtMousePosition[0]; // 获取第一个被点击的物体
      console.log('Clicked body texture:', clickedBody.render.sprite.texture); // 输出纹理到控制台

      MouseUse = true;

      // 放大纹理和尺寸
      Body.scale(clickedBody, Scale, Scale); // 将物体尺寸放大两倍

      // 放大纹理
      if (clickedBody.render.sprite) {
        clickedBody.render.sprite.xScale *= Scale; // 水平放大纹理
        clickedBody.render.sprite.yScale *= Scale; // 垂直放大纹理
      }

      // 将物体角度归零并停止旋转
      Body.setAngle(clickedBody, 0); // 设置物体的角度为0
      previousAngularVelocity[clickedBody.id] = clickedBody.angularVelocity; // 保存之前的角速度
      Body.setAngularVelocity(clickedBody, 0); // 设置角速度为0，禁止旋转
    }
  });

  // 添加鼠标松开事件监听器
  Events.on(mouseConstraint, 'mouseup', function (event) {
    const mousePosition = event.mouse.position;
    const bodiesAtMousePosition = Composite.allBodies(world).filter(body =>
      Matter.Bounds.contains(body.bounds, mousePosition)
    );

    if (bodiesAtMousePosition.length > 0 && MouseUse === true && UseFunction_Emoji === 2) {
      MouseUse = false;
      const clickedBody = bodiesAtMousePosition[0]; // 获取第一个被点击的物体

      // 恢复物体尺寸和纹理
      Body.scale(clickedBody, 1 / Scale, 1 / Scale); // 将物体尺寸恢复到原来的一半

      // 恢复纹理
      if (clickedBody.render.sprite) {
        clickedBody.render.sprite.xScale *= 1 / Scale; // 恢复水平纹理缩放
        clickedBody.render.sprite.yScale *= 1 / Scale; // 恢复垂直纹理缩放
      }

      // 恢复之前的角速度，但不改变角度
      if (previousAngularVelocity[clickedBody.id] !== undefined) {
        Body.setAngularVelocity(clickedBody, previousAngularVelocity[clickedBody.id]); // 恢复之前的角速度
        delete previousAngularVelocity[clickedBody.id]; // 清除记录，避免内存泄漏
      }
    }
  });

  physicsWorlds[elementId] = { engine, world, render, runner, mouse, mouseConstraint };
  return physicsWorlds[elementId];
}



function createDeleteArea(worldId, x, y, width, height) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return null;

  const deleteArea = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { fillStyle: 'red', opacity: 0.3 }
  });

  Composite.add(world, deleteArea);

  Events.on(physicsWorlds[worldId].engine, 'collisionStart', function (event) {
    const pairs = event.pairs;

    pairs.forEach(pair => {
      const bodyA = pair.bodyA;
      const bodyB = pair.bodyB;

      // 检查是否有 null 值
      if (bodyA && bodyB && (bodyA === deleteArea || bodyB === deleteArea)) {
        const otherBody = bodyA === deleteArea ? bodyB : bodyA;

        // 删除碰撞的其他物体
        Composite.remove(world, otherBody);
      }
    });
  });

  return deleteArea;
}


// 删除删除区域
function removeDeleteArea(worldId, deleteArea) {
  const world = physicsWorlds[worldId]?.world;
  if (!world || !deleteArea) return;

  // 从物理世界中移除删除区域
  Composite.remove(world, deleteArea);
}

// 预操作函数：创建或删除屏幕顶部或底部的删除区域
function preOperateDeleteArea(worldId, direction = true, action = true) {
  const world = physicsWorlds[worldId]?.world;
  const render = physicsWorlds[worldId]?.render;
  if (!world || !render) return;

  const width = render.options.width;
  const height = render.options.height;

  let x = width / 2;
  let y = direction === true ? -10 : height + 10;
  let areaHeight = 1;
  let areaWidth = width;

  if (action) {
    return createDeleteArea(worldId, x, y, areaWidth, areaHeight);
  } else {
    const bodies = Composite.allBodies(world);
    bodies.forEach(body => {
      if (body && body.position) {
        // 检查位置是否匹配删除区域的中心点
        if (Math.abs(body.position.x - x) < areaWidth / 2 &&
          Math.abs(body.position.y - y) < areaHeight / 2) {
          removeDeleteArea(worldId, body);
        }
      }
    });
  }
}


// 创建物理墙
function createWall(worldId, x, y, width, height, options = {}) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return null;

  const wall = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: { fillStyle: 'transparent' },
    ...options
  });
  Composite.add(world, wall);
  return wall;
}


// 创建特殊物理区域
function createSpecialPhysicsArea(worldId, offset = 300, allowHorizontal = true, allowVertical = true) {
  const { world, render, engine } = physicsWorlds[worldId] || {};
  if (!world || !render || !engine) return;

  const width = render.options.width;
  const height = render.options.height;

  // 如果不允许传送，则添加物理墙
  if (!allowHorizontal) {
    createWall(worldId, -offset / 2, height / 2, offset, height); // 左侧墙
    createWall(worldId, width + offset / 2, height / 2, offset, height); // 右侧墙
  }

  if (!allowVertical) {
    // createWall(worldId, width / 2, -offset / 2, width, offset); // 顶部墙
    createWall(worldId, width / 2, height + offset / 2, width, offset); // 底部墙
  }

  Events.on(engine, 'afterUpdate', function () {
    const bodies = Composite.allBodies(world);
    for (let body of bodies) {
      if (body.position.y > height + offset) {
        Body.setPosition(body, { x: body.position.x, y: -offset });
      } else if (body.position.y < -offset) {
        Body.setPosition(body, { x: body.position.x, y: height + offset });
      }
      if (body.position.x > width + offset) {
        Body.setPosition(body, { x: -offset, y: body.position.y });
      } else if (body.position.x < -offset) {
        Body.setPosition(body, { x: width + offset, y: body.position.y });
      }
    }
  });
}

// 控制重力
function setGravity(worldId, x, y) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return;
  world.gravity.x = x;
  world.gravity.y = y;
}

// 施加推力，支持起始点、时间和范围控制
function applyForce(worldId, startX, startY, endX, endY, forceX, forceY, duration = 1000, range = 100) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return;

  const bodies = Composite.allBodies(world);
  const startTime = Date.now();

  // 定时施加推力，直到时间到达设定的持续时间
  const interval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime > duration) {
      clearInterval(interval); // 超过持续时间后停止施加推力
      return;
    }

    // 计算当前位置的推力作用点
    const progress = elapsedTime / duration;
    const currentX = startX + (endX - startX) * progress;
    const currentY = startY + (endY - startY) * progress;

    bodies.forEach(body => {
      // 计算物体与作用点 (currentX, currentY) 的距离
      const distance = Vector.magnitude(Vector.sub(body.position, { x: currentX, y: currentY }));

      // 只对距离小于作用范围的物体施加推力
      if (distance < range) {
        // 施加推力
        const force = Vector.create(forceX, forceY);
        Body.applyForce(body, body.position, force);
      }
    });
  }, 1000 / 60);  // 每秒更新60次
}

// 屏幕底部中心施加向上的推力，持续一秒，推力作用范围为100像素
function applyUpwardForceToTop(worldId) {
  const width = physicsWorlds[worldId]?.render.options.width;
  const height = physicsWorlds[worldId]?.render.options.height;

  // 屏幕底部中心坐标
  const startX = width / 2;
  const startY = height;

  // 屏幕顶部中心坐标
  const endX = width / 2;
  const endY = 0;

  // 向上的推力
  const forceX = 0;
  const forceY = -0.1;  // 向上的推力

  applyForce(worldId, startX, startY, endX, endY, forceX, forceY, 500, width * 2);
}

// 手机摇一摇功能
function initShakeDetection() {
  let lastShakeTime = 0;

  window.addEventListener('devicemotion', event => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const shakeStrength = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
    const now = Date.now();

    if (shakeStrength > 20 && now - lastShakeTime > 500) { // 摇动阈值和冷却时间
      lastShakeTime = now;

      // 遍历所有物理世界，随机施加冲击力
      Object.keys(physicsWorlds).forEach(worldId => {
        const world = physicsWorlds[worldId]?.world;
        if (!world) return;

        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
          const randomForce = Vector.create((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
          Body.applyForce(body, body.position, randomForce);
        });
      });
    }
  });
}

// 添加按键控制功能
function initKeyboardControls() {
  window.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      // 空格键：随机施加冲击力，与手机摇一摇相同
      Object.keys(physicsWorlds).forEach(worldId => {
        const world = physicsWorlds[worldId]?.world;
        if (!world) return;

        const bodies = Composite.allBodies(world);
        bodies.forEach(body => {
          const randomForce = Vector.create((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
          Body.applyForce(body, body.position, randomForce);
        });
      });
    }
  });

  window.addEventListener('wheel', event => {
    Object.keys(physicsWorlds).forEach(worldId => {
      const world = physicsWorlds[worldId]?.world;
      if (!world) return;

      const bodies = Composite.allBodies(world);
      const forceY = event.deltaY < 0 ? 0.05 : -0.05; // 滚轮向上为负值，向下为正值
      bodies.forEach(body => {
        Body.applyForce(body, body.position, { x: 0, y: forceY });
      });
    });
  });
}

function clearWorlds() {
  // 清除特殊区域和墙壁
  Object.keys(physicsWorlds).forEach(worldId => {
    const { world, render, engine, mouseConstraint } = physicsWorlds[worldId] || {};
    if (world && render) {

      // 临时保存 MouseConstraint
      const tempMouseConstraint = mouseConstraint;

      // 清除所有物理元素，但保留 MouseConstraint
      Composite.clear(world, false, true);

      // 重新添加 MouseConstraint
      if (tempMouseConstraint) {
        Composite.add(world, tempMouseConstraint);
      }

      // 删除特殊区域
      Events.off(engine, 'afterUpdate'); // 移除相关事件监听器

      // 清空画布并调整尺寸
      render.canvas.width = render.options.width = render.element.clientWidth;
      render.canvas.height = render.options.height = render.element.clientHeight;
    }
  });
}

function WorldRefresh() {
  clearWorlds()
  // 重新创建特殊区域和墙壁
  Object.keys(physicsWorlds).forEach(worldId => {
    const { render } = physicsWorlds[worldId] || {};
    if (render) {
      createSpecialPhysicsArea(worldId); // 重新创建特殊区域
    }
  });

  // 重新添加所有元素
  if (UseFunction_Emoji === 1)
    createEmojiS(15, 6, 4, 0, 0, 0)
  else
    if (UseFunction_Emoji === 2)
      createPhotoS(15, 8, 4, 0, 0, 0)
}


// 初始化函数
function init() {
  // 初始化物理世界
  const specialWorld = initWorld('Emoji', { background: 'rgba(0, 0, 0, 0)' });

  if (specialWorld) {
    const { render } = specialWorld;
    createSpecialPhysicsArea('Emoji');

    if (UseFunction_Emoji === 1)
      createEmojiS(15, 6, 4, 0, 0, 0)
    else
      if (UseFunction_Emoji === 2)
        createPhotoS(15, 8, 4, 0, 0, 0)

    setGravity('Emoji', 0, 0.025);  // 设置适当的重力
  }

  // 初始化手机摇一摇功能
  if (MobileDevice)
    initShakeDetection();
}

// 窗口大小调整时重新初始化
window.addEventListener('resize', () => {
  WorldRefresh()
});

// 当DOM加载完成时初始化
// document.addEventListener('DOMContentLoaded', init);
init()
initKeyboardControls()


// ------------------------------------------------
// 创建Emoji物理元素
async function createEmoji(worldId, x, y, size, delay) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return null;

  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  // 设置生成位置：将 y 坐标设置为画布上方 (负值)，元素将从上方进入
  if (x === 0) x = Math.random() * physicsWorlds[worldId].render.options.width;
  else x = x * physicsWorlds[worldId].render.options.width;

  if (y === 0) y = Math.random() * physicsWorlds[worldId].render.options.height;
  else y = y * physicsWorlds[worldId].render.options.height;
  // const y = -size;

  // 延迟创建 Emoji
  setTimeout(() => {
    const body = Bodies.circle(x, y, size / 2, {
      render: {
        sprite: {
          texture: `data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${size}\" height=\"${size}\" viewBox=\"0 0 110 110\"><text y=\".9em\" font-size=\"90\">${emoji}</text></svg>`,
          xScale: 1,
          yScale: 1
        }
      },
      restitution: 0.8  // 增加一些反弹效果
    });

    // 设置随机旋转角度
    const randomAngle = Math.random() * Math.PI * 2; // 随机角度 [0, 2π)
    Body.setAngle(body, randomAngle);

    // 将新创建的 Emoji 物体添加到世界中
    Composite.add(world, body);
  }, delay);  // 使用随机延迟
}


async function createEmojiS(count, Size, SizeRandom, x, y, Delay) {
  UseFunction_Emoji = 1
  // 在物理世界中创建 N 个 Emoji
  for (let i = 0; i < count; i++) {
    let size
    if (MobileDevice)
      size = vhToPx(Size) + Math.random() * vhToPx(SizeRandom);  // 随机大小
    else
      size = vwToPx(Size) + Math.random() * vwToPx(SizeRandom);  // 随机大小
    const delay = Math.random() * Delay;  // 随机最大延时
    createEmoji('Emoji', x, y, size, delay);  // 生成位置在屏幕上方，且具有随机延时
  }
}

// ------------------------------------------------
// 鸣谢图册

function createPhoto(worldId, x, y, width, delay) {
  const world = physicsWorlds[worldId]?.world;
  if (!world) return null;

  // 随机选择一张图片对象
  const photoObject = ConfigData.PhotoConfig[Math.floor(Math.random() * ConfigData.PhotoConfig.length)];

  // 确保 photoObject 是有效的 <img> 对象，并获取其 src 属性
  const photoPath = photoObject?.src;
  if (!photoPath) {
    console.warn("无效的图片对象，跳过创建");
    return null;
  }

  // 设置生成位置
  if (x === 0) x = Math.random() * physicsWorlds[worldId].render.options.width;
  else x = x * physicsWorlds[worldId].render.options.width;

  if (y === 0) y = Math.random() * physicsWorlds[worldId].render.options.height;
  else y = y * physicsWorlds[worldId].render.options.height;

  // 创建一个临时的 Image 对象来获取图片的原始尺寸
  const img = new Image();
  img.src = photoPath;

  // 延迟创建图片
  setTimeout(() => {
    // 计算高度，保持原始宽高比
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    const height = width * aspectRatio;

    const body = Bodies.rectangle(x, y, width, height, {
      render: {
        sprite: {
          texture: photoPath,
          xScale: width / img.naturalWidth,
          yScale: height / img.naturalHeight
        }
      },
      restitution: 0.8,  // 增加一些反弹效果
    });

    // 设置随机旋转角度
    const randomAngle = Math.random() * Math.PI * 2;
    Body.setAngle(body, randomAngle);

    // 将新创建的图片物体添加到世界中
    Composite.add(world, body);
  }, delay);
}

// 创建多个图片物理元素
function createPhotoS(count, Size, SizeRandom, x, y, Delay) {
  UseFunction_Emoji = 2
  // 在物理世界中创建 N 个图片
  for (let i = 0; i < count; i++) {
    let size;
    if (MobileDevice)
      size = vhToPx(Size) + Math.random() * vhToPx(SizeRandom);  // 随机大小
    else
      size = vwToPx(Size) + Math.random() * vwToPx(SizeRandom);  // 随机大小
    const delay = Math.random() * Delay;  // 随机最大延时
    createPhoto('Emoji', x, y, size, delay);  // 生成位置在屏幕上，且具有随机延时
  }
}

// ------------------------------------------------
