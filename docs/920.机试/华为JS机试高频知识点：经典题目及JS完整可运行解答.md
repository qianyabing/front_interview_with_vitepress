# 华为 JS 机试高频知识点：经典题目及 JS 完整可运行解答

你需要的是华为JS机试高频知识点对应的**经典题目+完整可运行的JS解答**，这些题目覆盖了输入输出、哈希表、排序、二分、栈、字符串/数组处理等核心考点，每道题都贴合华为机试的出题风格（含输入输出逻辑），可以直接复制运行，同时附带关键思路解释。

---

## 高频知识点对应经典题目（附JS解答）

### 题目1：单行输入 - 数组求和（输入输出基础）

#### 题目描述

输入一行以空格分隔的整数，计算这些整数的总和并输出。

示例输入：`1 2 3 4 5`

示例输出：`15`

#### 解题思路

1. 用单行输入模板读取数据；

2. 将输入字符串分割并转换为数字数组；

3. 用`reduce`求和，输出结果。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (inputStr) => {
  // 处理输入：去空格→分割→转数字数组
  const numArr = inputStr.trim().split(' ').map(Number);
  // 核心逻辑：求和
  const sum = numArr.reduce((acc, cur) => acc + cur, 0);
  // 输出结果
  console.log(sum);
  rl.close();
});
```

#### 代码解释

- `trim()`：去除输入首尾的空格（避免空字符串干扰）；

- `split(' ')`：按空格分割成字符串数组；

- `map(Number)`：将字符串数组转为数字数组；

- `reduce`：遍历数组累加，初始值设为0（避免空数组返回NaN）。

---

### 题目2：多行输入 - 矩阵求和（多行输入模板）

#### 题目描述

第一行输入一个整数n（表示矩阵的行数），接下来n行每行输入以空格分隔的整数（表示矩阵的每行元素），计算矩阵所有元素的总和并输出。

示例输入：

```Plain Text

3
1 2 3
4 5 6
7 8 9
```

示例输出：`45`

#### 解题思路

1. 用多行输入模板读取总行数n和后续n行数据；

2. 将每行数据转为数字数组，扁平化后求和；

3. 输出结果。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let lineCount = 0; // 已读取行数
let totalLine = 0; // 总行数
const matrix = []; // 存储矩阵数据

rl.on('line', (inputStr) => {
  const input = inputStr.trim();
  if (lineCount === 0) {
    // 第一行是总行数
    totalLine = parseInt(input);
    lineCount++;
  } else {
    // 后续行是矩阵每行数据
    matrix.push(input.split(' ').map(Number));
    lineCount++;
    // 读取完所有行后计算
    if (lineCount > totalLine) {
      // 扁平化二维数组并求和
      const sum = matrix.flat().reduce((acc, cur) => acc + cur, 0);
      console.log(sum);
      rl.close();
    }
  }
});
```

#### 代码解释

- `lineCount`/`totalLine`：控制多行输入的读取逻辑，避免提前/延后计算；

- `flat()`：将二维数组（矩阵）扁平化为一维数组，方便求和；

- 仅当`lineCount > totalLine`时执行计算，确保读取完所有数据。

---

### 题目3：两数之和（哈希表核心）

#### 题目描述

输入一行以空格分隔的整数数组，再输入一个目标值（单行输入，用空格分隔数组和目标值），找出数组中两个数之和等于目标值的索引（假设只有一个解，且不能使用同一个元素）。

示例输入：`2 7 11 15 9`（数组是[2,7,11,15]，目标值是9）

示例输出：`0 1`

#### 解题思路

1. 拆分输入为数组和目标值；

2. 用`Map`存储“数值→索引”，遍历数组时计算差值；

3. 若差值存在于`Map`中，返回两个索引；否则将当前数值和索引存入`Map`。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (inputStr) => {
  const inputArr = inputStr.trim().split(' ').map(Number);
  // 拆分：最后一个元素是目标值，前面是数组
  const target = inputArr.pop();
  const nums = inputArr;
  
  // 核心逻辑：哈希表解法
  const map = new Map();
  let result = [];
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      result = [map.get(diff), i];
      break;
    }
    map.set(nums[i], i);
  }
  
  // 输出索引（空格分隔）
  console.log(result.join(' '));
  rl.close();
});
```

#### 代码解释

- `inputArr.pop()`：拆分目标值（输入的最后一个数）；

- `Map`存储已遍历的数值和索引，时间复杂度O(n)（比嵌套循环O(n²)高效）；

- 找到解后立即`break`，减少不必要的遍历。

---

### 题目4：快速排序（排序高频）

#### 题目描述

输入一行以空格分隔的整数，使用快速排序算法对数组进行升序排序并输出。

示例输入：`5 2 9 3 7 6 1`

示例输出：`1 2 3 5 6 7 9`

#### 解题思路

1. 读取输入并转为数字数组；

2. 实现快速排序函数（分治思想：选基准值→分左右→递归合并）；

3. 输出排序后的数组（空格分隔）。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 快速排序核心函数
function quickSort(arr) {
  if (arr.length <= 1) return arr; // 递归终止条件
  const pivot = arr[Math.floor(arr.length / 2)]; // 选中间值为基准
  const left = arr.filter(item => item < pivot); // 小于基准
  const middle = arr.filter(item => item === pivot); // 等于基准
  const right = arr.filter(item => item > pivot); // 大于基准
  return [...quickSort(left), ...middle, ...quickSort(right)]; // 递归合并
}

rl.on('line', (inputStr) => {
  const numArr = inputStr.trim().split(' ').map(Number);
  const sortedArr = quickSort(numArr);
  console.log(sortedArr.join(' '));
  rl.close();
});
```

