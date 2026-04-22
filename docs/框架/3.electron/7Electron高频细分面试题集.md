---
title: electron 
date: 2026-03-29 21:25:02
permalink: /electron
categories:
  - electron
tags:
  - electron
---

# Electron

## 一、Electron 核心基础

### Q1：Electron 是什么？核心架构是什么？

**答：**

- **Electron 定义**：基于 Chromium（渲染引擎）+ Node.js（运行时）+ 原生 API 封装的跨平台桌面应用开发框架，允许用前端技术（HTML/CSS/JS）开发 Windows/macOS/Linux 桌面应用。

- **核心架构**：采用**多进程架构**，核心分为两类进程：

    1. **主进程（Main Process）**：

        - 每个应用只有一个主进程，运行在 Node.js 环境中，负责生命周期管理（启动/退出）、窗口管理、原生 API 调用（文件、系统对话框、网络）、创建渲染进程；

        - 入口文件是 `main.js`（或 `index.js`），通过 `electron.app` 控制应用生命周期，`electron.BrowserWindow` 创建窗口。

    2. **渲染进程（Renderer Process）**：

        - 每个窗口对应一个渲染进程，运行在 Chromium 环境中，负责 UI 渲染和用户交互；

        - 拥有浏览器的全部能力，也可通过 `electron.ipcRenderer` 与主进程通信，开启 `nodeIntegration` 后可直接使用 Node.js API。

### Q2：Electron 主进程和渲染进程的区别？（核心）

**答：**

|维度|主进程（Main Process）|渲染进程（Renderer Process）|
|---|---|---|
|数量|唯一|每个窗口一个，可多个|
|运行环境|Node.js 环境|Chromium 环境（V8 引擎）|
|核心能力|窗口管理、原生 API 调用、进程通信|UI 渲染、用户交互、DOM 操作|
|可访问模块|`app`/`BrowserWindow`/`ipcMain`/`Menu` 等主进程模块|`ipcRenderer`/`webFrame` 等渲染进程模块（开启 `nodeIntegration` 可访问 Node.js）|
|生命周期|与应用一致（启动→退出）|与窗口一致（创建→销毁）|
|权限|高（系统级权限）|低（默认沙箱隔离，需配置）|
### Q3：Electron 如何实现跨平台？

**答：**

Electron 跨平台的核心是**封装不同系统的原生 API**，对外提供统一的 JS 接口，底层依赖三大核心组件实现跨平台：

1. **Chromium**：提供统一的渲染引擎，保证不同系统的 UI 渲染一致（HTML/CSS/JS 解析规则统一）；

2. **Node.js**：提供统一的文件、网络、进程等底层 API，屏蔽系统差异；

3. **原生模块封装**：Electron 封装了 Windows/macOS/Linux 的原生 API（如窗口、菜单、托盘、系统对话框），对外暴露统一的 `electron` 模块，开发者无需关注系统底层实现。

### Q4：Electron 应用的启动流程？

**答：**

Electron 应用的标准启动流程（从执行 `electron .` 到窗口显示）：

1. 启动主进程，执行入口文件（`main.js`）；

2. 主进程初始化 `electron.app`，监听 `ready` 事件（应用就绪）；

3. `ready` 事件触发后，通过 `BrowserWindow` 创建窗口实例；

4. 窗口实例通过 `loadURL`/`loadFile` 加载 HTML 文件，启动渲染进程；

5. 渲染进程加载并执行 HTML 中的 JS/CSS，渲染 UI；

6. 主进程监听窗口/应用的生命周期事件（如 `window-all-closed`/`before-quit`），处理退出逻辑。

**核心代码示例**：

