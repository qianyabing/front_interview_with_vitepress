### 第一部分：JavaScript 核心

#### 考点1：闭包（Closure）

- **基础认知（是什么）**：函数嵌套函数，**内部函数可以访问外部函数的变量**。这些变量不会被垃圾回收，常驻内存。
- **进阶原理（为什么存在）**：JS的作用域链机制。函数在定义时就会保存一个`[[Scopes]]`属性，指向它的父级作用域。即使父级函数执行完了，这个引用链还在，所以变量没被销毁。
- **源码/实战回答（怎么答）**：闭包好用，但容易**内存泄漏**。在WeLink这种高频通信场景，如果不手动销毁定时器或断开DOM引用，累积的内存会导致页面越来越卡。

**代码理解（从基础写到优化）**：

```javascript
// 1. 基础形态（人人都懂）
function outer() {
  let count = 0;
  return function inner() { // inner 就是闭包
    count++;
    return count;
  };
}
const add = outer();
console.log(add()); // 1 (count 没有被销毁)

// 2. 面试陷阱：循环中的闭包（var 导致的问题）
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 输出 3,3,3 （因为 var i 是同一个引用）
}
// 解法：用 let（块级作用域）或者立即执行函数(IIFE)包裹

// 3. 你的 WeLink 项目实战（清理闭包引用）
function createWebSocketManager(url) {
  let ws = null;
  let heartTimer = null;

  function connect() {
    ws = new WebSocket(url);
    heartTimer = setInterval(() => { ws.send('ping'); }, 30000);
  }

  function destroy() {
    // 【必杀技】不仅要 clearInterval，还要把引用置 null
    if (heartTimer) clearInterval(heartTimer);
    heartTimer = null; 
    if (ws) ws.close();
    ws = null; // 断开闭包对大对象的引用，让 V8 垃圾回收器能回收内存
  }
  return { connect, destroy };
}
```

---

#### 考点2：原型链（Prototype Chain）

- **基础认知（是什么）**：JS对象可以通过`__proto__`（隐式原型）指向另一个对象，访问属性时如果自身没有，就顺着这条链往上找，直到`null`。这是JS实现继承的底层机制。
- **进阶原理（为什么这么设计）**：为了**节省内存**。所有实例共享同一个`prototype`（显式原型）上的方法，而不是每个实例拷贝一份。
- **源码/实战回答（怎么答）**：搞清楚 `Function` 和 `Object` 的关系是面试常客。记住口诀：**所有函数的 `__proto__` 都指向 `Function.prototype`，所有对象的 `__proto__` 最终都指向 `Object.prototype`**。

**代码理解（画图辅助记忆）**：

```javascript
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { console.log('Hi ' + this.name); };

const p = new Person('Tom');

// 关系链：
// p.__proto__ === Person.prototype  (true)
// Person.prototype.__proto__ === Object.prototype (true)
// Object.prototype.__proto__ === null (终点)

// 【面试加分点】手动实现一个 new 操作符，彻底理解原型
function myNew(constructor, ...args) {
  // 1. 创建一个空对象，并将 __proto__ 指向构造函数的 prototype
  const obj = Object.create(constructor.prototype); 
  // 2. 执行构造函数，绑定 this
  const result = constructor.apply(obj, args);
  // 3. 如果构造函数返回了对象，则返回那个对象，否则返回新建的对象
  return typeof result === 'object' ? result : obj;
}
const p2 = myNew(Person, 'Jerry');
p2.sayHi(); // 输出正常，证明原型链完整
```

---

#### 考点3：Event Loop（事件循环）与微任务/宏任务

- **基础认知（是什么）**：JS是单线程，为了防止代码阻塞，把任务分为**同步**（立即执行）和**异步**（挂起等待）。异步又分**宏任务**（`setTimeout`、`setInterval`、I/O）和**微任务**（`Promise.then`、`MutationObserver`）。
- **进阶原理（执行规则）**：每轮循环先执行一个**宏任务**，然后**清空所有微任务**，最后可能尝试渲染UI，接着取下一个宏任务。
- **源码/实战回答（怎么答）**：微任务的设计初衷是为了**插队**，保证高优先级的更新（如DOM渲染）尽早执行。

**代码理解（死记硬背执行顺序）**：

```javascript
// 面试必考：输出顺序是什么？
console.log('1'); // 同步

setTimeout(() => console.log('2'), 0); // 宏任务1

Promise.resolve().then(() => {
  console.log('3'); // 微任务1
  // 微任务中产生微任务，本轮循环必须清空
  queueMicrotask(() => console.log('4')); 
});

setTimeout(() => {
  console.log('5'); // 宏任务2
  Promise.resolve().then(() => console.log('6')); // 宏任务2的微任务
}, 0);

console.log('7'); // 同步

// 输出：1 -> 7 -> 3 -> 4 -> 2 -> 5 -> 6
// 【理解逻辑】：
// 1. 先清空所有同步（1,7）
// 2. 清空本轮微任务队列（3,4），注意4虽然是在微任务里加的，但本轮必须清完
// 3. 开始下一轮宏任务（2），接着清空2产生的微任务（没有）
// 4. 再下一轮宏任务（5），清空微任务（6）
```

