# Vue 高频细分面试题集（大厂版）

## 一、Vue 核心基础（必问，打底）

### Q1：Vue 的核心特性有哪些？

**答：**

Vue 核心特性围绕“易用、灵活、高效”设计，核心包括：

1. **数据驱动（MVVM）**：数据变化自动更新视图，无需手动操作 DOM，底层是响应式原理；

2. **组件化**：将页面拆分为独立、可复用的组件，降低复杂度，支持全局/局部组件；

3. **指令系统**：提供 `v-if`/`v-for`/`v-bind`/`v-on` 等指令，简化 DOM 操作；

4. **模板语法**：HTML 模板 + 插值表达式，支持指令、过滤器（Vue2）、计算属性；

5. **双向绑定**：`v-model` 语法糖，简化表单交互；

6. **生命周期**：提供完整的组件生命周期钩子，便于在不同阶段处理逻辑；

7. **过渡/动画**：内置过渡系统，轻松实现组件切换动画。

### Q2：Vue2 和 Vue3 的核心区别？

**答：**

| 维度       | Vue2                              | Vue3                                          |
| ---------- | --------------------------------- | --------------------------------------------- |
| 核心架构   | Options API 为主                  | Composition API 为主（兼容 Options API）      |
| 响应式原理 | Object.defineProperty（劫持属性） | Proxy（代理对象）+ Reflect                    |
| 性能       | 响应式有局限，编译优化少          | 响应式更完整，编译优化（PatchFlag、静态提升） |
| 体积       | 无法按需引入，体积较大            | Tree-shaking 友好，按需引入，体积更小         |
| 类型支持   | 对 TS 支持差                      | 原生支持 TS，类型推断更完善                   |
| 组件       | 单根节点限制                      | 支持多根节点（Fragment）                      |
| 其他特性   | 无 Teleport/Suspense              | 新增 Teleport、Suspense、自定义渲染器         |

### Q3：MVVM 是什么？Vue 如何体现 MVVM 思想？

**答：**

- **MVVM**：Model（数据模型）+ View（视图）+ ViewModel（视图模型），是一种架构模式；

  - Model：前端的状态数据（如 `data` 中的数据）；

  - View：DOM 视图，负责展示；

  - ViewModel：连接 Model 和 View 的桥梁，处理数据绑定和事件监听；

- **Vue 中的体现**：

  1. Model：`data`/`ref`/`reactive` 定义的响应式数据；

  2. View：模板/JSX 渲染的 DOM 界面；

  3. ViewModel：Vue 实例本身，负责数据到视图的**单向绑定**（数据变 → 视图更）和视图到数据的**双向绑定**（`v-model`），实现 Model 和 View 解耦。

### Q4：Vue 模板和 JSX 的区别？使用场景？

**答：**

| 维度     | 模板（HTML 模板）            | JSX                                |
| -------- | ---------------------------- | ---------------------------------- |
| 语法     | 接近 HTML，易上手            | 类 JS 语法，灵活度高               |
| 可读性   | 结构清晰，适合简单组件       | 逻辑与结构融合，适合复杂组件       |
| 动态渲染 | 依赖指令（v-if/v-for）       | 原生 JS 逻辑（if/for），更灵活     |
| 性能     | 编译期优化（PatchFlag）      | 优化较少，需手动控制               |
| 使用场景 | 大部分业务组件（表单、列表） | 复杂逻辑组件（如动态表单、可视化） |

**总结**：日常业务优先用模板，复杂动态组件用 JSX。

### Q5：Vue 中的指令有哪些分类？核心指令的作用？

**答：**

指令分为**内置指令**和**自定义指令**，核心内置指令：

1. **内容渲染**：`{{ }}`（插值）、`v-text`（纯文本）、`v-html`（渲染 HTML）；

2. **条件渲染**：`v-if`/`v-else-if`/`v-else`（条件渲染）、`v-show`（显示/隐藏）；

   - 区别：`v-if` 是销毁/重建组件，`v-show` 是切换 `display: none`，频繁切换用 `v-show`；

3. **列表渲染**：`v-for`（遍历数组/对象），需配合 `key` 使用；

4. **属性绑定**：`v-bind`（缩写 `:`），绑定 DOM 属性/组件 props；

5. **事件绑定**：`v-on`（缩写 `@`），绑定事件，支持修饰符（`.stop`/`.prevent`/`.once`）；

