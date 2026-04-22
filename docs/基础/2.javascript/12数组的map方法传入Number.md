# 数组的map方法传入Number

你想知道数组的`map`方法传入`Number`是不是能把每一项转为数值型，以及这是什么写法、有没有类似的用法，对吧？

答案是：**是的**，`arr.map(Number)` 确实能把数组每一项转为数值型，这是 JS 中一种“利用内置函数/构造函数作为`map`回调”的简洁写法，核心是利用`map`的传参规则和内置函数的转换特性。

### 一、先搞懂这个写法的底层原理

#### 1. `map`方法的核心规则

`map(callback)` 接收一个**回调函数**作为参数，遍历数组时会给这个回调传 3 个参数：

- `currentValue`：当前遍历的元素（必传）

- `index`：当前元素的索引（可选）

- `array`：原数组（可选）

最终`map`会把回调的**返回值**收集成新数组返回。

#### 2. `Number`在这里的角色

`Number`本身是 JS 的内置构造函数，但当你**直接调用** **`Number(xxx)`**（而非`new Number(xxx)`）时，它会执行“值转换逻辑”——接收一个参数，返回其对应的数值型结果（无法转换则返回`NaN`）。

#### 3. 等价关系（关键）

```JavaScript

// 简洁写法：传入Number构造函数
arr.map(Number)

// 等价于手动写箭头函数（底层执行逻辑完全一致）
arr.map((item, index, array) => Number(item))
```

本质是`map`遍历数组时，自动把当前元素`item`传给`Number`函数，用转换后的结果作为新数组的元素。

### 二、示例：直观看效果

```JavaScript

const mixedArr = ['123', '45.6', '78a', '', null, undefined, true];
const numArr = mixedArr.map(Number);

console.log(numArr); 
// 输出：[123, 45.6, NaN, 0, 0, NaN, 1]
// 对应规则：
// '123'→123（正常转数字）、'45.6'→45.6、'78a'→NaN（含非数字字符）
// ''→0、null→0、undefined→NaN、true→1
```

### 三、这个写法的“坑点”：parseInt 特例

如果把`Number`换成`parseInt`，容易踩坑——因为`parseInt`本身接收**两个参数**（要转换的字符串、进制），而`map`会把`index`（索引）作为第二个参数传给`parseInt`，导致非预期结果：

```JavaScript

const arr = ['10', '10', '10'];
// 错误：parseInt('10', 0)→10，parseInt('10', 1)→NaN，parseInt('10', 2)→2
console.log(arr.map(parseInt)); // [10, NaN, 2]

// 正确：手动封装，只传当前元素给parseInt
console.log(arr.map(item => parseInt(item))); // [10, 10, 10]
```

### 四、类似的简洁写法（常用内置函数）

除了`Number`，还有很多内置函数可以这样用，核心是“该函数接收单个参数，返回转换后的值”：

|传入的函数|作用|示例代码|示例输出|
|---|---|---|---|
|`String`|转为字符串|`[123, true, null].map(String)`|`["123", "true", "null"]`|
|`Boolean`|转为布尔值|`[0, 1, '', 'a', null].map(Boolean)`|`[false, true, false, true, false]`|
|`parseFloat`|转为浮点数（无进制坑）|`['12.34', '56.78a'].map(parseFloat)`|`[12.34, 56.78]`|
|`Object`|转为包装对象|`[1, 'a', true].map(Object)`|`[Number {1}, String {'a'}, Boolean {true}]`|
### 五、什么时候用这种写法？

- ✅ **适合场景**：简单的类型转换（数字/字符串/布尔值），追求代码简洁、可读性高；

- ❌ **不适合场景**：

    1. 复杂转换逻辑（比如需要判断、处理特殊值）；

    2. 回调函数需要多个参数（如`parseInt`）；

    3. 需要自定义转换规则（比如`'78a'`想转为78而非NaN）。

### 总结

1. `arr.map(Number)` 是简洁写法，等价于`arr.map(item => Number(item))`，核心是利用`map`自动传参+`Number`的转换功能；

2. 类似的还有`map(String)`/`map(Boolean)`等，适合简单类型转换；

3. 规避`parseInt`的坑：直接传`parseInt`会接收索引作为进制参数，建议手动封装箭头函数；

4. 复杂逻辑仍需手写回调函数，这种简洁写法只适用于单参数的简单转换。
> （注：文档部分内容可能由 AI 生成）