```JavaScript

// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 创建窗口函数
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // 预加载脚本
    }
  });

  // 加载页面（本地文件/远程 URL）
  mainWindow.loadFile('index.html');
  // 打开开发者工具（开发环境）
  mainWindow.webContents.openDevTools();
}

// 应用就绪后创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS 特有：关闭所有窗口后不退出应用，点击 Dock 图标重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭后退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

### Q5：Electron 中的 preload 脚本是什么？作用？

**答：**

- **preload 脚本**：运行在渲染进程中、但**在 DOM 加载前执行**的特殊脚本，拥有 Node.js 权限，是主进程和渲染进程之间的“安全桥梁”；

- **核心作用**：

    1. **安全通信**：在不开启 `nodeIntegration` 的情况下，通过 `contextBridge` 向渲染进程暴露安全的 API，避免渲染进程直接访问 Node.js/主进程 API 带来的安全风险；

    2. **能力扩展**：为渲染进程提供有限的、可控的原生能力（如文件读取、系统信息），同时隔离危险操作；

- **核心代码示例**：

    ```JavaScript
    
    // preload.js
    const { contextBridge, ipcRenderer } = require('electron');
    
    // 向渲染进程暴露安全的 API
    contextBridge.exposeInMainWorld('electronAPI', {
      // 暴露主进程通信方法
      sendMessage: (msg) => ipcRenderer.send('message', msg),
      // 暴露监听主进程消息的方法
      onReceiveMessage: (callback) => ipcRenderer.on('reply', (_, data) => callback(data))
    });
    ```

    渲染进程中使用：

    ```JavaScript
    
    // renderer.js
    window.electronAPI.sendMessage('hello main');
    window.electronAPI.onReceiveMessage((data) => {
      console.log('收到主进程消息：', data);
    });
    ```

## 二、Electron 进程通信（大厂必问，核心）

### Q6：Electron 主进程和渲染进程有哪些通信方式？（按场景分类）

**答：**

Electron 进程通信是核心考点，按“单向/双向”“同步/异步”分类，主流方式如下：

#### 1. IPC 通信（最核心，推荐）

- **异步通信（推荐）**：

    - 渲染进程 → 主进程：`ipcRenderer.send`（发） + `ipcMain.on`（收）；

    主进程回复：`ipcMain.handle`（主进程注册） + `ipcRenderer.invoke`（渲染进程调用，返回 Promise）；

    - 主进程 → 渲染进程：`BrowserWindow.webContents.send`（主进程发） + `ipcRenderer.on`（渲染进程收）；

- **同步通信（不推荐）**：

    - 渲染进程 → 主进程：`ipcRenderer.sendSync`（阻塞渲染进程，易卡顿） + `ipcMain.on`（主进程返回）；

    - 缺点：阻塞渲染进程，影响 UI 响应，仅适合极简单的同步操作。

#### 2. 窗口间通信（渲染进程 ↔ 渲染进程）

- **方式 1**：主进程中转（推荐）：渲染进程 A → 主进程 → 渲染进程 B；

- **方式 2**：共享全局变量（不推荐）：主进程中通过 `global` 定义全局变量，渲染进程开启 `contextIsolation: false` 后访问 `global`；

- **方式 3**：`webContents` 直接通信：主进程获取目标窗口的 `webContents`，调用 `send` 发送消息。

#### 3. 其他通信方式

- **Clipboard（剪贴板）**：适合少量临时数据传递（如复制粘贴）；

- **文件/本地存储**：适合大量数据、持久化数据传递（如 `fs` 写文件、`localStorage`）；

- **Socket/HTTP 服务**：适合复杂场景（如多实例通信），渲染进程启动本地 HTTP 服务，主进程/其他渲染进程请求。

### Q7：ipcRenderer.send 和 ipcRenderer.invoke 的区别？使用场景？

**答：**

|维度|ipcRenderer.send|ipcRenderer.invoke|
|---|---|---|
|通信类型|单向异步（无返回值）|双向异步（返回 Promise，有返回值）|
|主进程处理|`ipcMain.on` 监听，无返回|`ipcMain.handle` 注册，可返回值/异步结果|
|使用场景|渲染进程通知主进程执行操作（无需结果）|渲染进程调用主进程方法并获取结果（如获取文件内容、请求接口）|
|错误处理|需手动监听 `ipcRenderer.on('error')`|可通过 `try/catch` 捕获 Promise 错误|
**核心示例**：

```JavaScript

// 1. ipcRenderer.send（单向）
// 渲染进程
ipcRenderer.send('open-file', '/path/to/file');
// 主进程
ipcMain.on('open-file', (event, path) => {
  fs.readFile(path, (err, data) => { /* 处理文件 */ });
});

