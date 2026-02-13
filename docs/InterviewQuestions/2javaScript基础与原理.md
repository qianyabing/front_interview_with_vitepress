# JavaScript 基础与原理 超细分面试题集（大厂版）

## 一、数据类型与类型判断（最基础但最易考细点）

### Q1：JS 有哪些数据类型？基本类型和引用类型的核心区别？

**答：**

- **数据类型分类**：

  1. 基本类型（原始类型）：`String`、`Number`、`Boolean`、`Null`、`Undefined`、`Symbol`（ES6）、`BigInt`（ES11）；

  2. 引用类型：`Object`（包含 `Array`、`Function`、`Date`、`RegExp`、`Set/Map` 等）。

- **核心区别**：

| 维度     | 基本类型                        | 引用类型                                |
| -------- | ------------------------------- | --------------------------------------- |
| 存储位置 | 栈内存（stack）                 | 堆内存（heap），栈存地址                |
| 赋值方式 | 值拷贝，互不影响                | 引用拷贝，修改一个影响所有              |
| 比较方式 | 比较值是否相等                  | 比较地址是否相等                        |
| 可变性   | 不可变（无法修改本身）          | 可变（可修改属性/内容）                 |
| 示例     | `let a=1; let b=a; b=2; // a=1` | `let a={x:1}; let b=a; b.x=2; // a.x=2` |

### Q2：typeof 判断类型的坑点有哪些？

**答：**

`typeof` 是判断基本类型的常用方法，但有 3 个核心坑点：

1. `typeof null === 'object'`：JS 设计缺陷（null 的二进制表示前三位为 000，与对象一致）；

2. `typeof [] === 'object'`/`typeof function(){} === 'function'`：数组属于对象，但函数是特殊的引用类型，`typeof` 能识别；

3. 无法区分具体的引用类型（如 `typeof new Date() === 'object'`、`typeof /abc/ === 'object'`）。

### Q3：instanceof 的原理？为什么不能准确判断基本类型？

**答：**

- **原理**：`A instanceof B` 检测 **B.prototype** 是否出现在 **A 的原型链** 上；

- **核心代码**：

  ```JavaScript

  function myInstanceof(A, B) {
    let proto = Object.getPrototypeOf(A); // 获取A的__proto__
    while (true) {
      if (proto === null) return false;
      if (proto === B.prototype) return true;
      proto = Object.getPrototypeOf(proto); // 沿原型链向上找
    }
  }
  ```

- **不能判断基本类型的原因**：基本类型没有原型链，`1 instanceof Number` 结果为 `false`（除非包装成对象：`new Number(1) instanceof Number → true`）。

### Q4：Object.prototype.toString.call() 的原理？如何封装通用类型判断函数？

**答：**

- **原理**：所有对象（包括基本类型的包装对象）都继承了 `Object.prototype.toString`，该方法返回 `[object 类型名]`，`call` 可以改变 `this` 指向，从而获取任意值的类型；

- **通用类型判断函数（大厂级）**：

  ```JavaScript

  function getType(val) {
    // 处理 null/undefined
    if (val === null) return 'null';
    if (val === undefined) return 'undefined';
    // 核心：截取 [object Type] 中的 Type 并转小写
    return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
  }
  // 测试：getType(1) → 'number'，getType([]) → 'array'，getType(/abc/) → 'regexp'
  ```

### Q5：null 和 undefined 的区别？各自的使用场景？

**答：**

- **语义区别**：

  - `undefined`：表示“未定义”（变量声明未赋值、函数无返回值、对象无该属性）；

  - `null`：表示“空值”（主动赋值，代表变量指向空对象）。

- **使用场景**：

  - `undefined`：JS 引擎自动赋值（如 `let a; // a=undefined`），不建议手动赋值；

  - `null`：手动清空对象引用（如 `let obj = null;`）、函数参数表示“无值”。

## 二、执行上下文与作用域（核心原理，必问）

### Q1：执行上下文的组成？创建阶段和执行阶段分别做什么？

