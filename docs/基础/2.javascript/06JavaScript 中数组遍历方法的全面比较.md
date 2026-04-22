# JavaScript 中数组遍历方法的全面比较

### 先明确核心定义（基础认知）

|方法|遍历核心|适用数据类型|是否可中断（break/return）|返回值|
|---|---|---|---|---|
|普通 `for`|索引/自定义条件|数组、类数组（如 arguments）|✅ 可以（break/continue）|无（手动定义变量接收）|
|`for in`|枚举对象的**键名**|任意对象（数组/普通对象）|✅ 可以（break/continue）|无|
|`for of`|迭代对象的**值**|可迭代对象（数组/字符串/Map等）|✅ 可以（break/continue）|无|
|`forEach`|数组元素的回调遍历|仅数组|❌ 无法中断（return无效）|无（始终返回 undefined）|
|`map`|数组元素的映射转换|仅数组|❌ 无法中断（return无效）|✅ 新数组（原数组元素处理后）|
### 逐一拆解（异同+场景）

#### 1. 普通 `for` 循环（最基础）

```JavaScript

const arr = [1, 2, 3];
// 经典索引遍历
for (let i = 0; i < arr.length; i++) {
  if (arr[i] === 2) break; // 可中断
  console.log(arr[i]); // 输出 1
}
```

- **特点**：

    - 手动控制索引（`i`）、循环条件（`i < arr.length`）、步长（`i++`），灵活性最高；

    - 可遍历数组/类数组，也可通过 `for (let i = arr.length-1; i >=0; i--)` 反向遍历；

    - 性能最优（无额外函数调用开销），适合需要精细控制遍历过程的场景。

- **缺点**：代码冗余（要写索引、条件、步长），遍历对象时需手动处理。

#### 2. `for in`（枚举对象键名）

```JavaScript

const obj = { a: 1, b: 2 };
const arr = [1, 2, 3];

// 遍历普通对象（键名）
for (const key in obj) {
  console.log(key); // 输出 a、b
  console.log(obj[key]); // 输出 1、2
}

// 遍历数组（索引，字符串类型！）
for (const index in arr) {
  console.log(typeof index); // string（注意：索引是字符串）
  console.log(arr[index]); // 输出 1、2、3
}
```

- **特点**：

    - 遍历的是**键名**（对象：属性名；数组：索引字符串）；

    - 会遍历对象的**原型链属性**（比如给 `Array.prototype` 加的自定义方法也会被遍历），需配合 `obj.hasOwnProperty(key)` 过滤；

    - 适合遍历**普通对象的属性**，不适合遍历数组（索引是字符串，且可能遍历到非数字索引）。

- **坑点**：

    ```JavaScript
    
    // 原型链污染示例
    Array.prototype.foo = 'bar';
    const arr = [1,2];
    for (const i in arr) {
      console.log(i); // 输出 0、1、foo（意外遍历到原型属性）
    }
    ```

#### 3. `for of`（迭代可迭代对象的值）

```JavaScript

const arr = [1, 2, 3];
const str = 'abc';
const map = new Map([['a', 1], ['b', 2]]);

// 遍历数组值
for (const value of arr) {
  if (value === 2) break; // 可中断
  console.log(value); // 输出 1
}

// 遍历字符串
for (const char of str) {
  console.log(char); // a、b、c
}

// 遍历Map（键值对）
for (const [key, value] of map) {
  console.log(key, value); // a 1、b 2
}
```

- **特点**：

    - 遍历的是**值**，且支持所有**可迭代对象**（数组、字符串、Map、Set、Generator 等）；

    - 不会遍历原型链，也不会拿到数组的非数字索引；

    - 可通过 `entries()` 同时获取索引和值：

        ```JavaScript
        
        for (const [index, value] of arr.entries()) {
          console.log(index, value); // 0 1、1 2、2 3
        }
        ```

- **适用场景**：需要中断的遍历、遍历非数组的可迭代对象（如 Map/Set）。

#### 4. `forEach`（数组回调遍历）

```JavaScript

const arr = [1, 2, 3];
arr.forEach((value, index, array) => {
  if (value === 2) return; // 仅跳过当前次循环，无法中断整体
  console.log(value); // 输出 1、3
});
console.log(arr.forEach(() => {})); // undefined（无返回值）
```

