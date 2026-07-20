

### 第一组：React Hooks 运行机制（连环炮 Q2, Q3, Q4）

#### Q2：Hooks 是用来干嘛的？

- **基础认知**：让**函数组件**拥有状态（`useState`）和生命周期能力（`useEffect`），替代 Class 组件。
- **进阶原理**：Hooks 的本质是**链表**。React 在组件初次渲染时，按调用顺序把 Hook 对象串成链表挂在 `Fiber` 节点上。**必须保证每次渲染时 Hooks 的调用顺序绝对一致**（这就是为什么不能在 `if` 里写 Hook）。
- **实战回答**：“我在 WeLink 项目中全面使用 React Hooks，通过自定义 Hooks（如 `useMessageSubscription`）封装了 WebSocket 的订阅和重连逻辑，让代码复用性大大提升。”

---

#### Q3：`componentDidMount` 怎么用 `useEffect` 表示？

- **基础认知**：`useEffect(fn, [])` —— 依赖数组传**空数组**，表示只在组件挂载时执行一次。
- **进阶陷阱（必看）**：如果 `fn` 里使用了 `props` 或 `state`，由于闭包特性，拿到的永远是**第一次渲染时的旧值**。如果想拿最新值，要么把依赖加进去，要么用 `useRef` 存最新值。
- **代码示例**：

```javascript
useEffect(() => {
  console.log('组件挂载了，执行一次');
  // 相当于 componentDidMount
  subscribeToSomething();

  return () => {
    // 相当于 componentWillUnmount
    unsubscribe();
  };
}, []); // 空依赖 = 只跑一次
```

---

#### Q4：每次 `setState`，Hook 函数会重新跑一遍吗？（超级重点）

- **基础认知**：会！只要状态变了，整个函数组件**从头到尾重新执行一遍**（不只是 `return` 的 JSX 部分）。
- **进阶更新流程（背下来）**：
  1. `setState` 触发状态更新。
  2. React 调度更新，标记当前 Fiber 节点需要重渲染。
  3. **重新执行函数组件**，所有 Hooks（`useState`、`useEffect`等）按顺序重新调用。
  4. 执行 `useEffect` 的**清除函数（cleanup）**（如果有）。
  5. 执行 `useEffect` 的回调（根据依赖数组决定是否执行）。
  6. React 进行虚拟 DOM Diff，将变更提交到真实 DOM。
- **怎么用 Hooks 防抖？（面试必手写）**：防抖的关键是**用 `useRef` 存储定时器 ID**，因为 `ref` 在多次渲染间保持不变。

```javascript
function useDebounceSearch(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null); // 核心：用 ref 存定时器，不受重渲染影响

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current); // 清除上次定时器

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerRef.current); // 组件卸载也要清
  }, [value, delay]);

  return debouncedValue;
}

// 业务中使用（搜索框）
function SearchComponent() {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounceSearch(keyword, 300);

  useEffect(() => {
    if (debouncedKeyword) {
      fetchSearchResult(debouncedKeyword); // 只有用户停止输入 300ms 后才发起请求
    }
  }, [debouncedKeyword]);

  return <input onChange={(e) => setKeyword(e.target.value)} />;
}
```

---

### 第二组：性能优化 Hooks（Q5, Q6）

#### Q5：`useMemo` 和 `useCallback` 是干什么用的？什么时候用？

- **基础认知**：
  - `useMemo`：**缓存计算结果**（值）。只有依赖变了才重新计算，避免每次渲染做高开销计算。
  - `useCallback`：**缓存函数实例**（引用）。保证依赖不变时，函数地址不变。
- **进阶原理（什么时候用？）**：
  - **绝对不要**每个函数都包 `useCallback`！那会适得其反（增加内存开销和依赖比较成本）。
  - **两个必须用的场景**：
    1. 该函数作为 `props` 传给**被 `React.memo` 包裹的子组件**（防止子组件因父组件重渲染而无效重绘）。
    2. 该函数被用作 `useEffect` 的**依赖项**（否则每次都是新函数，导致 `useEffect` 无限循环）。
- **代码对比**：

```javascript
// 场景：复杂数据计算（如 IRMP 报告的图表数据聚合）
const chartData = useMemo(() => {
  return expensiveAggregate(rawData); // 数据没变就不重新算
}, [rawData]);

// 场景：传给子组件的方法（配合 memo）
const handleClick = useCallback(() => {
  console.log(count);
}, [count]); // count 不变，函数地址不变，子组件不会重绘

// ❌ 错误示范：没事就包一层
const handleNothing = useCallback(() => {}, []); // 完全没必要！
```

