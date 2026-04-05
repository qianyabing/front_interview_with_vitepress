---
title: nodejs 
date: 2026-03-29 21:25:02
permalink: /nodejs
categories:
  - nodejs
tags:
  - nodejs
---

# Node.js 超细分大厂面试题集（核心+进阶+实战）

## 第一部分：Node.js 底层原理（大厂必问核心）

### 一、Node.js 架构与运行机制

#### Q1：Node.js 的核心架构？V8 引擎、libuv、内置模块的关系？

**标准答案**：

1. Node.js 三层架构（从下到上）：

   - **底层依赖层**：V8 引擎（JS 解析执行）、libuv（事件循环/异步 I/O）、c-ares（DNS 解析）、http_parser（HTTP 解析）等；

   - **内置核心模块层**：由 C++/JS 编写，封装底层能力（如 fs、net、http、stream）；

   - **用户层**：开发者编写的 JS 代码，调用核心模块实现业务逻辑。

2. 核心组件关系：

   - **V8 引擎**：Google 开源的 JS 引擎，负责解析、编译、执行 JS 代码，管理内存（堆/栈），Node.js 仅提供 V8 封装，不修改核心逻辑；

   - **libuv**：跨平台异步 I/O 库（C 语言编写），是 Node.js 事件循环、异步 I/O（文件/网络）、线程池的核心，抹平不同系统（Linux/Windows/macOS）的异步差异；

   - **内置模块**：桥接 JS 和底层 C++ 模块（如 fs 模块封装 libuv 的文件 I/O，net 模块封装 socket），对外暴露 JS API。

**关键**：Node.js 不是一门语言，而是“V8 + libuv + 内置模块”的运行时，让 JS 具备服务端能力。

**追问**：Node.js 为什么单线程还能处理高并发？

#### Q2：Node.js 事件循环（Event Loop）完整流程？各阶段执行顺序与任务类型？

**标准答案**：

1. 核心前提：Node.js 主线程是单线程，事件循环是 libuv 实现的异步任务调度机制，所有异步任务最终通过事件循环执行。

2. 事件循环 6 个阶段（按顺序执行，每个阶段处理完对应队列才进入下一个）：

   ```Plain Text

   ┌───────────────────────────┐
   ┌─>│           timers          │ （定时器阶段：setTimeout/setInterval 回调）
   │  └─────────────┬─────────────┘
   │  ┌─────────────┴─────────────┐
   │  │     pending callbacks     │ （待定回调：上一轮循环延迟的 I/O 回调）
   │  └─────────────┬─────────────┘
   │  ┌─────────────┴─────────────┐
   │  │       idle, prepare       │ （闲置阶段：仅内部使用）
   │  └─────────────┬─────────────┘      ┌───────────────┐
   │  ┌─────────────┴─────────────┐      │   incoming:   │
   │  │           poll            │<─────┤  connections, │ （轮询阶段：核心，处理 I/O 事件、读取文件/网络数据）
   │  └─────────────┬─────────────┘      │   data, etc.  │
   │  ┌─────────────┴─────────────┐      └───────────────┘
   │  │           check           │ （检查阶段：setImmediate 回调）
   │  └─────────────┬─────────────┘
   │  ┌─────────────┴─────────────┐
   └──┤      close callbacks      │ （关闭回调：如 socket.on('close')）
      └───────────────────────────┘
   ```

3. 各阶段核心任务：

   - **timers**：执行 `setTimeout`/`setInterval` 的到期回调（延迟时间是“期望时间”，非绝对，受前面阶段阻塞影响）；

   - **pending callbacks**：执行系统级回调（如 TCP 连接错误回调）；

   - **idle/prepare**：Node.js 内部使用，开发者无需关注；

   - **poll**：

     1. 执行已完成的 I/O 回调（如 fs.readFile、http 请求响应）；

     2. 轮询文件/网络 I/O，若有新的 I/O 事件则处理，无则等待（阻塞）；

     3. 若检测到 `setImmediate` 回调或 timers 到期，退出 poll 阶段；

   - **check**：执行 `setImmediate` 回调（专为 poll 阶段结束后立即执行设计）；

   - **close callbacks**：执行关闭事件回调（如 `socket.close()`、`process.on('exit')`）。

