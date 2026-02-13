# React 高频细分面试题集（大厂版）

我为你整理了一份**React 方向超细分的高频面试题集**，覆盖基础、原理、Hooks、性能优化、工程化等维度，每个问题都配了**能直接说出口的标准答案/核心思路**，完全贴合大厂面试的考察深度。

---

# React 高频细分面试题集（大厂版）

## 一、React 核心基础（必问，打底）

### Q1：React 的核心理念是什么？

**答：**

React 核心是 **声明式编程** + **组件化** + **单向数据流**。

- 声明式：只描述 UI “长什么样”，不用关心“怎么渲染”，对比命令式（一步步操作 DOM）更简洁；

- 组件化：将 UI 拆分为独立、可复用的组件，降低复杂度；

- 单向数据流：数据从父到子单向传递，状态管理更可控，避免数据混乱。

### Q2：JSX 本质是什么？为什么不能直接在浏览器运行？

**答：**

- JSX 不是标准 JS，是 **React.createElement 的语法糖**，最终会被 Babel 编译为 `React.createElement(type, props, children)` 调用；

- 浏览器不认识 JSX，必须通过 Babel 转译 + React 运行时（react/react-dom）才能执行；

- 例：`<div className="box">hello</div>` → `React.createElement('div', {className: 'box'}, 'hello')`。

### Q3：React 组件的两种定义方式（类组件/函数组件）区别？

**答：**

|维度|类组件|函数组件|
|---|---|---|
|状态管理|this.state/setState|useState/useReducer|
|生命周期|生命周期钩子（componentDidMount 等）|useEffect/useLayoutEffect|
|性能优化|shouldComponentUpdate/PureComponent|React.memo + useMemo/useCallback|
|this 指向|存在 this，需注意绑定|无 this，无绑定问题|
|复用逻辑|HOC/Render Props|Hooks（更简洁）|
|TS 支持|较繁琐（需继承 Component）|更友好（泛型直接标注）|
|心智负担|高（this、生命周期）|低（纯函数思维）|
### Q4：React 中 key 的作用？为什么不能用 index 作为 key？

**答：**

- **作用**：key 是 React 识别列表元素的唯一标识，用于 **diff 算法** 快速定位“新增/删除/移动”的元素，避免不必要的重渲染；

- **不用 index 的原因**：

    1. 列表重新排序/增删时，index 会变化，React 会误判元素“被修改”，导致全量重渲染，性能差；

    2. 会引发子组件状态错乱（比如输入框内容错位）；

- **正确做法**：用唯一且稳定的值（如后端返回的 id）作为 key。

### Q5：React 中的单向数据流是什么？有什么好处？

**答：**

- 单向数据流：数据只能从 **父组件 → 子组件** 通过 props 传递，子组件不能直接修改父组件的 props，需通过父组件传递的回调函数触发状态变更；

- **好处**：

    1. 数据流向清晰，便于调试和定位 bug；

    2. 避免多个组件同时修改同一数据导致的状态混乱；

    3. 组件更纯（输入 props 确定，输出 UI 确定），可预测性强。

## 二、React 生命周期（类组件 + 函数组件）

### Q6：类组件的生命周期分为哪几个阶段？核心钩子有哪些？

**答：**

分为 3 个阶段：

1. **挂载阶段**：`constructor` → `render` → `componentDidMount`（DOM 已渲染，可做异步请求、绑定事件）；

2. **更新阶段**：`shouldComponentUpdate`（控制是否更新）→ `render` → `componentDidUpdate`（更新后操作，需判断 prevProps/prevState）；

3. **卸载阶段**：`componentWillUnmount`（清除定时器、取消订阅、解绑事件，避免内存泄漏）。

### Q7：useEffect 模拟类组件生命周期？

**答：**

- 模拟 `componentDidMount`（仅挂载执行）：`useEffect(() => { ... }, [])`；

- 模拟 `componentDidUpdate`（依赖变化执行）：`useEffect(() => { ... }, [dep1, dep2])`；

- 模拟 `componentWillUnmount`（卸载清理）：`useEffect(() => { return () => { 清理逻辑 } }, [])`；

- 模拟 `componentDidMount + componentDidUpdate`：`useEffect(() => { ... })`（不传依赖）。

