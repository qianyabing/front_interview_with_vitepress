# JavaScript 对象在前端面试中的关键要点总结

你希望我继续总结前端面试中 JavaScript 对象（Object）的常用属性和方法，这是 JS 核心语法的重点，也是面试中考察数据类型、原型链等知识点的核心载体。

### 一、对象核心特性（面试先明确）

JS 中的对象是**键值对集合**（键为字符串/Symbol，值为任意类型），且所有对象都继承自 `Object.prototype`，以下方法均基于此核心特性展开。

### 二、对象常用属性/方法（分「对象自身」和「Object 静态方法」两类）

#### 1. 对象自身属性（实例属性/方法）

|类型/方法|说明|示例|
|---|---|---|
|`__proto__`|指向原型对象（非标准，面试常问）|`const obj = {a:1}; console.log(obj.__proto__ === Object.prototype); // true`|
|`constructor`|返回创建对象的构造函数|`obj.constructor === Object; // true`|
|`hasOwnProperty(key)`|判断属性是否为自身属性（非继承）|`const obj = {a:1}; obj.hasOwnProperty('a'); // true` <br> `obj.hasOwnProperty('toString'); // false（继承的）`|
|`toString()`|转为字符串（默认返回 "[object Object]"）|`obj.toString(); // "[object Object]"` <br> `// 自定义：` <br> `obj.toString = () => '{"a":1}'; obj.toString(); // '{"a":1}'`|
|`valueOf()`|返回对象原始值（默认返回自身）|`obj.valueOf() === obj; // true`|
#### 2. Object 静态方法（面试高频，直接通过 Object 调用）

##### （1）创建/复制对象

|方法|说明|示例|
|---|---|---|
|`Object.create(prototype, props)`|基于原型创建新对象|`// 以obj为原型创建新对象` <br> `const newObj = Object.create(obj); newObj.__proto__ === obj; // true`|
|`Object.assign(target, ...sources)`|浅拷贝合并对象（面试必考）|`const target = {a:1}; const source = {b:2};` <br> `Object.assign(target, source); // target = {a:1, b:2}`|
|`Object.freeze(obj)`|冻结对象（不可增删改属性）|`const frozen = Object.freeze({a:1}); frozen.a = 2; // 无效果（严格模式报错）`|
|`Object.seal(obj)`|密封对象（不可增删属性，可修改现有属性）|`const sealed = Object.seal({a:1}); sealed.a = 2; // 生效` <br> `delete sealed.a; // 无效`|
##### （2）获取对象属性/键值

|方法|说明|示例|
|---|---|---|
|`Object.keys(obj)`|获取自身可枚举属性名（数组）|`const obj = {a:1, b:2}; Object.keys(obj); // ['a','b']`|
|`Object.values(obj)`|获取自身可枚举属性值（数组）|`Object.values(obj); // [1,2]`|
|`Object.entries(obj)`|获取自身可枚举键值对（二维数组）|`Object.entries(obj); // [['a',1], ['b',2]]`|
|`Object.getOwnPropertyNames(obj)`|获取自身所有属性名（含不可枚举）|`const obj = {}; Object.defineProperty(obj, 'a', {value:1, enumerable:false});` <br> `Object.keys(obj); // []` <br> `Object.getOwnPropertyNames(obj); // ['a']`|
|`Object.getOwnPropertyDescriptor(obj, key)`|获取属性的描述符（面试常考）|`const desc = Object.getOwnPropertyDescriptor(obj, 'a');` <br> `// desc = {value:1, writable:false, enumerable:false, configurable:false}`|
##### （3）属性操作/判断

|方法|说明|示例|
|---|---|---|
|`Object.defineProperty(obj, key, desc)`|精准定义属性（面试高频）|`// 定义只读属性` <br> `Object.defineProperty(obj, 'b', {` <br> `  value: 2,` <br> `  writable: false, // 不可修改` <br> `  enumerable: true` <br> `});` <br> `obj.b = 3; // 无效果`|
|`Object.defineProperties(obj, props)`|批量定义属性|`Object.defineProperties(obj, {` <br> `  c: {value:3, writable:true},` <br> `  d: {value:4, enumerable:false}` <br> `});`|
|`Object.hasOwn(obj, key)`|ES2022 替代 hasOwnProperty，判断自身属性|`Object.hasOwn(obj, 'a'); // true`|
|`Object.is(value1, value2)`|严格判断两个值是否相等（比 === 更严谨）|`Object.is(NaN, NaN); // true（=== 返回 false）` <br> `Object.is(+0, -0); // false（=== 返回 true）`|
#### 3. 遍历对象的常用方式（面试常问）

|方式|说明|示例|
|---|---|---|
|`for...in`|遍历自身+继承的可枚举属性（需配合 hasOwnProperty 过滤）|`for (let key in obj) {` <br> `  if (obj.hasOwnProperty(key)) {` <br> `    console.log(key, obj[key]); // 仅打印自身属性` <br> `  }` <br> `}`|
|`Object.keys() + forEach`|仅遍历自身可枚举属性（推荐）|`Object.keys(obj).forEach(key => {` <br> `  console.log(key, obj[key]);` <br> `});`|
### 总结

1. **核心考点**：`Object.assign`（浅拷贝）、`Object.keys/values/entries`（属性遍历）、`Object.defineProperty`（属性定义）、`hasOwnProperty`（自身属性判断）是面试高频，需熟练掌握。

2. **关键特性**：JS 对象属性有「描述符」（writable/enumerable/configurable），`freeze/seal` 基于此控制对象可操作性；字符串作为对象键名，Symbol 可实现唯一键。

3. **易混点**：`for...in` 会遍历继承属性，需配合 `hasOwnProperty` 过滤；`Object.assign` 是浅拷贝，嵌套对象仅复制引用；`Object.is` 与 `===` 的差异（处理 NaN/±0）。
> （注：文档部分内容可能由 AI 生成）