6. **双向绑定**：`v-model`（语法糖，结合 `v-bind` 和 `v-on`）；

7. **其他**：`v-pre`（跳过编译）、`v-cloak`（解决插值闪烁）、`v-once`（只渲染一次）。

## 二、Vue 响应式原理（大厂必问，核心）

### Q6：Vue2 响应式原理？有哪些缺陷？

**答：**

#### 核心原理

基于 `Object.defineProperty` 劫持对象属性的 `getter/setter`，结合**发布-订阅模式**实现：

1. **初始化阶段**：遍历 `data` 中的属性，用 `Object.defineProperty` 重写 `get`/`set`；

2. **依赖收集**：

   - 组件渲染时，访问 `data` 属性触发 `get`，将当前组件的 Watcher 收集到 Dep（依赖容器）中；

3. **派发更新**：

   - 修改 `data` 属性触发 `set`，Dep 通知所有 Watcher 执行更新，重新渲染组件。

#### 缺陷

1. **无法监听新增/删除属性**：`Object.defineProperty` 只能劫持已存在的属性，新增属性需用 `this.$set`，删除需用 `this.$delete`；

2. **无法监听数组下标/长度变化**：Vue2 对数组做了特殊处理（重写 `push/pop/shift/unshift/splice/sort/reverse` 7 个方法），但仍无法监听 `arr[0] = 1`、`arr.length = 0`；

3. **深度监听需递归**：对嵌套对象需递归劫持所有属性，初始化性能差；

4. **劫持粒度细**：按属性劫持，开销较大。

### Q7：Vue3 响应式原理？相比 Vue2 做了哪些优化？

**答：**

核心原理

基于 `Proxy` 代理整个对象 + `Reflect` 操作属性，结合**Effect 副作用系统**实现：

1. **初始化阶段**：用 `Proxy` 包裹目标对象，拦截所有属性操作（读取、赋值、新增、删除）；

2. **依赖收集**：

   - 执行副作用函数（如组件渲染）时，访问属性触发 `Proxy.get`，将当前 Effect 收集到依赖 Map 中；

3. **派发更新**：

   - 修改属性触发 `Proxy.set`，从依赖 Map 中取出所有 Effect 执行，更新视图。

#### 核心优化

1. **劫持粒度更优**：Proxy 代理整个对象，而非单个属性，支持新增/删除属性、数组下标/长度变化，无需 `$set/$delete`；

2. **懒代理**：嵌套对象只有访问时才会被代理，初始化性能更好；

3. **Reflect 配合**：统一属性操作的返回值，处理 `this` 指向，更符合规范；

4. **支持更多数据类型**：可代理 Map/Set 等集合类型。

### Q8：Vue3 中 ref 和 reactive 的区别？使用场景？

**答：**

| 维度       | ref                                                                       | reactive                           |
| ---------- | ------------------------------------------------------------------------- | ---------------------------------- |
| 劫持目标   | 原始类型（字符串/数字/布尔）+ 对象/数组                                   | 仅对象/数组（引用类型）            |
| 访问方式   | 需通过 `.value`（模板中无需）                                             | 直接访问属性                       |
| 响应式原理 | 原始类型：包装为对象，劫持 `.value` 的 `get/set`；对象：内部调用 reactive | Proxy 代理整个对象                 |
| 解构       | 解构后丢失响应式（需用 toRefs/toRef）                                     | 解构后丢失响应式（需用 toRefs）    |
| 使用场景   | 单个原始类型状态（如 count、flag）                                        | 复杂对象/数组状态（如 user、list） |

**使用技巧**：

- 简单值（如 `let count = 0`）用 `ref`；

- 复杂对象（如 `let user = { name: '', age: 0 }`）用 `reactive`；

- 解构 reactive 对象时，用 `const { name, age } = toRefs(user)` 保留响应式。

### Q9：Vue3 中的 Effect 是什么？computed 和 watch 基于 Effect 如何实现？

**答：**

- **Effect**：副作用函数，是 Vue3 响应式系统的核心，用于收集依赖和触发更新；

  - 执行 Effect 时，会追踪所有访问的响应式属性（依赖收集）；

  - 当依赖的属性变化时，会重新执行 Effect（派发更新）。

#### computed 实现

- 基于 **lazy Effect**（懒执行）+ 缓存；