**答：**

- **执行上下文（EC）** 是 JS 代码执行的环境，分为：全局执行上下文（1 个）、函数执行上下文（N 个）、eval 执行上下文（极少用）；

- **组成部分**：

  1. **变量对象（VO）**：存储变量、函数声明、参数（函数执行上下文称为 AO：活动对象）；

  2. **作用域链（Scope Chain）**：当前 EC 的变量对象 + 所有父级 EC 的变量对象；

  3. **this 绑定**：确定 this 的指向。

- **创建阶段（进入执行上下文）**：

  1. 初始化变量对象（变量提升、函数提升、参数赋值）；

  2. 建立作用域链；

  3. 确定 this 指向。

- **执行阶段**：

  1. 变量赋值；

  2. 执行代码；

  3. 函数调用。

### Q2：变量提升与函数提升的区别？优先级？

**答：**

- **变量提升**：`var` 声明的变量会被提升到当前作用域顶部，但**赋值不会提升**（默认值为 `undefined`）；`let/const` 有“暂时性死区”，无变量提升；

- **函数提升**：函数声明（`function fn() {}`）会被整体提升（包括函数体），优先级高于变量提升；函数表达式（`let fn = function() {}`）只有变量提升，无函数提升；

- **优先级**：函数提升 > 变量提升（同名时，函数声明覆盖变量声明）；

- **示例**：

  ```JavaScript

  console.log(a); // function a() {}
  var a = 1;
  function a() {}
  console.log(a); // 1
  ```

### Q3：暂时性死区（TDZ）的原理？为什么 let/const 没有变量提升？

**答：**

- **暂时性死区（TDZ）**：`let/const` 声明的变量，从当前作用域开始到变量声明前，该变量不可访问（访问会报错）；

- **原理**：`let/const` 本质上也有“提升”，但提升后变量处于 TDZ 中，未完成“初始化”，而 `var` 提升后会初始化为 `undefined`；

- **示例**：

  ```JavaScript

  console.log(a); // Uncaught ReferenceError: Cannot access 'a' before initialization
  let a = 1;
  ```

### Q4：作用域与作用域链的原理？闭包和作用域链的关系？

**答：**

- **作用域**：变量的可访问范围，分为全局作用域、函数作用域、块级作用域（ES6 `let/const`）；作用域在**定义时确定**，与执行位置无关；

- **作用域链**：当前作用域 + 所有父级作用域的链式结构，变量查找时沿作用域链向上找，找到即停止，直到全局作用域；

- **闭包与作用域链的关系**：闭包的本质是**函数保留了对父级作用域的引用**，即使父函数执行完毕，作用域链也不会销毁，从而能访问父作用域的变量。

### Q5：块级作用域的实现？为什么 IIFE 能模拟块级作用域？

**答：**

- **块级作用域（ES6）**：`{}` 包裹的区域，`let/const` 声明的变量仅在块内有效；

- **IIFE（立即执行函数）模拟块级作用域的原理**：函数作用域是天然的私有作用域，IIFE 执行后，内部变量不会污染全局，等价于块级作用域；

- **示例**：

  ```JavaScript

  // ES5 IIFE 模拟
  (function() {
    var a = 1; // 仅在函数内有效
  })();
  console.log(a); // undefined

  // ES6 块级作用域
  {
    let a = 1; // 仅在块内有效
  }
  console.log(a); // ReferenceError
  ```

## 三、原型与继承（大厂必问，细粒度追问）

### Q1：**proto** 和 prototype 的区别？两者的关联？

**答：**

| 维度     | **proto**（隐式原型）                                    | prototype（显式原型）                               |
| -------- | -------------------------------------------------------- | --------------------------------------------------- |
| 所属对象 | 所有对象（包括函数）                                     | 仅函数拥有（除箭头函数）                            |
| 作用     | 构成原型链，用于查找属性                                 | 用于创建实例，实例的 **proto** 指向函数的 prototype |
| 关联     | `实例.__proto__ === 构造函数.prototype`                  | `Function.prototype.__proto__ === Object.prototype` |
| 示例     | `let arr = []; arr.__proto__ === Array.prototype → true` | `Array.prototype.push → 数组的 push 方法`           |

