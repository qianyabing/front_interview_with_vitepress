# Redux Toolkit：React 状态管理的高效方案示例

### 一、Redux Toolkit 核心优势

1. 内置 `immer` 库，支持**直接修改状态**（无需手动返回新状态），简化 reducer 编写；

2. 集成 `createSlice`，一键生成 action 和 reducer，无需手动定义 action type；

3. 内置 `configureStore`，自动配置中间件（如 redux-thunk），替代传统 `createStore`；

4. 减少样板代码，解决传统 Redux 代码冗余问题。

### 二、Redux Toolkit 完整使用示例（函数组件为主，类组件补充）

#### 1. 环境安装

```Bash

# 安装核心依赖
npm install @reduxjs/toolkit react-redux
# 或 yarn
yarn add @reduxjs/toolkit react-redux
```

#### 2. 步骤 1：创建 Store（全局状态仓库）

在 `src/store/index.js` 中创建全局 store：

```JavaScript

import { configureStore, createSlice } from '@reduxjs/toolkit';

// 1. 创建切片（Slice）：包含 state、reducer、action
const counterSlice = createSlice({
  name: 'counter', // 切片名称（action type 前缀）
  initialState: { // 初始状态
    count: 0,
    msg: 'Redux Toolkit 示例'
  },
  reducers: { // 定义修改状态的方法（同步）
    increment: (state) => {
      // 直接修改 state（immer 自动转换为不可变更新）
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    // 带参数的 action
    incrementByNum: (state, action) => {
      state.count += action.payload; // payload 是传参
    },
    updateMsg: (state, action) => {
      state.msg = action.payload;
    }
  }
});

// 2. 导出 action 创建函数（自动生成）
export const { increment, decrement, incrementByNum, updateMsg } = counterSlice.actions;

// 3. 配置并导出 store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer // 将切片 reducer 加入 store
    // 可添加多个切片：如 user: userSlice.reducer
  }
});
```

#### 3. 步骤 2：全局注入 Store

在项目入口文件 `src/index.js` 中，用 `Provider` 包裹根组件，让所有组件可访问 store：

```JavaScript

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // 导入 Provider
import { store } from './store'; // 导入创建的 store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}> {/* 注入 store */}
    <App />
  </Provider>
);
```

#### 4. 步骤 3：函数组件中使用 Store（面试高频）

用 `useSelector` 读取状态、`useDispatch` 触发 action：

```JavaScript

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByNum, updateMsg } from './store';

const Counter = () => {
  // 1. 读取 store 中的状态
  const { count, msg } = useSelector((state) => state.counter);
  
  // 2. 获取 dispatch 方法
  const dispatch = useDispatch();

  return (
    <div>
      <h3>{msg}</h3>
      <p>当前计数：{count}</p>
      {/* 触发 action 修改状态 */}
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByNum(5))}>+5</button>
      <button onClick={() => dispatch(updateMsg('更新后的消息'))}>修改消息</button>
    </div>
  );
};

export default Counter;
```

#### 5. 类组件中使用 Store（了解即可，面试少考）

类组件需用 `connect` 高阶组件连接 Redux，映射 state 和 dispatch：

```JavaScript

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { increment, decrement } from './store';

class CounterClass extends Component {
  render() {
    // 从 props 中获取映射的状态和方法
    const { count, increment, decrement } = this.props;
    return (
      <div>
        <p>类组件计数：{count}</p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </div>
    );
  }
}

// 1. 映射 state 到 props
const mapStateToProps = (state) => ({
  count: state.counter.count
});

// 2. 映射 dispatch 到 props
const mapDispatchToProps = {
  increment,
  decrement
};

// 3. 连接组件与 store
export default connect(mapStateToProps, mapDispatchToProps)(CounterClass);
```

#### 6. 异步 Action 示例（面试高频：请求接口）

Redux Toolkit 内置 `createAsyncThunk` 处理异步逻辑（如接口请求）：

```JavaScript

// 在 store/index.js 中补充
import { createAsyncThunk } from '@reduxjs/toolkit';

// 1. 定义异步 action
export const fetchUser = createAsyncThunk(
  'counter/fetchUser', // action 名称
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data = await res.json();
      return data; // 成功时，payload 为 data
    } catch (err) {
      return rejectWithValue(err.message); // 失败时，返回错误信息
    }
  }
);

// 2. 在 slice 中处理异步 action 的状态（pending/fulfilled/rejected）
const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    count: 0,
    msg: 'Redux Toolkit 示例',
    user: null,
    loading: false,
    error: null
  },
  reducers: { /* 同步 reducer */ },
  // 处理异步 action
  extraReducers: (builder) => {
    builder
      // 加载中
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 成功
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // 失败
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 组件中调用异步 action
// const handleFetchUser = () => {
//   dispatch(fetchUser(1)); // 传入参数 userId=1
// };
```

### 总结

1. **Redux Toolkit 核心用法**：

    - 用 `createSlice` 定义切片（包含 state 和 reducer），自动生成 action；

    - 用 `configureStore` 创建 store，替代传统 `createStore`；

    - 函数组件用 `useSelector` 读状态、`useDispatch` 触发 action；

    - 异步逻辑用 `createAsyncThunk` + `extraReducers` 处理。

2. **面试高频考点**：

    - Redux Toolkit 相比传统 Redux 的优势；

    - 异步 action 的实现方式（`createAsyncThunk`）；

    - `immer` 库的作用（允许直接修改 state，无需手动不可变更新）；

    - `useSelector` 和 `useDispatch` 的使用场景。

3. **核心原则**：Redux 始终遵循「单向数据流」，状态修改必须通过 action → reducer 完成，不可直接修改 store 中的状态。
> （注：文档部分内容可能由 AI 生成）