- 特点：

  1. 首次访问时才执行计算；

  2. 依赖不变时，重复访问返回缓存值；

  3. 依赖变化时，重新计算并更新缓存。

#### watch 实现

- 基于 **Effect** + 手动触发；

- 特点：

  1. 监听指定依赖，依赖变化时执行回调；

  2. 支持立即执行（`immediate: true`）、深度监听（`deep: true`）；

  3. 可返回清理函数，处理副作用（如取消请求、清除定时器）。

### Q10：Vue3 编译优化（PatchFlag、静态提升）是什么？

**答：**

Vue3 对模板编译做了两大核心优化，大幅提升渲染性能：

1. **PatchFlag（补丁标记）**：

   - 编译模板时，给**动态节点**打上标记（如 `TEXT`/`CLASS`/`STYLE`/`PROPS`）；

   - 组件更新时，只遍历带标记的动态节点，跳过静态节点，减少 diff 开销；

   - 例：`<div class="box" :title="title">hello {{name}}</div>` → 给 `title` 和 `name` 打标记，只更新这两个动态部分。

2. **静态提升**：

   - 编译时将**静态节点**（无动态绑定）提升到渲染函数外部，避免每次渲染重新创建；

   - 例：静态文本、静态 class 等，只创建一次，复用多次。

## 三、Vue 组件（高频）

### Q11：Vue 组件通信方式有哪些？（按场景分类）

**答：**

按组件关系分类，覆盖所有场景：

#### 1. 父子组件

- **props / $emit**（最常用）：

  - 父 → 子：子组件通过 `props` 接收父组件数据；

  - 子 → 父：子组件 `this.$emit('event', data)`，父组件 `@event` 监听；

- **v-model**（语法糖）：

  - 子组件：`props` 接收 `modelValue`，触发 `update:modelValue` 事件；

  - 父组件：`<Child v-model="value" />`，等价于 `<Child :modelValue="value" @update:modelValue="value = $event" />`；

- $parent / $ **children**（不推荐）：直接访问父/子组件实例，耦合度高；

- **ref**：父组件通过 `ref` 获取子组件实例，调用方法/访问数据。

#### 2. 跨级/祖孙组件

- **provide / inject**：

  - 父组件 `provide` 提供数据，后代组件 `inject` 注入数据；

  - 特点：无视层级，适合深层组件通信，非响应式（Vue2）/ 响应式（Vue3）；

  - 注意：适合全局配置（如主题、权限），不适合频繁变化的状态。

#### 3. 兄弟/全局组件

- **事件总线（EventBus）**（Vue2 常用，Vue3 推荐用 Pinia）：

  - Vue2：`new Vue()` 作为总线，`$on` 监听、`$emit` 触发、`$off` 取消；

  - Vue3：用 `mitt` 库替代（Vue3 移除了 `$on/$off`）；

- **Pinia / Vuex**（全局状态管理）：

  - 适合复杂场景，集中管理全局状态，支持响应式、模块化。

#### 4. 其他方式

- $attrs / $ **listeners**（Vue2）/ `useAttrs`（Vue3）：传递未声明的 props/事件；

- **插槽**：作用域插槽可实现子 → 父传递数据。

### Q12：Vue 中 props 校验如何实现？

**答：**

子组件通过 `props` 选项定义校验规则，支持类型、必填、默认值、自定义校验：

```JavaScript

// Vue2
props: {
  // 基础类型校验
  id: Number,
  // 多个类型
  name: [String, Number],
  // 必填 + 类型
  age: {
    type: Number,
    required: true
  },
  // 默认值
  gender: {
    type: String,
    default: 'male'
  },
  // 对象/数组默认值（需函数返回）
  list: {
    type: Array,
    default: () => []
  },
  // 自定义校验
  score: {
    type: Number,
    validator: (value) => {
      return value >= 0 && value <= 100;
    }
  }
}

// Vue3（TS 版）
defineProps<{
  id: number;
  name?: string | number;
  age: number;
  gender?: string;
  list?: number[];
  score: number;
}>();
// 带默认值
withDefaults(defineProps<{
  gender?: string;
  list?: number[];
}>(), {
  gender: 'male',
  list: () => []
});
```

### Q13：Vue 中的插槽有哪些类型？使用场景？

**答：**

插槽用于组件内容分发，分为 3 类：

