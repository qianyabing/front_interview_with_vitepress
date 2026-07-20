

## 一、基础知识（10题）

### 1. 盒模型及其应用场景

**面试官可能怎么问：**

- "请讲一下CSS盒模型"
- "box-sizing的两个值有什么区别？什么时候用哪个？"
- "你项目中遇到过盒模型相关的问题吗？"

**推荐回答框架：**

CSS盒模型定义了元素在页面中占据空间的计算方式，分为两种：

1. **标准盒模型（content-box）**：width/height只包含content，padding和border额外计算
2. **怪异盒模型（border-box）**：width/height包含content + padding + border

**应用场景结合你的项目：**

- 在智慧工地安全监控系统中，大屏仪表板布局时，使用border-box可以更方便地控制元素总尺寸
- 在华为WeLink的IM消息气泡中，使用border-box确保padding增加时整体宽度不变

```css
/* 全局重置，统一盒模型计算方式 */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 实际项目示例：消息气泡 */
.message-bubble {
  box-sizing: border-box;
  width: 300px;        /* 总宽度固定为300px */
  padding: 12px 16px;  /* padding在内部消化 */
  border: 1px solid #e0e0e0;
  /* 最终content宽度 = 300 - 32(padding) - 2(border) = 266px */
}

/* 大屏仪表板卡片 */
.dashboard-card {
  box-sizing: border-box;
  width: 25%;          /* 响应式布局，4列 */
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  /* 不用担心padding撑破布局 */
}
```

**延伸考点：** margin合并、BFC（块级格式化上下文）

---

### 2. Flex和Grid布局的区别

**面试官可能怎么问：**

- "什么时候用Flex，什么时候用Grid？"
- "Grid的auto-fill和auto-fit有什么区别？"
- "Flex的align-items和justify-content分别控制什么？"

**推荐回答框架：**

| 维度   | Flex          | Grid        |
| ---- | ------------- | ----------- |
| 维度   | 一维布局（行或列）     | 二维布局（行和列同时） |
| 适用场景 | 组件内部排列、导航栏、居中 | 整体页面布局、复杂网格 |
| 对齐控制 | 单轴对齐          | 双轴对齐        |
| 间隙控制 | gap（较新）       | gap（原生支持）   |

**结合项目回答：**

```css
/* Flex：WeLink消息列表的头部工具栏 */
.chat-header {
  display: flex;
  justify-content: space-between;  /* 两端对齐 */
  align-items: center;              /* 垂直居中 */
  padding: 0 16px;
  height: 56px;
}

/* Grid：智慧工地大屏仪表板 */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4列等宽 */
  grid-template-rows: auto auto;           /* 2行自适应 */
  gap: 20px;
}

/* Grid：更复杂的区域布局 */
.dashboard-complex {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  gap: 10px;
}
```

**关键区别代码示例：**

```css
/* auto-fill vs auto-fit - 常考点 */
.grid-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  /* 空间不够时，保留空轨道（可能右侧留白） */
}

.grid-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  /* 空间不够时，折叠空轨道（拉伸填充） */
}
```

---

### 3. JavaScript闭包是什么，有什么用途？

**面试官可能怎么问：**

- "什么是闭包？"
- "闭包会导致内存泄漏吗？"
- "你在项目中用过闭包吗？举个例子"
- "循环中使用闭包的常见问题怎么解决？"

**推荐回答框架：**

闭包是指**函数能够记住并访问其词法作用域，即使该函数在当前词法作用域之外执行**。

核心三要素：

1. 函数嵌套函数
2. 内部函数引用外部函数的变量
3. 内部函数被返回到外部使用

**结合项目回答（WeLink消息模块）：**

```javascript
// 场景1：消息模块的防抖搜索（结合手撕代码题）
function createDebouncedSearch() {
  let timer = null;  // 闭包保存timer状态

  return function(keyword) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('搜索:', keyword);
      // 实际调用API搜索消息
    }, 300);
  };
}

const searchMessages = createDebouncedSearch();
searchMessages('华为');  // 300ms后执行
searchMessages('华为OD'); // 重新计时

// 场景2：WeLink消息列表的私有状态管理
function createMessageStore() {
  let messages = [];      // 私有变量，外部无法直接访问
  let unreadCount = 0;

  return {
    addMessage(msg) {
      messages.push(msg);
      if (!msg.read) unreadCount++;
    },
    getMessages() {
      return [...messages]; // 返回副本，防止外部修改
    },
    getUnreadCount() {
      return unreadCount;
    },
    markAsRead(id) {
      const msg = messages.find(m => m.id === id);
      if (msg && !msg.read) {
        msg.read = true;
        unreadCount--;
      }
    }
  };
}

const store = createMessageStore();
// messages和unreadCount被闭包保护，无法从外部直接修改
```

