# Vue2 与 Vue3 中组件传值核心知识点对比

### 一、Vue2 组件传值（Options API 形式）

Vue2 组件传值核心围绕「父子、隔代、兄弟」三类关系，不同关系对应不同传值方式，以下是面试高频的 6 种方式：

|传值场景|方式|核心语法|示例|注意点|
|---|---|---|---|---|
|**父 → 子**（最常用）|props|父组件通过属性传值，子组件通过 props 接收|父组件：<br>`<Child :msg="parentMsg" :list="parentList" />`<br>子组件：<br>`props: {`<br> `  msg: { type: String, default: '' },`<br> `  list: { type: Array, default: () => [] }`<br>`}`|1. props 是单向数据流（子不能直接修改）；<br>2. 引用类型（数组/对象）修改内部值会同步到父组件（需避免）；<br>3. 默认值为引用类型时需用函数返回（避免共享引用）|
|**子 → 父**（常用）|自定义事件|子组件 $emit 触发事件，父组件 v-on 监听|子组件：<br>`this.$emit('change', newVal)`<br>父组件：<br>`<Child @change="handleChange" />`<br>`methods: { handleChange(val) { ... } }`|1. 事件名推荐 kebab-case（短横线）；<br>2. 可传多个参数，父组件通过参数接收|
|**子 → 父/父 → 子**（双向绑定）|.sync 修饰符（语法糖）|父组件：`<Child :msg.sync="parentMsg" />`<br>子组件：`this.$emit('update:msg', newVal)`|等价于：<br>`<Child :msg="parentMsg" @update:msg="parentMsg = $event" />`|Vue2.3+ 支持，本质是自定义事件的语法糖|
|**隔代组件/兄弟组件**（常用）|EventBus 事件总线|1. 创建总线：`const bus = new Vue()`<br>2. 发送：`bus.$emit('eventName', val)`<br>3. 接收：`bus.$on('eventName', (val) => { ... })`<br>4. 销毁：`bus.$off('eventName')`|兄弟组件 A 发送：`bus.$emit('send', 'hello')`<br>兄弟组件 B 接收：<br>`created() { bus.$on('send', (val) => { ... }) }`<br>`beforeDestroy() { bus.$off('send') }`|1. 需在组件销毁时解绑事件（避免内存泄漏）；<br>2. 复杂场景易维护性差|
|**隔代组件**（面试高频）|provide/inject|父组件 provide 提供数据，子孙组件 inject 注入|父组件：<br>`provide() {`<br> `  return { parentMsg: this.parentMsg }`<br>`}`<br>子/孙组件：<br>`inject: ['parentMsg']`|1. 非响应式（Vue2 中需手动处理响应式）；<br>2. 适用于隔代组件传值，不推荐大范围使用|
|**任意组件**（全局）|Vuex|1. 定义 state/mutations/actions<br>2. 取值：`this.$store.state.xxx`<br>3. 修改：`this.$store.commit('mutationsName', val)`|`// store/index.js`<br>`export default new Vuex.Store({`<br> `  state: { count: 0 },`<br> `  mutations: { add(state) { state.count++ } }`<br>`})`<br>组件中：`this.$store.commit('add')`|适用于复杂业务的全局状态管理，核心是「单向数据流」|
### 二、Vue3 组件传值（组合式 API 为主，兼容选项式）

Vue3 兼容 Vue2 大部分传值逻辑，但在组合式 API（`<script setup>`）下语法有调整，同时新增 `v-model` 多绑定、Pinia 替代 Vuex 等特性：

