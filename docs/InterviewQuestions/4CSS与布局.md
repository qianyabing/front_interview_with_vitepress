# CSS 与布局 超细分大厂面试题集（前端核心必考模块）

本套题集聚焦 CSS 底层原理、布局核心、易混点与工程化实践，覆盖**盒模型、BFC、Flex/Grid、层叠上下文、响应式适配、性能优化**等所有细粒度考点，配套**标准答案+坑点+面试官追问**，完全匹配大厂面试深度（从基础到中高级）。

---

## 第一部分：CSS 核心基础（大厂入门必问）

### 一、盒模型与基础属性

#### Q1：CSS 盒模型的分类？content-box 与 border-box 的区别？计算方式？

**标准答案**：

1. 盒模型核心组成：`content`（内容） + `padding`（内边距） + `border`（边框） + `margin`（外边距）；

2. 分类与计算规则：

| 类型                      | 触发方式                         | 宽度计算方式（width 属性）         | 示例（width:100px, padding:10px, border:5px） |
| ------------------------- | -------------------------------- | ---------------------------------- | --------------------------------------------- |
| 标准盒模型（content-box） | 默认值/`box-sizing: content-box` | width = content 宽度               | 总宽度 = 100 + 10*2 + 5*2 = 130px             |
| IE 盒模型（border-box）   | `box-sizing: border-box`         | width = content + padding + border | 总宽度 = 100px（content 自动缩减为 70px）     |

3. 工程化实践：**全局设置** **`box-sizing: border-box`**（`* { box-sizing: border-box; }`），避免布局计算混乱。

**坑点**：`margin` 不属于盒模型的“宽度/高度”计算范围，仅影响元素外部间距。

**追问**：margin 重叠的规则？如何解决？

#### Q2：margin 重叠（折叠）的规则？如何阻止？

**标准答案**：

1. 重叠场景（仅发生在**块级元素**的垂直方向）：

   - 相邻兄弟元素的 margin 重叠（如 div1 margin-bottom:20px，div2 margin-top:10px → 最终间距 20px）；

   - 父元素与第一个/最后一个子元素的 margin 重叠（父无 padding/border/overflow:hidden）；

   - 空块级元素的上下 margin 重叠（无内容/高度/padding/border）。

2. 重叠计算规则：

   - 正数值：取**最大值**；

   - 正负值：相加（如 -10px + 20px → 10px）；

   - 均为负值：取**绝对值最大值**（如 -20px + -10px → -20px）。

3. 阻止 margin 重叠的方法：

   - 给父元素加 `padding/border`（分隔父子 margin）；

   - 给父元素开启 BFC（如 `overflow:hidden`）；

   - 兄弟元素间加 `inline-block`/`flex` 分隔；

   - 空元素加 `min-height:1px`/`padding:1px`。

#### Q3：line-height 的取值方式（数值/百分比/长度）？垂直居中的原理？

**标准答案**：

1. 取值方式与计算规则：

| 取值类型       | 示例                | 计算方式                          | 继承规则                                 |
| -------------- | ------------------- | --------------------------------- | ---------------------------------------- |
| 数值（无单位） | `line-height: 1.5`  | 最终值 = 字体大小 \* 数值         | 继承数值本身（子元素按自身字体大小计算） |
| 百分比         | `line-height: 150%` | 最终值 = 父元素字体大小 \* 百分比 | 继承计算后的固定值                       |
| 长度（px/em）  | `line-height: 24px` | 固定值                            | 继承固定值                               |

2. 垂直居中原理：`line-height = 容器高度` 时，单行文本在容器内垂直居中（文字基线与行高中线对齐）；

3. 工程化建议：**优先使用无单位数值**（如 1.5），适配不同字体大小的子元素。

**坑点**：多行文本不能用 `line-height` 垂直居中，需用 Flex/Grid/table-cell。

---

## 第二部分：BFC/IFC 与层叠上下文（大厂高频难点）

### 二、BFC（块级格式化上下文）

#### Q4：BFC 的定义？触发条件？核心作用？

**标准答案**：

1. 定义：BFC 是**独立的块级渲染区域**，内部元素的布局不会影响外部元素，外部也不会影响内部；

2. 触发条件（满足其一即可）：

   - 根元素（`<html>`）；

   - `float` 不为 `none`；

   - `position` 为 `absolute`/`fixed`/`sticky`；

   - `display` 为 `inline-block`/`flex`/`grid`/`table-cell`/`flow-root`；

   - `overflow` 不为 `visible`（常用 `hidden`/`auto`）。