**经典循环闭包问题：**

```javascript
// ❌ 错误：循环中的var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 输出 3, 3, 3
}

// ✅ 方案1：使用IIFE（立即执行函数）
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100); // 输出 0, 1, 2
  })(i);
}

// ✅ 方案2：使用let（ES6块级作用域）
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 输出 0, 1, 2
}
```

**内存泄漏说明：**
闭包本身不会导致内存泄漏，但如果闭包持有大量数据且长期不被释放，会造成内存占用过高。

---

### 4. 事件循环机制怎么理解？

**面试官可能怎么问：**

- "讲一下事件循环（Event Loop）"
- "宏任务和微任务的区别？执行顺序？"
- "setTimeout(fn, 0)什么时候执行？"
- "Promise.then和setTimeout哪个先执行？"
- "async/await的执行顺序？"

**推荐回答框架：**

JavaScript是单线程语言，事件循环是其**异步编程的核心机制**，负责协调调用栈、宏任务队列和微任务队列的执行。

**执行顺序（重点）：**

1. 同步代码 → 调用栈
2. 微任务（Promise.then/catch/finally、MutationObserver、queueMicrotask）
3. 宏任务（setTimeout、setInterval、setImmediate、I/O、UI渲染）
4. 重复步骤2-3

**结合项目（WebSocket实时告警推送）：**

```javascript
console.log('1. 同步代码开始');

setTimeout(() => {
  console.log('5. setTimeout宏任务');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise微任务1');
});

Promise.resolve().then(() => {
  console.log('4. Promise微任务2');
});

console.log('2. 同步代码结束');

// 输出顺序：1 → 2 → 3 → 4 → 5

// ========== 实际项目：WebSocket消息处理 ==========
class AlertService {
  constructor() {
    this.ws = new WebSocket('wss://alert-server.com');
    this.messageQueue = []; // 消息队列

    this.ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);

      // 微任务：立即处理高优先级告警（不阻塞渲染）
      Promise.resolve().then(() => {
        if (alert.level === 'critical') {
          this.showCriticalAlert(alert); // 立即弹窗
        }
      });

      // 宏任务：延迟处理普通告警
      setTimeout(() => {
        if (alert.level === 'normal') {
          this.showNotification(alert); // 延迟通知
        }
      }, 100);
    };
  }
}
```

**async/await执行顺序（高频考点）：**

```javascript
async function test() {
  console.log('1. async开始');

  await Promise.resolve();  // await后面的代码变成微任务
  console.log('3. await之后');

  await new Promise(resolve => {
    console.log('4. Promise构造器同步执行');
    resolve();
  });
  console.log('5. 第二个await之后');
}

test();
console.log('2. 同步代码');

// 输出：1 → 2 → 3 → 4 → 5
```

**综合面试题（必会）：**

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

console.log('6');

// 输出：1 → 6 → 4 → 2 → 3 → 5
// 第一轮：同步 1, 6 → 微任务 4 → 宏任务 2
// 第二轮：微任务 3 → 宏任务 5
```

---

### 5. Promise有几种状态，如何链式调用？

**面试官可能怎么问：**

- "Promise有几种状态？"
- "Promise.all和Promise.race的区别？"
- "Promise.allSettled是干什么的？"
- "如何实现一个Promise？"
- "Promise链中错误怎么捕获？"

**推荐回答框架：**

Promise三种状态：

- **pending**：进行中
- **fulfilled**：已成功
- **rejected**：已失败

状态转换：pending → fulfilled 或 pending → rejected，**不可逆**。

**链式调用核心：** then返回一个新的Promise

```javascript
// ========== 基础链式调用 ==========
fetch('/api/user')
  .then(res => res.json())      // 返回解析后的数据
  .then(data => fetch(`/api/orders/${data.id}`))  // 返回新的Promise
  .then(res => res.json())
  .then(orders => console.log(orders))
  .catch(err => console.error('请求失败:', err))
  .finally(() => console.log('请求完成'));

