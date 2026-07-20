这是 **Vue 响应式系统** 的核心概念，Vue2 基于 `Object.defineProperty`，Vue3 基于 `Proxy`。我用代码帮你彻底搞懂。

---

## 一、整体流程图

```plain
┌─────────────┐     依赖收集      ┌─────────────┐
│   数据变化   │ ◄──────────────── │   组件渲染   │
│  (state)    │                   │  (render)   │
└──────┬──────┘                   └─────────────┘
       │                              │
       │  派发更新                     │ 读取数据触发getter
       ▼                              ▼
┌─────────────┐                   ┌─────────────┐
│  通知所有    │                   │  建立依赖关系 │
│  订阅者更新  │                   │  (Dep/Watcher)│
│ (notify)    │                   │ (depend)    │
└─────────────┘                   └─────────────┘
```

 ---

## 二、Vue2 实现（Object.defineProperty）

```javascript
// ========== 1. 依赖收集器 Dep ==========
class Dep {
  constructor() {
    this.subs = [];  // 存储所有Watcher（订阅者）
  }
  
  // 添加订阅者
  addSub(watcher) {
    this.subs.push(watcher);
  }
  
  // 依赖收集：当前正在执行的Watcher把自己加进来
  depend() {
    if (Dep.target) {  // Dep.target 是当前正在渲染的Watcher
      this.addSub(Dep.target);
      Dep.target.addDep(this);  // 双向记录，方便后续清理
    }
  }
  
  // 派发更新：数据变了，通知所有Watcher执行更新
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}

// 全局变量，记录当前正在执行的Watcher
Dep.target = null;

// ========== 2. Watcher（订阅者/观察者） ==========
class Watcher {
  constructor(vm, getter, callback) {
    this.vm = vm;           // Vue实例
    this.getter = getter;   // 获取数据的函数，如 () => vm.name
    this.callback = callback; // 数据变化后的回调
    this.deps = [];         // 记录自己依赖了哪些Dep
    
    this.get();  // 初始化时立即执行，触发getter进行依赖收集
  }
  
  get() {
    Dep.target = this;      // 把自己设为当前Watcher
    const value = this.getter.call(this.vm);  // 执行getter，触发数据getter
    Dep.target = null;        // 收集完毕，清空
    return value;
  }
  
  addDep(dep) {
    this.deps.push(dep);
  }
  
  update() {
    // 数据变了，重新执行getter获取新值
    const newValue = this.getter.call(this.vm);
    const oldValue = this.value;
    this.value = newValue;
    this.callback.call(this.vm, newValue, oldValue);
  }
}

// ========== 3. 响应式数据劫持 ==========
function defineReactive(obj, key, val) {
  const dep = new Dep();  // 每个属性一个Dep实例
  
  Object.defineProperty(obj, key, {
    get() {
      // 【依赖收集】：有人读取这个属性时，把当前Watcher加入依赖列表
      dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      // 【派发更新】：数据变了，通知所有Watcher更新
      dep.notify();
    }
  });
}

// ========== 4. 完整演示 ==========
const data = { name: 'Vue2', count: 0 };

// 将数据变成响应式
Object.keys(data).forEach(key => defineReactive(data, key, data[key]));

// 模拟组件渲染：创建一个Watcher
const watcher = new Watcher(
  data,
  () => data.name,           // getter：读取name属性
  (newVal, oldVal) => {      // callback：数据变化后的回调
    console.log(`【更新】${oldVal} → ${newVal}`);
  }
);

console.log('--- 修改数据，触发更新 ---');
data.name = 'Vue3';  // 触发setter → dep.notify() → watcher.update()
// 输出：【更新】Vue2 → Vue3

data.name = 'Vue3';  // 值没变，不会触发更新
// 无输出
```

 ---

## 三、Vue3 实现（Proxy）

```javascript
// ========== Vue3 用 Proxy + Reflect，性能更好，能监听新增/删除属性 ==========

const targetMap = new WeakMap();  // 存储对象 -> (属性 -> Dep) 的映射

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();  // Vue3用Set存储Watcher，去重更高效
    depsMap.set(key, dep);
  }
  return dep;
}

// 当前正在执行的 effect（类似Vue2的Watcher）
let activeEffect = null;

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 【依赖收集】
      if (activeEffect) {
        const dep = getDep(target, key);
        dep.add(activeEffect);
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      // 【派发更新】
      if (oldValue !== value) {
        const dep = getDep(target, key);
        dep.forEach(effect => effect());
      }
      return result;
    }
  });
}

function watchEffect(effectFn) {
  activeEffect = effectFn;
  effectFn();        // 立即执行，触发getter进行依赖收集
  activeEffect = null;
}

// ========== 演示 ==========
const state = reactive({ name: 'Vue3', count: 0 });

watchEffect(() => {
  console.log('【渲染】name =', state.name);
});
// 输出：【渲染】name = Vue3  （首次执行，触发getter，建立依赖）

console.log('--- 修改数据 ---');
state.name = 'React';  
// 输出：【渲染】name = React  （setter触发，通知effect重新执行）

state.count++;  
// 无输出，因为effect没有读取count，没有建立依赖关系

// ========== Vue3 优势：自动监听新增属性 ==========
state.age = 25;  // Vue2需要Vue.set，Vue3直接支持
watchEffect(() => {
  console.log('age =', state.age);
});
// 输出：age = 25
state.age = 26;
// 输出：age = 26
```

 ---