|传值场景|方式|核心语法|示例|注意点|
|---|---|---|---|---|
|**父 → 子**（常用）|props|父组件语法同 Vue2，子组件用 defineProps 接收|父组件：<br>`<Child :msg="parentMsg" />`<br>子组件（setup）：<br>`const props = defineProps({`<br> `  msg: { type: String, default: '' }`<br>`})`<br>`console.log(props.msg)`|1. `<script setup>` 中 defineProps 无需导入；<br>2. props 仍是响应式，但不能解构（解构会丢失响应式）|
|**子 → 父**（常用）|自定义事件|子组件 defineEmits 声明事件，emit 触发；父组件监听|子组件（setup）：<br>`const emit = defineEmits(['change'])`<br>`emit('change', newVal)`<br>父组件：<br>`<Child @change="handleChange" />`|defineEmits 无需导入，事件名推荐 kebab-case|
|**双向绑定**（常用）|v-model 多绑定（Vue3 增强）|父组件：`<Child v-model:msg="parentMsg" v-model:count="parentCount" />`<br>子组件：<br>`const props = defineProps(['msg', 'count'])`<br>`const emit = defineEmits(['update:msg', 'update:count'])`<br>`emit('update:msg', newMsg)`|1. 替代 Vue2 的 .sync，支持多个 v-model；<br>2. 默认 v-model 对应 modelValue 属性 + update:modelValue 事件||
|**隔代组件**（面试高频）|provide/inject（响应式增强）|父组件：<br>`import { provide, ref } from 'vue'`<br>`const msg = ref('hello')`<br>`provide('msg', msg)`<br>子孙组件：<br>`import { inject } from 'vue'`<br>`const msg = inject('msg')`|1. 传递响应式数据（ref/reactive），子孙组件可直接使用；<br>2. 推荐只在父组件修改数据，子孙组件只读（保持单向数据流）||
|**任意组件**（全局）|Pinia（替代 Vuex）|1. 创建 store：<br>`import { defineStore } from 'pinia'`<br>`export const useCountStore = defineStore('count', {`<br> `  state: () => ({ count: 0 }),`<br> `  actions: { add() { this.count++ } }`<br>`})`<br>2. 组件中使用：<br>`import { useCountStore } from '@/stores'`<br>`const store = useCountStore()`<br>`store.count // 取值`<br>`store.add() // 修改`|1. Pinia 是 Vue3 官方推荐，替代 Vuex；<br>2. 无需 mutations，直接在 actions 中修改 state；<br>3. 支持组合式 API，更轻量||
|**兄弟组件/隔代组件**|EventBus（Vue3 废弃）|替代方案：Pinia / provide/inject|-|Vue3 移除  $on/$ off/$once，不推荐使用 EventBus|
#### Vue3 组合式 API 传值完整示例

**父组件（Parent.vue）**：

```Plain Text

<template>
  <Child 
    :msg="parentMsg" 
    v-model:count="parentCount" 
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const parentMsg = ref('父组件传递的消息')
const parentCount = ref(0)

const handleChange = (val) => {
  console.log('子组件触发的事件：', val)
}
</script>
```

**子组件（Child.vue）**：

```Plain Text

<template>
  <div>{{ msg }}</div>
  <div>{{ count }}</div>
  <button @click="handleClick">修改值</button>
</template>

<script setup>
// 接收 props
const props = defineProps({
  msg: { type: String, default: '' },
  count: { type: Number, default: 0 }
})

// 声明自定义事件
const emit = defineEmits(['change', 'update:count'])

const handleClick = () => {
  // 触发自定义事件（子→父）
  emit('change', '子组件的消息')
  // 触发 v-model 双向绑定
  emit('update:count', props.count + 1)
}
</script>
```

### 三、Vue2 vs Vue3 组件传值核心差异

|维度|Vue2|Vue3|
|---|---|---|
|核心语法|Options API（props/emit 配置在选项中）|组合式 API（defineProps/defineEmits 直接使用）|
|双向绑定|.sync 修饰符|v-model 多绑定（v-model:xxx），替代 .sync|
|全局状态管理|Vuex（需区分 state/mutations/actions）|Pinia（无需 mutations，更简洁）|
|EventBus|基于 new Vue() 实现|官方废弃，推荐 Pinia/provide/inject|
|provide/inject|非响应式（需手动处理）|天然支持响应式（传递 ref/reactive）|
|语法便捷性|需在选项中声明 props/emit|`<script setup>` 中 defineProps/defineEmits 无需导入，更简洁|
### 总结

1. **核心传值逻辑**：Vue2/Vue3 父子组件传值核心仍是「props（父→子）+ 自定义事件（子→父）」，双向绑定语法有调整（.sync → v-model:xxx）。

2. **Vue3 关键变化**：① 组合式 API 用 defineProps/defineEmits 替代选项式声明；② Pinia 替代 Vuex 做全局状态管理；③ 废弃 EventBus，推荐 Pinia/provide/inject 处理跨组件传值。

3. **面试高频考点**：① props 单向数据流的理解；② 子组件修改父组件数据的正确方式（emit/双向绑定）；③ Vue3 中 v-model 多绑定的用法；④ Pinia 与 Vuex 的区别；⑤ provide/inject 的适用场景与响应式处理。
> （注：文档部分内容可能由 AI 生成）