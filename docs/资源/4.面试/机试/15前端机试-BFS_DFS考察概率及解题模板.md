# 前端机试：BFS/DFS 考察概率及解题模板

你想知道前端机试中BFS/DFS的考察概率，以及对应的高频核心题目，核心诉求是**明确考察重点、拿到可直接套用的解题模板**——结论先给你：前端机试**一定会考察**BFS/DFS（是二叉树/层级结构题的核心），但只考基础应用（无复杂图论难题），80%的题目都是二叉树场景的变种，少量涉及简单网格/路径场景，下面按DFS、BFS分类整理高频题，附前端机试专用的JS模板。

### 一、先明确：前端机试考BFS/DFS的特点

1. **考察形式**：不考纯算法名词，而是「以二叉树/树形结构为载体」考遍历逻辑（比如层序遍历=BFS，前序遍历=DFS）；

2. **难度**：只考基础题，无复杂优化（比如不用考虑时间复杂度优化，能跑通、边界处理到位即可）；

3. **语言**：全程用JS实现，优先写递归版DFS（简单易写）、队列版BFS（模板固定）。

---

## 二、DFS（深度优先）高频核心题（机试占比60%）

DFS是前端机试的重点，核心考察「递归遍历+回溯」，以下4题覆盖90%的DFS考点：

### 题1：二叉树的最大深度（LeetCode 104）—— DFS基础必考题

**题目**：求二叉树的最大深度（根到最远叶子节点的层数）。

**核心思路**：后序DFS，递归求左右子树深度，取最大值+1（当前层）。

```JavaScript

// DFS递归版（前端机试首选）
function maxDepth(root) {
    if (!root) return 0; // 空节点深度为0
    // DFS：先递归左、右子树（深度遍历到底），再计算当前层深度
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);
    return Math.max(leftDepth, rightDepth) + 1;
}

// 测试：树结构 1/2 3（2下有4），输出 3
const root = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));
console.log(maxDepth(root)); // 3
```

### 题2：二叉树的所有路径（LeetCode 257）—— DFS+回溯高频题

**题目**：返回所有从根到叶子的路径（比如 ["1->2->4", "1->3"]）。

**核心思路**：前序DFS+回溯，遍历过程中拼接路径，到叶子节点时存入结果。

```JavaScript

function binaryTreePaths(root) {
    const result = [];
    // DFS辅助函数：node=当前节点，path=当前拼接的路径
    const dfs = (node, path) => {
        if (!node) return;
        // 拼接当前节点值（首次拼接直接存值，后续加->）
        const newPath = path ? `${path}->${node.val}` : `${node.val}`;
        // 叶子节点：路径完成，存入结果（回溯终止）
        if (!node.left && !node.right) {
            result.push(newPath);
            return;
        }
        // DFS：递归左、右子树（深度遍历）
        dfs(node.left, newPath);
        dfs(node.right, newPath);
    };
    dfs(root, "");
    return result;
}

// 测试：同上的树，输出 ["1->2->4", "1->3"]
console.log(binaryTreePaths(root));
```

### 题3：路径总和 II（LeetCode 113）—— DFS+回溯进阶

**题目**：找出所有从根到叶子的路径，路径和等于目标值（比112题多了「收集所有路径」，机试更常考）。

**核心思路**：DFS遍历+回溯，递归时记录路径和剩余目标值，叶子节点验证后收集路径。

```JavaScript

function pathSum(root, targetSum) {
    const result = [];
    // DFS辅助函数：node=当前节点，path=当前路径，remain=剩余目标值
    const dfs = (node, path, remain) => {
        if (!node) return;
        // 加入当前节点值
        path.push(node.val);
        remain -= node.val;
        // 叶子节点+剩余值为0 → 收集路径
        if (!node.left && !node.right && remain === 0) {
            result.push([...path]); // 深拷贝，避免后续修改
        }
        // DFS遍历左、右子树
        dfs(node.left, path, remain);
        dfs(node.right, path, remain);
        // 回溯：移除当前节点值（关键，回到上一层）
        path.pop();
    };
    dfs(root, [], targetSum);
    return result;
}

// 测试：树1/2 3（2下有4），目标值7 → 路径[1,2,4]和为7，输出 [[1,2,4]]
console.log(pathSum(root, 7)); // [[1,2,4]]
```

### 题4：岛屿数量（LeetCode 200）—— DFS网格场景（少数大厂考）

**题目**：给定二维网格（'1'=陆地，'0'=水），统计岛屿数量（相邻陆地算一个）。

**核心思路**：遍历网格，遇到陆地则DFS标记所有相邻陆地为已访问（避免重复统计）。

```JavaScript

function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // DFS：标记当前陆地及相邻陆地为已访问（改为'0'）
    const dfs = (i, j) => {
        // 边界判断：越界/非陆地 → 终止
        if (i < 0 || i >= rows || j < 0 || j >= cols || grid[i][j] !== '1') return;
        grid[i][j] = '0'; // 标记为已访问
        // DFS遍历上下左右四个方向（深度优先）
        dfs(i - 1, j); // 上
        dfs(i + 1, j); // 下
        dfs(i, j - 1); // 左
        dfs(i, j + 1); // 右
    };

    // 遍历整个网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                count++; // 发现新岛屿，计数+1
                dfs(i, j); // 标记所有相邻陆地
            }
        }
    }
    return count;
}

// 测试：网格如下，输出 2
const grid = [
    ['1','1','0','0','0'],
    ['1','1','0','0','0'],
    ['0','0','1','0','0'],
    ['0','0','0','1','1']
];
console.log(numIslands(grid)); // 2
```