### Q8：useEffect 和 useLayoutEffect 的区别？

**答：**

- **执行时机**：

    - `useEffect`：在浏览器**渲染完成后**执行（异步，不阻塞渲染）；

    - `useLayoutEffect`：在 DOM 变更后、浏览器**渲染前**执行（同步，阻塞渲染）；

- **使用场景**：

    - 普通异步操作（请求、定时器）用 `useEffect`；

    - 需要读取/修改 DOM 布局（如获取元素宽高、调整位置）用 `useLayoutEffect`，避免页面闪烁；

- **注意**：`useLayoutEffect` 执行耗时会导致页面卡顿，尽量少用。

## 三、React Hooks 深度（中高级必问）

### Q9：React Hooks 设计初衷？解决了类组件的哪些问题？

**答：**

- **设计初衷**：让函数组件拥有状态和生命周期能力，同时解决类组件的逻辑复用痛点；

- **解决的问题**：

    1. 类组件逻辑复用繁琐（HOC/Render Props 会产生嵌套地狱），Hooks 可将逻辑抽离为自定义 Hooks，复用更简洁；

    2. 类组件生命周期钩子混杂不同逻辑（比如一个 `componentDidMount` 既有请求又有事件绑定），Hooks 可按逻辑拆分；

    3. 类组件 this 指向混乱（需 bind 或箭头函数），函数组件无 this 问题；

    4. 类组件难以做代码分割和 Tree-shaking，Hooks 更轻量化。

### Q10：Hooks 的使用规则？为什么要遵守？

**答：**

核心规则 2 条：

1. **只能在函数组件/自定义 Hooks 顶层调用**，不能在条件、循环、嵌套函数中调用；

2. **只能在 React 函数中调用**，不能在普通 JS 函数中调用。

**原因**：

React 靠 **Hooks 调用顺序** 维护状态映射关系（内部有一个 Hooks 链表），如果在条件/循环中调用，顺序会错乱，导致状态和 Hooks 不匹配，引发 bug。

### Q11：useState 原理？为什么更新是异步的？

**答：**

- **原理**：

    1. 每次调用 `useState`，React 会从 Hooks 链表中取出对应的状态；

    2. 调用 setState 时，React 会标记组件为“待更新”，将新状态存入队列，等待批处理；

    3. 组件重新渲染时，`useState` 返回最新状态。

- **更新异步的原因**：

React 为了性能优化，会**批量处理 setState**（合并多次更新为一次渲染），避免频繁重渲染；

- 注意：在 setTimeout/原生事件中，setState 是同步的（脱离 React 批处理机制）。

### Q12：useState 和 useReducer 的区别？使用场景？

**答：**

|维度|useState|useReducer|
|---|---|---|
|复杂度|简单状态（字符串/数字/布尔）|复杂状态（对象/数组）、多状态联动|
|逻辑封装|无，更新逻辑散在组件中|有，更新逻辑集中在 reducer 中|
|可测试性|差|好（reducer 是纯函数）|
|调试|难追踪状态变更|易追踪（action 可日志）|
**使用场景**：

- 简单状态（如开关、输入框值）→ `useState`；

- 复杂状态（如购物车、表单多字段、状态变更有固定逻辑）→ `useReducer`。

### Q13：useCallback 和 useMemo 的区别？使用场景？

**答：**

- **核心共性**：缓存结果，避免每次渲染重新创建/计算，优化性能；

- **区别**：

    1. `useCallback`：缓存**函数引用**，参数是函数 + 依赖数组，返回缓存的函数；

    2. `useMemo`：缓存**计算结果**，参数是计算函数 + 依赖数组，返回缓存的结果；

- **使用场景**：

    - `useCallback`：传递给子组件的回调函数（配合 `React.memo` 避免子组件不必要重渲染）；

    - `useMemo`：耗时计算（如大数据过滤、复杂公式计算），避免每次渲染重复计算。

### Q14：useRef 的作用？和 useState 的区别？

**答：**

`useRef` 有 2 个核心作用：

1. **获取 DOM 元素/组件实例**：`ref.current` 指向 DOM 节点或类组件实例；

2. **保存跨渲染的可变值**：`ref.current` 变更不会触发组件重渲染。

