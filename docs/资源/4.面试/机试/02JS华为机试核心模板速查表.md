# JS华为机试核心模板速查表

**适用场景**：Node.js ACM模式，考前快速翻看、默写，覆盖80%高频场景

## 一、输入输出模板（必考）

### 1. 多行输入（最常用）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
let lines = []; // 存储所有输入行

rl.on('line', (line) => {
  lines.push(line.trim()); // 去除首尾空格，避免空行干扰
}).on('close', () => {
  // 核心处理逻辑写这里
  // 示例：第一行是n，后续n行是数据
  const n = parseInt(lines[0]);
  const data = lines.slice(1, n+1).map(Number);
  console.log(处理结果);
});
```

### 2. 单行输入（简单题）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (input) => {
  const data = input.trim().split(' ').map(Number);
  console.log(处理结果);
  rl.close();
});
```

### 3. 多组输入（循环读取）

```JavaScript

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  if (line.trim() === '0') { // 终止条件（如输入0结束）
    rl.close();
    return;
  }
  // 处理单组输入
  const res = 处理逻辑(line);
  console.log(res);
});
```

## 二、核心算法模板

### 1. 双指针（滑动窗口）

```JavaScript

// 最长无重复子串（LeetCode 3）
function lengthOfLongestSubstring(s) {
  let set = new Set();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
```

### 2. DFS（二叉树/岛屿问题）

```JavaScript

// 岛屿数量（LeetCode 200）
function numIslands(grid) {
  let count = 0;
  const dfs = (i, j) => {
    // 边界+非岛屿判定
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] !== '1') return;
    grid[i][j] = '0'; // 标记已访问
    // 上下左右递归
    dfs(i-1, j);
    dfs(i+1, j);
    dfs(i, j-1);
    dfs(i, j+1);
  };
  // 遍历网格
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        dfs(i, j);
        count++;
      }
    }
  }
  return count;
}
```

### 3. 二叉树遍历（中序，递归+迭代）

```JavaScript

// 递归版（简单）
function inorderTraversal(root) {
  let res = [];
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  };
  dfs(root);
  return res;
}

// 迭代版（机试常考）
function inorderTraversal(root) {
  let res = [], stack = [];
  let cur = root;
  while (cur || stack.length) {
    // 左子树入栈
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }
    cur = stack.pop();
    res.push(cur.val);
    cur = cur.right;
  }
  return res;
}
```

### 4. 动态规划（爬楼梯）

```JavaScript

// 爬楼梯（LeetCode 70）
function climbStairs(n) {
  if (n <= 2) return n;
  let dp = new Array(n+1);
  dp[1] = 1;
  dp[2] = 2;
  // 状态转移：dp[i] = dp[i-1] + dp[i-2]
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}
```

## 三、前端高频API & 易错点

### 1. 高频API（直接用，不手写）

|类型|常用API|场景|
|---|---|---|
|数组|`sort((a,b)=>a-b)`/`filter`/`map`/`reduce`|排序、过滤、转换、累加|
|数组|`Set`/`Map`|去重、O(1)查找|
|字符串|`trim()`/`split(' ')`/`join('')`/`indexOf`|处理输入、子串查找|
### 2. 易错点（避坑）

1. **输入处理**：必须`trim()`去除首尾空格，否则易出现空字符串/多余空格

2. **数值转换**：输入默认是字符串，需`Number()`/`parseInt()`转换，注意`parseInt`进制问题

3. **超时优化**：避免嵌套循环（O(n²)），优先用`Map`/`Set`替代数组查找（O(1) vs O(n)）

4. **边界条件**：必测空输入、长度为1、最大值/最小值场景

5. **输出格式**：严格匹配题目要求（如空格分隔、换行、无多余输出）

### 总结

1. 输入输出模板优先记**多行输入**，覆盖80%场景；

2. 算法模板聚焦双指针、DFS、DP基础款，能解决前2题+第3题基础分；

3. 考前必看易错点，避免因语法/格式丢分（机试丢分重灾区）。
> （注：文档部分内容可能由 AI 生成）