3. 核心作用：

   - 解决**父元素高度塌陷**（子元素浮动，父元素无高度）；

   - 阻止**margin 重叠**（父子/兄弟）；

   - 阻止**元素被浮动元素覆盖**（如文字环绕问题）；

   - 隔离布局（BFC 内元素不受外部浮动影响）。

**示例**：解决浮动塌陷

```CSS

.parent {
  overflow: hidden; /* 开启BFC */
}
.child {
  float: left;
  width: 100px;
  height: 100px;
}
```

**追问**：BFC 与 IFC 的区别？

#### Q5：IFC（行内格式化上下文）的规则？与 BFC 的区别？

**标准答案**：

1. IFC 定义：行内元素的渲染上下文，仅作用于行内元素（`inline`/`inline-block`）；

2. IFC 核心规则：

   - 元素沿水平方向排列，垂直方向按 `line-height` 对齐；

   - 行内元素的 `vertical-align` 控制垂直对齐方式（基线/顶部/底部）；

   - 行盒高度由最高元素的 `line-height` 决定，超出部分可通过 `overflow` 处理；

3. BFC vs IFC：

| 维度     | BFC                         | IFC                        |
| -------- | --------------------------- | -------------------------- |
| 适用元素 | 块级元素                    | 行内元素                   |
| 排列方向 | 垂直排列                    | 水平排列                   |
| 核心作用 | 隔离块级布局、解决塌陷/重叠 | 控制行内元素对齐、行盒高度 |

### 三、层叠上下文与 z-index（大厂必问坑点）

#### Q6：层叠上下文的定义？形成条件？层叠顺序？

**标准答案**：

1. 定义：层叠上下文是**三维渲染的层级容器**，内部元素的层叠顺序仅在容器内生效，不会超出；

2. 形成条件（满足其一即可）：

   - 根元素（`<html>`）；

   - `z-index` 不为 `auto` 的定位元素（`relative`/`absolute`/`fixed`/`sticky`）；

   - `position: fixed/sticky`（即使 z-index: auto）；

   - CSS3 属性：`opacity < 1`/`transform` 非 none/`filter` 非 none/`will-change` 含上述属性；

   - `display: flex/grid` 子元素，`z-index` 不为 auto；

3. 层叠顺序（从下到上）：

`background/border` → 负 z-index 元素 → 块级元素 → 行内元素 → float 元素 → z-index: auto/0 → 正 z-index 元素。

**核心**：层叠上下文内的元素，`z-index` 只在当前上下文内比较，无法覆盖外层上下文的元素。

#### Q7：z-index 失效的常见原因？如何解决？

**标准答案**：

1. 失效原因（高频坑点）：

   - 元素未设置 `position`（`relative`/`absolute`/`fixed`/`sticky`），`z-index` 仅对定位元素生效；

   - 父元素形成了层叠上下文，子元素 `z-index` 无法突破父上下文；

   - 父元素 `z-index` 低于同级元素，子元素再高也无法覆盖；

   - 元素被 CSS3 属性（`opacity/transform/filter`）隐式创建层叠上下文，`z-index` 作用域受限。

2. 解决方式：

   - 确保元素设置定位属性；

   - 调整父元素的层叠上下文（如移除不必要的 `opacity/transform`）；

   - 提升父元素的 `z-index`（而非子元素）；

   - 重构布局，避免多层级层叠上下文嵌套。

**示例**：z-index 失效场景

```CSS

.parent {
  opacity: 0.9; /* 隐式创建层叠上下文 */
  z-index: 1;
}
.child {
  position: relative;
  z-index: 999; /* 失效：仅在.parent上下文内生效 */
}
```

---

## 第三部分：Flex 布局（大厂高频核心）

### 四、Flex 布局核心属性与坑点

#### Q8：flex 容器的核心属性？justify-content/align-items/align-content 的区别？

**标准答案**：

1. Flex 容器核心属性：

   - `display: flex/inline-flex`：开启 Flex 布局；

   - `flex-direction`：主轴方向（row/row-reverse/column/column-reverse）；

   - `flex-wrap`：是否换行（nowrap/ wrap/ wrap-reverse）；

   - `justify-content`：主轴对齐方式；

   - `align-items`：交叉轴**单行**对齐方式；

   - `align-content`：交叉轴**多行**对齐方式（仅 `flex-wrap: wrap` 时生效）。

2. 对齐方式核心区别：