## 四、Vue2 vs Vue3 对比

| 维⁠度 | Vue2 `Object.defineProperty` | Vue3 `Proxy` |
| --- | --- | --- |
| **依⁠赖⁠收⁠集⁠时⁠机** | 属⁠性getter被⁠读⁠取⁠时 | Proxy的get陷⁠阱⁠被⁠触⁠发⁠时 |
| **派⁠发⁠更⁠新⁠方⁠式** | 手⁠动⁠遍⁠历Dep.subs数⁠组⁠通⁠知 | 遍⁠历Set自⁠动⁠去⁠重⁠通⁠知 |
| **新⁠增⁠属⁠性** | ❌ 无⁠法⁠监⁠听，需`Vue.set` | ✅ 自⁠动⁠监⁠听 |
| **删⁠除⁠属⁠性** | ❌ 无⁠法⁠监⁠听，需`Vue.delete` | ✅ 自⁠动⁠监⁠听 |
| **数⁠组⁠索⁠引** | ❌ 无⁠法⁠直⁠接⁠监⁠听 | ✅ 自⁠动⁠监⁠听 |
| **Map/Set** | ❌ 不⁠支⁠持 | ✅ 支⁠持 |
| **性⁠能** | 递⁠归⁠遍⁠历⁠所⁠有⁠属⁠性 | 懒⁠代⁠理，按⁠需⁠劫⁠持 |

---

## 五、结合你简历的项目应用

```javascript
// ========== IRMP报告平台：响应式状态管理 ==========

// Vue3 Pinia 中的依赖收集（底层就是上面的原理）
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useReportStore = defineStore('report', () => {
  // ref创建响应式数据 → 底层是reactive({ value: '...' })
  const reportList = ref([]);      // 依赖收集：组件读取reportList时建立关系
  const currentReport = ref(null);
  const loading = ref(false);
  
  // computed也是依赖收集的典型应用
  const pendingReports = computed(() => {
    // 读取reportList.value → 建立computed和reportList的依赖关系
    return reportList.value.filter(r => r.status === 'pending');
  });
  
  // watch也是基于依赖收集
  watch(currentReport, (newVal, oldVal) => {
    // currentReport变化时，自动执行回调
    console.log('当前报告切换:', oldVal?.id, '→', newVal?.id);
  });
  
  async function fetchReports() {
    loading.value = true;          // 触发setter → 通知所有依赖loading的组件更新
    const res = await fetch('/api/reports');
    reportList.value = res.data;   // 触发setter → 通知pendingReports和用到reportList的组件
    loading.value = false;
  }
  
  return { reportList, currentReport, loading, pendingReports, fetchReports };
});

// ========== 组件中使用 ==========
<template>
  <div>
    <!-- 读取loading → 触发getter → 依赖收集 -->
    <div v-if="loading">加载中...</div>
    
    <!-- 读取pendingReports → 触发computed getter → 依赖收集 -->
    <div v-else>
      待审批报告: {{ pendingReports.length }} 条
    </div>
  </div>
</template>

<script setup>
import { useReportStore } from '@/stores/report';
const { loading, pendingReports, fetchReports } = useReportStore();

// 组件挂载时调用，修改reportList → 派发更新 → 组件重新渲染
onMounted(fetchReports);
</script>
```

 ---

## 六、面试话术

**"讲一下Vue的依赖收集和派发更新"**

> "Vue的响应式系统核心是**依赖收集**和**派发更新**两个过程：
>
> **依赖收集**：组件渲染时会读取数据（触发getter），此时Vue把当前的渲染函数（Watcher）记录到这个数据的依赖列表中。Vue2用`Object.defineProperty`劫持getter，Vue3用`Proxy`的get陷阱。
>
> **派发更新**：当数据被修改时（触发setter），Vue遍历这个数据的依赖列表，通知所有Watcher重新执行，也就是重新渲染组件。
>
> 我在IRMP报告平台中用Pinia管理状态，底层就是这套机制。比如`reportList`变化时，所有用到它的组件和computed都会自动更新，不需要手动操作DOM。"

**"Vue2和Vue3的响应式有什么区别？"**

> "Vue2用`Object.defineProperty`递归劫持已有属性，但无法监听新增属性和数组索引变化，需要`Vue.set`/`Vue.delete`。
>
> Vue3用`Proxy`代理整个对象，可以监听新增、删除、数组索引变化，而且性能更好，是懒代理（用到才劫持）。底层依赖收集从数组改为Set，自动去重更高效。"