- **特点**：

    - 专为数组设计，回调参数包含 `值、索引、原数组`，语义清晰；

    - 无法中断（`break` 报错，`return` 仅跳过当前迭代）；

    - 异步陷阱：回调中如果有异步操作（如 `setTimeout`），无法保证遍历顺序和执行完成时机；

        ```JavaScript
        
        // 异步陷阱示例
        arr.forEach(async (value) => {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log(value); // 执行顺序不确定，且无法等待所有异步完成
        });
        ```

- **适用场景**：简单的数组遍历，不需要中断、不需要返回值的场景。

#### 5. `map`（数组映射转换）

```JavaScript

const arr = [1, 2, 3];
const newArr = arr.map((value) => {
  return value * 2; // 必须return，否则返回undefined
});
console.log(newArr); // [2, 4, 6]（新数组）
console.log(arr); // [1,2,3]（原数组不变）
```

- **特点**：

    - 核心是“映射转换”，遍历数组的同时返回**新数组**（原数组不变）；

    - 回调必须有返回值（否则新数组元素为 `undefined`）；

    - 无法中断，且**不适合无返回值的遍历**（比如单纯打印，用 `map` 是浪费性能）；

- **适用场景**：数组元素的格式转换、数据加工（如接口返回数据处理）。

### 核心异同总结

#### 相同点

1. 都能实现“遍历数据”的核心目的；

2. 除 `for in` 外，其余方法遍历数组时默认按顺序执行（`for in` 可能因索引字符串排序问题乱序）；

3. 遍历过程中修改原数组（如 `arr[i] = 10`），除 `map`（返回新数组）外，其余方法都能感知到修改。

#### 不同点

|维度|关键差异点|
|---|---|
|适用范围|`for in` 适配所有对象，`for of` 适配可迭代对象，`forEach/map` 仅适配数组，普通 `for` 适配数组/类数组|
|中断能力|普通 `for`/`for in`/`for of` 可中断（break/continue），`forEach/map` 不可中断|
|返回值|`map` 返回新数组，其余仅 `for` 可手动接收值，其余无返回值|
|性能|普通 `for` 性能最优（无回调开销），`forEach/map` 因函数调用有轻微性能损耗|
|语义化|`map` 强调“转换”，`forEach` 强调“遍历执行操作”，`for of` 强调“迭代值”，`for in` 强调“枚举键名”|
### 实战选择建议（避坑指南）

1. **遍历数组且需要中断/反向遍历/精细控制索引** → 普通 `for` 循环；

2. **遍历普通对象的属性（非数组）** → `for in` + `hasOwnProperty` 过滤原型链；

3. **遍历数组/字符串/Map/Set 且需要中断，或需要同时拿索引+值** → `for of`（配合 `entries()`）；

4. **简单遍历数组，不需要中断，语义化优先** → `forEach`；

5. **数组元素转换，需要返回新数组** → `map`（切忌用 `map` 做无返回值的遍历）；

6. **异步遍历（如遍历数组发请求）** → 不要用 `forEach`（无法 await），用 `for of` + `async/await`：

    ```JavaScript
    
    // 正确的异步遍历
    async function asyncTraverse() {
      const arr = [1,2,3];
      for (const value of arr) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log(value); // 按顺序输出 1、2、3
      }
    }
    ```

### 总结

1. **普通 ** **`for`**：灵活性最高、性能最好，适合需要精细控制的数组遍历；

2. **for in**：仅适合遍历普通对象属性，遍历数组必踩坑；

3. **for of**：现代遍历方式，适配多类型可迭代对象，支持中断，异步遍历首选；

4. **forEach**：数组遍历语义化，无返回值、不可中断，适合简单操作；

5. **map**：专为数组转换设计，返回新数组，不可中断，切忌滥用做普通遍历。

核心原则：**按“语义+需求”选择**，比如需要“转换数组”就用 `map`，需要“中断遍历”就不用 `forEach`，需要“遍历对象属性”就不用 `for of`。
> （注：文档部分内容可能由 AI 生成）