### Q2：new 操作符的底层执行步骤？手写 new 实现？

**答：**

- **new 执行步骤**：

  1. 创建一个空对象 `obj`；

  2. 将 `obj.__proto__` 指向构造函数的 `prototype`；

  3. 将构造函数的 `this` 绑定到 `obj`，执行构造函数；

  4. 如果构造函数返回**对象/函数**，则返回该值；否则返回 `obj`。

- **手写 new 实现（大厂级）**：

  ```JavaScript

  function myNew(Fn, ...args) {
    // 1. 创建空对象，绑定原型
    const obj = Object.create(Fn.prototype);
    // 2. 执行构造函数，绑定this
    const result = Fn.apply(obj, args);
    // 3. 判断返回值
    return result instanceof Object ? result : obj;
  }
  // 测试：function Person(name) { this.name = name; }
  // const p = myNew(Person, '张三'); // p.name → '张三'
  ```

### Q3：原型链的查找规则？如果原型链上有同名属性会怎样？

**答：**

- **原型链查找规则**：

  1. 先查找实例自身的属性，找到则返回；

  2. 若未找到，沿 `__proto__` 向上查找原型链（构造函数的 prototype → 父构造函数的 prototype → ...）；

  3. 直到 `Object.prototype`，若仍未找到则返回 `undefined`。

- **同名属性处理**：实例自身属性会**覆盖**原型链上的同名属性（就近原则）；若想访问原型链上的属性，可通过 `Object.getPrototypeOf(实例).属性`。

### Q4：常见的继承方式？各自的优缺点？

**答：**

| 继承方式      | 实现方式                         | 优点                        | 缺点                                   |
| ------------- | -------------------------------- | --------------------------- | -------------------------------------- |
| 原型链继承    | `Child.prototype = new Parent()` | 简单，共享原型方法          | 父属性引用类型被所有实例共享；无法传参 |
| 借用构造函数  | `Parent.call(this, args)`        | 可传参；属性不共享          | 无法继承原型方法；函数无法复用         |
| 组合继承      | 原型链 + 借用构造函数            | 传参 + 继承原型方法         | 父构造函数执行两次（冗余）             |
| 寄生组合继承  | 组合继承 + 寄生式封装            | 最优，无冗余，传参+继承方法 | 实现稍复杂                             |
| class extends | ES6 语法糖                       | 简洁，语义化                | 本质是寄生组合继承，无新特性           |

- **寄生组合继承核心代码（最优）**：

  ```JavaScript

  function Parent(name) { this.name = name; }
  Parent.prototype.say = function() { console.log(this.name); };

  function Child(name, age) {
    Parent.call(this, name); // 借用构造函数传参
    this.age = age;
  }
  // 寄生式：继承原型方法，避免执行父构造函数
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child; // 修正constructor指向
  ```

### Q5：class 的本质？class extends 的底层原理？

**答：**

- **class 的本质**：语法糖，底层仍是**函数 + 原型**，没有新增特性；

  - `class Person {}` 等价于 `function Person() {}`；

  - `class` 内的方法会被添加到 `Person.prototype` 上；

  - `class` 不存在提升，必须先定义后使用。

- **class extends 原理**：底层是**寄生组合继承**，核心步骤：

  1. 子类 `__proto__` 指向父类（继承静态方法）；

  2. 子类 `prototype.__proto__` 指向父类 `prototype`（继承原型方法）；

  3. 调用 `super()` 等价于 `Parent.call(this)`（绑定 this）。

## 四、闭包与内存（易混+坑点）

### Q1：闭包的定义？底层原理（作用域链+变量对象）？

**答：**

- **定义**：函数嵌套时，内部函数保留对外部函数作用域的引用，即使外部函数执行完毕，内部函数仍能访问外部函数的变量；