// ========== 结合项目：IRMP报告平台的多步骤流程 ==========
class ReportService {
  async generateReport(templateId, data) {
    return fetch(`/api/templates/${templateId}`)
      .then(res => {
        if (!res.ok) throw new Error('模板获取失败');
        return res.json();
      })
      .then(template => this.fillTemplate(template, data))
      .then(filled => this.validateReport(filled))
      .then(valid => {
        if (!valid) throw new Error('报告验证失败');
        return this.renderPDF(valid);
      })
      .then(pdf => this.saveReport(pdf))
      .catch(err => {
        console.error('报告生成失败:', err);
        throw err; // 继续向上抛，让调用方处理
      });
  }
}

// ========== Promise.all：并行请求（智慧工地多设备数据） ==========
async function fetchDashboardData() {
  const [devices, alerts, envData] = await Promise.all([
    fetch('/api/devices').then(r => r.json()),
    fetch('/api/alerts').then(r => r.json()),
    fetch('/api/environment').then(r => r.json())
  ]);
  return { devices, alerts, envData };
}

// ========== Promise.race：超时控制（WebRTC连接） ==========
function connectWithTimeout(peerConnection, timeout = 5000) {
  return Promise.race([
    new Promise((resolve, reject) => {
      peerConnection.oniceconnectionstatechange = () => {
        if (peerConnection.iceConnectionState === 'connected') {
          resolve('连接成功');
        }
      };
    }),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('连接超时')), timeout)
    )
  ]);
}

// ========== Promise.allSettled：批量操作不中断 ==========
async function batchApproveReports(reportIds) {
  const results = await Promise.allSettled(
    reportIds.map(id => fetch(`/api/reports/${id}/approve`, { method: 'POST' }))
  );

  const success = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');

  return { success, failed };
}

// ========== 手写Promise（简化版） ==========
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        try {
          const result = onFulfilled(this.value);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } else if (this.state === 'rejected') {
        try {
          const result = onRejected(this.reason);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } else {
        this.onFulfilledCallbacks.push((value) => {
          try {
            const result = onFulfilled(value);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          try {
            const result = onRejected(reason);
            resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      }
    });
  }
}
```

---

### 6. Ajax和Fetch的区别？

**面试官可能怎么问：**

- "Ajax和Fetch有什么区别？"
- "Fetch的优缺点？"
- "Fetch怎么取消请求？"
- "Axios相比Fetch有什么优势？"

**推荐回答框架：**

| 维度     | Ajax (XMLHttpRequest) | Fetch API         | Axios                |
| ------ | --------------------- | ----------------- | -------------------- |
| API风格  | 事件驱动，较繁琐              | 基于Promise，简洁      | 基于Promise，功能丰富       |
| 进度监控   | 原生支持onprogress        | 需要ReadableStream  | 原生支持onUploadProgress |
| 取消请求   | 原生支持abort()           | 需要AbortController | 原生支持CancelToken      |
| 自动JSON | 否，需手动JSON.parse       | 需调用.json()        | 自动转换                 |
| 拦截器    | 无                     | 无                 | 请求/响应拦截器             |
| 浏览器兼容  | IE7+                  | IE不支持             | 现代浏览器                |

```javascript
// ========== Ajax (XMLHttpRequest) ==========
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data', true);
xhr.onprogress = (e) => {
  const percent = (e.loaded / e.total) * 100;
  console.log(`下载进度: ${percent}%`);
};
xhr.onload = () => {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
};
xhr.send();

// 取消请求
xhr.abort();

// ========== Fetch API ==========
// 基础用法
fetch('/api/data')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 取消请求（AbortController）
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal })
  .then(res => res.json())
  .catch(err => {
    if (err.name === 'AbortError') {
      console.log('请求已取消');
    }
  });

// 5秒后取消
setTimeout(() => controller.abort(), 5000);

// 进度监控（ReadableStream）
fetch('/api/large-file')
  .then(res => {
    const reader = res.body.getReader();
    const contentLength = +res.headers.get('Content-Length');
    let received = 0;

    return new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            received += value.length;
            console.log(`进度: ${(received / contentLength * 100).toFixed(2)}%`);
            controller.enqueue(value);
            push();
          });
        }
        push();
      }
    });
  });

// ========== Axios（项目中推荐） ==========
import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// 请求拦截器（添加token）
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器（统一错误处理）
instance.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      //  token过期，跳转登录
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 取消请求
const source = axios.CancelToken.source();
instance.get('/data', { cancelToken: source.token });
source.cancel('用户取消操作');
```

---

### 7. 跨域解决方案有哪些？

**面试官可能怎么问：**

- "什么是跨域？怎么解决？"
- "CORS的原理？简单请求和预检请求？"
- "JSONP的原理和局限性？"
- "代理怎么解决跨域？"
- "postMessage是干什么的？"

**推荐回答框架：**

跨域（CORS）是浏览器的同源策略限制，协议、域名、端口任一不同即跨域。

```javascript
// ========== 1. CORS（服务端配置，最常用） ==========
// 服务端响应头
/*
Access-Control-Allow-Origin: https://your-domain.com  // 或 *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true  // 允许携带cookie
Access-Control-Max-Age: 86400  // 预检请求缓存时间
*/