**和 useState 的区别**：

|维度|useState|useRef|
|---|---|---|
|触发渲染|会触发组件重渲染|不会触发重渲染|
|取值方式|解构获取（[val, setVal]）|ref.current|
|适用场景|需响应式的状态|非响应式的可变值（如定时器 ID、DOM 引用）|
### Q15：自定义 Hooks 设计原则？写一个防抖的自定义 Hooks 示例？

**答：**

- **设计原则**：

    1. 命名必须以 `use` 开头（遵循 Hooks 规则，React 能识别）；

    2. 内部可调用其他 Hooks（如 useState/useEffect）；

    3. 单一职责（一个 Hooks 只做一件事）；

    4. 可复用、可配置（通过参数传递配置）。

**防抖 Hooks 示例**：

```JavaScript

import { useCallback, useRef } from 'react';

// 自定义防抖 Hooks
function useDebounce(fn, delay = 300, immediate = false) {
  const timerRef = useRef(null);

  const debouncedFn = useCallback((...args) => {
    // 清除上一次定时器
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // 立即执行（第一次触发时执行）
    if (immediate && !timerRef.current) {
      fn.apply(this, args);
    }

    // 设置新定时器
    timerRef.current = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args);
      }
      timerRef.current = null;
    }, delay);
  }, [fn, delay, immediate]);

  // 卸载时清除定时器
  useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return debouncedFn;
}

// 使用示例
// const handleSearch = useDebounce((keyword) => { console.log(keyword) }, 500);
```

## 四、React 原理（大厂高频）

### Q16：React 的 Fiber 架构是什么？解决了什么问题？

**答：**

- **Fiber 本质**：是 React 16 引入的**可中断、可恢复、优先级可调**的渲染架构，将渲染任务拆分为一个个小单元（Fiber 节点）；

- **解决的问题**：

旧架构（Stack Reconciler）是同步渲染，一旦开始渲染就不能中断，长任务（如复杂组件渲染）会阻塞浏览器主线程，导致页面卡顿、交互无响应；

- **核心特点**：

    1. 任务拆分：将渲染分为“调和（Reconciliation）”和“提交（Commit）”两个阶段；

    2. 可中断：调和阶段可被高优先级任务（如用户输入、动画）中断，执行完高优先级任务后再恢复；

    3. 优先级：给不同更新任务分配优先级（如动画 > 普通更新 > 懒加载），优先处理高优先级任务。

### Q17：React 的 diff 算法核心规则？

**答：**

React diff 是**针对 Fiber 树**的对比算法，核心优化原则：

1. **同层比较**：只对比同一层级的节点，不跨层级对比（减少复杂度，O(n) 复杂度）；

2. **类型判断**：

    - 节点类型不同：直接删除旧节点，创建新节点（不深入对比子节点）；

    - 节点类型相同：复用节点，只更新属性；

3. **列表 key 优化**：列表节点通过 key 快速匹配，避免全量对比，提升效率。

### Q18：React 的调和（Reconciliation）和提交（Commit）阶段区别？

**答：**

Fiber 架构将渲染分为两个阶段：

1. **调和阶段（Reconciliation）**：

    - 异步、可中断：对比新旧 Fiber 树，找出需要更新的节点（打标记）；

    - 无 DOM 操作，不影响用户界面；

    - 可被高优先级任务中断。

2. **提交阶段（Commit）**：

    - 同步、不可中断：根据调和阶段的标记，执行 DOM 增删改；

    - 执行 `useEffect`/`componentDidMount` 等钩子；

    - 操作 DOM 是同步的，避免页面闪烁。

### Q19：React 中的批处理（Batching）是什么？

**答：**

- **批处理**：React 将多个状态更新合并为一次渲染，减少重渲染次数，提升性能；

- **默认批处理场景**：React 事件处理函数、`useEffect` 回调中的多次 setState 会被批处理；

- **非批处理场景**：setTimeout、原生事件、Promise 回调中的 setState 默认不批处理（React 18 中 `createRoot` 已支持所有场景批处理）；

- **手动批处理**：React 18 提供 `ReactDOM.flushSync` 可强制同步更新（跳过批处理）。

### Q20：React 18 的新特性？

**答：**