- **底层原理**：

  1. 外部函数执行时创建执行上下文，变量对象存储变量；

  2. 内部函数定义时，作用域链包含外部函数的变量对象；

  3. 外部函数执行完毕后，执行上下文销毁，但变量对象因被内部函数引用，不会被垃圾回收；

  4. 内部函数执行时，沿作用域链访问外部变量。

### Q2：闭包的常见用途？实际项目中的应用场景？

**答：**

- **核心用途**：

  1. 私有化变量（模块封装，避免全局污染）；

  2. 保存状态（如防抖节流、计数器）；

  3. 延迟执行（如定时器、事件监听）。

- **项目场景**：

  - 工具函数封装（如 `utils.js` 暴露方法，内部变量私有）；

  - React/Vue 中的自定义 Hooks（保存组件状态）；

  - 防抖节流函数（保留定时器 ID 状态）。

### Q3：闭包导致内存泄漏的场景？如何避免？

**答：**

- **内存泄漏场景**：

  1. 闭包引用的变量未手动释放（如全局变量引用闭包）；

  2. 闭包引用 DOM 元素，DOM 销毁后闭包仍存在；

  3. 定时器/事件监听未清除，闭包持有引用。

- **避免方式**：

  1. 不再使用时，手动解除引用（`fn = null`）；

  2. 组件卸载时清除定时器/事件监听；

  3. 避免闭包引用大对象/无用变量。

### Q4：循环中的闭包坑点？（如 for 循环 var 声明+setTimeout）如何解决？

**答：**

- **坑点示例**：

  ```JavaScript

  // 期望输出 0-4，实际输出 5 个 5
  for (var i = 0; i < 5; i++) {
    setTimeout(() => { console.log(i); }, 100);
  }
  ```

  - 原因：`var` 声明的 `i` 是全局变量，定时器执行时 `i` 已变为 5；

- **解决方式**：

  1. `let` 声明（块级作用域）：`for (let i = 0; ...)`；

  2. IIFE 包裹（创建私有作用域）：

     ```JavaScript

     for (var i = 0; i < 5; i++) {
       (function(j) { setTimeout(() => { console.log(j); }, 100); })(i);
     }
     ```

### Q5：闭包与垃圾回收的关系？为什么闭包变量不会被回收？

**答：**

- **JS 垃圾回收规则**：标记清除法（标记不再使用的变量，定期回收）；

- **闭包变量不回收的原因**：闭包（内部函数）持有外部函数变量对象的引用，该变量对象被标记为“仍在使用”，因此不会被回收；

- **注意**：闭包不会导致内存泄漏，**不合理的闭包使用**（如全局引用、未释放）才会导致泄漏。

## 五、异步编程（核心，细到执行顺序）

### Q1：宏任务与微任务的分类？执行顺序？

**答：**

- **任务分类**：

  1. 宏任务（Macrotask）：`setTimeout`/`setInterval`、`script` 整体代码、I/O、UI 渲染、`setImmediate`（Node）；

  2. 微任务（Microtask）：`Promise.then/catch/finally`、`async/await`、`MutationObserver`、`process.nextTick`（Node，优先级最高）。

- **执行顺序（核心）**：

  1. 执行同步代码（属于宏任务）；

  2. 清空当前微任务队列（按顺序执行）；

  3. 执行一个宏任务；

  4. 清空微任务队列；

  5. 循环往复（事件循环）。

- **示例（大厂必考执行顺序）**：

  ```JavaScript

  console.log(1); // 同步
  setTimeout(() => { console.log(2); }, 0); // 宏任务
  Promise.resolve().then(() => { console.log(3); }); // 微任务
  console.log(4); // 同步
  // 输出：1 → 4 → 3 → 2
  ```

### Q2：Promise 的三种状态？状态能否逆转？then/catch/finally 的返回值？

**答：**

- **Promise 状态**：

  1. `pending`（进行中）→ `fulfilled`（成功）/`rejected`（失败）；

  2. 状态一旦改变，**不可逆转**（如 `fulfilled` 无法变回 `pending`）。