| 属性            | 作用轴 | 生效条件 | 示例场景                      |
| --------------- | ------ | -------- | ----------------------------- |
| justify-content | 主轴   | 始终生效 | 水平居中（row 主轴）          |
| align-items     | 交叉轴 | 单行     | 单行垂直居中                  |
| align-content   | 交叉轴 | 多行     | 多行垂直分布（space-between） |

**坑点**：`align-content` 优先级高于 `align-items`（多行时）。

#### Q9：flex: 1 的完整拆解？flex-grow/flex-shrink/flex-basis 的作用？

**标准答案**：

1. `flex: 1` 等价于 `flex: 1 1 0%`（而非 0px！），三个值分别对应：

   - `flex-grow: 1`：剩余空间分配比例（0 不分配，1 均分）；

   - `flex-shrink: 1`：空间不足时的收缩比例（0 不收缩）；

   - `flex-basis: 0%`：元素的基准宽度（优先级高于 width）。

2. 各属性详解：

   - `flex-grow`：仅在容器宽度 > 所有子元素 flex-basis 总和时生效；

   - `flex-shrink`：仅在容器宽度 < 所有子元素 flex-basis 总和时生效，收缩量 = (超出宽度 \* 元素 flex-shrink) / 所有元素 flex-shrink 总和；

   - `flex-basis`：优先级 > width > 内容宽度，设为 `auto` 则取 width/内容宽度，设为 0% 则完全按比例分配。

**高频坑点**：

- `flex: 1` 若写成 `flex-grow: 1` 但未设置 `flex-basis: 0%`，子元素会保留内容宽度，导致比例分配不均；

- `flex-shrink: 0` 可防止元素被压缩（如固定宽度按钮）。

#### Q10：Flex 布局的常见坑点？（子元素宽度失效/换行异常）

**标准答案**：

1. 子元素 width 失效：

   - 原因：`flex-shrink: 1` 导致空间不足时收缩，或 `flex-basis` 优先级高于 width；

   - 解决：`flex-shrink: 0`（禁止收缩），或 `flex-basis: auto`（保留 width）。

2. 换行异常（`flex-wrap: wrap` 不生效）：

   - 原因：子元素 `flex-basis` 总和固定，或容器有固定宽度；

   - 解决：给子元素设置 `flex-basis`（如 30%），或容器宽度设为 `auto`。

3. 垂直居中失效：

   - 原因：容器未设置高度，或主轴方向错误；

   - 解决：容器设 `height/ min-height`，`flex-direction: row` 时用 `align-items: center`。

4. 空白间隙：

   - 原因：子元素为 `inline-flex` 或换行符导致；

   - 解决：容器设 `font-size: 0`，或子元素设 `display: block`。

#### Q11：Flex 实现圣杯布局/双飞翼布局？（一行代码版）

**标准答案**：

1. 圣杯布局（header+footer 固定，中间三列：左/右固定，中间自适应）：

```HTML

<div class="container">
  <header>头部</header>
  <main class="content">
    <div class="left">左</div>
    <div class="center">中</div>
    <div class="right">右</div>
  </main>
  <footer>底部</footer>
</div>
```

```CSS

.container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* 占满视口高度 */
}
header, footer {
  height: 60px; /* 固定高度 */
  flex-shrink: 0; /* 禁止收缩 */
}
.content {
  display: flex;
  flex: 1; /* 中间自适应 */
}
.left, .right {
  width: 200px; /* 固定宽度 */
  flex-shrink: 0; /* 禁止收缩 */
}
.center {
  flex: 1; /* 中间自适应 */
}
```

1. 核心优势：无需浮动/定位，无塌陷问题，适配性更强。

---

## 第四部分：Grid 布局（大厂中高级必问）

### 五、Grid 布局核心与实战

#### Q12：Grid 与 Flex 的核心区别？适用场景？

**标准答案**：

| 维度                                                                                 | Flex 布局                         | Grid 布局                                |
| ------------------------------------------------------------------------------------ | --------------------------------- | ---------------------------------------- |
| 布局维度                                                                             | 一维（单行/单列）                 | 二维（行+列）                            |
| 对齐方式                                                                             | 主轴+交叉轴                       | 行轴+列轴，支持单元格精准对齐            |
| 适用场景                                                                             | 线性布局（导航栏、单行/单列列表） | 二维布局（卡片网格、表单、页面整体布局） |
| 灵活性                                                                               | 更灵活，适配动态内容              | 更规整，适合固定网格                     |
| 学习成本                                                                             | 低                                | 高                                       |
| **工程化建议**：简单线性布局用 Flex，复杂二维布局用 Grid（如电商首页网格、仪表盘）。 |                                   |                                          |