4. 微任务/宏任务在 Node.js 中的执行顺序：

   - 宏任务：timers、poll、check 等阶段的回调（setTimeout/setInterval/setImmediate/I/O/close）；

   - 微任务：`process.nextTick`（独立队列，优先级最高）、Promise.then/catch/finally、queueMicrotask；

   - 执行规则：**每个阶段执行完后，先清空所有微任务（先 process.nextTick 队列，再 Promise 微任务队列），再进入下一个阶段**。

**实战示例**：判断执行顺序（高频面试题）

```JavaScript

console.log('同步代码');

setTimeout(() => {
  console.log('setTimeout');
  process.nextTick(() => console.log('setTimeout 内 nextTick'));
}, 0);

setImmediate(() => {
  console.log('setImmediate');
  process.nextTick(() => console.log('setImmediate 内 nextTick'));
});

process.nextTick(() => console.log('全局 nextTick'));

Promise.resolve().then(() => console.log('Promise then'));

// 输出顺序：
// 同步代码
// 全局 nextTick
// Promise then
// setTimeout
// setTimeout 内 nextTick
// setImmediate
// setImmediate 内 nextTick
// （注：若在 I/O 回调中，setImmediate 会比 setTimeout(0) 先执行）
```

**坑点**：`setTimeout(fn, 0)` 实际延迟至少 1ms（Node.js 限制），而 `setImmediate` 在 poll 阶段结束后立即执行，因此在 I/O 回调中 `setImmediate` 比 `setTimeout(fn, 0)` 先执行。

#### Q3：Node.js 线程池（libuv thread pool）原理？适用场景？

**标准答案**：

1. 核心原理：

   - Node.js 主线程是单线程，但 libuv 内置了**默认 4 个线程**的线程池（可通过 `UV_THREADPOOL_SIZE` 环境变量调整，最大 1024）；

   - 主线程遇到“无法异步化”的操作（如文件 I/O、DNS 解析、加密运算），会将任务交给线程池执行，执行完成后通过事件循环通知主线程；

   - 线程池任务是**阻塞式**的，但不影响主线程，实现“主线程单线程，底层多线程”。

2. 线程池处理的任务类型：

   - 文件 I/O（fs 模块大部分方法，如 fs.readFile、fs.writeFile）；

   - DNS 解析（dns.lookup）；

   - 加密/哈希运算（crypto 模块，如 crypto.pbkdf2、crypto.scrypt）；

   - zlib 压缩/解压（zlib 模块）。

3. 适用场景：CPU 密集型/阻塞式 I/O 任务（避免阻塞主线程事件循环）。

**坑点**：

- 线程池默认 4 个线程，若同时有 5 个文件 I/O 任务，第 5 个需等待前面线程释放；

- 调整 `UV_THREADPOOL_SIZE` 需谨慎，过大可能导致系统资源耗尽。

**追问**：如何优化线程池性能？

### 二、Node.js 内存模型与垃圾回收

#### Q4：Node.js 内存限制？V8 垃圾回收（GC）机制？

**标准答案**：

1. 内存限制：

   - V8 对 Node.js 内存有默认限制（64 位系统：堆内存约 1.4GB，32 位约 0.7GB），并非物理内存不足，而是 V8 垃圾回收的性能考量；

   - 可通过启动参数调整：`node --max-old-space-size=4096 app.js`（将老年代内存调整为 4GB）。

2. V8 内存分区（堆内存）：

   - **新生代（New Space）**：存储短期存活对象（如临时变量），容量小（默认 1-8MB），GC 频率高，采用“Scavenge 算法”（复制回收）；

   - **老年代（Old Space）**：存储长期存活对象（如全局变量），容量大，GC 频率低，采用“Mark-Sweep（标记清除）+ Mark-Compact（标记整理）”算法；

   - **大对象区（Large Object Space）**：存储超过新生代容量的大对象，直接进入老年代。

3. GC 核心流程：

   - **Scavenge（新生代）**：将新生代分为 From/To 两个半区，From 区存活对象复制到 To 区，清空 From 区，交换 From/To 区；对象经历多次 GC 仍存活则晋升到老年代；

   - **Mark-Sweep（老年代）**：标记存活对象，清除未标记对象（会产生内存碎片）；

   - **Mark-Compact（老年代）**：在 Mark-Sweep 基础上，将存活对象向内存一端移动，消除碎片（耗时较长）。

**关键**：GC 会阻塞主线程，频繁 GC 或大内存 GC 会导致 Node.js 性能下降（如卡顿）。

**追问**：如何排查 Node.js 内存泄漏？