- **then/catch/finally 返回值**：

  1. 都返回一个**新的 Promise**（可链式调用）；

  2. `then` 回调返回非 Promise 值 → 新 Promise 状态为 `fulfilled`；

  3. `then/catch` 抛出错误 → 新 Promise 状态为 `rejected`；

  4. `finally` 不改变 Promise 状态，仅执行回调。

### Q3：Promise.all/Promise.race/Promise.allSettled/Promise.any 的区别？手写 Promise.all？

**答：**

| 方法               | 核心逻辑                                    | 失败处理                             |
| ------------------ | ------------------------------------------- | ------------------------------------ |
| Promise.all        | 所有 Promise 成功才成功，返回结果数组       | 一个失败则立即失败，返回该错误       |
| Promise.race       | 第一个完成的 Promise 决定结果（成功/失败）  | 第一个失败则失败                     |
| Promise.allSettled | 所有 Promise 完成（无论成败），返回结果数组 | 无失败，结果包含 status/value/reason |
| Promise.any        | 第一个成功的 Promise 决定结果               | 所有失败则抛出 AggregateError        |

- **手写 Promise.all（大厂级）**：

  ```JavaScript

  function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(promises)) reject(new TypeError('参数必须是数组'));
      const result = [];
      let count = 0; // 记录已完成的Promise数量
      for (let i = 0; i < promises.length; i++) {
        // 兼容非Promise值
        Promise.resolve(promises[i]).then(res => {
          result[i] = res;
          count++;
          if (count === promises.length) resolve(result);
        }, err => {
          reject(err); // 一个失败则整体失败
        });
      }
    });
  }
  ```

### Q4：async/await 的原理？await 后面的代码属于什么任务？

**答：**

- **原理**：`async/await` 是 Promise 的语法糖，`async` 函数返回 Promise，`await` 等价于 `Promise.then`；

- **执行逻辑**：

  1. `await` 后面的代码会暂停执行，等待 Promise 完成；

  2. `await` 后的代码会被包裹到微任务中（等价于 `then` 回调）；

- **示例**：

  ```JavaScript

  async function fn() {
    console.log(1);
    await Promise.resolve(); // 微任务起点
    console.log(2); // 微任务
  }
  fn();
  console.log(3); // 同步
  // 输出：1 → 3 → 2
  ```

### Q5：回调地狱的解决方式？从回调 →Promise→async/await 的演进？

**答：**

- **回调地狱**：多层回调嵌套，代码可读性差、维护难；

- **演进过程**：

  1. 回调函数 → 基础异步，但嵌套深；

  2. Promise → 链式调用，解决嵌套，但仍有 `.then` 链；

  3. async/await → 同步写法，可读性最优，本质是 Promise 语法糖；

- **示例对比**：

  ```JavaScript

  // 回调地狱
  fs.readFile('1.txt', (err, res1) => {
    fs.readFile(res1, (err, res2) => {
      fs.readFile(res2, (err, res3) => { console.log(res3); });
    });
  });

  // Promise
  readFilePromise('1.txt').then(res1 => readFilePromise(res1)).then(res2 => readFilePromise(res2)).then(res3 => console.log(res3));

  // async/await（最优）
  async function read() {
    const res1 = await readFilePromise('1.txt');
    const res2 = await readFilePromise(res1);
    const res3 = await readFilePromise(res2);
    console.log(res3);
  }
  ```

## 六、函数进阶（this/柯里化/防抖节流）

### Q1：this 的绑定规则？优先级？手写 bind 函数？

**答：**

- **this 绑定规则（优先级从高到低）**：

  1. 显式绑定：`call/apply/bind`；

  2. 隐式绑定：对象调用（`obj.fn()`）；

  3. new 绑定：`new Fn()`；

  4. 默认绑定：全局作用域（浏览器 `window`，Node `global`）；

  - 例外：箭头函数无 this，继承外层作用域的 this。