#### Q6：`useCallback` 的底层实现（缓存函数实例）

- **源码级回答**：`useCallback` 内部维护了一个 `hook.memoizedState` 数组，存着 `[callback, dependencies]`。每次执行时，**浅比较**（`Object.is`）新旧依赖数组。如果依赖没变，直接返回旧的 `callback` 地址；变了，则更新缓存并返回新函数。
- 核心手写极简版：

```javascript
let prevDeps = null;
let prevCallback = null;

function myUseCallback(callback, deps) {
  if (!prevDeps || !deps.every((dep, i) => dep === prevDeps[i])) {
    prevCallback = callback;
    prevDeps = deps;
  }
  return prevCallback;
}
```

---

### 第三组：闭包在 React/Redux 中的体现（Q7, Q8, Q9）

#### Q7 & Q8：闭包 & 你写过的代码里哪些属于闭包？

- **基础认知回顾**：内部函数访问外部函数的变量。
- **你的简历实战举例（必须这样答）**：
  1. **`useEffect` 中的定时器**：内部函数引用了外部的 `props` 或 `state`。
  2. **`useDebounce` 自定义 Hook**：内部的 `setTimeout` 回调引用了 `timerRef` 和 `value`。
  3. **Redux 的 `thunk` 中间件**：`dispatch` 函数在 `thunk` 内部被闭包捕获。

#### Q9：Redux 里面有没有闭包？Reducer？

- **深度回答**：**有，而且非常关键！**
  1. **`createStore(reducer)` 返回的 `dispatch`**：`dispatch` 函数内部引用了 `currentState` 和 `currentReducer`，这两个变量被闭包保护，外界无法直接修改。
  2. **`Reducer` 本身**：虽然 `reducer` 是纯函数（输入输出），但如果它引用了外部配置对象，也形成闭包。
- **源码极简模拟**：

```javascript
function createStore(reducer) {
  let currentState = undefined;
  let listeners = [];

  function dispatch(action) {
    // 【闭包】dispatch 引用了外部变量 currentState 和 reducer
    currentState = reducer(currentState, action); 
    listeners.forEach(fn => fn());
  }

  function getState() {
    return currentState; // 【闭包】返回闭包中的变量
  }
  return { dispatch, getState };
}
```

---

### 第四组：React 组件通信 & Redux 原理（Q10, Q11, Q12, Q13）

#### Q10 & Q11：组件通信 & Context

- **基础**：
  - 父->子：`props`
  - 子->父：`props` + 回调函数
  - 跨层级（爷孙）：**Context** 或 Redux。
- **Context 用法**：`const ThemeContext = React.createContext(null);` 顶层 `<Provider value={...}>`，底层 `useContext(ThemeContext)` 获取。**原理**：Context 的变化会强制消费组件重渲染，即使使用了 `React.memo` 也挡不住。

#### Q12：React-Redux 的通信原理

- **进阶回答（面试官最爱）**：`React-Redux` 通过 `Provider` 组件利用 **Context** 将 `store` 向下传递。`connect` 高阶组件（或 `useSelector` Hook）在组件挂载时向 `store` 注册监听器（`store.subscribe`）。当 `dispatch` 触发后，`store` 变化，监听器回调执行，调用 `setState`（或强制更新）触发组件重渲染，从而拿到最新数据。这是一种**发布-订阅模式**。

#### Q13：`dispatch` 可以派发异步事件吗？Thunk？

- **基础**：原生的 `dispatch` **只能派发普通 `action` 对象**（`{ type, payload }`）。异步必须靠**中间件（Middleware）**。
- **进阶（Redux-Thunk 原理）**：`thunk` 中间件拦截 `action`，如果发现 `action` 是**函数**，就执行这个函数，并把 `dispatch` 和 `getState` 传进去；如果是对象，才传给 `reducer`。
- **实战写法**：

```javascript
// 异步 Action Creator
const fetchUser = (id) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.getUser(id);
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (e) {
      dispatch({ type: 'FETCH_ERROR', error: e });
    }
  };
};
// 调用：store.dispatch(fetchUser(1));
```

---

### 第五组：工程化与安全（Q14, Q15, Q16）