// 简单请求 vs 预检请求（OPTIONS）
// 简单请求：GET/HEAD/POST + 特定Content-Type + 无自定义头
// 预检请求：先发送OPTIONS，确认允许后再发送实际请求

// ========== 2. 代理（开发环境最常用） ==========
// vite.config.js
eexport default {
  server: {
    proxy: {
      '/api': {
        target: 'http://backend-server.com',
        changeOrigin: true,  // 修改请求头中的host
        pathRewrite: { '^/api': '' }
      }
    }
  }
};

// nginx配置
/*
location /api/ {
  proxy_pass http://backend-server.com/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
*/

// ========== 3. JSONP（只支持GET，已过时） ==========
function jsonp(url, callbackName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    window[callbackName] = (data) => {
      resolve(data);
      document.head.removeChild(script);
      delete window[callbackName];
    };
    script.src = `${url}?callback=${callbackName}`;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ========== 4. postMessage（跨窗口通信） ==========
// 父窗口
const iframe = document.getElementById('cross-origin-iframe');
iframe.contentWindow.postMessage({ type: 'GET_DATA', payload: {} }, 'https://other-domain.com');

window.addEventListener('message', (e) => {
  if (e.origin !== 'https://other-domain.com') return; // 验证来源
  console.log('收到数据:', e.data);
});

// ========== 5. WebSocket（不受同源策略限制） ==========
const ws = new WebSocket('wss://other-domain.com/socket');
ws.onmessage = (e) => console.log(e.data);

// ========== 结合项目：MMMP监控平台的跨域处理 ==========
/*
场景：内网摄像头RTSP流需要通过WebRTC在公网播放
方案：
1. 使用frp内网穿透，将内网服务映射到公网域名
2. Nginx反向代理，统一入口，解决跨域
3. WebRTC的ICE服务器配置STUN/TURN，处理NAT穿透
*/
```

---

### 8. Webpack打包优化做过哪些？

**面试官可能怎么问：**

- "Webpack打包优化做过什么？"
- "怎么减小打包体积？"
- "Code Splitting怎么配置？"
- "Tree Shaking原理？"
- "Webpack和Vite的区别？"

**推荐回答框架：**

```javascript
// ========== webpack.config.js 优化配置 ==========
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',

  // 1. 代码分割
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 提取第三方库
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        // 提取公共代码
        common: {
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    },
    // 2. Tree Shaking
    usedExports: true,
    sideEffects: false
  },

  // 3. 懒加载（动态import）
  // 在路由中使用：const Home = () => import('./views/Home.vue');

  // 4. 压缩
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,  // 移除console
            drop_debugger: true  // 移除debugger
          }
        }
      })
    ]
  },

  // 5. 持久化缓存
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },

  // 6. 构建速度优化
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue$': 'vue/dist/vue.runtime.esm.js'  // 使用runtime版本
    },
    extensions: ['.js', '.vue', '.json'],
    modules: [path.resolve(__dirname, 'node_modules')]  // 限定查找范围
  },

  // 7. 多线程打包
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader'],
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    // 8. 分析打包体积
    new BundleAnalyzerPlugin()
  ]
};

// ========== 实际项目优化措施 ==========
/*
在IAMP隧道检测平台中做的优化：
1. Three.js按模块导入（非全量）
   import * as THREE from 'three';  // ❌ 全量导入，体积大
   import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';  // ✅ 按需导入

2. 大文件懒加载
   const PointCloudViewer = () => import('./components/PointCloudViewer.vue');

3. Gzip压缩 + CDN加速
   Nginx配置：gzip on; gzip_types text/css application/javascript;

4. 图片资源优化
   - 使用WebP格式
   - 小图标转base64或SVG
   - 大图使用CDN + 懒加载
*/