- **手写 bind 函数（大厂级，兼容 new）**：

  ```JavaScript

  Function.prototype.myBind = function(context, ...args1) {
    const fn = this; // 保存原函数
    // 返回绑定后的函数
    const bound = function(...args2) {
      // 若用new调用，this指向实例，否则指向context
      return fn.apply(this instanceof bound ? this : context, [...args1, ...args2]);
    };
    // 继承原函数的原型
    bound.prototype = Object.create(fn.prototype);
    return bound;
  };
  ```

### Q2：箭头函数与普通函数的区别？箭头函数的 this 指向？

**答：**

| 维度      | 箭头函数                      | 普通函数               |
| --------- | ----------------------------- | ---------------------- |
| this 指向 | 继承外层作用域的 this         | 动态绑定（调用时确定） |
| 构造函数  | 不能作为构造函数（无 new）    | 可以作为构造函数       |
| arguments | 无，需用 rest 参数（...args） | 有 arguments 对象      |
| prototype | 无 prototype 属性             | 有 prototype 属性      |
| 换行      | 箭头后不能换行（除非用 {}）   | 无限制                 |

### Q3：柯里化的定义？原理？手写通用柯里化函数？

**答：**

- **定义**：将多参数函数转为单参数链式调用（`fn(a,b,c)` → `fn(a)(b)(c)`）；

- **原理**：利用闭包保存已传入的参数，直到参数数量满足原函数需求；

- **手写通用柯里化函数**：

  ```JavaScript

  function curry(fn) {
    const len = fn.length; // 原函数参数个数
    return function curried(...args) {
      // 参数足够，执行原函数
      if (args.length >= len) return fn.apply(this, args);
      // 参数不足，返回新函数，继续收集参数
      return function(...newArgs) {
        return curried.apply(this, [...args, ...newArgs]);
      };
    };
  }
  // 测试：const add = (a,b,c) => a+b+c; const curriedAdd = curry(add); curriedAdd(1)(2)(3) → 6
  ```

### Q4：防抖节流的原理？手写立即执行版防抖/时间戳版节流？

**答：**

- **防抖（Debounce）**：触发后延迟执行，若期间再次触发则重置延迟；

  - **立即执行版防抖（适合搜索框）**：

    ```JavaScript

    function debounce(fn, delay = 300, immediate = true) {
      let timer = null;
      return function(...args) {
        if (timer) clearTimeout(timer);
        // 立即执行：第一次触发直接执行
        if (immediate && !timer) fn.apply(this, args);
        timer = setTimeout(() => {
          if (!immediate) fn.apply(this, args);
          timer = null;
        }, delay);
      };
    }
    ```

- **节流（Throttle）**：固定时间内只执行一次；

  - **时间戳版节流（适合滚动/resize）**：

      ```JavaScript

      function throttle(fn, interval = 300) {
        let last = 0; // 上一次执行时间
        return function(...args) {
          const now = Date.now();
          // 时间间隔满足，执行函数
          if (now - last >= interval) {
            fn.apply(this, args);
            last = now;
          }
        };
      }
      ```

### Q5：纯函数的定义？优点？实际应用场景？

**答：**

- **定义**：输入相同则输出必相同，且无副作用（不修改外部变量、不触发 I/O、不改变参数）；

- **优点**：

  1. 可预测性（输入确定则输出确定）；

  2. 可缓存（如 `memoize` 缓存结果）；

  3. 可测试（无需模拟外部依赖）；

- **应用场景**：

  - React 组件（纯组件，props 相同则渲染结果相同）；

  - Redux reducer（必须是纯函数，state 不可变）；

  - 工具函数（如 `Array.map`/`filter` 是纯函数）。

## 七、数组/对象操作（高频手写+原理）

### Q1：数组的遍历方法？哪些会改变原数组？哪些是纯函数？

**答：**