#### Q5：Node.js 内存泄漏常见原因？排查方法与工具？

**标准答案**：

1. 常见内存泄漏原因：

   - 全局变量（未声明的变量、挂载到 global 的变量）无法被 GC；

   - 闭包引用（如定时器/事件监听持有闭包，闭包引用外部变量）；

   - 未清理的定时器/事件监听（如 setInterval 未 clear，socket 未 off 事件）；

   - 缓存未设置过期（如无限增大的对象/数组缓存）；

   - 流未正确处理（如可读流未消费，导致数据堆积）。

2. 排查工具与步骤：

   - **步骤 1**：开启内存快照/堆快照：

     ```Bash

     # 方式 1：启动时开启调试
     node --inspect app.js
     # 方式 2：生成堆快照
     node --inspect-brk app.js # 断点启动，Chrome DevTools 连接后捕获快照
     ```

   - **步骤 2**：使用 Chrome DevTools（chrome://inspect）：

     1. 连接 Node.js 进程；

     2. 捕获堆快照（Heap snapshot），对比多次快照的对象数量变化；

     3. 查看“Detached DOM nodes”或大对象，定位未释放的引用；

   - **步骤 3**：专用工具：

     - `heapdump`：生成堆快照文件，分析内存分布；

     - `clinic.js`（Node.js 官方工具）：可视化内存使用、事件循环延迟；

     - `pm2 monit`：监控进程内存、CPU 使用。

3. 修复方案：

   - 避免全局变量，使用 let/const 替代 var；

   - 定时器用完及时 clearInterval/clearTimeout；

   - 事件监听用完 off，或使用 once 替代 on；

   - 缓存设置最大容量/过期时间（如 lru-cache）；

   - 正确处理流（如 pipe 消费，或调用 destroy 清理）。

**实战示例**：内存泄漏代码（定时器闭包）

```JavaScript

// 泄漏代码：定时器持有闭包，引用外部数组，数组不断增大
let arr = [];
setInterval(() => {
  arr.push(new Array(10000).fill('leak')); // arr 无法被 GC
}, 1000);
// 修复：用完清除定时器，或限制数组大小
let timer = setInterval(() => {
  arr.push(new Array(10000).fill('leak'));
  if (arr.length > 100) {
    arr = []; // 清空缓存
  }
}, 1000);
// 业务结束时清除
// clearInterval(timer);
```

---

## 第二部分：Node.js 核心模块（高频实战）

### 三、核心模块深度解析

#### Q6：fs 模块的同步/异步/流式方法区别？适用场景？

**标准答案**：

| 类型           | 方法示例             | 特点                               | 适用场景                 |
| -------------- | -------------------- | ---------------------------------- | ------------------------ |
| 同步方法       | fs.readFileSync      | 阻塞主线程，代码简单               | 小型脚本、启动时读取配置 |
| 异步回调       | fs.readFile          | 非阻塞，回调嵌套（易回调地狱）     | 简单异步场景             |
| 异步 Promise   | fs.promises.readFile | 非阻塞，支持 async/await，代码优雅 | 现代异步编程（推荐）     |
| 流式方法       | fs.createReadStream  | 分块读取/写入，低内存占用          | 大文件（GB 级）读写      |
| **核心区别**： |                      |                                    |                          |

- 同步方法：阻塞事件循环，导致请求排队，生产环境慎用；

- 异步方法：非阻塞，通过事件循环调度，不影响主线程；

- 流式方法：将文件拆分为多个 chunk（默认 64KB），逐块处理，避免一次性加载大文件到内存。

**实战示例**：流式读取大文件

```JavaScript

const fs = require('fs');
const path = require('path');

// 创建可读流
const readStream = fs.createReadStream(path.resolve(__dirname, 'large-file.txt'), {
  highWaterMark: 64 * 1024, // 每次读取 64KB
  encoding: 'utf8'
});

// 监听数据块
readStream.on('data', (chunk) => {
  console.log(`读取到 ${chunk.length} 字节`);
  // 处理 chunk（如写入另一个文件、解析内容）
});

// 监听结束
readStream.on('end', () => {
  console.log('文件读取完成');
});

// 监听错误
readStream.on('error', (err) => {
  console.error('读取失败：', err);
});
```

**坑点**：流式读取需处理背压（backpressure），避免写入速度慢于读取速度导致数据堆积（解决方案：使用 pipe 自动处理，或监听 drain 事件）。

