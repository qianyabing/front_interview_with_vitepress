# JavaScript 排序（拼音/字母）

## 一、`sort()` 方法核心基础

### 1.1 默认排序规则

`sort()` 方法**本质是按「字符串的 Unicode 编码」排序**，而非数字大小——无论数组元素是数字/字符串，默认都会先转为字符串再比较，这是新手最易踩坑的核心点：

```JavaScript

// 数字数组默认排序（反直觉）：转字符串按 Unicode 比较
const numArr = [10, 2, 31, 4];
console.log(numArr.sort()); // [10, 2, 31, 4]（非数字大小排序）

// 字符串数组默认排序（符合预期）：按字母 Unicode 排序
const strArr = ["banana", "apple", "cherry"];
console.log(strArr.sort()); // ["apple", "banana", "cherry"]
```

### 1.2 比较函数的 `a`、`b` 参数

`sort()` 可接收**比较函数**作为参数，函数内的 `a`、`b` 是数组中**相邻的两个待比较元素**，类型与数组元素完全一致：

- 数字数组：`a`、`b` 为数字类型；

- 字符串数组：`a`、`b` 为字符串类型；

- 对象数组：`a`、`b` 为对象类型。

### 1.3 比较函数返回值规则

|返回值类型|排序结果|
|---|---|
|负数（如-1）|`a` 排在 `b` 前面（升序）|
|0|`a`、`b` 位置不变|
|正数（如1）|`b` 排在 `a` 前面（降序）|
## 二、中文按拼音排序

核心依赖 `Intl.Collator` API（本地化排序器），指定 `zh-CN` 语言后自动按汉语拼音规则排序，是最简洁、准确的方式。

### 2.1 基础实现（升序/降序）

```JavaScript

// 待排序中文数组
const chineseNames = ['张三', '李四', '王五', '赵六', '阿七'];

// 1. 拼音升序（a→z）
const pinyinAsc = [...chineseNames].sort(new Intl.Collator('zh-CN').compare);
console.log(pinyinAsc); // ["阿七", "李四", "王五", "张三", "赵六"]

// 2. 拼音降序（z→a）：交换 compare 的 a、b 参数
const pinyinDesc = [...chineseNames].sort((a, b) => {
  return new Intl.Collator('zh-CN').compare(b, a);
});
console.log(pinyinDesc); // ["赵六", "张三", "王五", "李四", "阿七"]
```

### 2.2 关键说明

- `[...chineseNames]`：拷贝原数组，避免 `sort()` 原地排序修改原始数据（大厂必做）；

- `Intl.Collator('zh-CN')`：封装了中文拼音排序逻辑，无需手动转换拼音；

- 降序核心：交换比较函数中 `a`、`b` 的位置。

## 三、英文按字母排序

核心用 `String.prototype.localeCompare()` 方法，支持区分/不区分大小写、带数字字符串的自然排序，比直接字符串比较更通用。

### 3.1 基础场景（纯大小写一致）

仅适用于无混合大小写、无数字的极简场景：

```JavaScript

const simpleLetters = ['b', 'a', 'c', 'd'];
const simpleAsc = [...simpleLetters].sort(); // 升序
const simpleDesc = [...simpleLetters].sort().reverse(); // 降序
```

### 3.2 区分/不区分大小写排序

```JavaScript

const letters = ['b', 'A', 'c', 'D', 'a'];

// 1. 区分大小写（大写 Unicode 更小，排在前面）
const caseSensitiveAsc = [...letters].sort((a, b) => a.localeCompare(b));
console.log(caseSensitiveAsc); // ["A", "D", "a", "b", "c"]

// 2. 不区分大小写（业务常用）：sensitivity: 'base'
const caseInsensitiveAsc = [...letters].sort((a, b) => 
  a.localeCompare(b, undefined, { sensitivity: 'base' })
);
console.log(caseInsensitiveAsc); // ["A", "a", "b", "c", "D"]

// 3. 不区分大小写降序：交换 localeCompare 的 a、b 参数
const caseInsensitiveDesc = [...letters].sort((a, b) => 
  b.localeCompare(a, undefined, { sensitivity: 'base' })
);
console.log(caseInsensitiveDesc); // ["D", "c", "b", "A", "a"]
```

### 3.3 带数字字符串的自然排序

业务中常见商品编号、版本号等场景，需开启 `numeric: true` 实现数字按大小排序：

```JavaScript

const numStrArr = ["item10", "item2", "item1", "item20"];

// 默认排序（非自然，按字符比较）
const defaultNumSort = [...numStrArr].sort((a, b) => a.localeCompare(b));
console.log(defaultNumSort); // ["item1", "item10", "item2", "item20"]

// 自然排序（数字按大小）：numeric: true
const naturalNumSort = [...numStrArr].sort((a, b) => 
  a.localeCompare(b, 'en-US', { numeric: true })
);
console.log(naturalNumSort); // ["item1", "item2", "item10", "item20"]
```

## 四、大厂业务级排序最佳实践

大厂代码追求**可读性、鲁棒性、兼容性、可维护性**，核心原则：

1. 显式传入比较函数，不依赖 `sort()` 默认行为；

2. 先拷贝数组，避免原地修改原数据；

3. 处理异常值（`null`/`undefined`），避免报错；

4. 排序逻辑封装为复用函数；

5. 配置明确的本地化参数（`sensitivity`/`numeric`）。

### 4.1 通用字符串数组排序函数

