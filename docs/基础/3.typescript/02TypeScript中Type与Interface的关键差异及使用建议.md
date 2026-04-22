# TypeScript 中 Type 与 Interface 的关键差异及使用建议

## 一、先讲「联系」：二者的共同点

`type` 和 `interface` 大部分场景下可以互换，核心都是**描述数据的形状（对象、函数、数组等）**，且都支持「扩展/继承」和「类型检查」。

### 1. 都可以描述对象类型

```TypeScript

// interface 描述对象
interface User {
  name: string;
  age: number;
}

// type 描述对象（效果完全一致）
type User = {
  name: string;
  age: number;
};

// 都能用于变量类型注解
const user: User = { name: "张三", age: 20 };
```

### 2. 都可以描述函数类型

```TypeScript

// interface 描述函数
interface Add {
  (a: number, b: number): number;
}

// type 描述函数（更简洁）
type Add = (a: number, b: number) => number;

// 都能赋值
const add: Add = (a, b) => a + b;
```

### 3. 都支持扩展/继承

二者都能实现“基于已有类型创建新类型”，只是语法不同（后面会讲）。

---

## 二、核心「区别」：8个关键差异（必记）

|特性|`interface`（接口）|`type`（类型别名）|
|---|---|---|
|**定义范围**|只能描述「对象/函数」的形状|可描述任意类型（基本类型、联合、交叉、元组等）|
|**扩展方式**|用 `extends` 继承，或重复声明自动合并|用 `&`（交叉类型）扩展，不支持重复声明|
|**重复声明**|支持（自动合并，适合扩展第三方类型）|不支持（重复声明会报错）|
|**元组/联合类型**|不支持直接定义|原生支持（`type Tuple = [number, string]`）|
|**映射类型**|支持，但语法繁琐|天生适配（`type Readonly<T> = { readonly [K in keyof T]: T[K] }`）|
|**计算属性**|不支持|支持（`type Obj = { [key: string]: number }`）|
|**泛型支持**|支持（`interface List<T> { data: T[] }`）|支持（`type List<T> = { data: T[] }`）|
|**使用场景**|描述对象结构、API 接口、类的实现|描述基本类型、联合/交叉类型、元组、复杂类型组合|
### 逐点拆解关键差异：

#### 1. 定义范围：`type` 能做的更多

`interface` 只能用于描述「对象/函数」的结构，而 `type` 可以描述**任意类型**：

```TypeScript

// ✅ type 支持基本类型别名
type Str = string;
type Num = number | string; // 联合类型
type Tuple = [number, string]; // 元组类型
type Obj = { name: string } & { age: number }; // 交叉类型

// ❌ interface 不支持上述场景
interface Str { /* 报错：接口只能描述对象/函数 */ }
```

#### 2. 扩展方式：语法不同

- `interface` 用 `extends` 继承：

    ```TypeScript
    
    interface Person {
      name: string;
    }
    // 继承 Person
    interface Student extends Person {
      studentId: number;
    }
    ```

- `type` 用 `&` 交叉扩展：

    ```TypeScript
    
    type Person = { name: string };
    // 交叉扩展
    type Student = Person & { studentId: number };
    ```

#### 3. 重复声明：`interface` 支持自动合并（重要）

这是 `interface` 独有的优势，适合扩展第三方库的类型（比如给 `window` 加自定义属性）：

```TypeScript

// ✅ interface 重复声明会自动合并
interface User {
  name: string;
}
interface User {
  age: number;
}
// 最终 User = { name: string; age: number }

// ❌ type 重复声明报错
type User = { name: string };
type User = { age: number }; // 报错：标识符“User”重复
```

#### 4. 元组/联合类型：`type` 是唯一选择

```TypeScript

// ✅ type 定义元组
type Point = [number, number];
const p: Point = [10, 20];

// ✅ type 定义联合类型
type Status = "success" | "error" | "loading";

// ❌ interface 无法直接定义上述类型
```

---

## 三、实战「使用建议」：什么时候用哪个？

### 优先用 `interface` 的场景：

1. 描述**对象/API 接口结构**（比如后端返回的接口、组件的 Props）；

2. 需要**扩展/合并类型**（比如给第三方库的类型加属性）；

3. 定义**类的实现接口**（`class` 可以 `implements` 接口）：

    ```TypeScript
    
    interface Printable {
      print(): void;
    }
    class Document implements Printable {
      print() { console.log("打印文档"); }
    }
    ```

### 优先用 `type` 的场景：

1. 描述**基本类型、联合类型、元组、交叉类型**；

2. 需要**计算属性、映射类型**（比如工具类型 `Partial<T>`、`Readonly<T>`）；

3. 定义**复杂的类型组合**（比如 `type User = Person & Address & Contact`）；

4. 避免类型被意外合并（`type` 重复声明报错，更严格）。

---

## 四、总结（关键点回顾）

1. **联系**：都能描述对象/函数类型，都支持泛型和扩展，核心功能重叠；

2. **核心区别**：

    - `type` 适用范围更广（支持基本类型、联合/元组等），不支持重复声明；

    - `interface` 仅描述对象/函数，支持自动合并，适合扩展第三方类型；

3. **使用原则**：

    - 描述“对象结构”用 `interface`，描述“复杂类型组合”用 `type`；

    - 不确定时，优先用 `interface`（更符合 TS 面向对象的设计思想），需要时再换 `type`。

如果需要，我可以帮你整理一份「type/interface 实战对比代码模板」，包含所有核心场景的可运行代码，你直接复制就能验证。需要吗？
> （注：文档部分内容可能由 AI 生成）