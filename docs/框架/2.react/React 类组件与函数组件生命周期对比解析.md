# React 类组件与函数组件生命周期对比解析

### 一、React 类组件生命周期（React 16.8 前主流，面试仍高频）

React 类组件生命周期分为 **3 个核心阶段**：挂载（Mount）、更新（Update）、卸载（Unmount），React 16.3+ 对部分钩子做了调整（废弃不安全的钩子），以下为最新规范的生命周期。

#### 1. 生命周期阶段 & 钩子函数（执行顺序）

|阶段|钩子函数|执行时机|核心用途|注意点|
|---|---|---|---|---|
|**挂载阶段**（组件首次渲染）|`constructor()`|组件实例创建时（最先执行）|初始化 state、绑定事件 this|避免调用 setState（无意义）|
||`static getDerivedStateFromProps(props, state)`|挂载/更新前（每次渲染前）|从 props 派生 state（极少用）|静态方法，无 this，返回新 state 或 null|
||`render()`|渲染 UI（核心）|返回 JSX 描述视图|纯函数，不能调用 setState、不能有副作用|
||`componentDidMount()`|组件挂载完成（DOM 渲染后）|操作 DOM、请求接口、初始化第三方插件（如 ECharts）、添加定时器/事件监听|可调用 setState（触发一次额外更新）|
|**更新阶段**（props/state 变化）|`static getDerivedStateFromProps(props, state)`|同挂载阶段|同挂载阶段|-|
||`shouldComponentUpdate(nextProps, nextState)`|渲染前触发|控制是否重新渲染（性能优化）|返回布尔值，默认 true；纯组件（PureComponent）已内置浅比较|
||`render()`|同挂载阶段|同挂载阶段|-|
||`getSnapshotBeforeUpdate(prevProps, prevState)`|DOM 更新前触发（render 后，更新 DOM 前）|捕获 DOM 状态（如滚动位置）|返回值会传给 componentDidUpdate 第三个参数|
||`componentDidUpdate(prevProps, prevState, snapshot)`|DOM 更新完成后|操作更新后的 DOM、根据 props 变化重新请求接口|需加条件判断（如 props 变化），否则 setState 易死循环|
|**卸载阶段**（组件销毁）|`componentWillUnmount()`|组件卸载/销毁前|清除定时器、解绑事件监听、取消接口请求、清理订阅|不可调用 setState（组件已不再渲染）|
#### 2. 废弃的钩子（面试了解即可）

React 16.3+ 废弃了 `componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`（标记为 UNSAFE_），原因是易引发副作用、不利于 Fiber 架构的异步渲染。

#### 3. 类组件生命周期示例

```JavaScript

import React, { Component } from 'react';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log('1. constructor：初始化state');
  }

  // 从props派生state（示例：props.count同步到state）
  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps：挂载/更新前');
    if (props.count !== state.count) {
      return { count: props.count };
    }
    return null;
  }

  handleClick = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    console.log('3. render：渲染UI');
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleClick}>+1</button>
      </div>
    );
  }

  componentDidMount() {
    console.log('4. componentDidMount：挂载完成');
    // 示例：请求接口、初始化定时器
    this.timer = setInterval(() => {
      this.setState({ count: this.state.count + 1 });
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('5. shouldComponentUpdate：判断是否更新');
    // 仅当count变化超过1时更新（性能优化示例）
    return Math.abs(nextState.count - this.state.count) > 1;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('6. getSnapshotBeforeUpdate：捕获DOM状态');
    // 返回滚动位置（示例）
    return document.documentElement.scrollTop;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('7. componentDidUpdate：更新完成，滚动位置：', snapshot);
    // 仅当props变化时处理
    if (this.props.count !== prevProps.count) {
      // 重新请求接口等操作
    }
  }

  componentWillUnmount() {
    console.log('8. componentWillUnmount：卸载前清理');
    // 清除定时器、解绑事件
    clearInterval(this.timer);
  }
}

export default MyComponent;
```

### 二、React 函数组件生命周期（Hooks 实现，React 16.8+ 主流）

函数组件本身无「生命周期钩子」，而是通过 `useEffect`、`useLayoutEffect` 等 Hooks 模拟生命周期行为，核心是「副作用处理」（副作用：数据请求、DOM 操作、定时器等非渲染逻辑）。

#### 1. 核心 Hooks 与生命周期的对应关系（面试必考）