```JavaScript

/**
 * 字母/拼音排序（支持中英文、异常值处理）
 * @param {string[]} arr - 待排序数组
 * @param {string} locale - 语言标识（zh-CN：拼音；en-US：字母）
 * @param {boolean} isAsc - 是否升序（默认 true）
 * @returns {string[]} 排序后的新数组
 */
function sortByLocale(arr, locale = 'en-US', isAsc = true) {
  // 1. 拷贝数组，避免污染原数据
  const copyArr = [...arr];
  
  return copyArr.sort((a, b) => {
    // 2. 异常值兜底：null/undefined 排到最后
    if (a == null) return 1;
    if (b == null) return -1;

    // 3. 核心排序：兼容大小写+数字自然排序
    const compareResult = a.localeCompare(b, locale, {
      sensitivity: 'base', // 忽略大小写、重音
      numeric: true        // 数字自然排序
    });

    // 4. 统一处理升序/降序
    return isAsc ? compareResult : -compareResult;
  });
}

// 示例1：英文字母排序（不区分大小写+数字自然排序）
const businessArr = ["item10", "Apple", null, "banana", "item2"];
console.log(sortByLocale(businessArr)); 
// ["Apple", "banana", "item2", "item10", null]

// 示例2：中文拼音排序
const chineseArr = ["张三", null, "李四", "阿七"];
console.log(sortByLocale(chineseArr, 'zh-CN'));
// ["阿七", "李四", "张三", null]
```

### 4.2 对象数组按字母/拼音字段排序（业务高频）

```JavaScript

/**
 * 对象数组按指定字段排序（字母/拼音）
 * @param {object[]} arr - 对象数组
 * @param {string} key - 排序字段名
 * @param {string} locale - 语言标识
 * @param {boolean} isAsc - 是否升序
 * @returns {object[]} 排序后的新数组
 */
function sortObjByLocale(arr, key, locale = 'en-US', isAsc = true) {
  const copyArr = [...arr];
  
  return copyArr.sort((a, b) => {
    // 字段不存在时兜底为空字符串
    const valA = a[key] || '';
    const valB = b[key] || '';

    // 复用基础排序逻辑
    if (valA == null) return 1;
    if (valB == null) return -1;

    const compareResult = valA.localeCompare(valB, locale, {
      sensitivity: 'base',
      numeric: true
    });

    return isAsc ? compareResult : -compareResult;
  });
}

// 业务示例：商品列表按名称排序
const products = [
  { id: 1, name: "iPhone 15", category: "Electronics" },
  { id: 2, name: "Nike Shoes", category: "Clothes" },
  { id: 3, name: "ipad Pro", category: "Electronics" }
];
// 按商品名称升序（不区分大小写+数字自然排序）
const sortedProducts = sortObjByLocale(products, 'name');
console.log(sortedProducts.map(item => item.name));
// ["ipad Pro", "iPhone 15", "Nike Shoes"]
```

### 4.3 多语言混合排序

```JavaScript

// 中英文混合数组：按拼音（中文）+ 字母（英文）统一排序
const mixArr = ["张三", "Apple", "李四", "banana"];
console.log(sortByLocale(mixArr, 'zh-CN'));
// ["Apple", "banana", "李四", "张三"]
```

## 五、关键配置/逻辑解析

### 5.1 异常值兜底：`if (a == null) return 1; if (b == null) return -1;`

- `a == null`：松散相等，等价于 `a === null || a === undefined`（同时匹配两种无效值）；

- `return 1`：让 `a`（无效值）排在 `b` 后面；`return -1`：让 `b`（无效值）排在 `a` 后面；

- 作用：避免 `null/undefined` 调用 `localeCompare` 报错，且让无效值统一排到数组末尾，提升用户体验。

### 5.2 `sensitivity: 'base'`

`localeCompare` 的敏感度配置，控制字符串比较的严格程度：

|配置值|比较规则|适用场景|
|---|---|---|
|`base`|忽略大小写、重音（只比基础字符）|业务级字母/拼音排序|
|`case`|区分大小写，忽略重音|严格区分大小写的场景|
|`variant`|区分大小写、重音（默认）|极少用（体验差）|
### 5.3 `numeric: true`

开启**数字自然排序**，解决字符串中数字按“字符编码”排序的反直觉问题（如 `item10` 不再排在 `item2` 前面），适配商品编号、版本号等高频业务场景。

## 六、常见坑点与避坑指南

1. **直接用 ** **`sort()`** ** + ** **`reverse()`** ** 实现降序**：`reverse()` 仅反转数组顺序，若原排序逻辑有问题（如大小写混乱），反转后结果仍错误；

2. **忽略 ** **`sort()`** ** 原地排序**：直接调用 `arr.sort()` 会修改原数组，必须先拷贝（`[...arr]`/`arr.slice()`）；

3. **未处理 ** **`null/undefined`**：会导致 `localeCompare` 报错，或无效值排在数组开头；

4. **依赖 ** **`sort()`** ** 默认排序处理数字**：数字数组必须用 `(a,b) => a - b`（升序）/ `(a,b) => b - a`（降序）。

## 七、总结

1. **核心排序 API**：中文拼音用 `Intl.Collator('zh-CN').compare`，英文字母用 `localeCompare` + 明确配置；

2. **升序/降序逻辑**：升序直接用比较结果，降序交换 `a`、`b` 参数（或取反比较结果）；

3. **大厂最佳实践**：封装复用函数 + 拷贝数组 + 异常值兜底 + 明确本地化配置；

4. **关键配置**：`sensitivity: 'base'`（忽略大小写）、`numeric: true`（数字自然排序）是业务排序的标配。

遵循以上规则，可实现稳定、易维护、符合用户预期的 JS 排序逻辑，适配绝大多数前端业务场景。
> （注：文档部分内容可能由 AI 生成）