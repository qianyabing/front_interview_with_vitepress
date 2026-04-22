# 虚拟 DOM 对比：Vue2、Vue3 与 React

### 一、虚拟 DOM 核心概念（先统一理解）

#### 1. 什么是虚拟 DOM？

虚拟 DOM 是**对真实 DOM 的抽象描述**，本质是一个 JavaScript 对象，包含 `tag`（标签名）、`props`（属性）、`children`（子节点）等核心属性，例如：

```JavaScript

// 虚拟 DOM 示例
const vnode = {
  tag: 'div',
  props: { id: 'app', class: 'container' },
  children: [{ tag: 'p', children: 'Hello VDOM' }],
  key: null, // 用于 Diff 算法的节点标识
  el: null // 关联的真实 DOM 元素
};
```

#### 2. 虚拟 DOM 的核心作用

- **减少真实 DOM 操作**：真实 DOM 操作性能开销大，虚拟 DOM 通过对比新旧 VNode 差异，只更新需要变化的 DOM（「最小化更新」）；

- **跨平台兼容**：虚拟 DOM 与平台无关，可渲染到 DOM/小程序/原生应用等（如 Vue 的 Weex、React 的 React Native）；

- **简化复杂 DOM 操作**：通过操作 JS 对象替代直接操作 DOM，降低编程复杂度。

### 二、Vue2 虚拟 DOM & Diff 算法

#### 1. Vue2 虚拟 DOM 实现

Vue2 的虚拟 DOM 基于 `VNode` 类实现，核心属性：`tag`、`data`（对应 props）、`children`、`text`（文本节点）、`elm`（真实 DOM）、`key` 等。

- 模板编译：Vue2 将 `<template>` 编译为 `render` 函数，执行 `render` 生成 VNode；

- 响应式触发：数据变化时，触发组件重新执行 `render` 生成新 VNode，与旧 VNode 对比（Diff）后更新 DOM。

#### 2. Vue2 Diff 算法（双端比较）

Vue2 的 Diff 算法是**同级比较**（不跨层级比较，跨层级直接销毁重建），核心采用「双端比较法」（同时从新旧节点的首尾向中间对比），相比 React 早期的单端遍历更高效。

##### 核心步骤：

1. **同级节点对比**：只对比同一层级的 VNode，跳过跨层级节点（如父节点下的子节点 vs 爷爷节点下的子节点）；

2. **双端指针对比**：

    - 定义 4 个指针：旧节点首 `oldStartIdx`、旧节点尾 `oldEndIdx`、新节点首 `newStartIdx`、新节点尾 `newEndIdx`；

    - 依次对比「旧首-新首」「旧尾-新尾」「旧首-新尾」「旧尾-新首」，匹配到则复用节点并移动指针；

    - 未匹配到则通过 `key` 查找旧节点中是否存在对应节点，存在则复用并移动位置，不存在则创建新节点；

3. **key 的作用**：`key` 是节点的唯一标识，用于快速判断节点是否可复用，无 `key` 时会按索引复用（易导致错误复用，如列表渲染）；

4. **列表 Diff 优化**：针对列表节点，通过 `key` 减少节点的增删改操作，优先复用相同 `key` 的节点。

##### 核心特点：

- 对比粒度：以「组件」为最小对比单元，组件内部再递归 Diff；

- 数组处理：对数组子节点的对比更高效（双端对比）；

- 局限性：对比过程中会修改旧 VNode 的指针，不可复用旧 VNode。

### 三、Vue3 虚拟 DOM & Diff 算法

Vue3 重写了虚拟 DOM 和 Diff 算法，核心基于「Monorepo + 组合式 API」重构，性能大幅提升。

#### 1. Vue3 虚拟 DOM 优化

- **静态提升**：编译阶段识别静态节点（如 `<div>静态文本</div>`），将其提升到 `render` 函数外，避免每次渲染重新创建 VNode；

- **PatchFlags（补丁标记）**：为动态节点添加标记（如 `TEXT` 文本变化、`CLASS` 类名变化），Diff 时只处理带标记的节点，跳过静态节点；

    ```JavaScript
    
    // 示例：带 PatchFlags 的 VNode
    const vnode = {
      tag: 'div',
      props: { class: 'dynamic-class' },
      children: [{ tag: 'p', text: '静态文本' }],
      patchFlag: 1 /* CLASS 标记，仅类名动态 */
    };
    ```

- **缓存事件处理函数**：编译阶段缓存 `@click` 等事件函数，避免每次渲染重新创建；

- **Tree-shaking**：虚拟 DOM 相关代码支持按需引入，减小打包体积。

#### 2. Vue3 Diff 算法（快速排序思想的双端比较）