1. **默认插槽**：

   - 子组件：`<slot></slot>`；

   - 父组件：`<Child>默认内容</Child>`；

   - 场景：组件主体内容自定义。

2. **具名插槽**：

   - 子组件：`<slot name="header"></slot> <slot name="footer"></slot>`；

   - 父组件：

     ```HTML

     <Child>
       <template #header>头部内容</template>
       <template #footer>底部内容</template>
     </Child>
     ```

   - 场景：组件多区域内容自定义（如布局组件）。

3. **作用域插槽**：

   - 子组件：`<slot :data="list"></slot>`（传递数据给父组件）；

   - 父组件：

     ```HTML

     <Child>
       <template #default="scope">
         <div>{{ scope.data }}</div>
       </template>
     </Child>
     ```

   - 场景：子组件数据，父组件自定义渲染（如表格列自定义）。

### Q14：Vue 组件的生命周期钩子（Vue2 vs Vue3）？

**答：**

#### Vue2 生命周期（Options API）

| 阶段     | 钩子函数      | 作用                                        |
| -------- | ------------- | ------------------------------------------- |
| 挂载阶段 | beforeCreate  | 实例创建前，data/methods 未初始化           |
|          | created       | 实例创建后，可访问 data/methods，DOM 未生成 |
|          | beforeMount   | 挂载前，模板编译完成，未挂载到 DOM          |
|          | mounted       | 挂载后，DOM 已生成，可操作 DOM              |
| 更新阶段 | beforeUpdate  | 数据更新前，虚拟 DOM 未重新渲染             |
|          | updated       | 数据更新后，虚拟 DOM 已重新渲染             |
| 卸载阶段 | beforeDestroy | 组件卸载前，可清理定时器/事件               |
|          | destroyed     | 组件卸载后，实例销毁                        |

#### Vue3 生命周期（Composition API）

- 兼容 Vue2 钩子（如 `mounted`），新增 `onXXX` 形式的钩子：

| Vue2 钩子     | Vue3 钩子（setup 中） |
| ------------- | --------------------- |
| beforeCreate  | setup 开始执行        |
| created       | setup 结束执行        |
| beforeMount   | onBeforeMount         |
| mounted       | onMounted             |
| beforeUpdate  | onBeforeUpdate        |
| updated       | onUpdated             |
| beforeUnmount | onBeforeUnmount       |
| unmounted     | onUnmounted           |

**核心注意点**：

- 挂载阶段：`mounted` 是操作 DOM 的第一个时机；

- 卸载阶段：`beforeUnmount`（Vue3）/ `beforeDestroy`（Vue2）是清理副作用的关键时机（清除定时器、取消订阅）。

### Q15：Vue 中 keep-alive 的作用？核心属性？

**答：**

- **作用**：缓存组件实例，避免组件重复创建/销毁，提升性能，保留组件状态（如表单输入内容）；

- **核心属性**：

  1. `include`：字符串/正则/数组，匹配组件名，只缓存匹配的组件；

  2. `exclude`：字符串/正则/数组，匹配组件名，不缓存匹配的组件；

  3. `max`：数字，最大缓存组件数，超出则删除最久未使用的组件；

- **生命周期钩子**：被缓存的组件会触发 `activated`（激活）/ `deactivated`（失活）钩子；

- **使用场景**：标签页切换、列表页返回详情页保留状态。

## 四、Vue 状态管理（高频）

### Q16：Vuex 和 Pinia 的区别？为什么 Vue3 推荐 Pinia？

**答：**

| 维度     | Vuex                                            | Pinia                                        |
| -------- | ----------------------------------------------- | -------------------------------------------- |
| 模块化   | 需手动嵌套 modules，命名空间复杂                | 天然模块化，每个 store 独立                  |
| TS 支持  | 差，需手动定义类型                              | 原生支持 TS，类型推断完善                    |
| API 设计 | 复杂（state/mutations/actions/getters/modules） | 简洁（state/actions/getters），无 mutations  |
| 数据修改 | 必须通过 mutations（同步）/ actions（异步）     | 直接在 actions 中修改 state（同步/异步均可） |
| 多实例   | 不支持                                          | 支持多个 store 实例                          |
| 体积     | 较大                                            | 轻量化，体积更小                             |

**Vue3 推荐 Pinia 的原因**：

1. 更简洁的 API，降低学习成本；

2. 原生支持 TS，适配 Vue3 的类型系统；