核心新特性围绕 **并发渲染（Concurrent Rendering）**：

1. **createRoot**：替代 `ReactDOM.render`，开启并发渲染；

2. **自动批处理**：所有场景（包括 setTimeout/Promise）都支持批处理，减少渲染次数；

3. **Suspense**：支持数据加载（配合 React.lazy 或数据请求库），实现“加载中”占位；

4. **useTransition**：标记低优先级更新（如列表筛选），避免阻塞高优先级操作（如输入）；

5. **useDeferredValue**：延迟更新非紧急值，类似防抖但更优雅；

6. **Server Components**：服务端组件，减少客户端 JS 体积。

## 五、React 状态管理（高频）

### Q21：React 组件间状态共享方式有哪些？

**答：**

按场景分：

1. **父子组件**：props + 回调函数；

2. **跨级/全局组件**：

    - Context API（轻量全局状态，适合简单场景）；

    - Redux/MobX/Zustand/Jotai（适合复杂场景）；

3. **第三方状态管理**：

    - Redux：单向数据流，纯函数 reducer，中间件丰富（redux-thunk/redux-saga）；

    - Zustand：轻量，无需 Provider，API 简洁；

    - Jotai/Recoil：原子化状态管理，适合细粒度状态。

### Q22：Redux 的核心原理？三大原则？

**答：**

- **核心原理**：基于“单向数据流”，通过 `store` 存储状态，`action` 描述状态变更，`reducer` 纯函数处理状态更新；

流程：`dispatch(action)` → `reducer` 计算新状态 → `store` 更新 → 组件订阅更新。

- **三大原则**：

    1. 单一数据源：整个应用的状态存储在一个 store 中；

    2. 状态只读：不能直接修改状态，只能通过 dispatch action 修改；

    3. 纯函数修改：reducer 是纯函数，相同输入必有相同输出，无副作用。

### Q23：Redux 中间件的作用？常用中间件有哪些？

**答：**

- **作用**：扩展 Redux 的 dispatch 能力，处理异步操作、日志、错误捕获等副作用；

- **常用中间件**：

    1. `redux-thunk`：支持 dispatch 函数，处理简单异步请求（如 fetch/axios）；

    2. `redux-saga`：通过 generator 处理复杂异步逻辑（如取消请求、重试、监听 action）；

    3. `redux-logger`：打印 action 和状态变更日志，方便调试。

### Q24：Context API 为什么会导致性能问题？如何优化？

**答：**

- **性能问题原因**：Context 的 Provider 值变化时，所有消费 Context 的组件都会重渲染（即使只用到 Context 的一部分）；

- **优化方案**：

    1. 拆分 Context：将不同维度的状态拆分为多个 Context，避免一个 Context 变化导致所有组件重渲染；

    2. 配合 useMemo：缓存 Provider 的 value（如对象/函数），避免每次渲染创建新值；

    3. 组件拆分：将消费 Context 的逻辑抽离为子组件，减少重渲染范围。

## 六、React 性能优化（大厂必问）

### Q25：React 性能优化的核心思路？具体手段？

**答：**

核心思路：**减少不必要的重渲染** + **减少渲染耗时** + **减少资源加载体积**。

**具体手段**：

#### 1. 减少组件重渲染

- 用 `React.memo` 缓存纯函数组件（浅对比 props）；

- 用 `useCallback` 缓存传递给子组件的回调函数；

- 用 `useMemo` 缓存计算结果和复杂组件；

- 拆分组件：将频繁更新的部分拆为独立组件，避免整体重渲染；

- 优化 Context：拆分 Context，避免全量更新。

#### 2. 减少渲染耗时

- 虚拟列表：长列表用 `react-window`/`react-virtualized`，只渲染可视区域；

- 懒加载：组件懒加载（`React.lazy + Suspense`）、图片懒加载；

- 避免长任务：将耗时计算放入 Web Worker，不阻塞主线程。

#### 3. 资源加载优化

- 代码分割：按路由/组件分割代码，减小首屏体积；

- 按需引入：第三方库（如 lodash）按需引入，避免全量导入；

- 压缩打包：Terser 压缩 JS，CSSNano 压缩 CSS，Gzip/Brotli 压缩资源。

### Q26：React.memo 和 PureComponent 的区别？