#### Q13：Grid 容器/项目的核心属性？grid-template 的简写？

**标准答案**：

1. Grid 容器核心属性：

   - `display: grid/inline-grid`：开启 Grid 布局；

   - `grid-template-rows/columns`：定义行/列尺寸（如 `100px 1fr auto`）；

   - `grid-gap`（`gap`）：行/列间距（`row-gap`/`column-gap` 拆分）；

   - `justify-items/align-items`：单元格内容对齐；

   - `justify-content/align-content`：整个网格在容器内的对齐。

2. Grid 项目核心属性：

   - `grid-row/grid-column`：指定项目占据的行/列（如 `grid-column: 1 / 3` 占 1-3 列）；

   - `grid-area`：简写 `grid-row + grid-column`（如 `grid-area: 1 / 1 / 3 / 3`）。

3. 简写规则：

   - `grid-template: 行 / 列`（如 `grid-template: 100px 1fr / 200px 1fr`）；

   - `grid: 行 / 列`（包含 `grid-template` + `grid-gap`，慎用）。

**示例**：3 列等宽网格

```CSS

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列均分 */
  gap: 20px; /* 行列间距20px */
}
```

#### Q14：Grid 实现响应式网格（自适应列数）？

**标准答案**：

用 `auto-fit` + `minmax` 实现“自动适配列数，列宽最小固定、最大自适应”：

```CSS

.grid-container {
  display: grid;
  /* 列宽最小200px，最大1fr，自动适配列数 */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

**原理**：

- `auto-fit`：自动填充列数，适配容器宽度；

- `minmax(200px, 1fr)`：列宽最小 200px（不足则换行），最大均分剩余空间；

- 优势：无需媒体查询，适配所有屏幕宽度。

---

## 第五部分：传统布局（浮动/定位）

### 六、浮动与清除浮动

#### Q15：浮动的特性？为什么会导致父元素高度塌陷？清除浮动的方法？

**标准答案**：

1. 浮动特性：

   - 脱离文档流（但不脱离文本流，文字会环绕）；

   - 元素变为行内块级（宽高由内容决定，可设宽高）；

   - 多个浮动元素并排，超出容器则换行。

2. 父元素高度塌陷原因：浮动元素脱离文档流，父元素无法感知其高度，默认高度为 0。

3. 清除浮动的方法（按推荐度排序）：

   - 方法 1：父元素开启 BFC（`overflow: hidden`/`display: flow-root`），最简洁；

   - 方法 2：伪元素清除（通用方案）：

     ```CSS

     .clearfix::after {
       content: "";
       display: block;
       clear: both;
       height: 0;
       visibility: hidden;
     }
     .clearfix { zoom: 1; /* 兼容IE6/7 */ }
     ```

   - 方法 3：父元素加空 div（`<div style="clear: both"></div>`），冗余不推荐；

   - 方法 4：父元素设 `float`，但会引发新的布局问题，慎用。

### 七、定位布局

#### Q16：position 的取值？各自的定位参考点？层叠规则？

**标准答案**：

| 取值       | 定位参考点                                                | 是否脱离文档流       | 适用场景                   |
| ---------- | --------------------------------------------------------- | -------------------- | -------------------------- |
| static     | 默认值，无定位                                            | 否                   | 普通文档流布局             |
| relative   | 自身原始位置                                              | 否（保留占位）       | 微调位置、作为绝对定位容器 |
| absolute   | 最近的已定位祖先（relative/absolute/fixed），无则为根元素 | 是（不保留占位）     | 弹窗、悬浮元素             |
| fixed      | 视口（viewport）                                          | 是                   | 固定导航、回到顶部按钮     |
| sticky     | 滚动到阈值前 relative，阈值后 fixed                       | 否（滚动前保留占位） | 吸顶导航、表格表头         |
| **坑点**： |                                                           |                      |                            |

- `sticky` 生效条件：必须设置 `top/bottom/left/right`，且父元素无 `overflow: hidden`；

- `fixed` 在 `transform` 父元素内，参考点变为父元素（而非视口）。

#### Q17：absolute 居中的多种实现方式？

**标准答案**：

1. 经典方案（已知宽高）：

```CSS

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin: -100px 0 0 -100px; /* 负一半宽高 */
}
```

1. 通用方案（未知宽高）：

```CSS

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 自身50% */
}
```

1. Grid/Flex 容器方案（最简）：

```CSS