**结合你的项目**：MMMP平台收到WebSocket告警时，用`queueMicrotask`合并高频数据更新，避免一秒内渲染几百次UI导致卡顿。

---

#### 考点4：异步编程（Promise/Async/Await）

- **基础认知（是什么）**：Promise是“承诺”，有三种状态（pending/fulfilled/rejected），一旦改变不可逆。`async/await`是语法糖，让异步代码像同步一样写。
- **进阶原理（微任务触发时机）**：`await`后面的代码相当于被`Promise.resolve().then()`包裹，属于微任务。
- **源码/实战回答（怎么答）**：手写`Promise.all`要特别注意**空数组**和**非Promise值**的处理。

**手写 Promise.all（基础版到完整版）**：

```javascript
function myPromiseAll(promises) {
  // 1. 基础：确保传入的是数组
  if (!Array.isArray(promises)) return Promise.reject(new TypeError('必须是数组'));

  return new Promise((resolve, reject) => {
    const result = [];
    let count = 0;
    const len = promises.length;

    // 2. 边界：空数组立即 resolve
    if (len === 0) return resolve(result);

    promises.forEach((p, index) => {
      // 3. 关键：用 Promise.resolve 包裹，兼容传入普通值（数字、字符串）
      Promise.resolve(p).then(
        (value) => {
          result[index] = value; // 保持顺序
          count++;
          if (count === len) resolve(result);
        },
        (reason) => {
          reject(reason); // 任何一个失败，整体失败
        }
      );
    });
  });
}
```

---

### 第二部分：Vue/React 框架原理（从设计哲学到源码实现）

#### 考点1：Vue2 `defineProperty` vs Vue3 `Proxy`

- **基础认知（是什么）**：两者都是实现“数据变化驱动视图更新”的工具。
- **进阶原理（为什么升级）**：
  - **Vue2（`defineProperty`）**：必须递归遍历data，性能开销大；无法监听数组下标赋值和对象新增/删除属性；`this.$set` 只是补丁。
  - **Vue3（`Proxy`）**：代理整个对象，可以拦截`get`、`set`、`deleteProperty`等13种操作；**懒代理**（只有访问到嵌套对象时才递归代理，初始化更快）。
- **源码/实战回答（怎么答）**：手写极简响应式，让面试官知道你懂`track`（依赖收集）和`trigger`（派发更新）。

**代码理解（Vue3 响应式核心极简版）**：

```javascript
// 存储依赖关系的全局容器（实际Vue3用的是 targetMap）
const effects = new Map(); 

function reactive(target) {
  return new Proxy(target, {
    get(obj, key) {
      // 【依赖收集】如果当前有正在执行的副作用函数，存起来
      if (currentEffect) {
        if (!effects.has(obj)) effects.set(obj, new Map());
        if (!effects.get(obj).has(key)) effects.get(obj).set(key, new Set());
        effects.get(obj).get(key).add(currentEffect);
      }
      // 【懒代理】只有取到嵌套对象时才递归，Vue3精髓
      return typeof obj[key] === 'object' ? reactive(obj[key]) : obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      // 【派发更新】找到依赖该key的所有副作用函数，依次执行
      if (effects.has(obj) && effects.get(obj).has(key)) {
        effects.get(obj).get(key).forEach(fn => fn());
      }
      return true;
    },
    deleteProperty(obj, key) { // Vue3 可以监听 delete
      delete obj[key];
      // 同样触发更新...
      return true;
    }
  });
}

// 测试
let currentEffect = null;
function watch(fn) {
  currentEffect = fn;
  fn(); // 首次执行触发 get 收集依赖
  currentEffect = null;
}
const state = reactive({ count: 0, nested: { a: 1 } });
watch(() => console.log('count变了', state.count));
state.count++; // 自动触发日志
state.nested.a = 2; // 懒代理生效，嵌套对象按需代理
```

---

#### 考点2：虚拟DOM与Diff算法（含Key的作用）

