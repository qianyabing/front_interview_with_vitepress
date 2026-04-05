# React 组件传值核心逻辑解析

React 组件传值的核心逻辑**不区分类组件和函数组件**，都是基于 `props` 实现单向数据流，不同组件关系（父子、兄弟、跨层级）对应不同传值方案。类组件和函数组件的差异仅在于**语法写法**，以下按**传值场景**分类总结，并明确两类组件的写法区别。

### 一、 父子组件传值（最常用，面试高频）

父子组件传值是 React 最基础的传值方式，核心是 **父传子用 props，子传父用回调函数**。

#### 1. 父组件 → 子组件（props 传递）

**核心逻辑**：父组件通过属性传递数据，子组件通过 `props` 接收数据。

|组件类型|核心语法|完整示例|
|---|---|---|
|**类组件**|1. 父组件：`<Child 数据={值} 方法={this.方法} />` <br> 2. 子组件：`this.props.数据`|父组件：<br>```jsx|
|import React, { Component } from 'react';|||
|import Child from './Child';|||
class Parent extends Component {

state = { name: "React 父组件" };

render() {

return <Child parentName={this.state.name} />;

}

}

`<br> 子组件：<br>`jsx

import React, { Component } from 'react';

class Child extends Component {

render() {

// 通过 this.props 接收

return <div>{this.props.parentName}</div>;

}

}

```Plain Text

| **函数组件** | 1. 父组件：`<Child 数据={值} 方法={方法} />` <br> 2. 子组件：直接解构 props 或 `props.数据` | 父组件：<br>```jsx
import React, { useState } from 'react';
import Child from './Child';

const Parent = () => {
  const [name] = useState("React 父组件");
  return <Child parentName={name} />;
};
``` <br> 子组件：<br>```jsx
// 方式1：直接解构
const Child = ({ parentName }) => {
  return <div>{parentName}</div>;
};

// 方式2：props 参数
const Child = (props) => {
  return <div>{props.parentName}</div>;
};
``` |

#### 2. 子组件 → 父组件（回调函数传值）
**核心逻辑**：父组件传递一个回调函数给子组件，子组件调用该函数并传入数据，实现反向传值。
| 组件类型 | 核心语法 | 完整示例 |
|----------|----------|----------|
| **类组件** | 1. 父组件：传递绑定好 this 的回调函数 <br> 2. 子组件：`this.props.回调函数(数据)` | 父组件：<br>```jsx
class Parent extends Component {
  state = { childMsg: "" };
  // 定义回调函数，接收子组件数据
  getChildData = (msg) => {
    this.setState({ childMsg: msg });
  };
  render() {
    return (
      <div>
        <Child sendData={this.getChildData} />
        <p>子组件消息：{this.state.childMsg}</p>
      </div>
    );
  }
}
``` <br> 子组件：<br>```jsx
class Child extends Component {
  handleClick = () => {
    // 调用父组件传递的回调函数
    this.props.sendData("我是子组件的消息");
  };
  render() {
    return <button onClick={this.handleClick}>发送消息</button>;
  }
}
``` |
| **函数组件** | 1. 父组件：传递普通函数 <br> 2. 子组件：`props.回调函数(数据)` | 父组件：<br>```jsx
const Parent = () => {
  const [childMsg, setChildMsg] = useState("");
  const getChildData = (msg) => {
    setChildMsg(msg);
  };
  return (
    <div>
      <Child sendData={getChildData} />
      <p>子组件消息：{childMsg}</p>
    </div>
  );
};
``` <br> 子组件：<br>```jsx
const Child = ({ sendData }) => {
  return (
    <button onClick={() => sendData("我是子组件的消息")}>
      发送消息
    </button>
  );
};
``` |

### 二、 兄弟组件传值（3种方案）
兄弟组件无直接关联，需借助 **共同父组件** 或 **全局状态管理** 传值，以下是 3 种常用方案。