3. 天然模块化，无需复杂的命名空间；

4. 体积更小，性能更好；

5. 兼容 Vue2/Vue3，迁移成本低。

### Q17：Vuex 的核心概念（5 个）？各自的作用？

**答：**

Vuex 核心是 5 个核心模块，遵循**单向数据流**：

1. **State**：全局状态容器，存储应用的核心数据；

   - 访问：组件中 `this.$store.state.xxx` 或 `mapState` 辅助函数；

2. **Mutations**：唯一修改 State 的方式，**同步函数**；

   - 定义：`mutations: { SET_COUNT (state, payload) { state.count = payload } }`；

   - 触发：`this.$store.commit('SET_COUNT', 10)` 或 `mapMutations`；

3. **Actions**：处理异步逻辑（如请求），可提交 Mutations 修改 State；

   - 定义：`actions: { async fetchData ({ commit }) { const res = await api(); commit('SET_DATA', res) } }`；

   - 触发：`this.$store.dispatch('fetchData')` 或 `mapActions`；

4. **Getters**：基于 State 派生的计算属性，缓存结果；

   - 定义：`getters: { doubleCount (state) { return state.count * 2 } }`；

   - 访问：`this.$store.getters.doubleCount` 或 `mapGetters`；

5. **Modules**：将 Store 拆分为多个模块，避免单一 Store 过大；

   - 支持命名空间：`namespaced: true`，防止命名冲突。

### Q18：Pinia 的核心用法？

**答：**

Pinia 用法简洁，核心是定义 Store 和使用 Store：

#### 1. 定义 Store

```JavaScript

// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 状态
  state: () => ({
    count: 0
  }),
  // 计算属性
  getters: {
    doubleCount: (state) => state.count * 2
  },
  // 同步/异步操作
  actions: {
    increment() {
      this.count++
    },
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.count++
    }
  }
})
```

#### 2. 使用 Store

```Plain Text

<script setup>
import { useCounterStore } from '@/stores/counter'
const counterStore = useCounterStore()

// 访问状态
console.log(counterStore.count)
console.log(counterStore.doubleCount)

// 修改状态
counterStore.increment()
counterStore.incrementAsync()

// 重置状态
counterStore.$reset()

// 批量修改
counterStore.$patch({ count: 10 })
counterStore.$patch((state) => { state.count += 5 })
</script>
```

## 五、Vue 工程化与实战（大厂高频）

### Q19：Vue CLI 和 Vite 的区别？为什么 Vite 更快？

**答：**

| 维度       | Vue CLI（Webpack）             | Vite                                   |
| ---------- | ------------------------------ | -------------------------------------- |
| 构建原理   | 打包式构建，启动时打包所有代码 | 无打包式构建，基于原生 ES Module       |
| 启动速度   | 慢（需打包所有依赖）           | 快（按需加载，预构建依赖）             |
| 热更新速度 | 慢（修改代码后重新打包）       | 快（只更新修改的模块）                 |
| 构建工具   | Webpack                        | 开发：ESBuild；生产：Rollup            |
| 兼容性     | 好，支持旧浏览器               | 开发：现代浏览器；生产：可兼容旧浏览器 |
| 配置复杂度 | 高（Webpack 配置繁琐）         | 低（配置简洁，开箱即用）               |

**Vite 更快的核心原因**：

1. **开发阶段无需打包**：浏览器通过原生 ES Module 按需请求模块，无需等待全量打包；

2. **依赖预构建**：用 ESBuild（Go 编写，比 JS 快 10-100 倍）预构建第三方依赖，将 CommonJS/UMD 转为 ESM；

3. **热更新（HMR）**：只更新修改的模块，无需重新打包整个应用；

4. **生产构建**：用 Rollup 打包，输出体积更小、性能更好的代码。

### Q20：Vue 项目如何做性能优化？（分维度）

**答：**

按“加载性能”“运行性能”“渲染性能”三个维度，覆盖全链路优化：

#### 1. 加载性能优化

- **资源优化**：

  - 图片：WebP/AVIF 格式、懒加载（`v-lazy`）、响应式图片；

  - 代码：代码分割（路由懒加载）、Tree-shaking、压缩（Terser/CSSNano）；

  - 依赖：按需引入第三方库（如 Element Plus 按需引入）；

