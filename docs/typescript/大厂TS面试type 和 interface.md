# 大厂TS面试：type 和 interface 满分回答（话术+核心代码）

这是**TS 基础必考高频题**，回答核心逻辑：**先总述定位 → 讲相同点 → 讲5大核心区别（带代码）→ 讲业务使用场景**，逻辑清晰、有代码示例，面试官直接判定你基础扎实。

## 一、面试口语话术（直接背，流畅自然）

面试官您好，TS 中的 `type`（类型别名）和 `interface`（接口）都是定义类型的核心语法，**基础场景下大部分可以互换**，但核心区别是**设计初衷和能力边界**：

1. `interface` 是为**面向对象设计**的关键字，专门用来**定义对象/类的结构契约**，只能描述对象/函数类型；

2. `type` 是**类型别名**，本质是给**任意 TS 类型**起别名，灵活性更高，能描述所有 TS 类型。

下面我结合代码，说下它们的相同点、核心区别和实际使用场景。

---

## 二、相同点（基础用法互通）

两者都能定义**对象/函数类型**、支持继承、被类实现，基础场景无差异。

### 核心代码示例

```TypeScript

// 1. 定义对象类型
interface IPerson { name: string; age: number }
type TPerson = { name: string; age: number }

// 2. 定义函数类型
interface IFn { (a: number, b: number): number }
type TFn = (a: number, b: number) => number

// 3. 继承/组合
interface IStudent extends IPerson { grade: number } // interface 继承
type TStudent = TPerson & { grade: number } // type 交叉类型（等价继承）

// 4. 类实现
class Person implements IPerson { name = "张三"; age = 18 }
```

---

## 三、5大核心区别（面试必考，带代码）

这是区分熟练度的关键，**每个区别配极简代码**：

### 1. 定义范围不同（最核心）

- `type`：可以定义**任意 TS 类型**（基本类型、联合类型、元组、映射类型）；

- `interface`：**只能定义对象/函数类型**，无法定义非对象类型。

```TypeScript

// ✅ type 全能：基本类型、联合类型、元组
type Str = string; // 基本类型别名
type Status = "success" | "error"; // 联合类型
type Data = [string, number]; // 元组类型

// ❌ interface 仅支持对象/函数，以下写法报错
// interface IStatus = "success" | "error";
```

### 2. 声明合并（重名处理）

- `interface`：支持**自动声明合并**（同名接口合并属性）；

- `type`：**不支持**，重名直接报错。

业务场景：扩展第三方库类型、全局类型补充必用！

```TypeScript

// ✅ interface 自动合并
interface User { name: string }
interface User { age: number }
// 最终合并：{ name: string; age: number }
const user: User = { name: "张三", age: 18 };

// ❌ type 重名直接报错
// type TUser = { name: string }
// type TUser = { age: number } // 标识符重复
```

### 3. 继承/组合方式

- `interface`：用 `extends` 继承，**支持多继承**；

- `type`：用**交叉类型 ** **`&`** 组合，无 `extends` 语法。

```TypeScript

// interface 多继承
interface A { a: string }
interface B { b: string }
interface C extends A, B { c: string }

// type 交叉组合
type TC = A & B & { c: string }
```

### 4. 映射类型（高级类型）

- `type`：**原生支持映射类型**（TS 高级类型核心，如 `Partial` 底层实现）；

- `interface`：**不支持**映射类型。

```TypeScript

// ✅ type 映射类型：把对象所有属性变为可选
type Optional<T> = { [P in keyof T]?: T[P] };

// ❌ interface 无法实现映射类型（语法报错）
// interface IOptional<T> { [P in keyof T]?: T[P] }
```

### 5. 类实现（implements）

- 两者都支持类实现，但 `type` 为**联合类型**时，**类无法实现**（无确定结构）；

- `interface` 始终是确定结构，可放心实现。

```TypeScript

type UnionType = { a: number } | { b: string };
// ❌ 类不能实现联合类型的 type
// class Demo implements UnionType {} 

interface SingleType { a: number }
// ✅ 类可以实现 interface
class Demo implements SingleType { a = 1 }
```

---

## 四、业务使用场景（加分项）

实际开发遵循这个规则，代码更规范：

1. **优先用 interface**

    - 定义**对象/类的结构**（面向对象契约）；

    - 需要**声明合并**（扩展第三方库、全局类型）；

    - 定义组件/接口的**入参出参对象**。

2. **优先用 type**

    - 定义**非对象类型**（联合类型、元组、基本类型）；

    - 需要**高级映射类型**（工具类型）；

    - 定义**复杂组合类型**。

---

## 五、一句话总结（收尾）

`interface` 专注**对象结构的契约定义**，支持声明合并、面向对象特性；`type` 是**通用类型别名**，灵活性拉满，能描述所有类型。对象结构用 `interface`，灵活场景用 `type`，两者互补。

---

### 总结

1. **定位**：`interface` = 对象契约，`type` = 通用类型别名；

2. **核心差异**：`type` 支持任意类型、映射类型；`interface` 支持声明合并、面向对象继承；

3. **使用规则**：对象结构用 `interface`，其他场景用 `type`。
> （注：文档部分内容可能由 AI 生成）