| 方案 | 核心逻辑 | 适用场景 | 类组件/函数组件写法 |
|------|----------|----------|---------------------|
| **共同父组件中转**（最基础） | 1. 父组件作为中间层，提供状态和修改状态的方法 <br> 2. 兄弟 A 通过回调函数将数据传给父组件 <br> 3. 父组件通过 props 将数据传给兄弟 B | 简单场景、兄弟组件层级浅 | 类组件：用 `state` 存储数据，`this.setState` 修改 <br> 函数组件：用 `useState` 存储数据 |
| **Context API**（React 内置） | 1. 创建 Context：`createContext()` <br> 2. 父组件用 `Provider` 提供数据 <br> 3. 子组件用 `useContext`（函数组件）/ `contextType`（类组件）消费数据 | 跨层级传值、中等复杂度场景 | 类组件：<br> `static contextType = MyContext;` <br> `this.context.数据` <br> 函数组件：<br> `const 数据 = useContext(MyContext);` |
| **全局状态管理**（Redux/Zustand） | 1. 全局 store 存储数据 <br> 2. 组件通过 dispatch 修改数据 <br> 3. 组件通过 selector 订阅数据 | 复杂场景、多组件共享数据 | 类组件：`connect` 高阶组件连接 Redux <br> 函数组件：`useSelector`/`useDispatch`（Redux Toolkit） |

#### Context API 示例（函数组件）
```jsx
// 1. 创建 Context
import React, { createContext, useContext, useState } from 'react';
const BrotherContext = createContext();

// 2. 父组件（Provider）
const Parent = () => {
  const [msg, setMsg] = useState("");
  return (
    <BrotherContext.Provider value={{ msg, setMsg }}>
      <BrotherA />
      <BrotherB />
    </BrotherContext.Provider>
  );
};

// 3. 兄弟 A（修改数据）
const BrotherA = () => {
  const { setMsg } = useContext(BrotherContext);
  return <button onClick={() => setMsg("来自A的消息")}>发送消息</button>;
};

// 4. 兄弟 B（消费数据）
const BrotherB = () => {
  const { msg } = useContext(BrotherContext);
  return <div>兄弟A的消息：{msg}</div>;
};
```

### 三、 跨层级组件传值（深层嵌套）

跨层级组件传值（如爷孙组件）不推荐多层 props 透传（**props drilling** 问题），优先用以下 2 种方案。

|方案|核心优势|类组件/函数组件支持|
|---|---|---|
|**Context API**|React 内置、无需第三方库、轻量|全支持|
|**全局状态管理**|支持复杂逻辑、中间件、数据持久化|全支持|
### 四、 类组件 vs 函数组件传值核心差异

|维度|类组件|函数组件|
|---|---|---|
|**props 接收方式**|通过 `this.props` 访问|直接通过参数或解构访问|
|**状态管理**|用 `this.state` + `this.setState`|用 `useState`/`useReducer` Hook|
|**Context 消费**|方式1：`static contextType = MyContext`（只能订阅一个 Context） <br> 方式2：`MyContext.Consumer` 嵌套|用 `useContext` Hook，支持多个 Context，写法更简洁|
|**全局状态（Redux）**|需用 `connect` 高阶组件包装，映射 state 和 dispatch|用 `useSelector`/`useDispatch` Hook，无需包装组件|
|**代码简洁性**|需绑定 this、代码冗余|无 this 问题、代码更简洁、逻辑聚合|
### 总结

1. **核心原则**：React 是**单向数据流**，数据只能从父组件流向子组件，子组件不能直接修改 props，需通过回调函数通知父组件修改。

2. **场景选择**：

    - 父子传值 → **props + 回调函数**

    - 兄弟/跨层级传值 → 简单场景用 **Context API**，复杂场景用 **Redux/Zustand**

3. **面试高频**：

    - props 单向数据流的理解

    - 子组件如何向父组件传值

    - Context API 的使用场景和优缺点

    - Redux 的核心原理（store、action、reducer）

是否需要我补充**Redux Toolkit 实现全局状态管理**的简洁示例？
> （注：文档部分内容可能由 AI 生成）