// ========== Webpack vs Vite ==========
/*
Webpack：
- 基于打包，开发时也要打包
- 热更新慢（项目越大越明显）
- 生态成熟，配置灵活

Vite：
- 基于ESM，开发时no-bundle
- 热更新快（按需编译）
- 生产环境用Rollup打包
- 配置更简单

在MMMP项目中从Webpack迁移到Vite，构建时间从45s降到3s，
HMR从3s降到200ms，开发效率大幅提升。
*/
```

---

### 9. 首屏加载速度如何优化？

**面试官可能怎么问：**

- "首屏加载慢怎么优化？"
- "FCP、LCP、CLS这些指标了解吗？"
- "SSR和CSR的区别？"
- "骨架屏怎么实现？"

**推荐回答框架：**

```javascript
// ========== 1. 资源优化 ==========
// 路由懒加载
const routes = [
  {
    path: '/report',
    component: () => import(/* webpackChunkName: "report" */ './views/Report.vue')
  },
  {
    path: '/3d-viewer',
    component: () => import(/* webpackChunkName: "3d" */ './views/PointCloudViewer.vue')
  }
];

// 图片懒加载
<img v-lazy="imageUrl" :src="placeholder" />

// 预加载关键资源
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="prefetch" href="/about.js">  // 预取下一页资源

// ========== 2. 代码优化 ==========
// Tree Shaking + 按需加载
// Element Plus 按需导入
import { ElButton, ElTable } from 'element-plus';

// ========== 3. 缓存策略 ==========
// Service Worker缓存（PWA）
// workbox配置
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60  // 30天
      })
    ]
  })
);

// ========== 4. 网络优化 ==========
// HTTP缓存头
/*
Cache-Control: max-age=31536000, immutable  // 静态资源长期缓存
ETag: "33a64df5"                            // 协商缓存
*/

// CDN + 域名分片
// static1.example.com, static2.example.com

// ========== 5. 渲染优化 ==========
// SSR/SSG（Next.js/Nuxt.js）
// 在华为内审中心项目中使用Next.js的SSG，首屏时间从2.5s降到0.8s

// 骨架屏
/*
<template>
  <div v-if="loading" class="skeleton">
    <div class="skeleton-title"></div>
    <div class="skeleton-content"></div>
  </div>
  <div v-else>
    <!-- 真实内容 -->
  </div>
</template>

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
*/

// ========== 6. 性能指标监控 ==========
/*
FCP (First Contentful Paint)：首次内容绘制 < 1.8s
LCP (Largest Contentful Paint)：最大内容绘制 < 2.5s
FID (First Input Delay)：首次输入延迟 < 100ms
CLS (Cumulative Layout Shift)：累积布局偏移 < 0.1
TTFB (Time to First Byte)：首字节时间 < 600ms

使用Performance API监控：
*/
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.startTime);
    // 上报到监控平台
  }
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

---

### 10. 项目中的权限管理怎么实现的？

**面试官可能怎么问：**

- "权限管理怎么设计的？"
- "前端权限和后端权限怎么配合？"
- "按钮级别的权限怎么控制？"
- "路由守卫怎么实现？"

**推荐回答框架：**

