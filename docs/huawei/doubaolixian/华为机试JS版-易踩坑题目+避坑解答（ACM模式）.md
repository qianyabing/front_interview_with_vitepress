# 华为机试JS版-易踩坑题目+避坑解答（ACM模式）

以下题目均为前端选手在华为机试中**高频踩坑题型**，覆盖输入处理、边界条件、性能优化等核心痛点，每道题都标注了**坑点分析**和**避坑技巧**，代码可直接运行。

## 一、 输入处理类坑题（机试第一关）

### 1. 多组输入（未处理终止条件）

#### 题目描述

输入有多组测试用例，每组输入两个整数 `a` 和 `b`，输出 `a + b` 的和。**当输入为 ** **`0 0`** ** 时，终止程序**。

#### 输入输出示例

```Plain Text

输入：
1 2
3 4
0 0
输出：
3
7
```

#### 坑点分析

- 前端选手容易忽略**多组输入的终止条件**，导致程序无限循环；

- 误用 `rl.question()` 处理多组输入，无法批量读取数据。

#### JS避坑解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 关键：监听line事件，逐行处理多组输入
rl.on('line', (line) => {
  const [a, b] = line.trim().split(' ').map(Number);
  // 终止条件：必须先判断，再处理逻辑
  if (a === 0 && b === 0) {
    rl.close(); // 关闭接口，终止程序
    return;
  }
  console.log(a + b);
});
```

#### 避坑技巧

- 多组输入优先用 `rl.on('line')`，而非 `rl.question()`；

- 终止条件要写在最前面，避免无效计算；

- 输入分割后必须用 `map(Number)` 转换，否则会出现字符串拼接（如 `'1'+'2'='12'`）。

### 2. 空格分隔的不定长输入

#### 题目描述

输入一行包含**不定数量整数**的数组，输出数组的最大值。

#### 输入输出示例

```Plain Text

输入：1 3 5 2 4 6
输出：6
```

#### 坑点分析

- 前端选手容易固定数组长度（如 `split(' ').slice(0, n)`），导致漏读数据；

- 忽略输入中的**多余空格**（如 `1  3  5` 两个空格），`split(' ')` 会产生空字符串。

#### JS避坑解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (line) => {
  // 关键：用 split(/\s+/) 匹配任意数量空格，过滤空字符串
  const nums = line.trim()
    .split(/\s+/) // 替代 split(' ')，处理多个空格
    .filter(item => item) // 过滤空字符串
    .map(Number);
  // 边界条件：空数组
  if (nums.length === 0) {
    console.log(0);
    rl.close();
    return;
  }
  const max = Math.max(...nums);
  console.log(max);
  rl.close();
});
```

#### 避坑技巧

- 不定长输入用 `split(/\s+/)` 替代 `split(' ')`，匹配任意空格；

- 必须加 `filter(item => item)` 过滤空字符串，避免 `Number('') = 0` 干扰结果；

- 处理前判断数组是否为空，避免 `Math.max(...[])` 报错。

## 二、 算法逻辑类坑题（易错边界+性能）

### 1. 二分查找（边界条件错误）

#### 题目描述

给定一个**升序排列的整数数组**和一个目标值 `target`，找出 `target` 在数组中的索引，不存在则返回 `-1`。

#### 输入输出示例

```Plain Text

输入：1,3,5,7,9 5
输出：2
输入：1,3,5,7,9 2
输出：-1
```

#### 坑点分析

- 前端选手容易写错 `mid` 计算（如 `mid = (left + right) / 2`，整数溢出）；

- 循环条件写成 `left <= right` 还是 `left < right` 混淆；

- 边界更新错误（如 `right = mid` 还是 `right = mid - 1`）。

#### JS避坑解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const [numsStr, targetStr] = line.trim().split(' ');
  const nums = numsStr.split(',').map(Number);
  const target = parseInt(targetStr);
  
  let left = 0;
  let right = nums.length - 1;
  let res = -1;
  
  // 关键：循环条件 left <= right，处理所有情况
  while (left <= right) {
    // 避坑：用 Math.floor((left + right) / 2) 或 left + Math.floor((right - left)/2)
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      res = mid;
      break;
    } else if (nums[mid] < target) {
      left = mid + 1; // 目标在右半区，排除mid
    } else {
      right = mid - 1; // 目标在左半区，排除mid
    }
  }
  
  console.log(res);
  rl.close();
});
```

#### 避坑技巧

- `mid` 计算用 `Math.floor((left + right)/2)`，避免小数索引；

- 循环条件用 `left <= right`，覆盖 `left === right` 的最后一次判断；

- 边界更新必须 `left = mid + 1` / `right = mid - 1`，否则会陷入死循环。

### 2. 两数之和（暴力解法超时）

#### 题目描述

给定一个整数数组 `nums` 和一个目标值 `target`，找出数组中**两个数的索引**，使它们的和等于 `target`，数组中同一元素不能使用两次。

#### 输入输出示例

```Plain Text

输入：2,7,11,15 9
输出：0,1
```

#### 坑点分析

- 前端选手容易用**双重循环暴力解法**（O(n²)），在大数据量下超时；

- 误用 `indexOf` 查找补数，忽略“同一元素不能使用两次”的条件（如 `nums = [3,3], target=6`）。

#### JS避坑解答（ACM模式，O(n) 时间复杂度）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const [numsStr, targetStr] = line.trim().split(' ');
  const nums = numsStr.split(',').map(Number);
  const target = parseInt(targetStr);
  
  // 关键：用 Map 存储已遍历元素的索引，O(1) 查找
  const map = new Map();
  let res = [];
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    // 先判断补数是否存在，再存储当前元素，避免同一元素重复使用
    if (map.has(complement)) {
      res = [map.get(complement), i];
      break;
    }
    map.set(nums[i], i);
  }
  
  console.log(res.join(','));
  rl.close();
});
```