#### Q7：stream 模块（流）的核心类型与原理？背压如何处理？

**标准答案**：

1. 流的核心类型（均继承自 EventEmitter）：

   - **可读流（Readable）**：数据来源（如 fs.createReadStream、http.IncomingMessage）；

   - **可写流（Writable）**：数据目的地（如 fs.createWriteStream、http.ServerResponse）；

   - **双工流（Duplex）**：既可读又可写（如 net.Socket、WebSocket）；

   - **转换流（Transform）**：可读可写，且可修改数据（如 zlib.createGzip、crypto.createCipher）。

2. 流的核心原理：

   - 可读流有两种模式：**流动模式**（自动推送数据）、**暂停模式**（手动调用 read() 读取）；

   - 可写流有缓冲区（默认 16KB），写入数据先进入缓冲区，满了则返回 false，触发 drain 事件后可继续写入；

   - 流通过事件通信：data（可读流推送数据）、end（可读流结束）、finish（可写流结束）、error（错误）、drain（可写流缓冲区清空）。

3. 背压（Backpressure）：

   - 定义：可读流读取速度 > 可写流写入速度，导致数据在内存中堆积，引发内存泄漏/进程崩溃；

   - 处理方法：

     1. **自动处理**：使用 `pipe()` 方法（推荐），pipe 会自动调节可读流速度，适配可写流；

        ```JavaScript

        // pipe 自动处理背压
        fs.createReadStream('input.txt').pipe(fs.createWriteStream('output.txt'));
        ```

     2. **手动处理**：监听可写流的 drain 事件，暂停/恢复可读流；

        ```JavaScript

        const readable = fs.createReadStream('large.txt');
        const writable = fs.createWriteStream('output.txt');

        readable.on('data', (chunk) => {
          if (!writable.write(chunk)) {
            readable.pause(); // 暂停读取
          }
        });

        writable.on('drain', () => {
          readable.resume(); // 恢复读取
        });
        ```

**关键**：处理大文件必须用流 + pipe，避免一次性加载文件到内存。

#### Q8：http 模块原理？如何实现一个简易 HTTP 服务器？

**标准答案**：

1. http 模块核心原理：

   - 基于 net 模块（TCP）封装，实现 HTTP 协议解析（请求行/请求头/请求体）；

   - http.Server 是 EventEmitter 实例，监听 request 事件处理请求；

   - http.IncomingMessage（请求对象）是可读流，http.ServerResponse（响应对象）是可写流。

2. 简易 HTTP 服务器实现：

```JavaScript

const http = require('http');
const fs = require('fs');
const path = require('path');

// 创建服务器
const server = http.createServer((req, res) => {
  // 解析请求
  const { method, url } = req;
  console.log(`请求方法：${method}，请求路径：${url}`);

  // 设置响应头
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // 路由处理
  if (url === '/') {
    res.statusCode = 200;
    res.end('<h1>首页</h1>');
  } else if (url === '/file') {
    // 流式返回文件
    const fileStream = fs.createReadStream(path.resolve(__dirname, 'test.txt'));
    fileStream.pipe(res); // 自动处理响应结束和错误
  } else {
    res.statusCode = 404;
    res.end('<h1>404 页面不存在</h1>');
  }
});

// 监听端口
```
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

