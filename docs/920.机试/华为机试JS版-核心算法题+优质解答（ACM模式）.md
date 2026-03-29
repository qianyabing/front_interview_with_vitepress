# 华为机试JS版-核心算法题+优质解答（ACM模式）

以下为你整理了三大核心类型的**基础必做题目**（含题干+JS AC级解答+核心思路），所有代码均适配华为机试的ACM模式（手写输入输出），可直接复制到Node.js环境运行。

## 一、双指针 & 滑动窗口

### 1. LeetCode 27 移除元素

#### 题目描述

给你一个数组 `nums` 和一个值 `val`，你需要**原地**移除所有数值等于 `val` 的元素，并返回移除后数组的新长度。

不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并**原地**修改输入数组。

元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

#### 输入输出示例

- 输入：`3 3,2,2,3`（第一个数是val，第二个是数组）

- 输出：`2`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  // 处理输入：分割val和数组
  const [valStr, numsStr] = line.trim().split(' ');
  const val = parseInt(valStr);
  const nums = numsStr.split(',').map(Number);
  
  // 核心逻辑：快慢指针
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  
  console.log(slow); // 输出新长度
  rl.close();
});
```

#### 核心思路

- 慢指针 `slow`：记录有效元素的位置；

- 快指针 `fast`：遍历整个数组；

- 快指针遇到不等于 `val` 的元素时，赋值给慢指针位置，慢指针右移；

- 最终慢指针的位置就是新数组长度，无需删除元素（机试只看长度）。

### 2. LeetCode 3 最长无重复子串

#### 题目描述

给定一个字符串 `s`，请你找出其中不含有重复字符的 **最长子串** 的长度。

#### 输入输出示例

- 输入：`abcabcbb`

- 输出：`3`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (s) => {
  s = s.trim();
  let set = new Set(); // 维护窗口内无重复字符
  let left = 0, maxLen = 0;
  
  // 滑动窗口：右指针扩张，左指针收缩
  for (let right = 0; right < s.length; right++) {
    // 有重复字符，收缩左指针
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  console.log(maxLen);
  rl.close();
});
```

#### 核心思路

- 用 `Set` 存储窗口内的字符，实现O(1)时间复杂度的查找；

- 右指针遍历字符串，遇到重复字符时，左指针向右移动直到窗口内无重复；

- 每次更新窗口长度，记录最大值。

### 3. LeetCode 209 长度最小的子数组

#### 题目描述

给定一个含有 `n` 个正整数的数组和一个正整数 `target`，找出该数组中满足其和 ≥ target 的长度最小的 **连续子数组**，并返回其长度。如果不存在符合条件的子数组，返回 0。

#### 输入输出示例

- 输入：`7 2,3,1,2,4,3`（第一个数是target，第二个是数组）

- 输出：`2`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const [targetStr, numsStr] = line.trim().split(' ');
  const target = parseInt(targetStr);
  const nums = numsStr.split(',').map(Number);
  
  let left = 0, sum = 0, minLen = Infinity;
  
  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    // 满足条件，收缩左指针找最小长度
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }
  
  // 无符合条件的子数组返回0
  console.log(minLen === Infinity ? 0 : minLen);
  rl.close();
});
```

#### 核心思路

- 滑动窗口的“定和”变种，先扩张右指针累加和；

- 当和≥target时，收缩左指针并更新最小长度；

- 最终判断是否找到有效子数组，未找到则返回0。

## 二、DFS/BFS & 二叉树基础

### 1. LeetCode 94 二叉树的中序遍历

#### 题目描述

给定一个二叉树的根节点 `root`，返回它的 **中序遍历**（左→根→右）。

#### 输入输出示例

- 输入：`1,null,2,3`（按层序表示二叉树）

- 输出：`1,3,2`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 构建二叉树（层序输入转二叉树）
function buildTree(nodes) {
  if (!nodes || nodes[0] === 'null') return null;
  const root = { val: parseInt(nodes[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < nodes.length) {
    const node = queue.shift();
    // 左节点
    if (nodes[i] !== 'null') {
      node.left = { val: parseInt(nodes[i]), left: null, right: null };
      queue.push(node.left);
    }
    i++;
    // 右节点
    if (i < nodes.length && nodes[i] !== 'null') {
      node.right = { val: parseInt(nodes[i]), left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 中序遍历（递归版，机试首选）
function inorderTraversal(root) {
  const res = [];
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  };
  dfs(root);
  return res;
}

rl.question('', (input) => {
  const nodes = input.trim().split(',');
  const root = buildTree(nodes);
  const res = inorderTraversal(root);
  console.log(res.join(','));
  rl.close();
});
```