#### 避坑技巧

- 拒绝双重循环，用 `Map` 降时间复杂度到 O(n)，适配华为机试大数据量；

- 先判断补数是否在 `Map` 中，再存储当前元素，避免 `nums = [3,3]` 时误判；

- 找到结果后立即 `break`，减少不必要的遍历。

### 3. 反转整数（溢出处理）

#### 题目描述

给你一个 32 位有符号整数 `x`，返回将 `x` 中的数字部分反转后的结果。**如果反转后整数超过 32 位有符号整数的范围 ** **`[-2^31, 2^31 - 1]`** **，返回 0**。

#### 输入输出示例

```Plain Text

输入：123 → 输出：321
输入：-123 → 输出：-321
输入：120 → 输出：21
输入：1534236469 → 输出：0（溢出）
```

#### 坑点分析

- 前端选手容易忽略**32位整数溢出**条件，导致大数测试用例失败；

- 处理负数时，直接反转字符串会保留负号，逻辑复杂。

#### JS避坑解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (xStr) => {
  const x = parseInt(xStr);
  let res = 0;
  const isNegative = x < 0;
  let num = Math.abs(x); // 先取绝对值，统一处理正数反转
  
  while (num > 0) {
    const digit = num % 10; // 取最后一位
    res = res * 10 + digit; // 构建反转数
    num = Math.floor(num / 10); // 去掉最后一位
    
    // 关键：提前判断溢出，避免中间结果过大
    if (res > Math.pow(2, 31) - 1 || res < -Math.pow(2, 31)) {
      res = 0;
      break;
    }
  }
  
  // 恢复符号 + 最终溢出判断
  res = isNegative ? -res : res;
  if (res > Math.pow(2, 31) - 1 || res < -Math.pow(2, 31)) {
    res = 0;
  }
  
  console.log(res);
  rl.close();
});
```

#### 避坑技巧

- 先取绝对值，统一处理正数反转，简化负数逻辑；

- 循环中**提前判断溢出**，避免中间结果超出JS数值范围；

- 32位有符号整数范围是 `[-2^31, 2^31 - 1]`，即 `[-2147483648, 2147483647]`，必须严格判断。

## 三、 字符串类坑题（细节易错）

### 1. 字符串转整数（atoi）

#### 题目描述

实现一个 `atoi` 函数，使其能将字符串转换成整数。

- 忽略前面的空格；

- 识别正负号；

- 读取数字部分，遇到非数字字符停止；

- 超出32位有符号整数范围则返回边界值。

#### 输入输出示例

```Plain Text

输入："   -42" → 输出：-42
输入："4193 with words" → 输出：4193
输入："words and 987" → 输出：0
输入："-91283472332" → 输出：-2147483648
```

#### 坑点分析

- 前端选手容易遗漏**空格、正负号、非数字字符**等边界情况；

- 未处理大数溢出，直接用 `parseInt` 会导致精度丢失。

#### JS避坑解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (s) => {
  s = s.trim(); // 去掉首尾空格
  if (s.length === 0) {
    console.log(0);
    rl.close();
    return;
  }
  
  let sign = 1; // 符号位，默认正
  let index = 0;
  const max = Math.pow(2, 31) - 1;
  const min = -Math.pow(2, 31);
  
  // 处理符号位
  if (s[index] === '+' || s[index] === '-') {
    sign = s[index] === '+' ? 1 : -1;
    index++;
  }
  
  let res = 0;
  while (index < s.length) {
    const charCode = s.charCodeAt(index);
    // 判断是否为数字（0-9的ASCII码：48-57）
    if (charCode < 48 || charCode > 57) {
      break;
    }
    const digit = charCode - 48;
    // 溢出判断：提前判断，避免res*10+digit溢出
    if (res > Math.floor(max / 10) || (res === Math.floor(max / 10) && digit > max % 10)) {
      res = sign === 1 ? max : min;
      break;
    }
    res = res * 10 + digit;
    index++;
  }
  
  res = sign * res;
  console.log(res);
  rl.close();
});
```

#### 避坑技巧

- 用 `charCodeAt` 判断是否为数字，比正则表达式更高效；

- 溢出判断要**提前计算**：`res > max/10` 时，`res*10` 必然溢出；

- 符号位单独处理，避免和数字混合判断。

## 四、 通用避坑指南

1. **输入处理**

    - 所有输入必须 `trim()`，避免首尾空格干扰；

    - 多组输入用 `rl.on('line')`，记得写终止条件；

    - 数字转换必须用 `map(Number)`，禁止直接用 `+` 隐式转换。

2. **性能优化**

    - 拒绝双重循环，优先用 `Map/Set` 降时间复杂度；

    - 数组查找用 `Map.has()` 替代 `Array.indexOf()`（O(1) vs O(n)）。

3. **边界条件**

    - 必测：空输入、0、负数、最大值/最小值；

    - 算法题先写边界条件，再写核心逻辑。

需要我帮你整理一份**华为机试JS避坑速记清单**，把所有坑点和解决方案浓缩成一页，方便考前快速过一遍吗？
> （注：文档部分内容可能由 AI 生成）