# 华为 JS 机试必记核心模板

你想知道在华为JS机试中必须熟练记忆、能直接套用的核心模板，这些模板是覆盖考试80%场景的“基础框架”，记住后能大幅节省解题时间，避免因基础框架出错导致丢分。以下是按「考试优先级」排序的必记模板，每个模板都标注了适用场景和记忆要点：

---

## 一、输入输出模板（必考，100%要用）

华为机试的输入输出是前端开发者最易踩坑的点，必须熟记不同输入场景的模板，能直接默写。

### 1. 单行输入（最常用）

**适用场景**：题目仅输入一行数据（如“1 2 3 4”“abc def”）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (inputStr) => {
  // 核心：根据题目转换输入格式（按需修改）
  const inputArr = inputStr.trim().split(' '); // 按空格分割
  const numArr = inputArr.map(Number); // 转数字数组

  // 核心解题逻辑（调用自定义函数）
  const result = solve(numArr);

  // 输出结果（必须console.log，不能改）
  console.log(result);

  // 关闭输入流（避免程序挂起）
  rl.close();
});

// 自定义解题函数（根据题目替换）
function solve(arr) {
  return arr.reduce((a, b) => a + b, 0); // 示例：求和
}
```

**记忆要点**：`trim()` 去首尾空格（避免空字符串）、`rl.close()` 必须加、输出只能用`console.log`。

### 2. 多行输入（高频）

**适用场景**：先输入行数n，再输入n行数据（如“3”→“1 2”→“3 4”→“5 6”）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lineCount = 0; // 记录已读取的行数
let totalLine = 0; // 总行数（第一行输入）
const data = []; // 存储所有输入数据

rl.on('line', (inputStr) => {
  const input = inputStr.trim();
  if (lineCount === 0) {
    // 第一行是总行数
    totalLine = parseInt(input);
    lineCount++;
  } else {
    // 后续行是业务数据
    data.push(input.split(' ').map(Number));
    lineCount++;

    // 读取完所有行后执行逻辑
    if (lineCount > totalLine) {
      const result = solve(data);
      console.log(result);
      rl.close();
    }
  }
});

function solve(data) {
  // 示例：计算所有数字的和
  return data.flat().reduce((a, b) => a + b, 0);
}
```

**记忆要点**：用两个计数器（`lineCount`/`totalLine`）控制读取逻辑、`flat()` 扁平化二维数组（按需用）。

### 3. 多组输入（次高频）

**适用场景**：输入多组数据，直到输入空行/特定字符结束（如输入“0”终止）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (inputStr) => {
  const input = inputStr.trim();
  // 终止条件（按题目要求改，如输入0结束）
  if (input === '0' || input === '') {
    rl.close();
    return;
  }

  // 处理单组数据
  const result = solve(input.split(' ').map(Number));
  console.log(result);
});

function solve(arr) {
  return arr.sort((a, b) => a - b); // 示例：排序
}
```

**记忆要点**：先判断终止条件，再处理数据，避免死循环。

---

## 二、高频算法模板（覆盖70%算法题）

这些模板是华为机试JS方向的“解题骨架”，熟记后能快速应对数组、字符串、查找、排序类题目。

### 1. 快速排序（排序类题目首选）

**适用场景**：数组排序（机试排序题80%可用，时间复杂度最优）

```JavaScript

