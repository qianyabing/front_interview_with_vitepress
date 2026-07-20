### 考点一：原型链与创建无原型对象

- **基础认知（是什么）**：
  - **原型链**：JS 中每个对象都有一个内部属性 `[[Prototype]]`（浏览器中通过 `__proto__` 访问），指向其构造函数的 `prototype` 对象。当访问对象属性时，如果自身没有，就沿着 `__proto__` 链向上查找，直到 `null`。这是 JS 实现继承和属性共享的底层机制。
  - **创建无原型对象**：`Object.create(null)`。它创建一个完全空的对象，没有 `__proto__`，没有 `toString`、`hasOwnProperty` 等任何内置方法。
- **进阶原理（为什么要无原型）**：
  - 纯粹做 **“字典/映射表”** 时，`{ key: value }` 会继承 `Object.prototype` 上的属性（如 `toString`），如果用 `obj[key]` 访问，可能和内置属性冲突（比如 key 恰好是 `toString`）。`Object.create(null)` 彻底消除了这个风险，且因为无原型链查找，属性访问**速度更快**。
- **源码/实战结合（你的项目）**：
  
  > “在 **IAMP 点云平台**，我用 `Object.create(null)` 做 **‘坐标值 → 点索引’** 的快速反查表。因为点云数据量大（百万级），如果用普通对象，`hasOwnProperty` 的干扰和原型链查找会拖慢性能。用 `Object.create(null)` 后，查找速度提升约 15%。”

---

### 考点二：通过 `new` 创建一个对象的过程（4个步骤）

- **基础认知（4步走）**：
  
  1. 创建一个全新的空对象 `{}`。
  2. 将这个空对象的 `__proto__` 指向构造函数的 `prototype`（建立原型链）。
  3. 执行构造函数，将 `this` 绑定到新对象上，并传入参数。
  4. 如果构造函数返回了一个对象，则返回该对象；否则返回新创建的对象。

- **进阶原理（手写 `new` 模拟）**：
  
  ```javascript
  function myNew(constructor, ...args) {
    // 1. 创建一个空对象，并设置原型链
    const obj = Object.create(constructor.prototype);
    // 2. 执行构造函数，绑定 this
    const result = constructor.apply(obj, args);
    // 3. 如果构造函数返回了对象，则返回该对象；否则返回新对象
    return (typeof result === 'object' && result !== null) ? result : obj;
  }
  
  // 测试
  function Person(name) { this.name = name; }
  const p = myNew(Person, 'Tom');
  console.log(p instanceof Person); // true
  console.log(p.name); // Tom
  ```

- **实战结合（你的 SuitUI 组件库）**：
  
  > “在维护 SuitUI 组件库时，我使用 `new` 创建了一些工具类的实例。同时因为要兼容多种使用方式（`new` 或工厂函数），我在代码里做了 `instanceof` 检测，如果忘记写 `new`，自动帮用户补上，提升 API 友好度。”

---

### 考点三：高度坍塌（父容器高度为0）—— 原因与解决方案

- **基础认知（是什么）**：
  - **现象**：父容器内所有子元素都**浮动（`float:left/right`）** 或**绝对定位（`position:absolute/fixed`）**，导致父容器无法感知子元素的高度，最终高度变为 0，像“塌”了一样。
  - **核心原因**：浮动/绝对定位让子元素**脱离文档流**，父容器计算高度时不包含它们。
- **进阶原理（BFC - 块级格式化上下文）**：
  - BFC 是 CSS 布局的一块独立区域，内部元素的布局不会影响外部。触发 BFC 的父容器会**包含内部浮动元素**，从而解决高度坍塌。
- **解决方案（4种，按推荐顺序）**：
  1. **父容器触发 BFC（最优雅）**：
     - `overflow: hidden/auto`（触犯 BFC，且不影响布局）。
     - `display: flex` / `display: grid`（现代布局，自带 BFC）。
     - `position: absolute`（不推荐，会脱离正常流）。
  2. **伪元素清除浮动（经典）**：
     
     ```css
     .parent::after {
       content: '';
       display: block;
       clear: both;
     }
     ```
  3. **父容器固定高度**（不灵活，内容溢出就崩）。
  4. **在浮动元素后面加空 `<div style="clear:both"></div>`**（违背语义化，已过时）。