| 方法          | 改变原数组 | 纯函数 | 用途                  |
| ------------- | ---------- | ------ | --------------------- |
| forEach       | 否         | 否     | 遍历，无返回值        |
| map           | 否         | 是     | 遍历，返回新数组      |
| filter        | 否         | 是     | 过滤，返回新数组      |
| reduce        | 否         | 是     | 累加/聚合，返回任意值 |
| push/pop      | 是         | 否     | 尾部添加/删除         |
| shift/unshift | 是         | 否     | 头部添加/删除         |
| splice        | 是         | 否     | 任意位置添加/删除     |
| sort/reverse  | 是         | 否     | 排序/反转             |
| slice         | 否         | 是     | 截取，返回新数组      |

### Q2：数组扁平化的多种实现方式？

**答：**

- **方式 1：递归**：

  ```JavaScript

  function flatten(arr) {
    let res = [];
    for (let item of arr) {
      res = res.concat(Array.isArray(item) ? flatten(item) : item);
    }
    return res;
  }
  ```

- **方式 2：ES6 flat**：`arr.flat(Infinity)`（Infinity 表示无限层级）；

- **方式 3：reduce**：

  ```JavaScript

  function flatten(arr) {
    return arr.reduce((res, item) => res.concat(Array.isArray(item) ? flatten(item) : item), []);
  }
  ```

- **方式 4：正则（仅数字数组）**：`JSON.parse('[' + JSON.stringify(arr).replace(/[|]/g, '') + ']')`。

### Q3：数组去重的多种实现？各自的优缺点？

**答：**

| 方法     | 实现代码                                               | 优点           | 缺点                           |
| -------- | ------------------------------------------------------ | -------------- | ------------------------------ |
| Set      | `[...new Set(arr)]`                                    | 简洁，性能好   | 无法去重对象/NaN（ES6 已修复） |
| 双重循环 | 外层遍历，内层判断是否重复                             | 兼容所有环境   | 性能差（O(n²)）                |
| indexOf  | `arr.filter((item, idx) => arr.indexOf(item) === idx)` | 简洁           | 性能一般，无法去重 NaN         |
| 哈希表   | 用对象/Map 存储已出现的值                              | 性能好（O(n)） | 需处理类型（如 '1' 和 1）      |

### Q4：深拷贝的实现？考虑循环引用、特殊类型（RegExp/Date）？

**答：**

- **基础版深拷贝（不考虑循环引用/特殊类型）**：

  ```JavaScript

  function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    // 处理数组/对象
    const res = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) { // 避免遍历原型链
        res[key] = deepClone(obj[key]);
      }
    }
    return res;
  }
  ```

- **进阶版（处理循环引用+特殊类型）**：

  ```JavaScript

  function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    // 处理循环引用
    if (map.has(obj)) return map.get(obj);
    // 处理Date/RegExp
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    // 处理数组/对象
    const res = Array.isArray(obj) ? [] : {};
    map.set(obj, res); // 缓存已拷贝的对象
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        res[key] = deepClone(obj[key], map);
      }
    }
    return res;
  }
  ```

### Q5：Object.create/Object.assign 的原理？浅拷贝的坑点？

**答：**

- **Object.create**：创建新对象，新对象的 `__proto__` 指向传入的原型对象；

  - 示例：`const obj = Object.create({x:1}); obj.x → 1`；

- **Object.assign**：将源对象的可枚举属性复制到目标对象，属于**浅拷贝**；

  - 原理：遍历源对象的属性，逐个赋值到目标对象；

- **浅拷贝坑点**：

  1. 引用类型属性共享（修改拷贝后的对象，原对象也会变）；

  2. 无法拷贝原型链上的属性；

  3. 无法拷贝不可枚举属性。

## 八、其他核心细节（大厂追问）

### Q1：JS 垃圾回收机制？标记清除/分代回收/引用计数？

**答：**

- **标记清除（主流）**：

  1. 标记：遍历所有可达对象（被引用的对象）；

  2. 清除：回收未被标记的对象；

  3. 优点：解决循环引用问题；缺点：内存碎片化。

