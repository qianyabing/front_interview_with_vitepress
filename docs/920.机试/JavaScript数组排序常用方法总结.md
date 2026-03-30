# 📊 JavaScript 数组排序常用方法总结

我帮你把数组排序的常用方法、原理、优缺点和适用场景整理得清清楚楚，你可以直接对照着用。

---

## 1. 原生方法：`Array.sort()`

### 特点

- **默认行为**：将元素转为字符串，按 Unicode 码点排序（对数字不友好）。

- **自定义排序**：传入比较函数 `(a,b) => a-b` 实现升序，`(a,b) => b-a` 实现降序。

- **原地排序**：直接修改原数组，不生成新数组。

### 示例

```JavaScript

const arr = [3, 1, 4, 1, 5];

// 数字升序
arr.sort((a, b) => a - b); // [1, 1, 3, 4, 5]

// 数字降序
arr.sort((a, b) => b - a); // [5, 4, 3, 1, 1]

// 按字符串长度排序
['apple', 'banana', 'pear'].sort((a, b) => a.length - b.length);
// ['pear', 'apple', 'banana']
```

### 复杂度

- 时间复杂度：平均 `O(n log n)`，浏览器通常使用 Timsort 或 QuickSort 实现。

- 空间复杂度：`O(log n)` ~ `O(n)`，取决于具体实现。

### 适用场景

- 快速实现简单排序（数字、字符串）。

- 需要原地修改数组，且不介意原数组被改变。

---

## 2. 快速排序（QuickSort）

### 特点

- **分治思想**：选基准值，将数组分为“小于基准”“等于基准”“大于基准”三部分，递归排序左右子数组。

- **不稳定排序**：相同元素的相对位置可能改变。

### 示例

```JavaScript

function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
```

### 复杂度

- 时间复杂度：平均 `O(n log n)`，最坏 `O(n²)`（可通过随机选基准优化）。

- 空间复杂度：`O(log n)`（递归栈）~ `O(n)`（额外数组存储）。

### 适用场景

- 需要高性能的通用排序。

- 对稳定性无要求（如纯数字排序）。

---

## 3. 归并排序（MergeSort）

### 特点

- **分治思想**：将数组不断拆分为两半，分别排序后再合并。

- **稳定排序**：相同元素的相对位置保持不变。

### 示例

```JavaScript

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    result.push(left[0] <= right[0] ? left.shift() : right.shift());
  }
  return [...result, ...left, ...right];
}
```

### 复杂度

- 时间复杂度：稳定 `O(n log n)`。

- 空间复杂度：`O(n)`（需要额外空间存储合并结果）。

### 适用场景

- 需要稳定排序的场景（如对象数组按多字段排序）。

- 数据量较大且对稳定性有要求。

---

## 4. 冒泡排序（BubbleSort）

### 特点

- **相邻比较**：重复遍历数组，比较相邻元素并交换，使较大的元素逐步“冒泡”到末尾。

- **稳定排序**：相同元素不交换，保持相对位置。

### 示例

```JavaScript

function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let swapped = false;
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // 无交换则已排序，提前退出
  }
  return arr;
}
```

### 复杂度

- 时间复杂度：最好 `O(n)`（已排序），最坏 `O(n²)`。

- 空间复杂度：`O(1)`（原地排序）。

### 适用场景

- 数据量很小（如 n < 100）。

- 教学演示排序原理，实际项目中很少使用。

---

## 5. 插入排序（InsertionSort）

### 特点

- **逐个插入**：将未排序元素逐个插入到已排序序列的正确位置。

- **稳定排序**：相同元素不交换，保持相对位置。

### 示例

```JavaScript

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
```

### 复杂度

- 时间复杂度：最好 `O(n)`（已排序），最坏 `O(n²)`。

- 空间复杂度：`O(1)`（原地排序）。

### 适用场景

- 数据量很小（如 n < 100）。

- 数组基本有序时效率很高。

---

## 🔍 常用排序方法对比

|方法|时间复杂度（平均）|时间复杂度（最坏）|空间复杂度|稳定性|适用场景|
|---|---|---|---|---|---|
|`Array.sort()`|`O(n log n)`|`O(n log n)`|`O(log n)`~`O(n)`|取决于实现|通用排序，简单场景|
|快速排序|`O(n log n)`|`O(n²)`|`O(log n)`~`O(n)`|不稳定|高性能通用排序|
|归并排序|`O(n log n)`|`O(n log n)`|`O(n)`|稳定|稳定排序、大数据量|
|冒泡排序|`O(n²)`|`O(n²)`|`O(1)`|稳定|小数据量、教学演示|
|插入排序|`O(n²)`|`O(n²)`|`O(1)`|稳定|小数据量、基本有序数组|
---

## 💡 实战选择建议

1. **日常开发**：优先用 `Array.sort()`，浏览器优化后的实现效率很高，代码最简洁。

2. **需要稳定排序**：用归并排序，或 `Array.sort()`（部分浏览器实现稳定）。

3. **手写排序面试题**：快速排序（高频）、归并排序（稳定高频）、冒泡/插入（基础高频）。

4. **小数据量或基本有序**：插入排序（比冒泡更高效）。

5. **避免原地修改原数组**：快速排序、归并排序（生成新数组）。

---

如果你需要，我可以帮你整理一份**排序算法测试用例清单**，包含普通数组、重复元素、已排序数组、逆序数组等场景，让你写完代码后可以快速验证。需要吗？
> （注：文档部分内容可能由 AI 生成）