|类组件生命周期|函数组件 Hooks 实现|说明|
|---|---|---|
|`constructor`|直接声明 state/变量|函数组件执行时初始化 state（useState）、绑定方法|
|`componentDidMount`|`useEffect(() => { ... }, [])`|空依赖数组，仅组件挂载时执行一次|
|`componentDidUpdate`|`useEffect(() => { ... }, [依赖项])`|依赖项变化时执行（模拟更新后逻辑）|
|`componentWillUnmount`|`useEffect(() => { return () => { ... } }, [])`|useEffect 返回的清理函数，组件卸载时执行|
|`shouldComponentUpdate`|`React.memo()` + `useMemo`/`useCallback`|React.memo 浅比较 props，useMemo/useCallback 缓存值/方法|
|`render`|函数组件本身|函数组件执行即渲染，返回 JSX|
#### 2. 函数组件生命周期模拟示例（核心）

```JavaScript

import React, { useState, useEffect, useMemo } from 'react';

// React.memo：模拟shouldComponentUpdate，浅比较props
const MyComponent = React.memo(({ initCount }) => {
  // 1. 模拟constructor：初始化state
  const [count, setCount] = useState(initCount || 0);
  console.log('函数执行：模拟render');

  // 2. 模拟componentDidMount + componentWillUnmount
  useEffect(() => {
    console.log('模拟componentDidMount：挂载完成');
    // 示例：添加定时器
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // 清理函数：模拟componentWillUnmount
    return () => {
      console.log('模拟componentWillUnmount：卸载清理');
      clearInterval(timer);
    };
  }, []); // 空依赖：仅挂载/卸载执行

  // 3. 模拟componentDidUpdate（依赖count变化）
  useEffect(() => {
    console.log('模拟componentDidUpdate：count更新为', count);
    // 示例：count>5时执行额外逻辑
    if (count > 5) {
      console.log('count超过5，执行更新逻辑');
    }
  }, [count]); // 依赖count：仅count变化时执行

  // 4. useMemo：缓存计算结果，优化性能（配合React.memo）
  const doubleCount = useMemo(() => {
    return count * 2;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
      <button onClick={() => setCount(prev => prev + 1)}>+1</button>
    </div>
  );
});

export default MyComponent;
```

#### 3. 补充 Hooks 说明

- `useLayoutEffect`：与 `useEffect` 功能一致，但执行时机不同：

    - `useEffect`：DOM 渲染完成后异步执行（不阻塞渲染）；

    - `useLayoutEffect`：DOM 更新后同步执行（阻塞渲染），适合需要立即操作 DOM 的场景（如调整元素位置），类比类组件的 `componentDidMount` 同步逻辑。

- 无对应 `getDerivedStateFromProps`/`getSnapshotBeforeUpdate`：函数组件中可直接在渲染逻辑中处理 props 派生 state，或通过 `useEffect` 捕获 DOM 状态。

### 三、类组件 vs 函数组件生命周期核心差异

|维度|类组件|函数组件|
|---|---|---|
|实现方式|固定生命周期钩子函数|基于 Hooks（主要是 useEffect）模拟，无固定钩子|
|执行逻辑|实例化后按阶段执行钩子，this 指向组件实例|每次渲染重新执行函数，Hooks 按顺序执行，无 this|
|性能优化|shouldComponentUpdate/PureComponent|React.memo + useMemo/useCallback|
|副作用管理|分散在 componentDidMount/componentDidUpdate 等钩子|集中在 useEffect 中，一个 useEffect 可管理多个副作用（或拆分多个）|
|卸载清理|componentWillUnmount 中统一清理|每个 useEffect 返回清理函数，按需清理（更细粒度）|
### 总结

1. **核心对应关系**：函数组件中 `useEffect(() => {}, [])` 对应挂载、`useEffect(() => {}, [依赖])` 对应更新、`useEffect` 返回的清理函数对应卸载，是面试必考的核心点。

2. **执行逻辑差异**：类组件生命周期基于实例阶段，函数组件基于「渲染+副作用」，每次渲染都会重新执行函数，Hooks 需严格遵循「只在顶层调用」的规则。

3. **面试高频考点**：① 类组件生命周期执行顺序；② useEffect 依赖数组的作用（空数组/指定依赖/无依赖的区别）；③ React.memo + useMemo/useCallback 的性能优化场景；④ 函数组件卸载时清理副作用的方式。
> （注：文档部分内容可能由 AI 生成）