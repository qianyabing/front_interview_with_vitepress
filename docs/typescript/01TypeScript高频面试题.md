# TypeScript

## 一、基础类型篇

### 1. any / unknown / never / void 四者区别？

**回答**

- `any`：放弃 TS 类型检查，任意赋值、调用，**不安全**；

- `unknown`：安全版 any，必须先做类型判断才能使用；

- `void`：表示没有返回值，多用于函数无返回；

- `never`：永远不会执行到终点（死循环、抛错），是所有类型的子类型。

**代码**

```TypeScript

// any：随便用，不安全
let a: any = 1;
a = 'str';
a.toUpperCase(); // 不报错

// unknown：必须判断类型
let b: unknown = 'hello';
if (typeof b === 'string') {
  b.toUpperCase();
}

// void 函数
function fn(): void {}

// never：抛错/死循环
function loop(): never {
  while (true) {}
}
```

---

### 2. 联合类型 | 和交叉类型 & 区别与常见坑？

**回答**

- 联合 `A|B`：满足其一即可；

- 交叉 `A&B`：必须同时满足所有类型；

- 坑：基本类型交叉会变成 `never`。

**代码**

```TypeScript

type A = { a: number }
type B = { b: string }

type Union = A | B
type Cross = A & B // {a:number, b:string}

// 坑：基本类型交叉 = never
type NeverType = string & number
```

---

### 3. 类型断言 as / 非空断言 ! / 可选链 ? 用法？

**回答**

- `as`：手动指定类型，绕过编译器推断；

- `!`：断言值一定不为 `null/undefined`；

- `?.`：安全访问，避免报错。

**代码**

```TypeScript

const el = document.getElementById('app')!
const text = (el as HTMLElement).innerText

const user?: { name?: string }
const name = user?.name
```

---

## 二、函数与重载

### 4. TS 函数重载是什么？有什么用？

**回答**

同一个函数名，多个参数/返回值类型声明，实现更精准类型提示，多用于工具函数。

**代码**

```TypeScript

function getValue(x: string): string
function getValue(x: number): number
function getValue(x: any) {
  return x
}

getValue(123) // 推断 number
getValue('str') // 推断 string
```

---

## 三、泛型（大厂必考核心）

### 5. 泛型是什么？为什么要用？

**回答**

泛型是**类型参数化**，让函数/类/接口支持多种类型，同时保留类型安全，避免写死 any。

**代码**

```TypeScript

function identity<T>(arg: T): T {
  return arg
}

const res = identity<number>(123) // res: number
```

---

### 6. 泛型约束 T extends xxx 作用？

**回答**

限制泛型必须具备某些属性/结构，避免非法调用。

**代码**

```TypeScript

interface Length {
  length: number
}

function logLength<T extends Length>(arg: T) {
  console.log(arg.length)
}

logLength('str') // ok
logLength(123) // 报错
```

### 19. 泛型是不是变量/函数后加<>写类型？本质是“不确定的类型”吗？

**回答**

面试口语话术（精准回应疑问）：面试官您好，您说的“变量/函数后加一对<>里面写类型”，是泛型的**基础写法**，但泛型本质**不是“不确定的类型”**，而是“**类型参数化**”——简单说，就是把“具体类型”当成“参数”传递，提前定义好类型的“模板”，使用时再确定具体类型，全程类型可控、不模糊。

- 泛型的<>里写的是「类型变量」（比如T、U），不是具体类型，相当于“类型占位符”；

- 不是“不确定类型”：使用泛型时，必须明确具体类型（要么手动指定，要么TS自动推断），只是这个类型可以灵活替换，避免写死；

- 核心目的：让同一个函数/类/接口，能复用给多种类型，同时保留TS类型安全（比any靠谱）。

**代码**

```TypeScript
// 1. 函数泛型（最常用，对应你说的“函数后加<>”）
// <T>：类型变量（占位符），使用时传递具体类型
function getValue<T>(arg: T): T {
  return arg
}
// 使用时确定类型（两种方式，都能明确类型，不是“不确定”）
const num = getValue<number>(123) // 手动指定T=number
const str = getValue('hello') // TS自动推断T=string

// 2. 类泛型（变量/类后加<>）
class Container<T> {
  data: T // 这里的T就是上面<>里的类型变量
  constructor(data: T) {
    this.data = data
  }
}
const numContainer = new Container<number>(100) // T=number
const strContainer = new Container('test') // 自动推断T=string
```

---

### 7. 内置工具类型 Partial / Required / Readonly / Pick / Omit 原理？