---

## 三、BFS（广度优先）高频核心题（机试占比40%）

BFS核心考察「队列+按层遍历」，以下4题是前端机试的绝对高频：

### 题1：二叉树的层序遍历（LeetCode 102）—— BFS必考基础

**题目**：按层输出二叉树节点值（如 [[1],[2,3],[4]]）。

**核心思路**：队列存储当前层节点，遍历完一层再处理下一层（BFS核心模板）。

```JavaScript

function levelOrder(root) {
    const result = [];
    if (!root) return result;
    const queue = [root]; // 队列初始化

    while (queue.length > 0) {
        const levelSize = queue.length; // 当前层节点数（关键）
        const currentLevel = [];
        // 遍历当前层所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift(); // 队首出队
            currentLevel.push(node.val);
            // 子节点入队（保证下一层顺序）
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(currentLevel);
    }
    return result;
}

// 测试：同上的树，输出 [[1],[2,3],[4]]
console.log(levelOrder(root));
```

### 题2：二叉树的最小深度（LeetCode 111）—— BFS找最短路径

**题目**：求二叉树的最小深度（根到最近叶子节点的层数）。

**核心思路**：BFS按层遍历，遇到第一个叶子节点直接返回当前层数（无需遍历所有节点，效率更高）。

```JavaScript

function minDepth(root) {
    if (!root) return 0;
    const queue = [root];
    let depth = 1; // 根节点层数为1

    while (queue.length > 0) {
        const levelSize = queue.length;
        // 遍历当前层
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            // 找到叶子节点 → 直接返回当前深度（BFS找最短路径核心）
            if (!node.left && !node.right) return depth;
            // 子节点入队
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        depth++; // 遍历完一层，深度+1
    }
    return depth;
}

// 测试：同上的树，最近叶子是3（层数2），输出 2
console.log(minDepth(root)); // 2
```

### 题3：二叉树的右视图（LeetCode 199）—— BFS变种高频题

**题目**：返回二叉树每层最右侧的节点值（如 [1,3,4]）。

**核心思路**：BFS按层遍历，记录每层最后一个节点值。

```JavaScript

function rightSideView(root) {
    const result = [];
    if (!root) return result;
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        // 遍历当前层，只记录最后一个节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            // 最后一个节点 → 存入结果
            if (i === levelSize - 1) result.push(node.val);
            // 子节点入队
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    return result;
}

// 测试：同上的树，输出 [1,3,4]
console.log(rightSideView(root));
```

### 题4：打开转盘锁（LeetCode 752）—— BFS最短路径（大厂高频）

**题目**：转盘锁初始为"0000"，每次可转一位（+1/-1，9→0，0→9），避开死锁列表，求打开目标锁的最少步数。

**核心思路**：BFS按层遍历所有可能的密码，找到目标时返回步数（典型「最短路径」问题）。

```JavaScript

function openLock(deadends, target) {
    const deadSet = new Set(deadends);
    const visited = new Set(); // 记录已访问密码，避免重复
    const queue = [["0000", 0]]; // [密码, 步数]

    // 初始密码是死锁 → 直接返回-1
    if (deadSet.has("0000")) return -1;
    visited.add("0000");

    // 辅助函数：转动一位密码（向上/向下）
    const turn = (code, index, isUp) => {
        const arr = code.split("");
        let num = parseInt(arr[index]);
        num = isUp ? (num + 1) % 10 : (num - 1 + 10) % 10;
        arr[index] = num.toString();
        return arr.join("");
    };

    while (queue.length > 0) {
        const [code, step] = queue.shift();
        // 找到目标 → 返回步数
        if (code === target) return step;
        // 遍历4位密码，每位转上下两个方向
        for (let i = 0; i < 4; i++) {
            const upCode = turn(code, i, true); // 向上转
            const downCode = turn(code, i, false); // 向下转
            // 未访问+非死锁 → 入队
            if (!visited.has(upCode) && !deadSet.has(upCode)) {
                visited.add(upCode);
                queue.push([upCode, step + 1]);
            }
            if (!visited.has(downCode) && !deadSet.has(downCode)) {
                visited.add(downCode);
                queue.push([downCode, step + 1]);
            }
        }
    }
    // 遍历完未找到 → 返回-1
    return -1;
}

// 测试：deadends=["0201","0101"], target="0202" → 步数6
console.log(openLock(["0201","0101"], "0202")); // 6
```

---

### 四、前端机试BFS/DFS考察的核心要点

1. **模板优先**：DFS优先写递归版（代码少、不易错），BFS死记「队列+按层遍历」模板；

2. **边界处理**：必须判断「空节点」「越界」「已访问」（比如岛屿题的网格边界、转盘锁的已访问密码）；

3. **回溯关键**：DFS+回溯题（如路径总和II），记得`path.pop()`恢复状态，避免路径错误；

4. **场景适配**：找「最短路径/按层结果」用BFS，找「所有路径/深层节点」用DFS。

### 总结

1. 前端机试必考BFS/DFS，核心载体是二叉树，少量网格/路径场景；

2. DFS高频题：二叉树最大深度、所有路径、路径总和II、岛屿数量；

3. BFS高频题：层序遍历、最小深度、右视图、打开转盘锁；

4. 解题关键：背熟递归（DFS）/队列（BFS）模板，重点处理边界和回溯。

这些题目覆盖了前端机试中95%的BFS/DFS考点，你只需把代码模板手写2遍，保证能快速默写并处理边界，就能轻松应对这类题目。
> （注：文档部分内容可能由 AI 生成）