- **缓存优化**：

  - HTTP 缓存（强缓存/协商缓存）；

  - 本地缓存（localStorage/sessionStorage 缓存非敏感数据）；

- **预加载**：

  - 路由预加载（`router.beforeEach` 提前加载下一页组件）；

  - `preload/prefetch` 预加载关键资源。

#### 2. 运行性能优化

- **组件优化**：

  - 缓存组件（`keep-alive`）；

  - 拆分组件，减少单个组件复杂度；

  - 避免无用渲染（Vue3 编译优化已自动处理）；

- **响应式优化**：

  - 避免深层嵌套对象，减少响应式劫持开销；

  - 非响应式数据用 `markRaw` 跳过代理；

- **逻辑优化**：

  - 防抖节流处理高频事件（如输入、滚动）；

  - 长任务拆分（如大数据处理放入 `nextTick` 或 Web Worker）。

#### 3. 渲染性能优化

- **减少重排重绘**：

  - 避免频繁修改样式，批量更新；

  - 用 `transform/opacity` 做动画，开启硬件加速；

- **长列表优化**：

  - 虚拟列表（`vue-virtual-scroller`），只渲染可视区域；

- **首屏优化**：

  - 骨架屏、懒加载、服务端渲染（SSR）/ 静态站点生成（SSG）。

### Q21：Vue 中的 nextTick 是什么？使用场景？

**答：**

- **nextTick**：将回调函数延迟到**下一次 DOM 更新循环结束后**执行，本质是异步队列（微任务优先）；

- **原理**：Vue 更新 DOM 是异步的，修改数据后不会立即更新 DOM，nextTick 确保回调在 DOM 更新后执行；

- **使用场景**：

  1. 修改数据后，立即操作更新后的 DOM（如获取元素宽高、滚动位置）；

  2. 避免多次数据修改导致多次 DOM 更新，合并到 nextTick 执行；

- **示例**：

  ```JavaScript

  this.count = 10;
  // 此时 DOM 未更新，获取不到最新值
  console.log(this.$refs.box.innerText); // 旧值
  this.$nextTick(() => {
    // DOM 已更新，获取最新值
    console.log(this.$refs.box.innerText); // 10
  });

  // Vue3
  import { nextTick } from 'vue';
  nextTick(() => { /* 操作 DOM */ });
  ```

### Q22：Vue 项目如何做单元测试？

**答：**

大厂主流方案：`Vitest + Vue Test Utils`（Vue3）/ `Jest + Vue Test Utils`（Vue2）。

- **核心思路**：模拟组件渲染，断言组件的 props、事件、DOM 表现是否符合预期；

- **示例（测试按钮点击）**：

  ```JavaScript

  // Button.spec.js
  import { mount } from '@vue/test-utils';
  import Button from './Button.vue';

  test('按钮点击触发回调', async () => {
    const onClick = vi.fn(); // Vitest 模拟函数
    const wrapper = mount(Button, {
      props: { onClick }
    });

    // 模拟点击
    await wrapper.trigger('click');

    // 断言回调被调用
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  ```

### Q23：Vue3 的 Teleport（瞬移）是什么？使用场景？

**答：**

- **Teleport**：将组件的 DOM 节点“瞬移”到指定容器中，保持组件逻辑在当前组件，仅 DOM 结构移动；

- **语法**：

  ```Plain Text

  <template>
    <Teleport to="body">
      <div class="modal">弹窗内容</div>
    </Teleport>
  </template>
  ```

- **使用场景**：

  1. 弹窗/对话框：避免被父组件的 `overflow: hidden`/`z-index` 限制；

  2. 悬浮组件：如悬浮按钮、通知提示，瞬移到 `body` 下，避免样式隔离问题；

  3. 全局组件：如加载中提示、Toast，统一挂载到 `body` 下。

---

### 总结

1. Vue 核心考察 **响应式原理（Vue2 vs Vue3）**、**组件通信**、**生命周期**、**性能优化** 四大块，是大厂面试的重点；

2. Vue3 是当前主流，需重点掌握 `ref/reactive` 区别、Composition API、编译优化、Pinia 等新特性；

3. 工程化方面，需理解 Vite 相比 Webpack 的优势，以及实际项目中的性能优化落地经验。

如果需要，我可以针对其中某一类问题（比如响应式原理手写、性能优化落地）给出更具体的代码示例或面试答题技巧。

> （注：文档部分内容可能由 AI 生成）