```
// 监听错误
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用`);
  }
});
```

1. 核心扩展：

   - 处理 POST 请求（请求体是可读流）：

     ```JavaScript

     if (method === 'POST' && url === '/api') {
       let body = '';
       req.on('data', (chunk) => {
         body += chunk; // 拼接请求体
       });
       req.on('end', () => {
         res.end(`接收到 POST 数据：${body}`);
       });
     }
     ```

**坑点**：响应对象必须调用 end() 结束，否则客户端会一直等待；未处理的请求会导致连接泄漏。

#### Q9：child_process 模块（子进程）原理？spawn/exec/execFile/fork 的区别？

**标准答案**：

1. 核心原理：Node.js 主线程是单线程，child_process 允许创建子进程执行命令/JS 文件，实现多核利用（CPU 密集型任务）。

2. 四种创建方式对比：

| 方法     | 特点                                           | 适用场景                                       | 坑点                                       |
| -------- | ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| spawn    | 流式输出，无缓存，支持大输出，异步             | 执行耗时命令（如 ls -l）、实时输出             | 需手动处理 stdout/stderr 流                |
| exec     | 缓存输出，支持 shell 语法（管道/重定向），异步 | 简单命令（如 echo 'hello'）                    | 输出超过 200KB 可能卡死，有 shell 注入风险 |
| execFile | 无 shell 解析，更安全，缓存输出，异步          | 执行可执行文件（如`./[script.sh](script.sh)`） | 不支持 shell 语法（如                      |
| fork     | 专用于执行 JS 文件，内置 IPC 通信，异步        | 拆分 Node.js 进程（CPU 密集型任务）            | 每个 fork 是独立 V8 实例，内存占用高       |

1. 实战示例：

   - spawn 执行系统命令：

     ```JavaScript

     const { spawn } = require('child_process');
     const ls = spawn('ls', ['-l', './']); // 命令 + 参数数组

     // 监听输出
     ls.stdout.on('data', (data) => {
       console.log(`stdout: ${data}`);
     });

     // 监听错误输出
     ls.stderr.on('data', (data) => {
       console.error(`stderr: ${data}`);
     });

     // 监听退出
     ls.on('close', (code) => {
       console.log(`子进程退出码：${code}`);
     });
     ```

   - fork 实现进程通信：

     ```JavaScript

     // 主进程 app.js
     const { fork } = require('child_process');
     const child = fork('./child.js');

     // 发送消息给子进程
     child.send({ msg: '主进程消息' });

     // 接收子进程消息
     child.on('message', (data) => {
       console.log('主进程收到：', data); // 输出：主进程收到：{ msg: '子进程响应' }
     });

     // 子进程 child.js
     process.on('message', (data) => {
       console.log('子进程收到：', data); // 输出：子进程收到：{ msg: '主进程消息' }
       process.send({ msg: '子进程响应' }); // 发送消息给主进程
     });
     ```

**关键**：CPU 密集型任务（如数据计算、加密）必须用 fork 拆分到子进程，避免阻塞主线程事件循环。

### 四、模块化与包管理

#### Q10：Node.js 模块加载机制（CommonJS）？require 加载流程？

**标准答案**：

1. CommonJS 模块核心规则：

   - 每个文件是独立模块，`module.exports` 导出，`require` 导入；

   - 模块加载是**同步**的，加载完成后缓存，后续 require 直接读取缓存；

   - 模块作用域：变量默认仅在模块内有效，挂载到 `module.exports` 才对外暴露。

2. require 加载完整流程：

```mermaid
graph TD
A[require(X)] --> B{X 是核心模块？};
B -- 是 --> C[加载核心模块（如 fs、http）];
B -- 否 --> D{X 以 '/'/'./'/'../' 开头？};
D -- 是 --> E[加载文件/目录（按 .js/.json/.node 顺序查找）];
D -- 否 --> F[加载 node_modules 模块（向上级目录查找）];
E --> G{模块是否缓存？};
F --> G;
G -- 是 --> H[返回缓存的 module.exports];
G -- 否 --> I[执行模块代码，生成 module.exports];
I --> J[缓存模块];
J --> H;
```

1. 关键细节：

   - 加载目录：优先查找目录下的 `package.json`（main 字段），无则查找 index.js/index.json/index.node；

   - 缓存机制：`require.cache` 存储已加载模块，删除 `require.cache[模块路径]` 可重新加载模块；

   - 循环依赖：模块 A 依赖 B，B 依赖 A，Node.js 会返回未完全初始化的 module.exports（需注意顺序）。

**实战示例**：循环依赖处理

```JavaScript

// a.js
const b = require('./b.js');
console.log('a.js 中 b：', b); // 输出：a.js 中 b：{ foo: 'bar' }
module.exports = { a: 'a' };

// b.js
const a = require('./a.js');
console.log('b.js 中 a：', a); // 输出：b.js 中 a：{}（a 未完全初始化）
module.exports = { foo: 'bar' };