// 2. ipcRenderer.invoke（双向）
// 渲染进程
async function readFile() {
  try {
    const data = await ipcRenderer.invoke('read-file', '/path/to/file');
    console.log('文件内容：', data);
  } catch (err) {
    console.error('读取失败：', err);
  }
}
// 主进程
ipcMain.handle('read-file', async (event, path) => {
  return await fs.promises.readFile(path, 'utf8');
});
```

### Q8：Electron 进程通信的安全注意事项？

**答：**

进程通信是 Electron 安全漏洞的高发区，大厂面试必问，核心注意点：

1. **禁用 ** **`nodeIntegration`** ** 和 ** **`contextIsolation: false`**：

    - 默认关闭 `nodeIntegration`（渲染进程无法直接访问 Node.js），开启 `contextIsolation`（隔离主/渲染进程上下文），避免 XSS 攻击获取系统权限；

2. **使用 ** **`contextBridge`** ** 暴露有限 API**：

    - 不直接暴露 `ipcRenderer`，而是通过 `contextBridge.exposeInMainWorld` 暴露封装后的、可控的 API；

3. **验证通信参数**：

    - 主进程接收渲染进程的参数时，必须校验类型/格式（如文件路径、命令参数），避免注入攻击（如路径遍历、命令执行）；

4. **使用 ** **`ipcMain.handle`** ** 替代 ** **`ipcMain.on`** **（双向通信）**：

    - 便于错误捕获和结果返回，避免回调嵌套；

5. **限制通信白名单**：

    - 主进程只处理预定义的 `channel`（通信通道），拒绝未知通道的消息。

### Q9：如何实现渲染进程之间的通信？（举具体例子）

**答：**

渲染进程间通信需通过主进程中转（最安全、推荐），步骤如下：

#### 示例：窗口 A 向窗口 B 发送消息

1. **主进程**：保存所有窗口实例，提供转发方法；

    ```JavaScript
    
    // main.js
    const windows = new Map(); // 存储窗口实例：key 为窗口名称，value 为 BrowserWindow 实例
    
    // 创建窗口 A
    function createWindowA() {
      const winA = new BrowserWindow({ /* 配置 */ });
      winA.loadFile('windowA.html');
      windows.set('windowA', winA);
    }
    
    // 创建窗口 B
    function createWindowB() {
      const winB = new BrowserWindow({ /* 配置 */ });
      winB.loadFile('windowB.html');
      windows.set('windowB', winB);
    }
    
    // 监听渲染进程 A 的消息，转发给窗口 B
    ipcMain.on('send-to-windowB', (event, data) => {
      const winB = windows.get('windowB');
      if (winB) {
        winB.webContents.send('message-from-windowA', data); // 转发给窗口 B
      }
    });
    ```

2. **渲染进程 A**：发送消息到主进程；

    ```JavaScript
    
    // windowA.js
    ipcRenderer.send('send-to-windowB', { text: '来自窗口 A 的消息' });
    ```

3. **渲染进程 B**：监听主进程转发的消息；

    ```JavaScript
    
    // windowB.js
    ipcRenderer.on('message-from-windowA', (event, data) => {
      console.log('收到窗口 A 的消息：', data);
    });
    ```

## 三、Electron 打包与优化（大厂高频）

### Q10：Electron 应用有哪些打包工具？区别？

**答：**

Electron 主流打包工具为 `electron-builder` 和 `electron-packager`，大厂常用 `electron-builder`：

|维度|electron-builder（推荐）|electron-packager|
|---|---|---|
|打包产物|支持安装包（.exe/.dmg/.deb）+ 绿色版|仅绿色版（文件夹形式）|
|跨平台打包|支持（如 Windows 打包 macOS 包，需配置）|有限（需对应系统环境）|
|自动更新|内置 `electron-updater`，支持自动更新|无内置，需手动实现|
|配置复杂度|中等（配置文件 `package.json`）|低（命令行参数）|
|压缩优化|支持 ASAR 打包、代码压缩、依赖裁剪|支持 ASAR，优化较少|
|社区支持|活跃，更新频繁|维护较少|
**核心配置示例（electron-builder）**：

```JSON

