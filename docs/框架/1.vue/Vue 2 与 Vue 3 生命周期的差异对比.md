# Vue 2 与 Vue 3 生命周期的差异对比

### 一、Vue2 生命周期（Options API 形式）

Vue2 实例从创建到销毁的全过程分为 **8个核心阶段**，按执行顺序可分为「创建、挂载、更新、销毁」四大类，每个阶段对应成对的「钩子函数」（前为组件自身，后为子组件相关）。

#### 1. 生命周期阶段 & 钩子函数（执行顺序）

|阶段|钩子函数|执行时机|核心用途|注意点|
|---|---|---|---|---|
|**创建阶段**（初始化）|`beforeCreate`|实例创建后，数据观测、事件配置前|无（无法访问 data/methods）|极少使用|
||`created`|实例创建完成，已初始化 data/methods|初始化数据、请求接口（无 DOM）|不能操作 DOM|
|**挂载阶段**（渲染DOM）|`beforeMount`|挂载开始前，模板编译完成，DOM 未生成|最后修改数据（不触发更新）|$el 未挂载|
||`mounted`|DOM 挂载完成（$el 可用）|操作 DOM、初始化第三方插件（如echarts）|子组件已挂载完成|
|**更新阶段**（数据变化）|`beforeUpdate`|数据更新后，DOM 重新渲染前|获取更新前的 DOM 状态|可修改数据（不会触发重复更新）|
||`updated`|DOM 重新渲染完成|获取更新后的 DOM 状态|避免在此修改数据（易死循环）|
|**销毁阶段**（实例销毁）|`beforeDestroy`|实例销毁前|清除定时器、解绑事件、取消订阅|仍可访问实例数据/方法|
||`destroyed`|实例销毁完成|收尾操作（极少用）|实例所有指令/事件已解绑|
#### 2. 补充钩子（面试次高频）

- `activated`：keep-alive 包裹的组件**激活**时触发

- `deactivated`：keep-alive 包裹的组件**失活**时触发

- `errorCaptured`：捕获子组件抛出的错误时触发

#### 3. 示例代码（Vue2 选项式 API）

```JavaScript

new Vue({
  el: '#app',
  data() {
    return { msg: 'hello vue2' }
  },
  beforeCreate() {
    console.log('beforeCreate:', this.msg); // undefined（无法访问data）
  },
  created() {
    console.log('created:', this.msg); // hello vue2（可访问data）
    // 此处请求接口
  },
  beforeMount() {
    console.log('beforeMount:', document.getElementById('box')); // null（DOM未挂载）
  },
  mounted() {
    console.log('mounted:', document.getElementById('box')); // DOM元素（可操作）
  },
  beforeUpdate() {
    console.log('beforeUpdate:', document.getElementById('box').innerText); // 更新前的内容
  },
  updated() {
    console.log('updated:', document.getElementById('box').innerText); // 更新后的内容
  },
  beforeDestroy() {
    console.log('beforeDestroy'); // 清除定时器：clearInterval(this.timer)
  },
  destroyed() {
    console.log('destroyed');
  }
})
```

### 二、Vue3 生命周期（两种写法）

Vue3 兼容 Vue2 大部分生命周期钩子，但因组合式 API（Composition API）的引入，新增了「生命周期钩子函数」（前缀 `on`），且废弃了 `beforeDestroy/destroyed`，替换为更语义化的名称。

#### 1. 核心变化

|Vue2 钩子|Vue3 选项式 API|Vue3 组合式 API（setup 中）|说明|
|---|---|---|---|
|beforeCreate|保留|无（setup 执行时机等同）|setup 执行时已完成实例初始化|
|created|保留|无（setup 执行时机等同）|setup 内可直接写初始化逻辑|
|beforeMount|保留|onBeforeMount|功能一致|
|mounted|保留|onMounted|功能一致|
|beforeUpdate|保留|onBeforeUpdate|功能一致|
|updated|保留|onUpdated|功能一致|
|beforeDestroy|beforeUnmount|onBeforeUnmount|更名，功能一致|
|destroyed|unmounted|onUnmounted|更名，功能一致|
|activated|保留|onActivated|功能一致|
|deactivated|保留|onDeactivated|功能一致|
#### 2. 组合式 API（setup 中使用，面试高频）

setup 是 Vue3 组合式 API 的入口，执行时机**早于 beforeCreate**，因此无需 beforeCreate/created 钩子，直接在 setup 内写初始化逻辑。

```Plain Text

<template>
  <div>{{ msg }}</div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue';

// 初始化数据（等同 created）
const msg = ref('hello vue3');
console.log('setup:', msg.value); // hello vue3（可访问响应式数据）

// 挂载前
onBeforeMount(() => {
  console.log('onBeforeMount'); // DOM 未生成
});

// 挂载完成
onMounted(() => {
  console.log('onMounted'); // 操作 DOM、初始化插件
});

// 更新前
onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

// 更新完成
onUpdated(() => {
  console.log('onUpdated');
});

// 卸载前
onBeforeUnmount(() => {
  console.log('onBeforeUnmount'); // 清除定时器、解绑事件
});

// 卸载完成
onUnmounted(() => {
  console.log('onUnmounted');
});
</script>
```

#### 3. 选项式 API（兼容 Vue2 写法）

Vue3 仍支持选项式 API，仅钩子名称微调（beforeDestroy → beforeUnmount，destroyed → unmounted）：

```JavaScript

export default {
  data() {
    return { msg: 'hello vue3' }
  },
  created() {
    console.log('created');
  },
  mounted() {
    console.log('mounted');
  },
  beforeUnmount() { // 替代 beforeDestroy
    console.log('beforeUnmount');
  },
  unmounted() { // 替代 destroyed
    console.log('unmounted');
  }
}
```

### 三、Vue2 vs Vue3 生命周期核心差异

|维度|Vue2|Vue3|
|---|---|---|
|核心写法|仅选项式 API|组合式 API（推荐）+ 选项式 API（兼容）|
|销毁阶段钩子|beforeDestroy、destroyed|beforeUnmount、unmounted（语义化更名）|
|初始化逻辑|依赖 beforeCreate/created|setup 执行时机覆盖 beforeCreate/created，直接写逻辑|
|钩子调用方式|选项式声明|组合式需导入对应钩子函数（如 onMounted）|
|父子组件执行顺序|整体一致，子组件挂载完成后父组件 mounted|逻辑一致，仅写法不同|
### 总结

1. **核心执行顺序**：Vue2/Vue3 生命周期核心阶段（创建→挂载→更新→销毁）执行顺序一致，仅销毁阶段钩子名称和组合式 API 写法不同。

2. **Vue3 核心变化**：setup 替代 beforeCreate/created，destroyed 系列钩子更名，组合式 API 需导入钩子函数使用。

3. **面试高频考点**：① 生命周期执行顺序；② Vue3 钩子更名和 setup 执行时机；③ mounted 中操作 DOM、beforeUnmount 中清除副作用（定时器/事件）的最佳实践。
> （注：文档部分内容可能由 AI 生成）