```javascript
// ========== RBAC（基于角色的访问控制） ==========
// 权限模型：用户 → 角色 → 权限 → 资源

// ========== 1. 路由权限 ==========
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'editor'] }
  },
  {
    path: '/report/approve',
    component: () => import('@/views/ReportApprove.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'approver'], permission: 'report:approve' }
  }
];

const router = createRouter({ history: createWebHistory(), routes });

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !token) {
    next('/login');
    return;
  }

  // 首次加载，获取用户权限
  if (token && !userStore.permissions.length) {
    await userStore.fetchUserInfo();
  }

  // 角色校验
  if (to.meta.roles && !to.meta.roles.includes(userStore.role)) {
    next('/403');
    return;
  }

  // 权限点校验
  if (to.meta.permission && !userStore.hasPermission(to.meta.permission)) {
    next('/403');
    return;
  }

  next();
});

// ========== 2. 按钮级别权限（自定义指令） ==========
// directives/permission.js
import { useUserStore } from '@/stores/user';

export const permission = {
  mounted(el, binding) {
    const { value } = binding;  // 'report:delete'
    const userStore = useUserStore();

    if (!userStore.hasPermission(value)) {
      el.parentNode?.removeChild(el);  // 无权限则移除按钮
      // 或者 el.style.display = 'none';
    }
  }
};

// main.js
import { permission } from './directives/permission';
app.directive('permission', permission);

// 使用
<template>
  <el-button v-permission="'report:delete'" type="danger">删除报告</el-button>
  <el-button v-permission="['report:edit', 'report:admin']">编辑</el-button>
</template>

// ========== 3. 菜单权限（动态路由） ==========
// store/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    permissions: [],
    routes: []
  }),

  actions: {
    async fetchUserInfo() {
      const res = await fetchUserInfoAPI();
      this.userInfo = res.data;
      this.permissions = res.data.permissions;  // ['report:view', 'report:edit', ...]
      this.routes = this.generateRoutes(res.data.menus);
    },

    generateRoutes(menus) {
      const accessedRoutes = [];
      menus.forEach(menu => {
        const route = asyncRoutes.find(r => r.path === menu.path);
        if (route) {
          accessedRoutes.push(route);
        }
      });
      return accessedRoutes;
    },

    hasPermission(permission) {
      if (Array.isArray(permission)) {
        return permission.some(p => this.permissions.includes(p));
      }
      return this.permissions.includes(permission);
    }
  }
});

// ========== 4. 数据权限（表格列/搜索条件） ==========
// 根据权限动态显示表格列
const columns = computed(() => {
  const baseColumns = [
    { prop: 'name', label: '名称' },
    { prop: 'status', label: '状态' }
  ];

  if (userStore.hasPermission('report:view_sensitive')) {
    baseColumns.push({ prop: 'cost', label: '成本' });
    baseColumns.push({ prop: 'profit', label: '利润' });
  }

  return baseColumns;
});

// ========== 5. 后端配合（IRMP报告平台实践） ==========
/*
后端返回数据结构：
{
  "role": "approver",
  "permissions": [
    "report:view",
    "report:approve",
    "report:reject"
  ],
  "menus": [
    { "path": "/report/list", "name": "报告列表" },
    { "path": "/report/approve", "name": "报告审批" }
  ]
}

安全原则：
1. 前端权限用于UI控制（隐藏按钮、菜单），提升用户体验
2. 后端必须再次校验权限，防止接口被绕过
3. 敏感操作（删除、审批）必须后端二次确认
*/
```

============================================================

## 二、场景题

============================================================

### 场景1：如果页面出现白屏，如何排查问题？

**面试官想考察：** 问题排查思路、工具使用、经验积累

```javascript
// ========== 系统排查步骤 ==========

// 第1步：确认问题范围
/*
- 所有用户都白屏？还是特定用户？
- 所有页面？还是特定页面？
- 特定浏览器？还是所有浏览器？
- 生产环境？还是开发环境？
*/

// 第2步：浏览器控制台检查
/*
1. 打开F12 → Console
   - 是否有JS报错？（如Cannot read property of undefined）
   - 是否有资源加载失败？（404）
   - 是否有CORS错误？

2. Network面板
   - HTML是否返回200？
   - JS/CSS是否加载成功？
   - 加载时间是否过长？

3. Elements面板
   - body是否为空？
   - 是否有display:none？
   - 是否有visibility:hidden？
*/

// 第3步：常见白屏原因及解决

// 原因1：JS报错导致渲染中断
// 解决：try-catch + 错误边界（React Error Boundary）
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 上报错误到监控平台
    console.error('ErrorBoundary caught:', error, errorInfo);
    reportError({ error, errorInfo, url: window.location.href });
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Vue3错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info);
  reportError({ error: err, info, component: vm?.$options?.name });
};

// 原因2：路由配置错误（如history模式刷新404）
// 解决：Nginx配置try_files
/*
location / {
  try_files $uri $uri/ /index.html;
}
*/

// 原因3：资源加载失败（CDN挂了、路径错误）
// 解决：资源加载监控 + 降级
function loadScript(src, fallbackSrc) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => {
      if (fallbackSrc) {
        script.src = fallbackSrc;  // CDN降级到源站
      } else {
        reject(new Error(`Failed to load ${src}`));
      }
    };
    document.head.appendChild(script);
  });
}

// 原因4：内存溢出（如Three.js场景未清理）
// 解决：组件卸载时清理资源
onBeforeUnmount(() => {
  renderer.dispose();
  geometry.dispose();
  material.dispose();
  scene.clear();
});

// 原因5：浏览器兼容（如使用了ES6+语法，IE不支持）
// 解决：Babel转译 + polyfill
// .browserslistrc: > 1%, last 2 versions, not dead

// 第4步：监控与预防
/*
- 接入Sentry/阿里ARMS等错误监控
- 灰度发布，小流量验证
- 自动化测试（E2E）
- 性能预算（Performance Budget）
*/
```

---

### 场景2：用户反馈操作卡顿，从前端角度如何分析？

**面试官想考察：** 性能分析能力、优化手段、工具使用