#### 核心思路

- 先实现“层序输入转二叉树”的工具函数（适配机试输入）；

- 中序遍历优先用递归（代码简洁，不易出错），遵循“左→根→右”顺序；

- 迭代版可作为备选，但递归版在机试中足够通过所有用例。

### 2. LeetCode 200 岛屿数量

#### 题目描述

给你一个由 `'1'`（陆地）和 `'0'`（水）组成的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

#### 输入输出示例

- 输入：`1,1,0,0,0 1,1,0,0,0 0,0,1,0,0 0,0,0,1,1`（每行用空格分隔，列用逗号分隔）

- 输出：`3`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let grid = [];
rl.on('line', (line) => {
  // 读取每行并转换为数组
  grid.push(line.trim().split(','));
}).on('close', () => {
  let count = 0;
  
  // DFS标记已访问的陆地
  const dfs = (i, j) => {
    // 边界判断 + 非陆地判断
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] !== '1') {
      return;
    }
    grid[i][j] = '0'; // 标记为已访问
    // 上下左右递归
    dfs(i - 1, j);
    dfs(i + 1, j);
    dfs(i, j - 1);
    dfs(i, j + 1);
  };
  
  // 遍历整个网格
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        dfs(i, j);
        count++;
      }
    }
  }
  
  console.log(count);
});
```

#### 核心思路

- 遍历网格中的每个点，遇到陆地则启动DFS；

- DFS中先判断边界和是否为陆地，再将当前陆地标记为水（避免重复计算）；

- 递归遍历上下左右四个方向，每完成一次DFS，岛屿数量+1。

### 3. LeetCode 101 对称二叉树

#### 题目描述

给你一个二叉树的根节点 `root`，检查它是否是镜像对称的。

#### 输入输出示例

- 输入：`1,2,2,3,4,4,3`

- 输出：`true`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 复用之前的二叉树构建函数
function buildTree(nodes) {
  if (!nodes || nodes[0] === 'null') return null;
  const root = { val: parseInt(nodes[0]), left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < nodes.length) {
    const node = queue.shift();
    if (nodes[i] !== 'null') {
      node.left = { val: parseInt(nodes[i]), left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < nodes.length && nodes[i] !== 'null') {
      node.right = { val: parseInt(nodes[i]), left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

// 判断是否对称
function isSymmetric(root) {
  const check = (left, right) => {
    // 都为空则对称
    if (!left && !right) return true;
    // 一个为空一个不为空，不对称
    if (!left || !right) return false;
    // 值相等 + 左的左和右的右对称 + 左的右和右的左对称
    return left.val === right.val && check(left.left, right.right) && check(left.right, right.left);
  };
  return check(root, root);
}

rl.question('', (input) => {
  const nodes = input.trim().split(',');
  const root = buildTree(nodes);
  console.log(isSymmetric(root));
  rl.close();
});
```

#### 核心思路

- 递归检查两个节点是否对称：值相等 + 左节点的左子树和右节点的右子树对称 + 左节点的右子树和右节点的左子树对称；

- 终止条件：两个节点都为空（对称）、一个为空一个不为空（不对称）。