// package.json
{
  "scripts": {
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.example.myapp",
    "productName": "MyApp",
    "directories": {
      "output": "dist"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "preload.js"
    ],
    "mac": {
      "target": "dmg",
      "icon": "assets/icon.icns"
    },
    "win": {
      "target": "nsis", // 生成 exe 安装包
      "icon": "assets/icon.ico"
    },
    "linux": {
      "target": "deb"
    }
  }
}
```

### Q11：Electron 应用体积过大的原因？如何优化？

**答：**

#### 体积过大的核心原因：

1. **内置 Chromium + Node.js**：Electron 打包时会包含完整的 Chromium 内核和 Node.js 运行时（约 100+MB）；

2. **依赖冗余**：打包了未使用的第三方依赖、devDependencies 依赖；

3. **资源未压缩**：图片、JS/CSS 未压缩，未做 Tree-shaking；

4. **未使用 ASAR 打包**：源码直接暴露，体积未压缩。

#### 优化方案（按优先级）：

1. **依赖优化**：

    - 剔除 `devDependencies`（打包时只包含 `dependencies`）；

    - 按需引入第三方库（如 Vue/React 按需引入、lodash 按需导入）；

    - 替换大体积依赖（如用 `axios` 替代 `request`，用轻量 UI 库替代 Element Plus）。

2. **资源压缩**：

    - 压缩图片（WebP/AVIF 格式、压缩分辨率）；

    - 压缩 JS/CSS（Terser 压缩、CSSNano 压缩）；

    - 开启 Tree-shaking（Webpack/Vite 配置）。

3. **ASAR 打包**：

    - `electron-builder` 默认开启 ASAR 打包，将源码打包为 `.asar` 文件（压缩体积 + 保护源码）；

4. **裁剪 Chromium 内核**：

    - 使用 `electron-builder` 的 `asarUnpack` 配置，只解压必要文件；

    - 进阶：使用 `electron-rebuild` 编译原生模块，剔除无用模块；

5. **分平台打包**：

    - 只打包目标平台的产物（如 Windows 只打包 exe，不打包 dmg/deb）；

6. **使用轻量替代方案**：

    - 用 `electron-vite` 替代传统 Webpack，减少打包体积；

    - 考虑 `Tauri`（更轻量的跨平台框架，替代 Electron）。

### Q12：Electron 应用启动慢的原因？如何优化？

**答：**

#### 启动慢的核心原因：

1. **主进程初始化耗时**：主进程启动时执行了大量同步操作（如文件读取、依赖加载）；

2. **渲染进程加载慢**：页面资源大、JS 执行耗时、首屏渲染复杂；

3. **窗口创建过早**：主进程未就绪就创建窗口，导致卡顿；

4. **无启动缓存**：未利用 Electron 的 `app.setAppUserModelId`、`BrowserWindow` 缓存。

#### 优化方案：

1. **主进程优化**：

    - 延迟初始化：将非必要的同步操作（如日志、配置读取）放到 `app.ready` 后异步执行；

    - 避免阻塞主进程：用 `setImmediate`/`process.nextTick` 拆分长任务；

2. **渲染进程优化**：

    - 首屏懒加载：非首屏组件、资源延迟加载；

    - 预加载脚本轻量化：preload 脚本只做必要的通信封装，不执行复杂逻辑；

    - 开启硬件加速：`BrowserWindow` 配置 `webPreferences: { hardwareAcceleration: true }`；

3. **窗口优化**：

    - 先创建隐藏窗口，加载完成后再显示：

        ```JavaScript
        
        const win = new BrowserWindow({ show: false });
        win.webContents.on('did-finish-load', () => {
          win.show(); // 加载完成后显示窗口，避免白屏
        });
        ```

    - 禁用不必要的功能：`webPreferences: { spellcheck: false, webSecurity: false }`（按需）；

4. **缓存优化**：

    - 开启 HTTP 缓存、本地缓存，减少重复请求/计算；

    - 使用 `electron-store` 缓存配置信息，避免重复读取文件。

### Q13：Electron 如何实现自动更新？

**答：**

大厂常用 `electron-builder` + `electron-updater` 实现自动更新，核心步骤：

1. **打包配置**：`package.json` 中配置更新服务器地址（如 GitHub Releases、私有服务器）；

    ```JSON
    
    "build": {
      "publish": {
        "provider": "github",
        "repo": "my-app",
        "owner": "my-github-username"
      }
    }
    ```

2. **主进程实现更新逻辑**：

    ```JavaScript
    
    // main.js
    const { autoUpdater } = require('electron-updater');
    const { dialog } = require('electron');
    
    // 配置更新日志
    autoUpdater.setFeedURL({
      provider: 'github',
      repo: 'my-app',
      owner: 'my-github-username'
    });
    
    // 监听更新事件
    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: '更新提示',
        message: '发现新版本，是否立即更新？',
        buttons: ['是', '否']
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.downloadUpdate(); // 下载更新
        }
      });
    });
    
    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'info',
        title: '更新完成',
        message: '更新已下载完成，是否重启应用？',
        buttons: ['是', '否']
      }).then(({ response }) => {
        if (response === 0) {
          autoUpdater.quitAndInstall(); // 重启并安装更新
        }
      });
    });
    
    // 检查更新（应用启动后执行）
    app.whenReady().then(() => {
      if (process.env.NODE_ENV !== 'development') {
        autoUpdater.checkForUpdates();
      }
    });
    ```

## 四、Electron 安全与实战（大厂高频）

### Q14：Electron 应用的安全风险有哪些？如何防范？

**答：**

Electron 作为桌面应用，安全风险直接关联系统权限，大厂面试必问：

#### 核心安全风险：

1. **XSS 攻击**：渲染进程存在 XSS 漏洞，攻击者注入恶意脚本，若开启 `nodeIntegration` 可获取系统权限（如读取文件、执行命令）；

2. **路径遍历攻击**：渲染进程传递的文件路径未校验，攻击者构造 `../` 路径遍历系统文件；

3. **命令注入攻击**：主进程执行系统命令时，参数未过滤，攻击者注入恶意命令；

4. **未隔离上下文**：`contextIsolation: false` 导致渲染进程可直接访问主进程 API。

#### 防范措施（核心）：

1. **基础安全配置**：

    - 禁用 `nodeIntegration`：`webPreferences: { nodeIntegration: false }`；

    - 开启 `contextIsolation`：`webPreferences: { contextIsolation: true }`；

    - 开启 `webSecurity`：`webPreferences: { webSecurity: true }`（防止跨域、XSS）；

2. **参数校验**：

    - 主进程接收渲染进程的路径/命令参数时，校验格式（如用 `path.resolve` 解析路径，防止遍历）；

    - 执行系统命令时，使用 `child_process.execFile`（而非 `exec`），避免命令注入；

3. **权限最小化**：

    - 仅暴露必要的 API（通过 `contextBridge`），不暴露完整的 `fs`/`child_process` 模块；

    - 限制文件访问范围（如只允许访问应用目录，不允许访问系统目录）；

4. **更新安全**：

    - 验证更新包的签名（`electron-updater` 支持签名验证），防止恶意更新包；

5. **源码保护**：

    - 使用 ASAR 打包源码，避免源码暴露；

    - 编译原生模块，混淆 JS 代码。

### Q15：Electron 如何调用原生 API（如系统对话框、托盘、快捷键）？

**答：**

Electron 封装了常用的原生 API，均在主进程中调用，核心示例：

#### 1. 系统对话框（dialog）

```JavaScript