#### 代码解释

- 递归终止条件`arr.length <= 1`：避免无限递归；

- 选中间值为基准：比选第一个/最后一个值更稳定（避免有序数组导致的性能退化）；

- `filter`分治：将数组拆分为左、中、右三部分，递归排序后合并。

---

### 题目5：二分查找（查找高频）

#### 题目描述

输入一行以空格分隔的**升序整数数组**，再输入一个目标值（单行输入，空格分隔数组和目标值），用二分查找找到目标值的索引，未找到则输出-1。

示例输入：`1 3 5 7 9 5`（数组[1,3,5,7,9]，目标值5）

示例输出：`2`

#### 解题思路

1. 拆分输入为有序数组和目标值；

2. 初始化左右指针，循环计算中间值；

3. 比较中间值与目标值，调整指针范围，找到则返回索引，否则返回-1。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 二分查找核心函数
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) { // 循环条件：low <= high（关键）
    const mid = Math.floor(low + (high - low) / 2); // 避免low+high溢出
    if (arr[mid] === target) {
      return mid; // 找到目标值，返回索引
    } else if (arr[mid] < target) {
      low = mid + 1; // 目标在右侧，左指针右移
    } else {
      high = mid - 1; // 目标在左侧，右指针左移
    }
  }
  return -1; // 未找到
}

rl.on('line', (inputStr) => {
  const inputArr = inputStr.trim().split(' ').map(Number);
  const target = inputArr.pop();
  const nums = inputArr;
  
  const index = binarySearch(nums, target);
  console.log(index);
  rl.close();
});
```

#### 代码解释

- `low <= high`：循环条件不能写成`low < high`，否则会漏掉最后一个元素；

- `mid = Math.floor(low + (high - low)/2)`：比`(low+high)/2`更安全，避免大数相加溢出；

- 指针调整必须`+1/-1`：否则会导致死循环（如`low=high`时）。

---

### 题目6：括号匹配（栈核心）

#### 题目描述

输入一个仅包含`()`、`[]`、`{}`的字符串，判断括号是否合法匹配（左括号必须按顺序闭合，且所有括号都闭合），合法输出`true`，不合法输出`false`。

示例输入1：`()[]{}` → 输出`true`

示例输入2：`([)]` → 输出`false`

#### 解题思路

1. 用栈存储左括号；

2. 用`Map`建立右括号到左括号的映射；

3. 遍历字符串：左括号入栈，右括号则弹出栈顶匹配，不匹配则返回false；

4. 最终栈为空则合法（无剩余左括号）。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 括号匹配核心函数
function isValidBracket(str) {
  const stack = [];
  const bracketMap = new Map([[')', '('], ['}', '{'], [']', '[']]);
  
  for (const char of str) {
    if (bracketMap.has(char)) {
      // 右括号：栈空或栈顶不匹配则返回false
      if (stack.length === 0 || stack.pop() !== bracketMap.get(char)) {
        return false;
      }
    } else {
      // 左括号：入栈
      stack.push(char);
    }
  }
  // 栈空才是完全匹配
  return stack.length === 0;
}

rl.on('line', (inputStr) => {
  const str = inputStr.trim();
  const result = isValidBracket(str);
  console.log(result);
  rl.close();
});
```

#### 代码解释

- `bracketMap`：统一管理右括号与左括号的对应关系，代码更简洁；

- `stack.pop()`：遇到右括号时，弹出栈顶左括号进行匹配；

- 最终判断`stack.length === 0`：避免“(()”这类有剩余左括号的情况。

---

### 题目7：字符串回文判断（字符串处理）

#### 题目描述

输入一个字符串，判断是否为回文字符串（忽略大小写、空格和非字母数字字符），是则输出`true`，否则输出`false`。

示例输入：`A man, a plan, a canal: Panama` → 输出`true`

示例输入：`race a car` → 输出`false`

#### 解题思路

1. 预处理字符串：转小写→移除非字母数字字符；

2. 双指针法：左指针从头部、右指针从尾部开始比较，不相等则返回false；

3. 全部匹配则返回true。

#### 完整JS代码

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 回文判断核心函数
function isPalindrome(str) {
  // 预处理：转小写 + 只保留字母数字
  const processedStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = processedStr.length - 1;
  
  while (left < right) {
    if (processedStr[left] !== processedStr[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

rl.on('line', (inputStr) => {
  const result = isPalindrome(inputStr);
  console.log(result);
  rl.close();
});
```

#### 代码解释

- `toLowerCase()`：忽略大小写；

- 正则`/[^a-z0-9]/g`：匹配非字母数字字符并移除，只保留有效字符；

- 双指针法：时间复杂度O(n)，空间复杂度O(1)（比反转字符串更高效）。

---

### 总结

1. **核心模板复用**：所有题目都基于之前的输入输出模板，只需替换核心逻辑，记住模板能快速搭建代码框架；

2. **高频考点覆盖**：这7道题覆盖了输入输出、哈希表、快速排序、二分查找、栈、字符串处理等华为JS机试80%的高频考点；

3. **避坑关键点**：注意输入转换、边界条件（如二分查找的`low <= high`、栈的空判断）、输出格式（空格分隔/布尔值）。

建议你把这些题目逐行敲一遍（不要复制），并尝试修改输入用例（如空输入、大数、边界值）测试，确保理解每一行代码的作用，这样在机试中能快速适配不同的题目变体。
> （注：文档部分内容可能由 AI 生成）