#### Q14：前端测试 Jest

- **基础回答**：Jest 是 Facebook 出的单元测试框架，配合 `@testing-library/react` 做组件测试。
- **核心写法**：`test('描述', () => { expect(sum(1,2)).toBe(3); })`。快照测试（`toMatchSnapshot()`）用于检测 UI 意外变化。

#### Q15：缓存类型 & 策略（必背）

- **强缓存**：`Cache-Control: max-age=3600`（1小时内直接用本地缓存，不发请求给服务器）。
- **协商缓存**：`Last-Modified` / `If-Modified-Since` 或 `ETag` / `If-None-Match`（发请求问服务器，没变就返回 304，变就返回新资源）。
- **实战**：“我们在 IAMP 平台静态资源（Three.js 库）用强缓存 + CDN，接口数据用协商缓存。”

#### Q16：安全攻防（XSS & CSRF）

- **XSS（跨站脚本攻击）**：恶意注入 `<script>`。防御：**对用户输入转义**（React 的 JSX 默认转义，但 `dangerouslySetInnerHTML` 要小心）。
- **CSRF（跨站请求伪造）**：诱导用户点击恶意链接，携带 Cookie 发请求。防御：**CSRF Token**（服务端下发随机 Token，请求必须带上）、**SameSite Cookie**。

---

### 第六组：手撕算法（Q17）—— 链表实现优先级队列

**题目要求**：`push({v, priority})`、`pop()`、`getSize()`，只能用整数，**链表实现**。

**面试官潜台词**：考察你能否灵活运用**哨兵节点（Dummy Node）** 简化插入逻辑。

- **基础思路**：维护一个按 `priority` **从小到大**排序的链表（优先级数字越小越先 pop）。
- **核心难点**：插入时要遍历找到合适位置（`while` 循环）。

**完整手写代码（背这个，直接满分）**：

```javascript
// 节点定义
class Node {
  constructor(v, priority) {
    this.v = v;
    this.priority = priority;
    this.next = null;
  }
}

class PriorityQueue {
  constructor() {
    // 【精髓】哨兵节点：让 head 永远存在，省去大量 if 判空逻辑
    this.head = new Node(null, -Infinity); 
    this.size = 0;
  }

  // 1. 插入（按优先级升序）
  push(item) {
    const { v, priority } = item;
    // 题目限制：只使用整型数据（检查）
    if (typeof priority !== 'number' || !Number.isInteger(priority)) {
      throw new Error('Priority must be integer');
    }

    const newNode = new Node(v, priority);
    let cur = this.head;

    // 找到第一个 priority > 新节点 priority 的位置（插入其前面）
    // 这里用 <= 保证稳定排序（同优先级先入先出）
    while (cur.next && cur.next.priority <= newNode.priority) {
      cur = cur.next;
    }

    // 标准链表插入操作
    newNode.next = cur.next;
    cur.next = newNode;
    this.size++;
  }

  // 2. 弹出（取出头部节点）
  pop() {
    if (this.head.next === null) return null;
    const node = this.head.next;
    this.head.next = node.next;
    this.size--;
    return node.v; // 根据题目要求，返回 v
  }

  // 3. 获取队列长度
  getSize() {
    return this.size;
  }
}

// --- 测试用例 ---
const pq = new PriorityQueue();
pq.push({ v: 'task_3', priority: 3 });
pq.push({ v: 'task_1', priority: 1 });
pq.push({ v: 'task_2', priority: 2 });

console.log(pq.pop()); // task_1 (priority 1)
console.log(pq.pop()); // task_2 (priority 2)
console.log(pq.getSize()); // 1
```

**面试时主动补充**：

> “我用了哨兵节点（Dummy Head），这样即使队列为空，`head` 也不会是 `null`，`pop` 和 `push` 都不用单独判空，代码更健壮。同时我用 `<=` 保证了同优先级下先进先出的稳定性。”

---

### 最后给你的面试“兜底话术”

如果面试官追问的某个细节（比如 Jest 具体 API 或 CSRF 深层绕过）你实在没答全，**千万不能慌**，用下面这句话圆场：

> “这块我更侧重实际项目中的落地，比如在 WeLink 我们主要关注 XSS 防御和数据加密传输，具体的测试框架语法我平时直接查官方文档，但我能熟练编写单元测试和集成测试保证核心模块稳定性。”


