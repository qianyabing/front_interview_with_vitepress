# JavaScript 数组属性与方法：面试高频考点解析

你希望我总结前端面试中高频出现的 JavaScript 数组属性和方法，并配合简洁示例解释，这是面试中考察 JS 基础的核心考点之一。

### 一、数组核心属性

|属性|说明|示例|
|---|---|---|
|`length`|获取/设置数组长度（最常用）|`const arr = [1,2,3]; console.log(arr.length); // 3` <br> `arr.length = 2; console.log(arr); // [1,2]`|
|`constructor`|返回创建数组的构造函数（了解即可）|`console.log(arr.constructor === Array); // true`|
### 二、数组常用方法（面试高频）

#### 1. 增删改类（会改变原数组）

|方法|说明|示例|
|---|---|---|
|`push()`|末尾添加元素，返回新长度|`const arr = [1]; const len = arr.push(2); // len=2, arr=[1,2]`|
|`pop()`|末尾删除元素，返回删除值|`const val = arr.pop(); // val=2, arr=[1]`|
|`unshift()`|开头添加元素，返回新长度|`const len = arr.unshift(0); // len=2, arr=[0,1]`|
|`shift()`|开头删除元素，返回删除值|`const val = arr.shift(); // val=0, arr=[1]`|
|`splice(start, delNum, ...add)`|增/删/改，返回删除的元素数组|`const arr = [1,2,3];`<br>`// 删除：从索引1删1个` <br> `arr.splice(1,1); // 返回[2], arr=[1,3]`<br>`// 添加：从索引1删0个，加2、4` <br> `arr.splice(1,0,2,4); // 返回[], arr=[1,2,4,3]`|
#### 2. 遍历/迭代类（不改变原数组）

|方法|说明|示例|
|---|---|---|
|`forEach()`|遍历数组，无返回值|`[1,2,3].forEach((item, idx) => {`<br> `  console.log(item, idx); // 1 0 / 2 1 / 3 2` <br> `});`|
|`map()`|遍历数组，返回新数组（面试必考）|`const newArr = [1,2,3].map(item => item*2); // [2,4,6]`|
|`filter()`|过滤元素，返回符合条件的新数组|`const newArr = [1,2,3].filter(item => item>1); // [2,3]`|
|`reduce()`|累加/归并，返回最终值（重点）|`// 求和：prev初始为0，依次累加item` <br> `const sum = [1,2,3].reduce((prev, item) => prev+item, 0); // 6`|
#### 3. 查找/判断类（不改变原数组）

|方法|说明|示例|
|---|---|---|
|`indexOf()`|查找元素索引，找不到返回-1|`[1,2,3].indexOf(2); // 1` <br> `[1,2,3].indexOf(4); // -1`|
|`includes()`|判断是否包含元素，返回布尔值|`[1,2,3].includes(2); // true`|
|`find()`|找第一个符合条件的元素，无则undefined|`[1,2,3].find(item => item>1); // 2`|
|`findIndex()`|找第一个符合条件的索引，无则-1|`[1,2,3].findIndex(item => item>1); // 1`|
|`every()`|所有元素满足条件，返回布尔值|`[1,2,3].every(item => item>0); // true`|
|`some()`|至少一个元素满足条件，返回布尔值|`[1,2,3].some(item => item>2); // true`|
#### 4. 转换/拼接类（不改变原数组）

|方法|说明|示例|
|---|---|---|
|`join()`|数组转字符串，指定分隔符|`[1,2,3].join('-'); // "1-2-3"`|
|`concat()`|拼接数组，返回新数组|`[1,2].concat([3,4]); // [1,2,3,4]`|
|`slice(start, end)`|截取数组（含start，不含end），返回新数组|`[1,2,3,4].slice(1,3); // [2,3]`|
|`reverse()`|反转数组（改变原数组）|`const arr = [1,2,3]; arr.reverse(); // arr=[3,2,1]`|
|`sort()`|排序（改变原数组，默认字符序）|`// 数字升序` <br> `[3,1,2].sort((a,b) => a-b); // [1,2,3]` <br> `// 数字降序` <br> `[3,1,2].sort((a,b) => b-a); // [3,2,1]`|
#### 5. 较常用方法（面试次高频）

|方法|说明|示例|
|---|---|---|
|`flat(depth)`|数组扁平化，depth为层级（默认1）|`[1,[2,[3]]].flat(2); // [1,2,3]`|
|`flatMap()`|map+flat(1)，返回新数组|`[1,2].flatMap(item => [item, item*2]); // [1,2,2,4]`|
|`fill(val, start, end)`|填充数组（改变原数组）|`[1,2,3].fill(0,1,2); // [1,0,3]`|
|`entries()`|返回键值对迭代器|`for (let [idx, item] of [1,2].entries()) {`<br> `  console.log(idx, item); // 0 1 / 1 2` <br> `}`|
### 总结

1. **核心区分**：面试常考「是否改变原数组」—— 增删改类（push/pop/splice/reverse/sort）会改，遍历/查找/拼接类（map/filter/reduce/slice）不改。

2. **高频重点**：`map`/`filter`/`reduce`（迭代三剑客）、`splice`（增删改核心）、`sort`（排序需手写比较函数）是面试必问，需熟练掌握。

3. **易混点**：`slice`（截取，不改原数组）vs `splice`（增删改，改原数组）；`every`（全满足）vs `some`（至少一个满足）。
> （注：文档部分内容可能由 AI 生成）