**答：**

- **相同点**：都是浅对比 props，避免组件不必要的重渲染；

- **区别**：

    1. `React.memo`：用于**函数组件**，是高阶组件，可自定义对比函数；

    2. `PureComponent`：用于**类组件**，继承自 `Component`，内部实现了 `shouldComponentUpdate` 浅对比；

- **注意**：两者都是浅对比，若 props 是对象/数组（引用类型），需配合 `useCallback`/`useMemo` 缓存引用。

### Q27：为什么会出现闭包陷阱？如何解决？

**答：**

- **闭包陷阱**：`useEffect` 中捕获了旧的状态/ props，导致读取到过期值；

例：

```JavaScript

const [count, setCount] = useState(0);
useEffect(() => {
  setInterval(() => {
    console.log(count); // 永远打印 0，因为捕获了初始的 count
  }, 1000);
}, []);
```

- **解决方法**：

    1. 依赖数组添加对应变量（`[count]`），但会导致定时器重复创建；

    2. 用 `useRef` 保存最新值（推荐）：

        ```JavaScript
        
        const countRef = useRef(count);
        countRef.current = count;
        useEffect(() => {
          setInterval(() => {
            console.log(countRef.current); // 读取最新值
          }, 1000);
        }, []);
        ```

## 七、React 工程化与实战

### Q28：React 项目的目录结构如何设计？

**答：**

大厂主流的模块化目录结构（按功能/特性拆分）：

```Plain Text

src/
├── api/          # 接口请求（按模块拆分）
├── assets/       # 静态资源（图片、字体、样式）
├── components/   # 通用组件（Button、Input 等）
├── features/     # 业务特性模块（如购物车、支付）
│   ├── cart/     # 购物车模块（组件、hooks、状态）
│   └── pay/      # 支付模块
├── hooks/        # 自定义 Hooks
├── layouts/      # 布局组件（Header、Footer、Sidebar）
├── pages/        # 页面组件（路由对应）
├── router/       # 路由配置
├── store/        # 状态管理（Redux/Zustand 等）
├── utils/        # 工具函数
└── App.js        # 根组件
```

### Q29：React 路由（React Router）核心用法？

**答：**

React Router v6 核心用法：

1. **路由配置**：

    ```JavaScript
    
    import { createBrowserRouter, RouterProvider } from 'react-router-dom';
    const router = createBrowserRouter([
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/user/:id', element: <User /> }, // 动态路由
      { path: '*', element: <NotFound /> }, // 404
    ]);
    // 根组件渲染
    <RouterProvider router={router} />
    ```

2. **路由跳转**：

    - 声明式：`<Link to="/about">关于</Link>`；

    - 编程式：`const navigate = useNavigate(); navigate('/about');`；

3. **路由参数**：

    - 动态参数：`const params = useParams(); // { id: '123' }`；

    - 查询参数：`const searchParams = useSearchParams(); searchParams.get('name');`；

4. **嵌套路由**：`Outlet` 组件渲染子路由。

### Q30：React 项目如何做单元测试？

**答：**

大厂主流方案：`Jest + React Testing Library`（侧重用户行为，而非实现细节）。

- **核心思路**：模拟用户操作（点击、输入），断言 UI 表现是否符合预期；

- **示例（测试按钮点击）**：

    ```JavaScript
    
    import { render, screen, fireEvent } from '@testing-library/react';
    import Button from './Button';
    
    test('按钮点击触发回调', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>点击我</Button>);
      
      // 模拟点击
      fireEvent.click(screen.getByText('点击我'));
      
      // 断言回调被调用
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    ```

---

### 总结

1. React 核心考察 **Hooks 原理与使用**、**Fiber 架构**、**diff 算法**、**性能优化** 四大块，是大厂面试的重中之重；

2. 函数组件相关（Hooks）是当前主流，需熟练掌握 `useEffect`/`useCallback`/`useMemo` 的使用场景和坑点；

3. 状态管理要区分不同方案的适用场景（Context/Redux/Zustand），性能优化要结合实际项目落地经验。

如果需要，我可以针对其中某一类问题（比如 Hooks 手写、性能优化落地）给出更具体的代码示例或面试答题技巧。
> （注：文档部分内容可能由 AI 生成）