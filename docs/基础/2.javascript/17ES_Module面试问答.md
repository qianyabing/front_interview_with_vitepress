# 大厂面试 ES Module 标准回答

面试官您好，关于 ESM 的浏览器支持、Vite/Webpack 对 ESM 的处理，我分三点说明：

---

## 1. 浏览器原生支持 ESM 吗？

**现代主流浏览器完全原生支持 ES Module**，老旧浏览器不支持。
- 支持版本：Chrome≥61、Firefox≥60、Safari≥10.1、Edge≥16
- 使用方式：通过 `<script type="module">` 标签直接加载 ESM 文件
- 关键特性：默认启用严格模式、加载行为等价`defer`（不阻塞渲染）、遵循跨域 CORS 策略

IE 等旧浏览器完全不支持，需要通过打包工具做兼容。

---

## 2. Vite 原生支持 ESM 是什么意思？

Vite 的核心设计就是**开发环境直接基于「浏览器原生 ESM」运行**，这是它快的核心原因：
1. 开发阶段**不做全量打包**，浏览器直接通过原生 ESM 请求单个模块文件
2. Vite 只做**即时编译**（TS/JSX 转译）+ 依赖预构建（把 CommonJS 转成 ESM）
3. 模块按需加载，热更新只更新修改文件，启动 / 热更新速度极快
    生产环境 Vite 仍用 Rollup 打包做兼容优化，开发环境才是原生 ESM 直出。

---

## 3. Webpack 不支持 ESM 吗？

**Webpack 完全支持 ESM 语法**，只是和 Vite 的运行逻辑完全不同：
1. Webpack 是**模块打包工具**，会把 ESM、CommonJS 等所有模块打包成浏览器兼容的 bundle（IIFE/UMD 等）
2. 它不会让浏览器原生解析 ESM，而是**编译 + 打包**后再运行
3. Webpack 也支持配置输出 ESM 格式产物，但核心流程依然是打包，而非原生 ESM 直跑
    开发环境 webpack-dev-server 仍有编译打包过程，速度远慢于 Vite。

---

# 一句话总结（加分收尾）

浏览器原生 ESM 是底层加载能力；Vite 开发环境直接复用这个能力，不打包；Webpack 兼容 ESM 但核心是打包编译，而非原生运行 ESM。