- **实战结合（你的项目）**：
  
  > “在 **IRMP 报告预览页**，我使用 `display: flex` 做多栏布局，天然解决了高度坍塌问题。但在维护一些**旧版 Vue2 组件**时，看到同事用 `float` 做横向滚动列表导致塌陷，我统一改成了 **`overflow: hidden` 触发 BFC** 的方案，并封装成混入（Mixin），一行代码搞定。”

---

### 考点四：SessionStorage vs LocalStorage

- **基础认知**：
  - **共同点**：都存储在浏览器端，同源（协议+域名+端口）下共享，键值对存储。
  - **核心区别**：
    - **生命周期**：`LocalStorage` **永久存储**（除非手动清除）；`SessionStorage` **会话级存储**（关闭标签页或浏览器即清除）。
    - **作用域**：`LocalStorage` 在同源所有标签页/窗口间共享；`SessionStorage` **仅在当前标签页（同一浏览上下文）有效**，即使同源，开两个标签页也互不干扰。
- **存储大小限制**：
  - 绝大多数浏览器：**5MB ~ 10MB**（不同浏览器略有差异，如 Chrome 约 5MB，Firefox 约 10MB）。
  - 注意：这个限制是针对**整个域名**的总大小，而不是单个 key。
- **进阶原理（与 Cookie 对比）**：

| 维度          | LocalStorage | SessionStorage | Cookie                |
|:----------- |:------------ |:-------------- |:--------------------- |
| **容量**      | 5-10MB       | 5-10MB         | 4KB                   |
| **生命周期**    | 永久           | 标签页关闭          | 可设置过期时间               |
| **是否随请求发送** | 否            | 否              | 是（每次请求自动携带）           |
| **适用场景**    | 持久化用户配置、离线缓存 | 表单临时数据、滚动位置    | 身份认证（SessionId/Token） |

- **实战结合（你的项目，重要！）**：
  
  > **（LocalStorage 场景）** “在 **IRMP 报告平台**，我把用户自定义的表格列配置（显示哪些列、宽度排序）存进 `localStorage`，下次登录自动恢复，体验丝滑。”
  > **（SessionStorage 场景）** “在 **IAMP 点云数据标注**时，用户可能在页面内切换不同隧道段，我把当前标注进度（未提交的草稿）存进 `sessionStorage`。用户不小心刷新页面，数据依然在；但关闭页面后自动清除，不占服务器存储，保障数据隐私。”
  > **（容量/安全红线）** “在做 **WeLink** 时，因为涉及企业敏感信息，我们**禁止**在 `localStorage` 存 Token 或用户身份凭证，只用 `HttpOnly Cookie`（防止 XSS 窃取）。`localStorage` 只用来缓存非敏感数据，比如用户头像 URL、主题色等。”

---

### 面试现场组合技（把这些串起来）

> “面试官，我总结一下这几个点的底层逻辑：
> 
> **JS 层面**：`new` 和原型链是 JS 面向对象的基石。我手写过 `myNew` 模拟构造函数调用，并且用 `Object.create(null)` 做过极致性能优化的字典表，**规避了原型链查找的额外开销**。
> 
> **CSS 层面**：高度坍塌是浮动布局的经典问题，我首选 **`display: flex`** 或 **`overflow: hidden` 触发 BFC** 来解决，绝对不会用空 `div` 污染 HTML 结构。
> 
> **存储层面**：我严格遵循 **‘敏感凭证存 HttpOnly Cookie，非敏感配置存 LocalStorage，临时草稿存 SessionStorage’** 的分级存储策略。比如 WeLink 的 IM 聊天记录草稿就是存 `sessionStorage`，关了标签页即清空，保障企业数据不外泄。”


