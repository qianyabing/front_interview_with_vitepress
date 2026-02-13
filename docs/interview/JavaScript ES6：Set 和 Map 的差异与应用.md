# JavaScript ES6：Set 和 Map 的差异与应用

你希望我总结 JavaScript 中 Set 和 Map 这两种 ES6 新增数据结构的核心用法、区别及实战场景，这是前端基础面试的高频考点，尤其是它们与数组/对象的差异、常用方法和性能优势是重点。

### 一、Set 核心用法（集合：无序、唯一值）

Set 是**值的集合**，特点是**成员唯一、无重复值**，且不区分数据类型（`5` 和 `'5'` 是不同值），键和值是同一个（可理解为「只有键没有值」的特殊 Map）。

#### 1. 基础操作（创建/增删查）

|操作|语法|示例|
|---|---|---|
|创建 Set|`new Set(iterable)`|`const s = new Set(); // 空Set`<br>`const s = new Set([1,2,2,3]); // 自动去重 → Set(3) {1,2,3}`|
|添加元素|`add(value)`|`s.add(4); // Set(4) {1,2,3,4}`（支持链式调用：`s.add(5).add(6)`）|
|删除元素|`delete(value)`|`s.delete(2); // 返回布尔值：true（删除成功）/false（无该值）`|
|判断是否存在|`has(value)`|`s.has(3); // true`|
|清空所有元素|`clear()`|`s.clear(); // Set 变为空`|
|获取元素数量|`size`（属性，非方法）|`s.size; // 新增后的值，如 4`|
#### 2. 遍历 Set（4 种方式）

Set 是可迭代对象，支持 `for...of` 和 `forEach` 遍历，遍历顺序为**插入顺序**：

```JavaScript

const s = new Set(['a', 'b', 'c']);

// 1. for...of 遍历值
for (const val of s) {
  console.log(val); // 'a' 'b' 'c'
}

// 2. forEach 遍历（value 和 key 相同）
s.forEach((value, key) => {
  console.log(value, key); // 'a' 'a'、'b' 'b'
});

// 3. 遍历 keys()（等同于 values()）
for (const key of s.keys()) {
  console.log(key); // 'a' 'b' 'c'
}

// 4. 遍历 entries()（[value, value]）
for (const [key, val] of s.entries()) {
  console.log(key, val); // 'a' 'a'、'b' 'b'
}
```

#### 3. 核心应用场景（面试高频）

|场景|示例代码|
|---|---|
|数组去重|`const arr = [1,2,2,3];`<br>`const uniqueArr = [...new Set(arr)]; // [1,2,3]`|
|字符串去重|`const str = 'aabbcc';`<br>`const uniqueStr = [...new Set(str)].join(''); // 'abc'`|
|求数组交集|`const a = [1,2,3]; const b = [2,3,4];`<br>`const intersection = [...new Set(a)].filter(x => new Set(b).has(x)); // [2,3]`|
|求数组并集|`const union = [...new Set([...a, ...b])]; // [1,2,3,4]`|
|求数组差集|`const difference = [...new Set(a)].filter(x => !new Set(b).has(x)); // [1]`|
|存储不重复的标签/ID|`const tags = new Set();`<br>`tags.add('js').add('react').add('vue'); // 避免重复添加相同标签`|
#### 4. 注意点

- Set 中 `NaN` 被视为相同值（`new Set([NaN, NaN])` → 仅一个 `NaN`）；

- Set 无法通过索引访问元素（如 `s[0]` 为 `undefined`），需遍历；

- 引用类型（对象/数组）是不同值：`new Set([{}, {}])` → 两个空对象（地址不同）。

### 二、Map 核心用法（映射：键值对、键可任意类型）

Map 是**键值对的集合**，特点是**键可以是任意类型**（对象、数组、函数等），且键值对按插入顺序保存，解决了传统对象「键只能是字符串/Symbol」的问题。

#### 1. 基础操作（创建/增删查）

|操作|语法|示例|
|---|---|---|
|创建 Map|`new Map(iterable)`|`const m = new Map(); // 空Map`<br>`const m = new Map([['name','张三'], ['age',18]]); // Map(2) {'name'=>'张三','age'=>18}`|
|添加/修改键值对|`set(key, value)`|`m.set('gender', '男'); // 新增`<br>`m.set('age', 20); // 修改已有键的值`（支持链式调用：`m.set('a',1).set('b',2)`）|
|获取值|`get(key)`|`m.get('name'); // '张三'`（无该键返回 `undefined`）|
|删除键值对|`delete(key)`|`m.delete('age'); // 返回布尔值：true/false`|
|判断键是否存在|`has(key)`|`m.has('gender'); // true`|
|清空所有键值对|`clear()`|`m.clear(); // Map 变为空`|
|获取键值对数量|`size`（属性）|`m.size; // 新增后的值，如 3`|
#### 2. 遍历 Map（5 种方式）