// 主文件 index.js
require('./a.js');
// 输出顺序：
// b.js 中 a：{}
// a.js 中 b：{ foo: 'bar' }
```

**坑点**：循环依赖会导致模块未完全初始化，需避免或通过延迟加载（如函数内 require）解决。

#### Q11：Node.js 如何支持 ESM？CommonJS 与 ESM 互操作？

**标准答案**：

1. 启用 ESM 的方式：

   - 方式 1：文件后缀改为 `.mjs`；

   - 方式 2：在 `package.json` 中设置 `"type": "module"`（所有 `.js` 文件视为 ESM）；

   - 方式 3：启动参数 `node --experimental-modules app.js`（低版本 Node.js）。

2. CommonJS 与 ESM 核心差异（Node.js 环境）：

| 特性                 | CommonJS        | ESM                           |
| -------------------- | --------------- | ----------------------------- |
| 导出                 | module.exports  | export/export default         |
| 导入                 | require         | import/import()               |
| 加载时机             | 运行时          | 编译时（静态）                |
| 路径                 | 可省略后缀/目录 | 必须写完整后缀（如 ./a.js）   |
| **dirname/**filename | 内置            | 需手动实现（import.meta.url） |

1. 互操作规则：

   - **ESM 导入 CommonJS**：默认导入获取 `module.exports`，无法命名导入（需解构）；

     ```JavaScript

     // CommonJS 模块 cjs.js
     module.exports = { foo: 'bar' };

     // ESM 模块 esm.mjs
     import cjs from './cjs.js';
     console.log(cjs.foo); // bar
     // 或
     import * as cjs from './cjs.js';
     console.log(cjs.default.foo); // bar
     ```

   - **CommonJS 导入 ESM**：无法用 require 同步导入，需用动态 import()（返回 Promise）；

     ```JavaScript

     // ESM 模块 esm.mjs
     export const foo = 'bar';

     // CommonJS 模块 cjs.js
     import('./esm.mjs').then(({ foo }) => {
       console.log(foo); // bar
     });
     ```

2. ESM 中实现 **dirname/**filename：

   ```JavaScript

   import { fileURLToPath } from 'url';
   import { dirname } from 'path';
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = dirname(__filename);
   ```

**坑点**：ESM 中 require/module/exports 未定义，需避免使用；CommonJS 中 import 关键字未定义，只能用 import()。

---

## 第三部分：Node.js 进阶与工程化

### 五、性能优化与生产环境

#### Q12：Node.js 性能优化方案？（CPU/内存/I/O/网络）

**标准答案**：

| 优化维度                               | 核心方案                                                                                                                                                                      |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU 密集型                             | 1. 用 child_process.fork 拆分到子进程，利用多核；2. 避免同步操作，使用异步 API；3. 优化算法（如缓存计算结果）；4. 使用 worker_threads（Node.js 12+）替代 fork（更低内存占用） |
| 内存优化                               | 1. 避免内存泄漏（清理定时器/事件监听）；2. 用流处理大文件，避免一次性加载；3. 合理设置缓存过期（lru-cache）；4. 开启 GC 优化（--expose-gc 手动触发）                          |
| I/O 优化                               | 1. 文件 I/O：使用流式 API + pipe，调整线程池大小（UV_THREADPOOL_SIZE）；2. 网络 I/O：使用连接池（如数据库连接池），避免频繁创建连接；3. 批量操作（如批量写入数据库）          |
| 网络优化                               | 1. 启用 HTTP 长连接（keep-alive）；2. 压缩响应（gzip/brotli）；3. 限流/熔断（如 koa-ratelimit、opossum）；4. 使用反向代理（Nginx）分担压力                                    |
| 通用优化                               | 1. 启用集群模式（cluster 模块），利用多核；2. 缓存热点数据（Redis/内存缓存）；3. 代码压缩/Tree Shaking（ESBuild/Rollup）；4. 监控与告警（pm2、prometheus）                    |
| **实战示例**：cluster 模块实现多核利用 |                                                                                                                                                                               |

```JavaScript

const cluster = require('cluster');
const os = require('os');
const http = require('http');

const numCPUs = os.cpus().length; // 获取 CPU 核心数

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 运行`);

  // 启动子进程（每个 CPU 核心一个）
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 子进程退出时重启
  cluster.on('exit', (worker, code, signal) => {
    console.log(`子进程 ${worker.process.pid} 退出，重启中...`);
    cluster.fork();
  });
} else {
  // 子进程创建 HTTP 服务器
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello World! 子进程 ${process.pid}\n`);
  }).listen(3000);

  console.log(`子进程 ${process.pid} 启动`);
}
```

**关键**：cluster 模块通过共享端口实现负载均衡，主进程分发请求到子进程，充分利用多核 CPU。

#### Q13：Node.js 生产环境部署方案？PM2 核心功能与配置？

**标准答案**：

1. 生产环境部署核心要求：

   - 进程守护（崩溃自动重启）；

   - 多核利用；

   - 日志管理；

   - 热重启（无停机更新）；

   - 监控与告警。

2. PM2（Node.js 进程管理工具）核心功能：

   - 进程守护：`pm2 start app.js`，进程崩溃自动重启；

   - 多核集群：`pm2 start app.js -i max`（自动启动与 CPU 核心数相同的进程）；

   - 日志管理：默认记录 stdout/stderr 到 `~/.pm2/logs`，支持日志分割、轮转；

   - 热重启：`pm2 reload app.js`（无停机更新代码）；

   - 监控：`pm2 monit` 实时监控 CPU/内存/请求数；

   - 部署：`pm2 deploy` 支持远程部署。

3. PM2 实战配置（ecosystem.config.js）：

```JavaScript