Vue3 继承了 Vue2 的同级比较核心，优化了对比逻辑，核心改进：

1. **最长递增子序列**：针对列表 Diff，通过「最长递增子序列」算法计算出最少的移动操作，减少 DOM 移动次数（解决 Vue2 中列表反转、乱序时的性能问题）；

2. **非对称对比**：对比新旧节点时，先快速对比相同前缀和后缀的节点，再处理中间差异部分，减少对比次数；

3. **Fragment 支持**：允许组件返回多个根节点（Fragment），Diff 时直接对比多个根节点，无需额外包裹层；

4. **复用旧 VNode**：Vue3 的 Diff 过程不修改旧 VNode，可复用旧 VNode 提升性能。

### 四、React 虚拟 DOM & Diff 算法

#### 1. React 虚拟 DOM 实现

React 的虚拟 DOM 称为「Fiber 节点」（React 16+），核心属性：`type`（标签/组件类型）、`props`、`children`、`key`、`stateNode`（真实 DOM）、`effectTag`（更新标记）等。

- JSX 编译：JSX 被编译为 `React.createElement` 调用，返回 Fiber 节点；

- 调度机制：React 16+ 引入 Fiber 架构，将 Diff 过程拆分为多个小任务，可中断、可恢复，避免长时间阻塞主线程。

#### 2. React Diff 算法（时间复杂度 O(n)）

React 早期 Diff 算法是「单端遍历」，React 16+ 基于 Fiber 架构优化，核心原则：

1. **同级比较**：与 Vue 一致，只对比同一层级节点，跨层级直接销毁重建；

2. **key 优先匹配**：通过 `key` 快速判断节点是否可复用，无 `key` 时按索引复用（同 Vue）；

3. **类型优先判断**：

    - 若新旧节点类型不同（如 `div` → `p`），直接销毁旧节点，创建新节点；

    - 若类型相同，再对比 `props` 和 `children`；

4. **列表 Diff 优化**：

    - React 列表 Diff 采用「单端遍历 + key 映射」，对比新旧列表的 `key`，计算出「插入、删除、移动」操作；

    - 局限性：列表乱序时，React 早期 Diff 会频繁销毁重建节点（Vue3 的最长递增子序列更优）；

5. **Fiber 架构下的 Diff 流程**：

    - 「协调（Reconciliation）」阶段：异步对比新旧 Fiber 节点，标记更新类型（`effectTag`）；

    - 「提交（Commit）」阶段：同步执行 DOM 更新，应用所有标记的修改。

### 五、Vue2/Vue3/React 虚拟 DOM & Diff 核心差异

|维度|Vue2|Vue3|React（16+）|
|---|---|---|---|
|虚拟 DOM 核心|VNode 类|带 PatchFlags 的 VNode|Fiber 节点（可中断）|
|编译优化|无静态提升，全量 Diff|静态提升 + PatchFlags，只 Diff 动态节点|无编译优化（JSX 编译为 createElement）|
|Diff 算法核心|双端比较法|双端比较 + 最长递增子序列（列表）|单端遍历 + key 映射（Fiber 异步 Diff）|
|列表 Diff 性能|中等（双端对比）|最优（最长递增子序列）|中等（乱序列表易重建）|
|调度机制|同步 Diff，不可中断|同步 Diff（Vue3.2+ 引入 Suspense 实验性异步）|异步可中断 Diff（Fiber 架构）|
|跨层级处理|直接销毁重建|直接销毁重建|直接销毁重建|
|根节点支持|单根节点（需包裹 div）|多根节点（Fragment）|多根节点（Fragment）|
### 总结

1. **核心共性**：

    - 三者均遵循「同级比较」原则，跨层级节点直接销毁重建；

    - `key` 是节点复用的核心标识，无 `key` 会导致错误复用或性能下降；

    - 虚拟 DOM 的最终目标是「最小化真实 DOM 操作」。

2. **核心差异**：

    - Vue 侧重「编译期优化」（静态提升、PatchFlags），React 侧重「运行期调度」（Fiber 异步 Diff）；

    - Vue3 的列表 Diff 引入「最长递增子序列」，性能优于 Vue2 和 React；

    - React 的 Fiber 架构让 Diff 过程可中断，更适合复杂组件渲染，避免页面卡顿。

3. **面试高频考点**：

    - 虚拟 DOM 的作用和实现原理；

    - `key` 的作用（为何不能用索引作为 key）；

    - Vue3 虚拟 DOM 的优化点（PatchFlags、静态提升）；

    - React Fiber 架构的核心意义（异步可中断 Diff）；

    - 三者 Diff 算法的核心差异。
> （注：文档部分内容可能由 AI 生成）