```javascript
// ========== 分析步骤 ==========

// 第1步：复现问题
/*
- 什么操作卡顿？（点击按钮？滚动？动画？）
- 什么设备？（低端机？）
- 什么网络？（弱网？）
- 什么浏览器？
*/

// 第2步：Performance面板分析
/*
Chrome DevTools → Performance
1. 录制操作过程
2. 查看FPS：绿色条表示流畅，红色条表示卡顿
3. 查看Main线程：长任务（>50ms）会阻塞渲染
4. 查看Timings：FCP、LCP、FID等指标
*/

// 第3步：常见卡顿原因及优化

// 原因1：大量DOM操作（如表格渲染10000行）
// 优化：虚拟滚动
// vue-virtual-scroller / react-window
<RecycleScroller
  class="scroller"
  :items="list"
  :item-size="50"
  key-field="id"
  v-slot="{ item }"
>
  <div class="item">{{ item.name }}</div>
</RecycleScroller>

// 原因2：频繁重排重绘
// 优化：批量操作 + 使用transform
// ❌ 频繁修改样式，触发重排
for (let i = 0; i < 1000; i++) {
  element.style.left = i + 'px';  // 每次都重排
}

// ✅ 使用requestAnimationFrame + transform
function animate() {
  let start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    element.style.transform = `translateX(${Math.min(progress / 10, 1000)}px)`;
    if (progress < 10000) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// 原因3：内存泄漏（闭包、事件未解绑、定时器未清理）
// 优化：组件卸载时清理
onBeforeUnmount(() => {
  // 清除定时器
  clearInterval(timer);
  clearTimeout(timeout);

  // 解绑事件
  window.removeEventListener('resize', handleResize);

  // 取消订阅
  subscription.unsubscribe();

  // 清理WebSocket
  ws.close();

  // 清理Three.js资源
  renderer.dispose();
});

// 原因4：大数据量计算阻塞主线程
// 优化：Web Worker
const worker = new Worker('./worker.js');
worker.postMessage({ points: pointCloudData });  // 发送数据到Worker
worker.onmessage = (e) => {
  const processed = e.data;  // 接收处理结果
  render(processed);
};

// worker.js
self.onmessage = (e) => {
  const { points } = e.data;
  // 在Worker线程中处理大数据
  const result = heavyComputation(points);
  self.postMessage(result);
};

// 原因5：图片/视频资源过大
// 优化：懒加载 + 压缩 + WebP
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imgObserver.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  imgObserver.observe(img);
});

// 原因6：React/Vue组件不必要的重渲染
// 优化：useMemo / useCallback / memo / computed
// React
const MemoizedComponent = React.memo(MyComponent, (prev, next) => {
  return prev.id === next.id;  // 自定义比较
});

// Vue
const filteredList = computed(() => {
  return list.value.filter(item => item.status === 'active');
});

// 第4步：性能监控
// 使用Performance API
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {  // 长任务
      console.warn('Long task detected:', entry.duration);
      reportLongTask(entry);
    }
  }
});
observer.observe({ entryTypes: ['longtask'] });
```

============================================================

## 三、手撕代码：实现一个防抖函数，支持立即执行选项

============================================================

