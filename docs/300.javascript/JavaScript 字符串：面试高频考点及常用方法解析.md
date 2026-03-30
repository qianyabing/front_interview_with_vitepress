# JavaScript 字符串：面试高频考点及常用方法解析

你希望我接着数组的内容，总结前端面试中 JavaScript 字符串的常用及较常用属性和方法，并搭配简洁示例解释，这也是 JS 基础面试的高频考点。

### 一、字符串核心属性

|属性|说明|示例|
|---|---|---|
|`length`|获取字符串长度（最常用）|`const str = 'hello'; console.log(str.length); // 5`|
|`constructor`|返回创建字符串的构造函数（了解即可）|`console.log(str.constructor === String); // true`|
### 二、字符串常用方法（面试高频）

#### 1. 查找/判断类（不改变原字符串，字符串是不可变类型）

|方法|说明|示例|
|---|---|---|
|`indexOf(searchVal, start)`|查找子串首次出现的索引，找不到返回-1|`'hello'.indexOf('e'); // 1` <br> `'hello'.indexOf('x'); // -1`|
|`lastIndexOf(searchVal)`|查找子串最后出现的索引，找不到返回-1|`'hello world'.lastIndexOf('l'); // 9`|
|`includes(searchVal)`|判断是否包含子串，返回布尔值|`'hello'.includes('ll'); // true`|
|`startsWith(searchVal)`|判断是否以指定子串开头|`'hello'.startsWith('he'); // true`|
|`endsWith(searchVal)`|判断是否以指定子串结尾|`'hello'.endsWith('lo'); // true`|
|`charAt(index)`|获取指定索引的字符|`'hello'.charAt(0); // 'h'`|
|`charCodeAt(index)`|获取指定索引字符的 Unicode 编码|`'hello'.charCodeAt(0); // 104`|
#### 2. 截取/分割类（返回新字符串/数组）

|方法|说明|示例|
|---|---|---|
|`slice(start, end)`|截取子串（含start，不含end），支持负数索引|`'hello'.slice(1,3); // 'el'` <br> `'hello'.slice(-2); // 'lo'`|
|`substring(start, end)`|截取子串（与slice类似，但不支持负数，start>end会自动交换）|`'hello'.substring(3,1); // 'el'`|
|`substr(start, length)`|截取子串（start为起始索引，length为长度）|`'hello'.substr(1,2); // 'el'`|
|`split(separator, limit)`|按分隔符分割为数组，limit限制返回长度|`'a-b-c'.split('-'); // ['a','b','c']` <br> `'a-b-c'.split('-',2); // ['a','b']`|
#### 3. 转换/拼接类

|方法|说明|示例|
|---|---|---|
|`concat(str1, str2...)`|拼接字符串（日常更常用`+`或模板字符串）|`'hello'.concat(' ', 'world'); // 'hello world'`|
|`toLowerCase()`|转为小写|`'HELLO'.toLowerCase(); // 'hello'`|
|`toUpperCase()`|转为大写|`'hello'.toUpperCase(); // 'HELLO'`|
|`trim()`|去除首尾空格（面试高频）|`'  hello  '.trim(); // 'hello'`|
|`trimStart()`/`trimLeft()`|去除开头空格|`'  hello'.trimStart(); // 'hello'`|
|`trimEnd()`/`trimRight()`|去除结尾空格|`'hello  '.trimEnd(); // 'hello'`|
#### 4. 替换/匹配类

|方法|说明|示例|
|---|---|---|
|`replace(searchVal, replaceVal)`|替换子串（默认只替换第一个，正则加`g`全局替换）|`'hello world'.replace('world', 'js'); // 'hello js'` <br> `'aabbaa'.replace(/a/g, 'x'); // 'xxbbxx'`|
|`match(regexp)`|匹配正则，返回匹配结果数组/`null`|`'123abc456'.match(/\d+/g); // ['123','456']`|
|`search(regexp)`|查找正则匹配的首个索引，找不到返回-1|`'hello123'.search(/\d/); // 5`|
#### 5. 较常用方法（面试次高频）

|方法|说明|示例|
|---|---|---|
|`repeat(count)`|重复字符串指定次数|`'hi'.repeat(3); // 'hihihi'`|
|`padStart(length, padStr)`|开头补全字符串至指定长度|`'123'.padStart(5, '0'); // '00123'`（补零常用）|
|`padEnd(length, padStr)`|结尾补全字符串至指定长度|`'123'.padEnd(5, '0'); // '12300'`|
|`normalize()`|统一字符串的 Unicode 编码形式（了解即可）|`'\u00E9'.normalize() === 'é'; // true`|
### 总结

1. **核心特性**：字符串是**不可变类型**，所有方法都不会修改原字符串，而是返回新字符串，这是面试常考的基础点。

2. **高频重点**：`indexOf`/`includes`（查找）、`slice`/`split`（截取分割）、`trim`（去空格）、`replace`（替换，结合正则）是面试必问，需熟练掌握。

3. **易混点**：`slice`/`substring`/`substr` 的参数区别；`trim` 系列仅去除空格，不会处理中间空格；`replace` 不加正则`g`只替换首个匹配项。
> （注：文档部分内容可能由 AI 生成）