.parent {
  display: flex; /* 或 grid */
  justify-content: center;
  align-items: center;
}
.absolute-center {
  position: absolute; /* 不影响Flex/Grid居中 */
}
```

1. CSS3 新方案：

```CSS

.absolute-center {
  position: absolute;
  inset: 0; /* top/right/bottom/left: 0 */
  margin: auto;
  width: 200px; /* 可设可省 */
  height: 200px;
}
```

---

## 第六部分：响应式与适配（大厂实战必问）

### 八、响应式布局核心

#### Q18：rem/em/vw/vh/% 的区别？适配方案选择？

**标准答案**：

| 单位               | 参考基准                   | 特点                   | 适用场景               |
| ------------------ | -------------------------- | ---------------------- | ---------------------- |
| rem                | 根元素（html）的 font-size | 全局统一基准，适配方便 | 移动端整体适配         |
| em                 | 自身/父元素的 font-size    | 局部适配，嵌套易混乱   | 局部文字/间距          |
| vw/vh              | 视口宽度/高度的 1%         | 直接关联视口，无需计算 | 移动端适配、全屏布局   |
| %                  | 父元素对应属性的 100%      | 依赖父元素，布局灵活   | 宽度自适应、百分比布局 |
| px                 | 固定像素                   | 精准，无适配性         | 固定尺寸、边框、阴影   |
| **核心适配逻辑**： |                            |                        |                        |

- 移动端：优先 `vw`（如 `font-size: 4vw`）或 `rem`（动态设置 html font-size）；

- PC 端：优先 `%`/`flex`/`grid`，配合媒体查询；

- 文字：移动端用 `rem/vw`，PC 端用 `px`（14-16px 最小可读）。

#### Q19：移动端适配方案（rem 适配/vw 适配）？原理与实现？

**标准答案**：

1. rem 适配（经典方案，兼容低版本）：

   - 原理：动态设置 html 的 `font-size = 视口宽度 / 设计稿宽度 * 基准值`（如设计稿 750px，基准值 100 → html font-size = 100vw / 7.5）；

   - 实现（JS 动态计算）：

     ```JavaScript

     function setRem() {
       const designWidth = 750; // 设计稿宽度
       const baseFontSize = 100;
       const clientWidth = document.documentElement.clientWidth;
       const rem = clientWidth / designWidth * baseFontSize;
       document.documentElement.style.fontSize = rem + 'px';
     }
     setRem();
     window.addEventListener('resize', setRem);
     ```

   - 工程化：用 postcss-pxtorem 自动将 px 转为 rem。

2. vw 适配（极简方案，现代浏览器）：

   - 原理：直接将设计稿 px 转为 vw（1vw = 750px 设计稿的 7.5px → 1px = 1/7.5 vw）；

   - 实现：postcss-px-to-viewport 自动转换，无需 JS；

   - 配置示例：

     ```JavaScript

     // postcss.config.js
     module.exports = {
       plugins: {
         'postcss-px-to-viewport': {
           viewportWidth: 750, // 设计稿宽度
           unitPrecision: 2, // 精度
           viewportUnit: 'vw',
           selectorBlackList: ['.ignore'], // 忽略类
         }
       }
     }
     ```

3. 方案对比：rem 适配兼容更好，vw 适配更简洁（无需 JS），现代项目优先 vw。

#### Q20：媒体查询（@media）的用法？断点选择？

**标准答案**：

1. 基本语法：

```CSS

/* 屏幕宽度 ≤768px 生效 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
/* 屏幕宽度 ≥1200px 生效 */
@media (min-width: 1200px) {
  .container {
    width: 1140px;
    margin: 0 auto;
  }
}
/* 组合条件（宽≥768 且 ≤992） */
@media (min-width: 768px) and (max-width: 992px) {
  .col {
    width: 50%;
  }
}
```

1. 大厂通用断点（移动端优先）：

   - 移动端：≤767px；

   - 平板：768px ~ 991px；

   - 小屏 PC：992px ~ 1199px；

   - 大屏 PC：≥1200px。

2. 工程化建议：

   - 移动端优先（先写移动端样式，再用 `min-width` 覆盖大屏）；

   - 断点不宜过多（3-4 个即可），避免样式冗余。

---

## 第七部分：CSS 进阶与性能

### 九、CSS 进阶特性

#### Q21：CSS 变量（Custom Properties）的用法？优势？

**标准答案**：

1. 基本用法：

```CSS

