let ConfigData = {}; // 全局变量，用于存储配置文件内容


async function loadFileContent(elementId, path, allowScripts = true) {
  const outputElement = document.getElementById(elementId);

  try {
    const response = await fetch(path); // 从指定路径获取文件
    if (!response.ok) {
      throw new Error(`网络错误：${response.status}`);
    }

    // 直接将响应体插入到指定元素中
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }

    if (allowScripts) {
      outputElement.innerHTML = result;
      // 查找并运行 script 标签中的代码
      const scripts = outputElement.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
        } else {
          newScript.textContent = script.textContent;
        }
        document.head.appendChild(newScript).parentNode.removeChild(newScript); // 确保执行后移除
      });
    } else {
      // 不允许 script 标签时，将内容以文本形式插入
      outputElement.textContent = result;
    }

    console.log(`元素 ${elementId} 已加载`);
  } catch (error) {
    console.error("加载文件时出错:", error);
    outputElement.textContent = "加载文件时出错，请检查路径或网络连接。";
  }
}


async function ClearRemoveElement(elementId, removeElement = false) {
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`元素 ${elementId} 未找到`);
    return; // 如果没有找到该元素，退出函数
  }

  if (removeElement) {
    // 删除整个元素
    element.remove();
    console.log(`元素 ${elementId} 已删除`);
  } else {
    // 仅清空元素内容
    element.innerHTML = '';
    console.log(`元素 ${elementId} 内容已清空`);
  }
}

async function loadMultipleFiles(dataArray) {
  // 检查 dataArray 是否是有效的数组
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    console.error("无效的文件加载配置数据：", dataArray);
    return;  // 如果配置无效，退出函数
  }

  // 遍历配置数组，依次调用 loadFileContent 函数
  for (let i = 0; i < dataArray.length; i++) {
    const item = dataArray[i];

    // 检查 item 是否是一个包含 id 和 path 的对象
    if (item && typeof item === 'object' && item.id && item.path) {
      const elementId = item.id;
      const path = item.path;
      await loadFileContent(elementId, path);  // 等待当前文件加载完成
    } else {
      console.error(`无效的项：${JSON.stringify(item)}，应为包含 'id' 和 'path' 属性的对象`);
    }
  }

  // 处理完成后的回调或返回结果
  console.log("所有文件已加载完成");
  return "加载完成";  // 或者你可以根据需要返回任何值
}

async function loadConfig(path) {
  try {
    const response = await fetch(path); // 从指定路径获取配置文件
    if (!response.ok) {
      throw new Error(`网络错误：${response.status}`);
    }

    const data = await response.json(); // 解析 JSON 数据

    // 初始化配置对象
    ConfigData.FileLoadConfig = [];
    ConfigData.MarkdownInfo = [];
    ConfigData.Language = data.Language || 'en'; // 默认语言为 'en'

    // 处理需要加载的内容
    if (Array.isArray(data.FileLoadConfig)) {
      data.FileLoadConfig.forEach((file) => {
        if (file.id && file.path) {
          ConfigData.FileLoadConfig.push({
            id: file.id,   // 要加载内容的元素 ID
            path: file.path, // 对应的文件路径
          });
        } else {
          console.warn("文件加载配置无效:", file);
        }
      });
    } else {
      console.warn("FileLoadConfig 配置未找到或格式无效");
    }

    // 处理 Markdown 文件信息
    if (Array.isArray(data.MarkdownFiles)) {
      data.MarkdownFiles.forEach((file) => {
        if (file.title && file.path) {
          ConfigData.MarkdownInfo.push({
            title: file.title, // Markdown 文档的标题
            path: file.path,   // Markdown 文档的路径
          });
        } else {
          console.warn("Markdown 文件信息无效:", file);
        }
      });
    } else {
      console.warn("MarkdownFiles 配置未找到或格式无效");
    }

    // 输出加载的配置
    console.log("需要加载的文件配置:", ConfigData.FileLoadConfig); // 输出需要加载的文件配置
    console.log("Markdown 文件信息:", ConfigData.MarkdownInfo);    // 输出 Markdown 文件信息
    console.log("语言配置:", ConfigData.Language);                 // 输出语言配置

  } catch (error) {
    console.error("读取配置文件时出错:", error);
  }
}