```javascript
/**
 * 防抖函数
 * @param {Function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} - 防抖后的函数
 * 
 * 原理：在delay时间内，多次触发只执行最后一次（或第一次，取决于immediate）
 * 应用场景：搜索框输入、窗口resize、按钮点击防重复提交
 */
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;  // 闭包保存timer

  return function(...args) {
    const context = this;  // 保存this指向
    const callNow = immediate && !timer;  // 立即执行条件

    // 清除上一次的定时器
    clearTimeout(timer);

    // 设置新的定时器
    timer = setTimeout(() => {
      timer = null;  // 重置timer，允许下次立即执行
      if (!immediate) {
        fn.apply(context, args);  // 非立即模式下，延迟执行
      }
    }, delay);

    // 立即模式下，第一次触发立即执行
    if (callNow) {
      fn.apply(context, args);
    }
  };
}

// ========== 使用示例 ==========

// 场景1：搜索框防抖（非立即执行）
const searchInput = document.getElementById('search');
const handleSearch = debounce(function(keyword) {
  console.log('搜索:', keyword, 'this指向:', this);
  fetch(`/api/search?q=${keyword}`)
    .then(res => res.json())
    .then(data => renderResults(data));
}, 500);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);  // 停止输入500ms后才搜索
});

// 场景2：按钮防抖（立即执行，防止重复提交）
const submitBtn = document.getElementById('submit');
const handleSubmit = debounce(function(formData) {
  console.log('提交表单:', formData);
  return fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(formData)
  });
}, 2000, true);  // 立即执行，2秒内重复点击无效

submitBtn.addEventListener('click', () => {
  handleSubmit({ name: 'test', value: 123 });
});

// 场景3：窗口resize防抖（结合你的智慧工地大屏项目）
const handleResize = debounce(() => {
  console.log('窗口尺寸:', window.innerWidth, window.innerHeight);
  // 重新计算Three.js相机比例
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, 300);

window.addEventListener('resize', handleResize);

// ========== 进阶：带取消功能的防抖 ==========
function debounceAdvanced(fn, delay = 300, immediate = false) {
  let timer = null;

  const debounced = function(...args) {
    const context = this;
    const callNow = immediate && !timer;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(context, args);
    }, delay);

    if (callNow) fn.apply(context, args);
  };

  // 取消方法
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  // 立即执行方法
  debounced.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      fn.apply(this, arguments);
    }
  };

  return debounced;
}

// 使用
const debouncedSearch = debounceAdvanced(searchAPI, 500);
// 组件卸载时取消
debouncedSearch.cancel();

// ========== 节流函数（对比记忆） ==========
/**
 * 节流函数：在delay时间内，只执行一次
 * 应用场景：滚动加载、鼠标移动、游戏射击
 */
function throttle(fn, delay = 300) {
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 时间戳版（立即执行） + 定时器版（延迟执行）
function throttle(fn, delay = 300, options = { leading: true, trailing: false }) {
  let timer = null;
  let lastTime = 0;

  return function(...args) {
    const now = Date.now();
    const context = this;

    // 处理leading
    if (!lastTime && !options.leading) lastTime = now;
    const remaining = delay - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastTime = now;
      fn.apply(context, args);
    } else if (!timer && options.trailing) {
      timer = setTimeout(() => {
        lastTime = options.leading ? Date.now() : 0;
        timer = null;
        fn.apply(context, args);
      }, remaining);
    }
  };
}
```

============================================================

## 四、结合简历的加分回答策略

============================================================

### 你的独特优势（一定要主动提）：

1. **Electron + React + TypeScript（华为WeLink）**
   
   - 百万级日活IM的实战经验
   - 主进程与渲染进程通信（ipcRenderer/ipcMain）
   - 客户端加密通信方案

2. **Three.js 3D可视化（IAMP隧道检测）**
   
   - 点云数据渲染与交互
   - 性能优化（LOD、八叉树、视锥体剔除）
   - 厘米级病害定位

3. **WebRTC + 内网穿透（MMMP监控）**
   
   - RTSP转WebRTC链路打通
   - STUN/TURN服务器配置
   - 实时视频流播放

4. **WebSocket实时通信**
   
   - 设备状态监控
   - 告警秒级推送
   - 心跳机制与重连策略

5. **uniapp跨端开发**
   
   - 一套代码多端运行
   - 原生能力调用（摄像头、文件系统）

### 面试话术建议：

**当被问到"你有什么优势"时：**
"我有7年前端经验，覆盖Vue/React双栈，特别是在复杂场景上有实战经验：

- 在华为WeLink负责百万级日活IM的PC端开发，使用Electron+React+TypeScript
- 在隧道检测项目中用Three.js做3D点云可视化，处理过百万级点云数据的渲染性能优化
- 在监控平台中打通了WebRTC视频流链路，解决了内网摄像头公网播放的问题
  这些经历让我对性能优化、跨端开发、实时通信都有深入理解。"

**当被问到"遇到过什么难题"时：**
"在MMMP监控平台中，最大的挑战是内网摄像头的公网播放。内网RTSP流无法直接在公网访问，我调研了多种方案：

1. 最初尝试HLS，但延迟太高（8-10秒），不满足实时监控需求
2. 最终采用WebRTC方案，配合frp内网穿透+自建STUN/TURN服务器
3. 解决了NAT穿透、ICE候选收集、SDP协商等问题
4. 最终延迟控制在200ms以内，满足了秒级告警响应的需求"

============================================================

## 五、面试注意事项

============================================================

1. **回答问题要有结构**：先讲概念 → 再讲原理 → 结合项目 → 代码示例
2. **不懂不要硬答**：可以说"这个我不太确定，但我理解是..."
3. **主动引导话题**：提到简历中的亮点项目，引导面试官提问
4. **代码要手写**：手撕代码时，先讲思路再写，边写边解释
5. **准备反问问题**：如"团队技术栈是什么？""这个岗位主要负责什么业务？"

============================================================