- **基础认知（是什么）**：虚拟DOM是用JS对象模拟真实DOM，通过Diff算法找最小差异，一次性更新真实DOM，减少昂贵回流重绘。
- **进阶原理（Key为什么不能是Index）**：`Key`是节点的唯一标识。用`Index`时，如果数组头部插入数据，所有节点的Index都变了，Diff会误判所有节点都变了，导致全部销毁重建（性能崩了）。正确的Key（如ID）能让Diff精准识别“哪个节点被移动了，哪个是新来的”。
- **源码/实战回答（怎么答）**：Vue2用的是**双端比较**（四个指针移动），Vue3引入了**最长递增子序列（LIS）**，只移动必要节点，减少DOM移动开销。

**代码理解（为什么 key 不能用 index）**：

```javascript
// 场景：展示列表 ['A', 'B']，在头部插入 'C'
// 用 index 做 key 时（错误）：
// 旧节点：key=0(A), key=1(B)
// 新节点：key=0(C), key=1(A), key=2(B)
// Diff 发现 key=0 的文本从 A 变成 C，key=1 从 B 变成 A，key=2 是新增 B
// 结果：A 和 B 两个 DOM 都被更新了，并新建了 B 的 DOM，原 B 复用错误！

// 用 ID 做 key 时（正确）：
// 旧节点：key=A_id(A), key=B_id(B)
// 新节点：key=C_id(C), key=A_id(A), key=B_id(B)
// Diff 精准知道 A 和 B 只是移动了位置，C 是新增
// 结果：只新建一个 C 的 DOM，A 和 B 仅仅移动位置（或调整顺序），性能最高！
```

---

#### 考点3：React vs Vue 状态管理（Redux vs Pinia）

- **基础认知**：Redux是**单向数据流**（Action -> Reducer -> Store），强调不可变数据；Pinia/Vuex是**集中式状态管理**，利用Vue响应式自动更新。
- **进阶原理**：Redux的中间件（如Redux-Thunk）处理异步，原理是拦截Action；Pinia取消了Mutations，只有Actions，更简洁，且完美支持TypeScript类型推断。
- **实战回答**：WeLink用Redux是因为IM消息状态极其复杂（已读/未读/发送中/失败），Redux的DevTools时间旅行能帮我们快速定位状态异常。IRMP用Pinia是因为简单，直接`store.reportData = xx`就能触发更新，开发效率高。

---

### 第三部分：项目深挖（STAR法则 + 量化数据）

#### 项目1：IAMP 隧道智能检测（Three.js 点云）

- **基础解释**：点云就是激光雷达扫出来的大量三维坐标点（X,Y,Z），要在浏览器渲染出来。
- **难点**：数据量巨大（几十万到几百万个点），直接一次性渲染会卡死。
- **你的回答（带上数据）**：
  - **视锥体裁剪**：只渲染相机视野内的点。
  - **分块加载（Chunk）**：每5万个点生成一个`Points`对象，滚动时动态销毁/创建。
  - **Worker解析**：数据解析在Worker线程做，避免主线程阻塞。
  - **结果**：支持百万级点云，帧率稳定60fps。

---

#### 项目2：MMMP 监控平台（WebRTC 内网穿透）

- **基础解释**：工地摄像头是内网RTSP流，公网网页没法直接访问，要用WebRTC做中转。
- **难点**：内网没有公网IP，打洞失败率很高。
- **你的回答**：采用 **STUN（打洞） + TURN（中转保底）** 策略。优先尝试STUN建立P2P连接，失败则降级使用TURN服务器转发流量。用`frp`做内网穿透辅助信令交换。解决了工地远程看不了监控的痛点，异常响应从小时级变秒级。

---

### 第四部分：手撕代码记忆宝典（面试前10分钟看）

| 考题              | 一句话记忆口诀                        | 核心边界（必写）                                                    |
| --------------- | ------------------------------ | ----------------------------------------------------------- |
| **防抖**          | 延迟执行，重新计时                      | `clearTimeout`，保存`this`指向，透传`event`参数                       |
| **节流**          | 时间戳控制开关，或者定时器控制                | 立即执行用时间戳，最后一次必须执行用定时器                                       |
| **深拷贝**         | 递归 + WeakMap 破循环               | 处理 `Date`、`RegExp`、`Map/Set`；用 `Reflect.ownKeys` 遍历Symbol属性 |
| **Promise.all** | 计数器 + 结果数组按序存                  | 传入空数组直接`resolve`；用`Promise.resolve`包裹普通值                    |
| **发布订阅**        | `on` 存回调，`emit` 遍历执行，`off` 删回调 | 注意`once`的实现（执行完调用`off`）                                     |

**深拷贝最终版代码（背这个就够了）**：

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 基础类型 / null 直接返回
  if (obj === null || typeof obj !== 'object') return obj;
  // 处理特殊对象
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 解决循环引用
  if (map.has(obj)) return map.get(obj);

  // 保持原型链
  const clone = new obj.constructor();
  map.set(obj, clone);

  // 遍历所有属性（包括 Symbol）
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], map);
  });
  return clone;
}
```