/* 定义变量（:root 全局，类/元素内局部） */
:root {
  --primary-color: #1890ff;
  --font-size: 16px;
  --gap: 20px;
}
/* 使用变量 */
.button {
  background: var(--primary-color);
  font-size: var(--font-size);
  margin: var(--gap);
  /* 变量默认值（变量未定义时生效） */
  color: var(--text-color, #333);
}
/* 动态修改（JS） */
document.documentElement.style.setProperty('--primary-color', '#40a9ff');
```

1. 核心优势：

   - 统一管理样式（主题色/间距/字体），减少重复代码；

   - 支持动态修改（JS 交互），实现主题切换；

   - 支持继承，局部覆盖全局，灵活性高；

   - 兼容现代浏览器（IE 不支持）。

#### Q22：CSS 选择器的优先级？计算规则？

**标准答案**：

1. 优先级从高到低：

`!important` → 内联样式（style=""）→ ID 选择器（#id）→ 类/伪类/属性选择器（.class/:hover/[type]）→ 标签/伪元素选择器（div/:before）→ 通配符（\*）→ 继承样式。

1. 计算规则（权重值）：

   - 内联样式：1,0,0,0；

   - ID 选择器：0,1,0,0；

   - 类/伪类/属性：0,0,1,0；

   - 标签/伪元素：0,0,0,1；

   - 规则：权重值逐位比较，高位大则优先级高（如 0,1,0,0 > 0,0,99,99）；

2. 坑点：

   - `!important` 优先级最高，但慎用（破坏样式层级）；

   - 相同权重时，后定义的样式覆盖先定义的；

   - 继承样式优先级最低，任何直接选择器都能覆盖。

### 十、CSS 性能优化

#### Q23：CSS 渲染性能优化？（减少重排重绘）

**标准答案**：

1. 减少重排（Reflow）：

   - 批量修改 DOM（DocumentFragment/离线 DOM）；

   - 避免频繁读取布局属性（offsetWidth/scrollTop），读写分离；

   - 动画元素脱离文档流（absolute/fixed），缩小重排范围；

   - 用 `transform/opacity` 替代宽高/位置修改（仅触发合成，无重排）。

2. 减少重绘（Repaint）：

   - 合并样式修改（`element.style.cssText = 'a:1; b:2'`）；

   - 避免使用昂贵样式（box-shadow/filter/gradients），或用 `will-change` 提前优化；

   - 用 CSS 精灵图（sprite）减少图片请求，避免频繁绘制。

3. 渲染优化：

   - 关键 CSS 内联（`<style>` 放在 head），避免渲染阻塞；

   - 非关键 CSS 异步加载（link rel="preload" + onload）；

   - 开启硬件加速（transform: translateZ(0)），但避免层爆炸。

#### Q24：CSS 工程化优化？（可维护性/体积）

**标准答案**：

1. 代码组织：

   - 按功能拆分文件（base.css/reset.css/component.css）；

   - 使用 BEM 命名规范（.block\_\_element--modifier），避免样式冲突；

   - 用 CSS 预处理器（Sass/Less）：变量、混合、嵌套、继承，提升可维护性。

2. 体积优化：

   - 用 PostCSS 自动前缀（autoprefixer），按需添加浏览器前缀；

   - 压缩 CSS（cssnano），移除注释/空格/冗余代码；

   - Tree Shaking（purgecss），移除未使用的样式；

   - 拆分样式（关键 CSS 内联，非关键异步）。

3. 复用性：

   - 提取通用样式（mixin/utility class，如 .flex-center/.mb-10）；

   - 使用 CSS Modules 或 CSS-in-JS，避免全局样式污染。

---

## CSS 与布局模块核心总结

1. **核心原理**：盒模型（border-box 全局设置）、BFC（解决塌陷/重叠）、层叠上下文（z-index 生效条件）是 CSS 布局的三大底层原理；

2. **布局优先级**：简单线性布局用 Flex，复杂二维布局用 Grid，传统浮动/定位仅作补充；

3. **适配核心**：移动端优先 vw 适配（简洁）/rem 适配（兼容），PC 端用 Flex/Grid + 媒体查询；

4. **性能关键**：避免频繁重排重绘，优先用 transform/opacity 做动画，关键 CSS 内联；

5. **易混坑点**：flex:1 是 1 1 0%、z-index 仅对定位元素生效、sticky 需设 top/bottom 且父无 overflow:hidden。

> （注：文档部分内容可能由 AI 生成）