Map 同样按插入顺序遍历，支持更多维度的遍历：

```JavaScript

const m = new Map([['name','张三'], ['age',18]]);

// 1. for...of 遍历键值对
for (const [key, val] of m) {
  console.log(key, val); // 'name' '张三'、'age' 18
}

// 2. forEach 遍历（val 在前，key 在后）
m.forEach((val, key) => {
  console.log(val, key); // '张三' 'name'、18 'age'
});

// 3. 遍历键（keys()）
for (const key of m.keys()) {
  console.log(key); // 'name' 'age'
}

// 4. 遍历值（values()）
for (const val of m.values()) {
  console.log(val); // '张三' 18
}

// 5. 遍历条目（entries()，等同于直接遍历 Map）
for (const entry of m.entries()) {
  console.log(entry); // ['name','张三']、['age',18]
}
```

#### 3. 核心应用场景（面试高频）

|场景|示例代码|
|---|---|
|以对象/数组为键存储数据|`const objKey = { id: 1 };`<br>`const m = new Map();`<br>`m.set(objKey, '用户1');`<br>`m.get(objKey); // '用户1'`（传统对象无法用对象做键）|
|存储需要保持顺序的键值对|`const m = new Map();`<br>`m.set('b', 2).set('a', 1).set('c', 3);`<br>`[...m.keys()]; // ['b','a','c']（保持插入顺序）`（对象键无序）|
|缓存数据（避免重复计算）|`const cache = new Map();`<br>`function getCache(key) {`<br> `  if (cache.has(key)) return cache.get(key);`<br> `  const res = 计算逻辑;`<br> `  cache.set(key, res);`<br> `  return res;`<br>`}`|
|替代对象存储多类型键|`// 对比：对象只能用字符串/Symbol做键`<br>`const obj = { [{}]: 'test' }; // 键变为 '[object Object]'`<br>`const m = new Map();`<br>`m.set({}, 'test'); // 键是原对象，无转换`|
#### 4. 注意点

- Map 的键是「引用相等」：`m.set({}, 1)` 和 `m.set({}, 2)` 是两个不同键（地址不同）；

- Map 可与数组互转：`const arr = [...m]` / `new Map(arr)`；

- Map 没有像对象一样的 `__proto__` 问题，不会有原型链污染风险。

### 三、Set/Map 与数组/对象的核心区别

|数据结构|核心特点|优势|劣势|适用场景|
|---|---|---|---|---|
|Set|无序、唯一值，无索引|自动去重、判断存在性能高（O(1)）|无法通过索引访问|去重、交集/并集/差集、存储不重复值|
|Map|键任意类型、有序键值对|键类型灵活、遍历有序、增删查性能高（O(1)）|无法直接序列化（需手动转数组）|非字符串键的键值对、有序缓存、复杂映射关系|
|数组|有序、可重复，索引访问|索引访问快、内置方法多（map/filter 等）|去重/判断存在性能低（O(n)）|有序列表、需要频繁遍历/过滤/映射|
|对象|键仅字符串/Symbol、无序|语法简洁、易序列化|键类型受限、遍历无序、判断存在需手动处理|简单键值对（字符串键）、配置项、数据序列化|
### 四、Set/Map 性能对比

- **判断元素是否存在**：Set.has() / Map.has() → O(1)（哈希表实现），远快于数组.indexOf()/includes() → O(n)；

- **增删元素**：Set/Map 的增删操作 O(1)，数组的 splice 等操作 O(n)；

- **遍历速度**：Set/Map 遍历速度略快于数组（无索引转换），远快于对象。

### 总结

1. **Set 核心**：

    - 本质是「无重复值的集合」，核心用于**去重、判断元素是否存在、集合运算（交集/并集）**；

    - 常用方法：`add/delete/has/clear`，遍历用 `for...of`/`forEach`。

2. **Map 核心**：

    - 本质是「灵活键值对」，解决了对象「键只能是字符串」的问题，核心用于**非字符串键的映射、有序缓存、复杂键值关系**；

    - 常用方法：`set/get/delete/has/clear`，遍历可按键/值/键值对拆分。

3. **面试高频考点**：

    - Set 实现数组去重的方法；

    - Map 与普通对象的区别（键类型、顺序、性能）；

    - Set/Map 的遍历方式和性能优势；

    - 为何 Map 的增删查比对象/数组高效（哈希表底层）。
> （注：文档部分内容可能由 AI 生成）