// 主进程
const { dialog } = require('electron');

// 打开文件对话框
dialog.showOpenDialog({
  title: '选择文件',
  filters: [
    { name: 'Text Files', extensions: ['txt'] },
    { name: 'All Files', extensions: ['*'] }
  ]
}).then(({ filePaths }) => {
  if (filePaths.length > 0) {
    console.log('选中的文件：', filePaths[0]);
  }
});

// 保存文件对话框
dialog.showSaveDialog({
  title: '保存文件',
  defaultPath: 'output.txt'
}).then(({ filePath }) => {
  if (filePath) {
    fs.writeFile(filePath, '内容', (err) => { /* 处理 */ });
  }
});
```

#### 2. 系统托盘（Tray）

```JavaScript

// 主进程
const { Tray, Menu } = require('electron');
const path = require('path');

let tray = null;
app.whenReady().then(() => {
  // 创建托盘图标
  tray = new Tray(path.join(__dirname, 'tray.png'));
  // 创建托盘菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow.show() },
    { label: '退出', click: () => app.quit() }
  ]);
  // 设置托盘提示和菜单
  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);
});
```

#### 3. 全局快捷键（globalShortcut）

```JavaScript

// 主进程
const { globalShortcut } = require('electron');

app.whenReady().then(() => {
  // 注册全局快捷键：Ctrl+Shift+I 打开开发者工具
  const ret = globalShortcut.register('Ctrl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });

  if (!ret) {
    console.log('快捷键注册失败');
  }

  // 检查快捷键是否注册成功
  console.log(globalShortcut.isRegistered('Ctrl+Shift+I'));
});

// 应用退出前注销快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
```

### Q16：Electron 如何实现多窗口管理？

**答：**

大厂应用常需多窗口（如主窗口、设置窗口、关于窗口），核心管理方案：

1. **主进程维护窗口实例**：用 Map/数组存储所有窗口实例，避免重复创建；

    ```JavaScript
    
    // main.js
    const windows = new Map();
    
    // 创建窗口的通用函数
    function createWindow(windowName, options, url) {
      // 避免重复创建
      if (windows.has(windowName)) {
        const win = windows.get(windowName);
        win.show();
        win.focus();
        return;
      }
    
      const win = new BrowserWindow(options);
      win.loadFile(url);
      windows.set(windowName, win);
    
      // 窗口关闭时从 Map 中移除
      win.on('closed', () => {
        windows.delete(windowName);
      });
    
      return win;
    }
    
    // 创建主窗口
    createWindow('main', { width: 800, height: 600 }, 'index.html');
    // 创建设置窗口
    createWindow('settings', { width: 400, height: 300, parent: mainWindow }, 'settings.html');
    ```

2. **窗口父子关系**：

    - 创建窗口时设置 `parent` 属性，子窗口随父窗口最小化/关闭而同步；

    - 模态窗口：`modal: true`，子窗口阻塞父窗口交互（如确认对话框）；

3. **窗口通信**：通过主进程中转（见 Q9）；

4. **窗口状态保存**：

    - 用 `electron-store` 保存窗口大小/位置，下次启动恢复：

        ```JavaScript
        
        const Store = require('electron-store');
        const store = new Store();
        
        // 保存窗口状态
        mainWindow.on('close', () => {
          store.set('windowState', {
            width: mainWindow.getBounds().width,
            height: mainWindow.getBounds().height,
            x: mainWindow.getBounds().x,
            y: mainWindow.getBounds().y
          });
        });
        
        // 恢复窗口状态
        const windowState = store.get('windowState', { width: 800, height: 600 });
        const mainWindow = new BrowserWindow({
          width: windowState.width,
          height: windowState.height,
          x: windowState.x,
          y: windowState.y
        });
        ```

### Q17：Electron 如何处理原生模块（如 node-gyp 编译的模块）？

**答：**

Electron 内置的 Node.js 版本可能与本地 Node.js 版本不一致，原生模块（如 `serialport`/`sqlite3`）需重新编译，核心步骤：

1. **安装依赖**：

    ```Bash
    
    npm install --save-dev electron-rebuild
    ```

2. **配置脚本**：

    ```JSON
    
    // package.json
    "scripts": {
      "rebuild": "electron-rebuild"
    }
    ```

3. **编译原生模块**：

    ```Bash
    
    # 安装原生模块后执行
    npm run rebuild
    ```

4. **核心原理**：

    - `electron-rebuild` 会根据 Electron 的 Node.js 版本和架构，重新编译原生模块，生成适配 Electron 的二进制文件；

    - 需确保安装了 `python`/`node-gyp`/C++ 编译工具（Windows 需安装 Visual Studio Build Tools）。

---

### 总结

1. Electron 核心考察 **主/渲染进程区别**、**进程通信方式**、**安全配置**、**打包优化** 四大块，是大厂桌面端面试的重点；

2. 进程通信优先用 `ipcRenderer.invoke` + `ipcMain.handle`（双向异步），避免同步通信和不安全的全局变量；

3. 性能优化核心是“减小体积（依赖裁剪/ASAR）+ 加快启动（延迟初始化/懒加载）”，安全核心是“禁用 nodeIntegration + 开启 contextIsolation + 校验参数”。

如果需要，我可以针对其中某一类问题（如进程通信手写、打包优化落地）给出更具体的代码示例或面试答题技巧。
> （注：文档部分内容可能由 AI 生成）