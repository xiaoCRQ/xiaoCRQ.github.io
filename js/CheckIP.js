// IP查询
// async function checkIPAndRedirect(targetUrl) {
//   const localProxyUrl = 'http://192.168.1.28:80/ip-api/json'; // 本地代理服务器地址
//
//   try {
//     // 使用本地代理服务器请求IP信息
//     const response = await fetch(localProxyUrl);
//
//     if (!response.ok) {
//       throw new Error(`Network response was not ok: ${response.statusText}`);
//     }
//
//     const data = await response.json();
//     console.log(`IP 查询结果:`, data);
//
//     // 判断是否为中国IP
//     if (data.country === 'China' || data.country === 'CN') {
//       console.log(`访问来自中国，重定向到 ${targetUrl}`);
//       window.location.href = targetUrl; // 如果是中国IP，重定向
//     } else {
//       console.log('访问不来自中国，继续访问原网站');
//     }
//   } catch (error) {
//     console.error('获取IP信息失败:', error.message);
//     // 进一步打印详细的错误信息
//     console.error(error);
//   }
// }
// checkIPAndRedirect('192.168.1.107')

window.location.href = 'http://192.168.1.107';