**回答**

都是基于**映射类型 + 索引类型**实现，面试可以手写 1~2 个证明理解。

**代码**

```TypeScript

// 手写 Partial
type MyPartial<T> = { [P in keyof T]?: T[P] }

// 手写 Pick
type MyPick<T, K extends keyof T> = { [P in K]: T[P] }

// 使用
type User = { name:string; age:number }
type PartialUser = Partial<User>
type PickUser = Pick<User, 'name'>
```

---

### 8. Exclude / Extract / ReturnType 作用？

**回答**

- `Exclude<A,B>`：从A中剔除B；

- `Extract<A,B>`：从A中提取B；

- `ReturnType<T>`：获取函数返回值类型。

**代码**

```TypeScript

type T1 = 'a'|'b'|'c'
type T2 = 'a'|'d'

type E1 = Exclude<T1, T2> // 'b'|'c'
type E2 = Extract<T1, T2> // 'a'

type Fn = () => string
type R = ReturnType<Fn> // string
```

---

## 四、高级类型

### 9. keyof 与索引访问 T[K] 用法？

**回答**

- `keyof`：获取对象类型所有键，返回联合类型；

- `T[K]`：获取对象某个值类型。

**代码**

```TypeScript

type User = { name:string; age:number }
type Keys = keyof User // 'name'|'age'
type AgeType = User['age'] // number
```

---

### 10. 条件类型 T extends A ? B : C 用法？

**回答**

TS 版三元表达式，用于动态生成类型，是高级类型基础。

**代码**

```TypeScript

type IsString<T> = T extends string ? true : false
type A = IsString<string> // true
type B = IsString<number> // false
```

---

### 11. infer 关键字作用？

**回答**

在条件类型中**提取类型变量**，常用于提取函数参数、返回值、数组元素。

**代码**

```TypeScript

// 提取函数返回值
type MyReturnType<T> = T extends (...args:any[]) => infer R ? R : never

// 提取数组元素
type Element<T> = T extends (infer U)[] ? U : never
```

---

## 五、类与面向对象

### 12. public / private / protected / readonly 区别？

**回答**

- `public`：默认，随处可访问；

- `private`：仅当前类内部可访问；

- `protected`：当前类 + 子类可访问；

- `readonly`：只读，只能赋值一次。

**代码**

```TypeScript

class Person {
  public name: string
  private age: number
  protected gender: string
  readonly id: number
}
```

---

### 13. abstract 抽象类与抽象方法？

**回答**

抽象类不能实例化，只能被继承；抽象方法无实现，子类必须实现。

**代码**

```TypeScript

abstract class Animal {
  abstract say(): void
}

class Dog extends Animal {
  say() { console.log('汪汪') }
}
```

---

## 六、声明文件 & 工程化

### 14. 什么是 .d.ts 声明文件？何时手写？

**回答**

只描述类型，不生成 JS，用于给无 TS 的库补充类型。

当使用第三方库没有 `@types/xxx` 时，需要手写 `declare`。

**代码**

```TypeScript

// global.d.ts
declare module '*.png' {
  const src: string
  export default src
}

declare var $: any
```

---

### 15. TS 泛型擦除是什么？有什么影响？

**回答**

TS 编译为 JS 后泛型会消失，**运行时不存在泛型信息**，不能直接用 `T` 做类型判断。

```TypeScript

function fn<T>() {
  // console.log(T) // 报错
}
```

---

## 七、React + TS 实战题

### 16. React 中 FC、Props、事件类型怎么写？

**回答**

使用 `React.FC`、`React.PropsWithChildren`、内置事件类型。

**代码**

```TypeScript

import React, { ChangeEvent } from 'react'

type Props = {
  title: string
}

const Comp: React.FC<Props> = ({ title, children }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {}
  return <input onChange={handleChange} />
}
```

---

## 八、高频综合题

### 17. type 和 interface 到底优先用哪个？

**回答**

- 定义**对象/类契约、需要声明合并** → 用 `interface`；

- 定义**联合/元组/映射/高级类型** → 用 `type`；

- 业务组件 Props 推荐 `interface`，工具类型用 `type`。

---

### 18. any 为什么不推荐用？如何替代？

**回答**

any 破坏类型安全，失去 TS 意义。

替代方案：`unknown` + 类型守卫、泛型、联合类型。

---

如果你需要，我可以把这份文档直接导出成**Markdown 文件内容**，或者整理成**一页纸面试背诵版（极简口诀）**，方便你直接背。
> （注：文档部分内容可能由 AI 生成）