function quickSort(arr) {
  // 递归终止条件（核心，不能漏）
  if (arr.length <= 1) return arr;
  
  // 选基准值（中间值更稳定）
  const pivot = arr[Math.floor(arr.length / 2)];
  
  // 分治
  const left = arr.filter(item => item < pivot);
  const middle = arr.filter(item => item === pivot);
  const right = arr.filter(item => item > pivot);
  
  // 递归合并
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

**记忆要点**：终止条件`arr.length <= 1`、分治三步（左/中/右）、解构合并数组。

### 2. 二分查找（有序数组查找）

**适用场景**：有序数组找目标值/边界值（必考）

```JavaScript

function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  // 循环条件（核心：low <= high，不是low < high）
  while (low <= high) {
    // 计算中间值（避免溢出，等价于(low+high)/2）
    const mid = Math.floor(low + (high - low) / 2);
    
    if (arr[mid] === target) {
      return mid; // 找到目标值，返回索引
    } else if (arr[mid] < target) {
      low = mid + 1; // 目标值在右侧，缩小左边界
    } else {
      high = mid - 1; // 目标值在左侧，缩小右边界
    }
  }
  
  return -1; // 未找到
}
```

**记忆要点**：循环条件`low <= high`、mid计算方式、边界更新要+1/-1（避免死循环）。

### 3. 哈希表（两数之和/字符统计）

**适用场景**：快速查找、统计频次、降低时间复杂度（从O(n²)→O(n)）

```JavaScript

// 示例1：两数之和（找数组中两个数之和等于target的索引）
function twoSum(nums, target) {
  const map = new Map(); // 用Map比Object更安全（key不自动转类型）
  
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    // 查哈希表，存在则返回结果
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    // 不存在则存入哈希表（值→索引）
    map.set(nums[i], i);
  }
  
  return []; // 无结果
}

// 示例2：字符统计（统计字符串中每个字符的出现次数）
function countChar(str) {
  const map = new Map();
  for (const char of str) {
    map.set(char, (map.get(char) || 0) + 1);
  }
  return map;
}
```

**记忆要点**：`Map`的`has()`/`get()`/`set()`方法、统计时`(map.get(key) || 0) + 1`的写法。

### 4. 栈（括号匹配/字符串反转）

**适用场景**：括号匹配、逆序处理、单调栈（高频）

```JavaScript

// 示例：括号匹配（判断字符串中的括号是否合法）
function isValidBracket(str) {
  const stack = [];
  const bracketMap = new Map([
    [')', '('],
    ['}', '{'],
    [']', '[']
  ]);

  for (const char of str) {
    // 是右括号，判断是否匹配
    if (bracketMap.has(char)) {
      // 栈空或栈顶不匹配，直接返回false
      if (stack.length === 0 || stack.pop() !== bracketMap.get(char)) {
        return false;
      }
    } else {
      // 是左括号，入栈
      stack.push(char);
    }
  }

  // 栈空才是完全匹配（避免剩余左括号）
  return stack.length === 0;
}
```

**记忆要点**：左括号入栈、右括号出栈匹配、最终栈必须为空。

---

## 三、通用工具模板（避坑专用）

这些模板能解决机试中常见的“边界问题”，避免因小细节丢分。

### 1. 数组去重（高频辅助）

```JavaScript

// 方法1：Set（简洁，推荐）
function uniqueArr(arr) {
  return [...new Set(arr)];
}

// 方法2：Map（保留首次出现的顺序，兼容复杂场景）
function uniqueArr2(arr) {
  const map = new Map();
  return arr.filter(item => !map.has(item) && map.set(item, 1));
}
```

### 2. 深拷贝（处理复杂数据）

```JavaScript

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  // 处理数组
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  // 处理对象
  const newObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key]);
    }
  }
  return newObj;
}
```

### 3. 边界值判断（避坑核心）

```JavaScript

// 判断是否为有效数字（排除NaN/Infinity）
function isNumber(num) {
  return typeof num === 'number' && !isNaN(num) && isFinite(num);
}

// 判断数组是否为空/无效
function isEmptyArr(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}
```

---

### 总结

1. **基础优先级**：输入输出模板（单行/多行）是底线，必须能默写且无语法错误；

2. **算法核心**：快速排序、二分查找、哈希表（两数之和）是高频骨架，记住逻辑+关键边界；

3. **避坑关键**：通用工具模板（去重、深拷贝、边界判断）能解决80%的细节错误，减少测试用例失败。

建议你把这些模板手写一遍（不用复制），然后结合牛客网华为真题套入模板练习，2-3天就能熟练套用，大幅提升解题效率。
> （注：文档部分内容可能由 AI 生成）