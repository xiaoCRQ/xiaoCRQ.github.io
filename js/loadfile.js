// 全局变量，用于存储配置文件内容
let ConfigData = {};

// 辅助函数：处理文件的网络请求和错误管理
async function fetchFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`网络错误: ${response.status}`);
  }
  return await response.text(); // 返回文件内容
}

// 辅助函数：执行页面中的 script 标签中的代码
function executeScripts(element) {
  const scripts = element.querySelectorAll('script');
  scripts.forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.head.appendChild(newScript).parentNode.removeChild(newScript); // 确保脚本执行后移除
  });
}

// 加载文件内容到指定的元素中
async function loadFileContent(elementId, path, allowScripts = true) {
  const outputElement = document.getElementById(elementId);

  try {
    const content = await fetchFile(path); // 获取文件内容
    outputElement.innerHTML = content; // 将内容插入元素中

    // 如果允许执行脚本，则执行其中的 script 标签中的代码
    if (allowScripts) {
      executeScripts(outputElement);
    } else {
      outputElement.textContent = content; // 如果不允许脚本，直接作为文本内容显示
    }

    console.log(`元素 ${elementId} 加载成功`);
  } catch (error) {
    console.error("加载文件时出错:", error);
    outputElement.textContent = "加载文件时出错，请检查路径或网络连接。";
  }
}

// 清空元素内容或删除元素本身
async function ClearRemoveElement(elementId, removeElement = false) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`元素 ${elementId} 未找到`);
    return;
  }

  if (removeElement) {
    element.remove(); // 删除元素
    console.log(`元素 ${elementId} 已删除`);
  } else {
    element.innerHTML = ''; // 清空元素内容
    console.log(`元素 ${elementId} 内容已清空`);
  }
}

// 根据配置加载多个文件，依次加载
async function loadMultipleFiles(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    console.error("无效的文件加载配置:", dataArray);
    return;
  }

  for (let item of dataArray) {
    if (item && item.id && item.path) {
      await loadFileContent(item.id, item.path); // 按照配置加载文件
    } else {
      console.error(`无效项: ${JSON.stringify(item)} (应包含 'id' 和 'path' 属性)`);
    }
  }

  console.log("所有文件已加载完成");
  return "加载完成"; // 或根据需要返回其他值
}

// 处理 FileLoadConfig 配置部分
async function processFileLoadConfig(fileLoadConfig) {
  if (Array.isArray(fileLoadConfig)) {
    fileLoadConfig.forEach(file => {
      if (file.id && file.path) {
        ConfigData.FileLoadConfig.push({
          id: file.id,
          path: file.path
        });
      } else {
        console.warn("无效的文件加载配置:", file);
      }
    });
  } else {
    console.warn("FileLoadConfig 配置无效或未找到");
  }
}

// 处理 MarkdownFiles 配置部分
async function processMarkdownFiles(markdownFiles) {
  if (Array.isArray(markdownFiles)) {
    markdownFiles.forEach(file => {
      if (file.title && file.path) {
        ConfigData.MarkdownInfo.push({
          title: file.title,
          path: file.path
        });
      } else {
        console.warn("无效的 Markdown 文件信息:", file);
      }
    });
  } else {
    console.warn("MarkdownFiles 配置无效或未找到");
  }
}

// 处理 ProjectResources 配置部分
async function processProjectResources(ProjectResources) {
  if (Array.isArray(ProjectResources)) {
    ProjectResources.forEach(file => {
      if (file.title && file.path) {
        ConfigData.ProjectConfig.push({
          title: file.title,
          path: file.path
        });
      } else {
        console.warn("无效的 ProjectResources 文件信息:", file);
      }
    });
  } else {
    console.warn("ProjectResources 配置无效或未找到");
  }
}

// 处理 PhotoConfig 配置部分
async function processPhotoConfig(photoConfig) {
  if (Array.isArray(photoConfig)) {
    ConfigData.PhotoConfig = photoConfig.map(path => {
      if (typeof path === 'string') {
        const img = new Image();
        img.src = path;  // 将路径设置为图片源
        img.onload = () => {
          console.log(`图片加载成功: ${path}`);
        };
        img.onerror = (error) => {
          console.warn(`图片加载失败: ${path}`, error);
        };
        return img;  // 返回图片对象
      } else {
        console.warn("无效的照片配置路径:", path);
        return null; // 无效路径忽略
      }
    }).filter(img => img !== null);  // 过滤掉无效路径
  } else {
    console.warn("PhotoConfig 配置无效或未找到");
  }
}


function waitForMediaLoaded(ID, MaxDelay = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(ID);
    if (!element) return reject(new Error('元素未找到'));

    const mediaElements = element.querySelectorAll('img, audio, video');
    if (mediaElements.length === 0) return resolve('没有媒体元素');

    let loadedCount = 0;
    let hasError = false;

    const checkAllLoaded = () => {
      if (loadedCount === mediaElements.length) {
        clearTimeout(timeout);
        hasError ? reject(new Error('部分媒体加载失败')) : resolve('所有媒体已加载');
      }
    };

    const onMediaEvent = (event) => {
      if (event.type === 'error') hasError = true;
      loadedCount++;
      checkAllLoaded();
    };

    mediaElements.forEach((media) => {
      if (media.complete || (media instanceof HTMLMediaElement && media.readyState >= 3)) {
        loadedCount++;
      } else {
        media.addEventListener('load', onMediaEvent, { once: true });
        media.addEventListener('error', onMediaEvent, { once: true });
      }
    });

    const timeout = setTimeout(() => {
      reject(new Error('加载超时'));
    }, MaxDelay);

    checkAllLoaded(); // 初次检查是否所有媒体已经加载
  });
}

// 加载配置文件并处理不同的配置部分
async function loadConfig(path) {
  try {
    const data = await fetchFile(path); // 获取配置文件
    const config = JSON.parse(data); // 解析 JSON 配置

    // 初始化配置对象
    ConfigData.FileLoadConfig = [];
    ConfigData.MarkdownInfo = [];
    ConfigData.PhotoConfig = [];
    ConfigData.ProjectConfig = [];
    ConfigData.Language = config.Language || 'en';  // 默认语言为 'en'

    await processFileLoadConfig(config.FileLoadConfig); // 处理文件加载配置
    await processMarkdownFiles(config.MarkdownFiles);   // 处理 Markdown 文件信息
    await processProjectResources(config.ProjectResources);   // 处理 ProjectResources 信息
    await processPhotoConfig(config.PhotoConfig);       // 处理 Photo 配置

    // 输出加载的配置
    console.log("文件加载配置:", ConfigData.FileLoadConfig);
    console.log("Markdown 文件信息:", ConfigData.MarkdownInfo);
    console.log("Project 信息:", ConfigData.ProjectConfig);
    console.log("照片配置:", ConfigData.PhotoConfig);
    console.log("语言配置:", ConfigData.Language);
    console.log("所有文件和媒体已加载完毕");

  } catch (error) {
    console.error("读取配置文件时出错:", error);
  }
}