- **引用计数（废弃）**：

  1. 记录每个对象的引用次数，次数为 0 则回收；

  2. 缺点：无法解决循环引用（如 `a={b:b}; b={a:a}`，引用次数永远为 1）。

- **分代回收（V8 优化）**：

  1. 将对象分为新生代（短期）和老生代（长期）；

  2. 新生代用 Scavenge 算法（复制+清理），老生代用标记清除+标记整理。

### Q2：ES6 模块化（ESM）与 CommonJS 的区别？

**答：**

| 维度         | ESM（import/export）                 | CommonJS（require/module.exports） |
| ------------ | ------------------------------------ | ---------------------------------- |
| 加载方式     | 静态加载（编译时确定）               | 动态加载（运行时确定）             |
| 模块类型     | 只读引用（不能修改）                 | 拷贝值（可修改）                   |
| 执行时机     | 顶层 await，模块预解析               | 同步加载，无顶层 await             |
| Tree Shaking | 支持（静态分析）                     | 不支持（动态 require）             |
| 浏览器支持   | 原生支持`（<script type="module">）` | 需打包工具转换                     |

### Q3：== 和 === 的区别？隐式转换的核心规则？

**答：**

- **区别**：

  - `===`：严格相等，类型和值都相等才返回 true；

  - `==`：宽松相等，类型不同则先隐式转换，再比较值。

- **隐式转换核心规则**：

  1. 数字与字符串：字符串转数字（`1 == '1' → true`）；

  2. 布尔值与其他：布尔值转数字（`true == 1 → true`）；

  3. null/undefined：`null == undefined → true`，与其他值比较均为 false；

  4. 对象与基本类型：对象转基本类型（`toString/valueOf`）。

### Q4：为什么 0.1+0.2!==0.3？如何解决？

**答：**

- **原因**：JS 采用 IEEE 754 浮点数标准，0.1 和 0.2 二进制是无限循环小数，存储时精度丢失，相加后结果为 `0.30000000000000004`；

- **解决方式**：

  1. 转整数计算：`(0.1*10 + 0.2*10)/10 → 0.3`；

  2. 固定小数位数：`Number((0.1+0.2).toFixed(1)) → 0.3`；

  3. 使用 BigInt（适合整数）：`BigInt(1) + BigInt(2) → 3n`。

### Q5：call/apply/bind 的区别？底层实现原理？

**答：**

- **区别**：

| 方法  | 参数传递           | 执行时机 | 返回值               |
| ----- | ------------------ | -------- | -------------------- |
| call  | 单个参数           | 立即执行 | 函数执行结果         |
| apply | 数组参数           | 立即执行 | 函数执行结果         |
| bind  | 单个参数（柯里化） | 延迟执行 | 绑定 this 后的新函数 |

- **底层原理**：

  1. 将函数作为目标对象的临时属性；

  2. 执行该函数（this 指向目标对象）；

  3. 删除临时属性，返回执行结果；

- **call 简易实现**：

  ```JavaScript

  Function.prototype.myCall = function(context, ...args) {
    context = context || window; // 兼容null/undefined
    const fn = Symbol('fn'); // 避免属性冲突
    context[fn] = this; // 函数作为对象属性
    const result = context[fn](...args); // 执行函数
    delete context[fn]; // 删除临时属性
    return result;
  };
  ```

---

### 总结（JS 基础与原理核心关键点）

1. **核心原理**：执行上下文（变量提升/TDZ）、原型链（**proto**/prototype）、事件循环（宏任务/微任务）是大厂必问的三大底层原理；

2. **高频坑点**：类型判断（typeof/instanceof）、this 指向、闭包内存泄漏、异步执行顺序、浅拷贝/深拷贝；

3. **手写重点**：new、bind、柯里化、防抖节流、深拷贝、Promise.all 是大厂必考手写题，必须熟练；

4. **易混概念**：基本类型 vs 引用类型、宏任务 vs 微任务、ES Module vs CommonJS、原型链继承 vs class 继承。
