async function renderMarkdownById(id) {
  try {
    // 获取指定 ID 的元素
    const element = document.getElementById(id);
    if (!element) {
      // 如果找不到元素，抛出错误
      throw new Error(`未找到 ID 为 '${id}' 的元素。`);
    }

    // 从元素的 innerHTML 中获取 Markdown 内容，并去除首尾空白
    const markdownContent = element.innerHTML.trim();

    // 使用 marked 库将 Markdown 内容解析为 HTML
    // 注意，这里使用的是 marked.parse() 方法
    element.innerHTML = marked.parse(markdownContent);
    hljs.highlightAll();
  } catch (error) {
    // 捕获错误并输出到控制台
    console.error('渲染 Markdown 时出错：', error);

    // 如果元素存在，显示错误信息
    const element = document.getElementById(id);
    if (element) {
      element.textContent = '内容渲染失败。';
    }
  }
}


async function loadMarkdownTitles(elementId, renderId = 'Blog_Page') {
  const container = document.getElementById(elementId);

  if (!container) {
    console.error(`未找到 ID 为 '${elementId}' 的元素`);
    return;
  }

  // 清空目标容器内容
  container.innerHTML = '';

  if (!ConfigData.MarkdownInfo || ConfigData.MarkdownInfo.length === 0) {
    console.warn("Markdown 文件信息为空或未加载");
    container.textContent = "无可用的 Markdown 文件标题。";
    return;
  }

  // 遍历 MarkdownInfo 并为每个标题创建 div
  ConfigData.MarkdownInfo.forEach((file) => {
    if (file.title && file.path) {
      // 创建 div 元素
      const div = document.createElement('div');
      const randomId = `md-title-${Math.random().toString(36).substr(2, 9)}`; // 生成随机 ID
      div.id = randomId;
      div.textContent = file.title; // 设置标题内容
      div.setAttribute('data-path', file.path); // 添加路径信息作为自定义属性

      // 添加点击事件
      div.addEventListener('click', async () => {
        try {
          const dataPath = div.getAttribute('data-path');
          console.log(`加载文件路径: ${dataPath}`);
          await loadFileContent(renderId, dataPath); // 加载文件内容 
          await renderMarkdownById(renderId, dataPath); // 渲染 Markdown 内容
        } catch (error) {
          console.error('加载或渲染 Markdown 时出错:', error);
        }
      });

      // 将 div 插入到容器中
      container.appendChild(div);
    } else {
      console.warn("Markdown 文件信息无效:", file);
    }
  });

  console.log(`Markdown 文件标题已加载到 ID 为 '${elementId}' 的元素`);
}