module.exports = {
  apps: [{
    name: 'node-app', // 应用名称
    script: 'app.js', // 启动文件
    cwd: './', // 工作目录
    instances: 'max', // 启动实例数（max=多核）
    exec_mode: 'cluster', // 集群模式（fork/cluster）
    env: { // 开发环境变量
      NODE_ENV: 'development'
    },
    env_production: { // 生产环境变量
      NODE_ENV: 'production'
    },
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    out_file: './logs/out.log', // 标准输出日志
    error_file: './logs/error.log', // 错误日志
    merge_logs: true, // 合并所有实例日志
    log_rotate: {
      max_size: '100M', // 日志最大 100MB
      retain: 10 // 保留 10 个日志文件
    },
    // 重启配置
    max_restarts: 10, // 最大重启次数
    restart_delay: 3000, // 重启延迟 3 秒
    // 自动重启触发条件
    watch: false, // 生产环境关闭 watch
    ignore_watch: ['node_modules', 'logs'],
    // 内存限制重启
    max_memory_restart: '1G' // 内存超过 1GB 自动重启
  }],
  // 部署配置（可选）
  deploy: {
    production: {
      user: 'root',
      host: ['192.168.1.100'],
      ref: 'origin/main',
      repo: 'git@github.com:xxx/node-app.git',
      path: '/var/www/node-app',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
```

1. 常用 PM2 命令：

```Bash

# 启动生产环境
pm2 start ecosystem.config.js --env production
# 查看进程
pm2 list
# 监控
pm2 monit
# 日志查看
pm2 logs node-app
# 热重启
pm2 reload node-app
# 停止
pm2 stop node-app
# 删除
pm2 delete node-app
# 保存/恢复进程
pm2 save
pm2 resurrect
```

**坑点**：生产环境关闭 watch（避免代码修改触发重启），日志需配置轮转（防止日志文件过大）。

### 六、错误处理与安全

#### Q14：Node.js 错误类型？全局错误处理方案？

**标准答案**：

1. Node.js 核心错误类型：

   - **JavaScript 错误**：SyntaxError（语法错误）、ReferenceError（引用错误）、TypeError（类型错误）、RangeError（范围错误）；

   - **Node.js 系统错误**：Error（通用错误）、SystemError（系统调用错误，如 EADDRINUSE、ENOENT）；

   - **自定义错误**：继承 Error 类扩展（如 BusinessError）。

2. 错误处理层级（从局部到全局）：

   - **局部处理**：try/catch（仅捕获同步错误/async/await 异步错误）；

     ```JavaScript

     // 同步错误
     try {
       const fs = require('fs');
       fs.readFileSync('nonexist.txt');
     } catch (err) {
       console.error('读取文件错误：', err.message);
     }

     // 异步错误（async/await）
     async function readFile() {
       try {
         const fs = require('fs/promises');
         await fs.readFile('nonexist.txt');
       } catch (err) {
         console.error('读取文件错误：', err.message);
       }
     }
     ```

   - **事件错误**：监听 EventEmitter 的 error 事件（如流、子进程、服务器）；

     ```JavaScript

     const fs = require('fs');
     const stream = fs.createReadStream('nonexist.txt');
     stream.on('error', (err) => {
       console.error('流错误：', err.message);
     });
     ```

   - **全局错误**：捕获未处理的异常和未处理的拒绝；

     ```JavaScript

     // 捕获未处理的同步/异步异常（已废弃，仅应急）
     process.on('uncaughtException', (err) => {
       console.error('未捕获的异常：', err);
       // 记录日志后退出进程（避免状态异常）
       process.exit(1);
     });

     // 捕获未处理的 Promise 拒绝
     process.on('unhandledRejection', (reason, promise) => {
       console.error('未处理的 Promise 拒绝：', reason, promise);
       // 可重启进程或处理错误
     });

     // 捕获警告（如弃用 API）
     process.on('warning', (warn) => {
       console.warn('警告：', warn.message);
     });
     ```

3. 最佳实践：

   - 局部错误优先处理，全局错误仅作为兜底；

   - `uncaughtException` 触发后，进程状态可能异常，需记录日志后退出（PM2 自动重启）；

   - 自定义错误类，区分业务错误和系统错误：

     ```JavaScript

     class BusinessError extends Error {
       constructor(message, code) {
         super(message);
         this.name = 'BusinessError';
         this.code = code; // 错误码（如 400、500）
       }
     }

     // 使用
     throw new BusinessError('参数错误', 400);
     ```

**坑点**：未处理的 `error` 事件会导致进程崩溃，所有 EventEmitter 实例必须监听 error 事件。

#### Q15：Node.js 生产环境安全防护措施？

**标准答案**：

1. 基础安全：

   - **版本升级**：使用 LTS 版本（如 Node.js 20.x），及时修复安全漏洞；

   - **依赖审计**：`npm audit`/`pnpm audit` 检查依赖漏洞，`npm update` 修复；

   - **环境变量**：敏感信息（数据库密码、密钥）通过环境变量传递，避免硬编码；

   - **权限控制**：运行 Node.js 进程的用户避免 root 权限（用普通用户）。

2. Web 安全（HTTP 服务）：

   - **防注入**：

     - SQL 注入：使用参数化查询（如 mysql2 的 prepare statement）；

     - XSS：转义输出（如 DOMPurify），设置 CSP 头；

     - CSRF：使用 CSRF Token，验证 Origin/Referer 头；

   - **请求限制**：

     - 限流：使用 koa-ratelimit/express-rate-limit 限制请求频率；

     - 防 DDOS：Nginx 前置代理，设置连接数限制；

   - **HTTP 头安全**：

     ```JavaScript

     const helmet = require('helmet'); // 安全头中间件
     const express = require('express');
     const app = express();
     app.use(helmet()); // 自动设置 X-XSS-Protection、X-Frame-Options 等头
     ```

   - **HTTPS**：强制使用 HTTPS，设置 HSTS 头；

     ```JavaScript

     const https = require('https');
     const fs = require('fs');
     const options = {
       key: fs.readFileSync('private.key'),
       cert: fs.readFileSync('certificate.crt')
     };
     https.createServer(options, app).listen(443);
     ```

3. 代码安全：

   - **输入验证**：所有用户输入（URL 参数、POST 数据）严格验证（如 Joi/Zod 校验）；

   - **避免 shell 注入**：使用 `execFile` 替代 `exec`，避免用户输入作为命令参数；

   - **文件访问限制**：限制文件读取路径（如 path.resolve 拼接路径，避免路径遍历）；

     ```JavaScript

     // 不安全：用户输入可能包含 ../../
     const filePath = `./uploads/${req.query.file}`;
     // 安全：解析为绝对路径，检查是否在允许目录内
     const allowedDir = path.resolve(__dirname, 'uploads');
     const filePath = path.resolve(allowedDir, req.query.file);
     if (!filePath.startsWith(allowedDir)) {
       res.status(403).end('禁止访问');
       return;
     }
     ```

4. 监控与审计：

   - 记录访问日志、错误日志（如 winston/morgan）；

   - 审计关键操作（如登录、数据修改）；

   - 定期备份数据，避免数据丢失。

---

## Node.js 核心总结

1. **底层核心**：Node.js 是“V8 + libuv”的运行时，事件循环是异步调度核心，线程池处理阻塞 I/O，单线程主线程 + 多线程底层实现高并发；

2. **异步编程**：掌握事件循环各阶段执行顺序、微任务/宏任务优先级，避免回调地狱（用 async/await），处理流的背压；

3. **性能优化**：CPU 密集型任务用 fork/worker_threads 拆分，I/O 密集型用流 + 异步 API，生产环境用 cluster/PM2 利用多核；

4. **工程化**：CommonJS/ESM 互操作需注意规则，生产环境部署用 PM2 做进程守护、日志管理、热重启；

5. **安全与错误**：局部错误优先处理，全局错误兜底，生产环境做好依赖审计、输入验证、权限控制，避免注入/路径遍历漏洞。

> （注：文档部分内容可能由 AI 生成）
