# JavaScript 中高效的数组构造方法解析

你想知道JavaScript中有没有能一次性构造出大量有规律元素的数组方法，对吧？当然有！最常用且高效的是 `Array.from()` 和 `Array.fill()`，配合简单的逻辑就能快速生成有规律的数组（比如等差数列、重复值、按规则计算的值等），比手动循环push要简洁得多。

### 一、核心方法：Array.from()（最灵活，支持自定义规律）

`Array.from()` 可以从“类数组/可迭代对象”创建新数组，还能通过第二个参数（映射函数）给每个元素设置规律值，是生成有规律数组的首选。

#### 语法

```JavaScript

Array.from(arrayLike, mapFn, thisArg);
```

- `arrayLike`：决定数组长度（比如 `{length: 10}` 表示生成长度为10的数组）；

- `mapFn`（可选）：映射函数，定义每个元素的规律（参数是 `当前索引、当前索引`）；

#### 常用示例

1. **生成0~9的数组（索引直接作为值）**

```JavaScript

const arr = Array.from({length: 10}, (_, index) => index);
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

1. **生成等差数列（比如1,3,5,7...，步长2）**

```JavaScript

// 长度10，起始值1，步长2
const oddNumbers = Array.from({length: 10}, (_, i) => 1 + i * 2);
console.log(oddNumbers); // [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
```

1. **生成重复但带索引的字符串（比如item1, item2...）**

```JavaScript

const items = Array.from({length: 5}, (_, i) => `item${i+1}`);
console.log(items); // ["item1", "item2", "item3", "item4", "item5"]
```

1. **生成随机数数组（限定范围）**

```JavaScript

// 生成10个1~100的随机整数
const randomNums = Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
console.log(randomNums); // 比如 [23, 56, 89, 12, 45, 78, 9, 34, 67, 8]
```

### 二、补充方法：Array.fill()（适合生成重复值/分段规律）

`fill()` 会用指定值填充数组的所有/部分元素，适合生成“固定值重复”的数组，或结合长度先创建空数组再填充规律值（但灵活性不如 `Array.from()`）。

#### 语法

```JavaScript

arr.fill(value, start, end);
```

- `value`：要填充的值；

- `start/end`（可选）：填充的起始/结束索引（左闭右开）。

#### 常用示例

1. **生成全为同一值的数组**

```JavaScript

// 生成长度为5，所有元素都是0的数组
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// 生成长度为8，所有元素都是"默认值"的数组
const defaults = new Array(8).fill("默认值");
console.log(defaults); // ["默认值", "默认值", ..., "默认值"]
```

1. **分段填充（部分元素有规律）**

```JavaScript

// 先创建长度10的数组，前5个填1，后5个填2
const arr = new Array(10).fill(1, 0, 5).fill(2, 5, 10);
console.log(arr); // [1,1,1,1,1,2,2,2,2,2]
```

⚠️ 注意：`fill()` 填充引用类型（比如对象/数组）时，所有元素会指向同一个引用，修改一个会影响全部：

```JavaScript

// 坑点：所有元素都是同一个空对象
const badArr = new Array(3).fill({});
badArr[0].name = "张三";
console.log(badArr); // [{name: "张三"}, {name: "张三"}, {name: "张三"}]

// 解决：用Array.from生成（每个元素都是新对象）
const goodArr = Array.from({length: 3}, () => ({}));
goodArr[0].name = "张三";
console.log(goodArr); // [{name: "张三"}, {}, {}]
```

### 三、进阶：结合两种方法生成复杂规律

比如生成“每行5个元素，共3行”的二维数组（矩阵）：

```JavaScript

// 3行5列，每个元素值为 行号*列号（行/列从1开始）
const matrix = Array.from({length: 3}, (_, row) => {
  return Array.from({length: 5}, (_, col) => (row+1) * (col+1));
});
console.log(matrix);
// [
//   [1, 2, 3, 4, 5],
//   [2, 4, 6, 8, 10],
//   [3, 6, 9, 12, 15]
// ]
```

### 四、方法对比（怎么选？）

|方法|适用场景|优点|缺点|
|---|---|---|---|
|`Array.from()`|自定义规律（等差数列、带索引值等）|灵活，支持映射函数|语法稍复杂（需写映射函数）|
|`Array.fill()`|固定值重复、分段填充|语法简单，代码短|不支持动态规律，引用类型有坑|
### 总结

1. **生成自定义规律的数组**（比如等差数列、带索引的字符串、随机数）→ 优先用 `Array.from({length: N}, (_, i) => 规律逻辑)`；

2. **生成全为固定值的数组**（比如全0、全1）→ 用 `new Array(N).fill(值)`；

3. **避免用fill填充引用类型**（对象/数组），改用Array.from保证每个元素是独立实例；

4. 两种方法都能一次性生成任意长度的有规律数组，比手动循环push更简洁、高效。
> （注：文档部分内容可能由 AI 生成）