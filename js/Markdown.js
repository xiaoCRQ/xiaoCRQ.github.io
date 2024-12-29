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

    console.log(element.id, '已渲染');
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



let MD_NOW;

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

  const div1 = document.createElement('div');
  const div2 = document.createElement('div');
  div1.className = div2.className = 'BlogNav_Line'

  container.appendChild(div1);

  // 遍历 MarkdownInfo 并为每个标题创建 div
  ConfigData.MarkdownInfo.forEach((file, index) => {
    if (file.title && file.path) {
      // 创建 div 元素
      const div = document.createElement('a');
      div.id = `md-title-${Math.random().toString(36).substr(2, 9)}`; // 生成随机 ID
      div.className = "MD-Title Text_Line_Black";
      div.textContent = file.title; // 设置标题内容
      div.setAttribute('data-path', file.path); // 添加路径信息作为自定义属性

      // 添加点击事件
      div.addEventListener('click', async () => {
        try {
          const dataPath = div.getAttribute('data-path');
          if (dataPath !== MD_NOW) {
            console.log(`加载文件路径: ${dataPath}`);
            MD_NOW = dataPath; // 更新当前加载的文件路径
            BlogNav(false)
            NavAnimes(false)
            await loadIcon();
            await loadFileContent(renderId, dataPath); // 加载文件内容 
            await renderMarkdownById(renderId, dataPath); // 渲染 Markdown 内容
            await waitForMediaLoaded(renderId);
            lenis.resize()
            await loadIcon(false);
          }
        } catch (error) {
          await loadIcon(false);
          console.error('加载或渲染 Markdown 时出错:', error);
        }
      });

      // 将 div 插入到容器中
      container.appendChild(div);

      // 默认加载第一篇 Markdown 文件
      if (index === 0) {
        const dataPath = div.getAttribute('data-path');
        console.log(`加载文件路径: ${dataPath}`);
        MD_NOW = dataPath; // 更新当前加载的文件路径

        loadFileContent(renderId, dataPath)
          .then(async () => {
            await renderMarkdownById(renderId, dataPath)
            await waitForMediaLoaded(renderId);
            lenis.resize()
          })
          .catch(error => console.error('发生错误:', error));
      }

    } else {
      console.warn("Markdown 文件信息无效:", file);
    }
  });

  container.appendChild(div2);

  console.log(`Markdown 文件标题已加载到 ID 为 '${elementId}' 的元素`);
}