## 三、动态规划基础 + 贪心

### 1. LeetCode 70 爬楼梯

#### 题目描述

假设你正在爬楼梯。需要 `n` 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶？

#### 输入输出示例

- 输入：`3`

- 输出：`3`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (nStr) => {
  const n = parseInt(nStr);
  // 边界条件
  if (n <= 2) {
    console.log(n);
    rl.close();
    return;
  }
  // 动态规划：空间优化版（不用数组，只用两个变量）
  let prev1 = 1; // n-2
  let prev2 = 2; // n-1
  let res = 0;
  for (let i = 3; i <= n; i++) {
    res = prev1 + prev2;
    prev1 = prev2;
    prev2 = res;
  }
  console.log(res);
  rl.close();
});
```

#### 核心思路

- 状态转移方程：`dp[i] = dp[i-1] + dp[i-2]`（第i阶的方法数=第i-1阶+第i-2阶）；

- 空间优化：不用数组存储所有状态，只用两个变量记录前两个状态，节省空间。

### 2. LeetCode 455 分发饼干

#### 题目描述

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 `i`，都有一个胃口值 `g[i]`，这是能让孩子们满足胃口的饼干的最小尺寸；每块饼干 `j`，都有一个尺寸 `s[j]` 。如果 `s[j] >= g[i]`，我们可以将这个饼干 `j` 分配给孩子 `i`，这个孩子会得到满足。

你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

#### 输入输出示例

- 输入：`1,2,3 1,1`（第一个数组是胃口，第二个是饼干尺寸）

- 输出：`1`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const [gStr, sStr] = line.trim().split(' ');
  const g = gStr.split(',').map(Number).sort((a, b) => a - b);
  const s = sStr.split(',').map(Number).sort((a, b) => a - b);
  
  let child = 0; // 满足的孩子数
  let cookie = 0; // 已使用的饼干数
  // 贪心：大饼干优先给大胃口的孩子
  while (child < g.length && cookie < s.length) {
    if (s[cookie] >= g[child]) {
      child++; // 满足一个孩子
    }
    cookie++; // 饼干要么用了，要么不够用，都要往后移
  }
  
  console.log(child);
  rl.close();
});
```

#### 核心思路

- 贪心策略：先排序两个数组，用双指针匹配；

- 大饼干优先给大胃口的孩子，最大化满足数量；

- 遍历条件：孩子未满足完且饼干未用完。

### 3. LeetCode 53 最大子数组和

#### 题目描述

给你一个整数数组 `nums`，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

#### 输入输出示例

- 输入：`-2,1,-3,4,-1,2,1,-5,4`

- 输出：`6`

#### JS解答（ACM模式）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (input) => {
  const nums = input.trim().split(',').map(Number);
  // 动态规划：滚动变量版
  let dp = nums[0]; // dp[i]表示以i结尾的最大子数组和
  let maxSum = dp;
  for (let i = 1; i < nums.length; i++) {
    // 状态转移：要么延续之前的子数组，要么重新开始
    dp = Math.max(nums[i], dp + nums[i]);
    maxSum = Math.max(maxSum, dp);
  }
  console.log(maxSum);
  rl.close();
});
```

#### 核心思路

- 状态转移方程：`dp[i] = max(nums[i], dp[i-1]+nums[i])`；

- 滚动变量优化空间：不用数组存储dp，只用一个变量记录当前状态；

- 遍历过程中记录最大和，避免最后再遍历一次数组。

### 总结

1. 所有解答均适配华为机试的**ACM模式**，包含完整的输入输出处理，可直接运行；

2. 核心思路聚焦“易理解、易默写”，优先选择机试中不易出错的写法（如递归＞迭代）；

3. JS特有的优化点（如Set/Map、空间优化）已融入代码，避免前端选手易踩的超时/内存坑。
> （注：文档部分内容可能由 AI 生成）