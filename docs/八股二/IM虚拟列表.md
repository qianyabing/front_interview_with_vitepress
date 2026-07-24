# IM虚拟列表

## 一、面试官到底想听什么？

- **不是听你背虚拟列表原理**（这个大家都知道）
- **是听你如何解决“不定高”这个核心痛点**（图片、文本、系统消息高度各异）
- **是听你如何处理“异步加载”对布局的冲击**（缩略图下载前后高度变化）
- **是听你如何与数据流（Redux）联动**（分片加载、已读未读、滚动恢复）
- **是听你如何抽象组件实现多处复用**（会话列表、全局历史记录）

---

## 二、整体架构：你们封装的虚拟列表长什么样？

### 2.1 基础架构（一句话说清楚）

> “我们封装了一个 **`VirtualList` 类组件**，核心依赖 **`react-window`** 或自研的 **`FixedSizeList` / `VariableSizeList`**，结合 **Redux 中的消息 Map**，实现了**不定高消息的虚拟滚动**，并在三个场景（会话列表、全局历史记录、搜索高亮跳转）中复用。”

**关键点**：你们用的是类组件（因为当时 React Hooks 还没全面普及，或者为了保留 `shouldComponentUpdate` 的细粒度控制），这个细节如果面试官问“为什么不用函数组件”，你可以回答：

> “当时团队对类组件的生命周期（`componentDidUpdate`、`getSnapshotBeforeUpdate`）更熟悉，且需要精细控制 `shouldComponentUpdate` 来避免 Redux 频繁更新导致的重渲染风暴。”

### 2.2 核心数据结构

> “Redux 中维护了一个 **`messagesById: { [messageId]: Message }`** 的 Map，以及**当前会话的消息 ID 列表**。虚拟列表只接收**当前可视区需要的 messageId 列表**，然后从 Map 中取数据渲染。这样做的优势是：**消息实体只存一份，多个列表（会话列表、全局搜索）复用同一份数据**，避免了数据冗余和不一致。”

**画个图**（在脑子里或白板上）：

```
Redux Store
├── messages: {
│     byId: { msg_1: { id, type, content, height, ... }, ... },
│     allIds: ['msg_1', 'msg_2', ...]
│   }
├── currentSession: {
│     messageIds: ['msg_1', 'msg_2', ...],  // 当前会话的消息 ID 列表
│     unreadCount: 15,
│     scrollOffset: 1200
│   }
└── globalSearch: {
      messageIds: ['msg_100', 'msg_200', ...]
    }

VirtualList 组件
├── props: messageIds (从 Redux 取)
├── state: {
│     itemHeights: { msg_1: 80, msg_2: 120, ... }  // 缓存每个消息的高度
│   }
└── render: 只渲染可视区内的消息
```

## 三、核心难点与解决方案（重点！）

### 难点 1：消息类型多样，高度完全不可预知

**你的回答**：

> “IM 消息类型非常多：纯文本、带 @ 的文本、图片、文件、语音、系统通知、红包、引用回复……每种类型的高度都不一样。甚至同一种类型，因为文本长度不同，高度也千差万别。”
> 
> **解决方案**：
> 
> 1. **给每条消息一个预估高度**：文本消息按字符数估算（如每行 50 字符，行高 24px），图片消息给默认高度 120px（缩略图下载完成前）。
> 2. **真实渲染后更新高度**：每条消息渲染完成后，通过 `ref` 获取真实 DOM 高度，调用 `VirtualList` 的 `resetHeight` 方法更新缓存。
> 3. **使用 `VariableSizeList` 的 `itemSize` 函数**：根据消息类型和内容动态返回高度。
>    
>    ```javascript
>    // 伪代码
>    const getItemSize = (index) => {
>      const msg = getMessage(index);
>      if (msg.type === 'text') return calculateTextHeight(msg.content);
>      if (msg.type === 'image') return cachedHeight[msg.id] || 120;
>      if (msg.type === 'file') return 60;
>      // ...
>    };
>    ```

### 难点 2：图片消息——下载缩略图前后高度变化（这是你们的亮点！）

**你的回答**：

> “这是最棘手的场景。用户发送一张图片，缩略图需要从 CDN 下载。下载完成前，我们只能显示一个占位框（比如 120px 高）；下载完成后，要根据图片的实际宽高比计算缩略图高度。**这个高度变化会直接冲击虚拟列表的滚动位置。**”
> 
> **具体流程**：
> 
> 1. **占位阶段**：图片消息组件挂载时，`ref` 获取到的高度是占位框高度（如 120px），`VirtualList` 按这个高度计算布局。
> 2. **下载完成**：图片 `onLoad` 触发，获取自然宽高（`naturalWidth`/`naturalHeight`），按容器宽度计算出实际渲染高度。
> 3. **高度更新**：调用 `VirtualList` 的 `resetAfterIndex(index)`（`react-window` 提供的方法），告诉虚拟列表“这个位置之后的所有高度都要重新计算”。
> 4. **滚动修正**：如果当前可视区域在图片附近，需要维持滚动位置不变。用 `getSnapshotBeforeUpdate` 记录变化前后的偏移量，在 `componentDidUpdate` 中做微调。
> 
> **代码片段（可以用伪代码说明）**：
> 
> ```javascript
> // 在图片消息组件中
> const handleImageLoad = (e) => {
>   const { naturalWidth, naturalHeight } = e.target;
>   const displayWidth = containerWidth; // 容器宽度
>   const displayHeight = (naturalHeight / naturalWidth) * displayWidth;
> 
>   // 更新 Redux 中的消息高度缓存
>   dispatch(updateMessageHeight({ messageId, height: displayHeight }));
> 
>   // 通知虚拟列表重新计算
>   virtualListRef.current.resetAfterIndex(messageIndex);
> };
> ```

### 难点 3：点击右上角未读气泡加载 20 条未读消息

**你的回答**：

> “用户进入会话时，首屏只加载**最新的 10 条未读消息**（从最后一条未读开始往前取）。点击右上角的**未读气泡**时，再往历史方向加载 20 条。滚动到顶部时，继续加载更早的消息。”
> 
> **数据加载策略（你可以尝试深入讲解，配合上面的伪代码实现）**：
> 
> 1. **Redux 中的分页状态**：维护 `hasMore`、`pageSize`、`loadedCount`。
> 2. **加载时机**：
>    - 初始化时：`loadUnreadMessages({ limit: 10 })`
>    - 点击未读气泡：`loadMoreUnread({ limit: 20 })`（追加到列表顶部）
>    - 滚动到顶部：`loadMoreHistory({ limit: 20 })`（追加到列表顶部）
> 3. **加载完成后**：更新 Redux 中的消息列表，虚拟列表自动响应（因为 `messageIds` 变化了）。
> 4. **滚动位置保持**：在列表头部插入新消息时，需要用 `getSnapshotBeforeUpdate` 记录滚动偏移，防止用户视角跳动。
>    
>    ```javascript
>    // 伪代码：在 Redux 中追加历史消息时
>    const insertHistoryMessages = (state, newMessages) => {
>      // 在 allIds 头部插入新 ID
>      state.allIds = [...newMessageIds, ...state.allIds];
>      // 更新 byId Map
>      newMessages.forEach(msg => state.byId[msg.id] = msg);
>      // 记录插入的条数，用于滚动补偿
>      state.insertedCount = newMessages.length;
>    };
>    ```

### 难点 4：加载图片时，需要“微调高度以保证滚动到底部准确”

**你的回答**：

> “用户滚动到最底部时，我们希望**最后一条消息完全可见**，而不是只露出半条。但异步加载的图片会导致高度不断变化，用户明明滚到底了，图片加载完又把内容撑开了。”
> 
> **解决方案**：
> 
> 1. **预留空间**：在图片占位时，按图片的**宽高比（从消息元数据中读取）** 先计算一个近似高度，而不是用固定高度。
> 
> 2. **底部安全区**：在列表底部增加一个 **`threshold`（阈值）**，当滚动距离底部小于 20px 时，自动对齐到底部。
> 
> 3. **加载完成后微调**：图片 `onLoad` 后，重新计算高度并调用 `resetAfterIndex`，同时如果用户当前在底部，调用 `scrollToItem(列表末尾)` 保持底部对齐。
>    
>    ```javascript
>    // 伪代码
>    const handleImageLoad = (msgId) => {
>      const newHeight = calculateRealHeight(msgId);
>      updateHeightCache(msgId, newHeight);
>      listRef.current.resetAfterIndex(getMessageIndex(msgId));
>    
>      // 如果用户之前在底部，重新锚定到底部
>      if (isAtBottom()) {
>        listRef.current.scrollToItem(totalCount - 1, 'end');
>      }
>    };
>    ```

### 难点 5：多处复用——会话列表、全局历史记录、搜索跳转

**你的回答**：

> “这个 `VirtualList` 是一个**类组件**，通过 **`props` 控制不同的数据源和交互行为**：
> 
> - **会话列表**：数据源是当前会话的消息 ID 列表，支持滚动加载历史、点击未读气泡。
> - **全局历史记录**：数据源是全部历史消息（按时间倒序），不支持加载更多。
> - **搜索跳转**：数据源是搜索结果，高亮匹配关键词，并自动滚动到第一条匹配项。
> 
> **关键的复用设计**：
> 
> 1. **数据源抽象**：`VirtualList` 只接收 `messageIds: string[]`，不关心数据从哪来。
> 2. **渲染函数注入**：通过 `renderItem` 或 `children` 函数，让外部决定每条消息怎么渲染。
> 3. **行为钩子**：提供 `onLoadMore`、`onScrollToTop`、`onItemClick` 等回调，让外部控制加载逻辑。
> 4. **高度缓存独立**：每个 `VirtualList` 实例维护自己的 `itemHeights` 缓存，互不干扰。”

```javascript
// 伪代码：VirtualList 的使用方式
<VirtualList
  messageIds={currentSessionMessageIds}
  loadMore={() => dispatch(loadMoreHistory())}
  onItemClick={(msg) => dispatch(openMessageDetail(msg))}
  renderItem={(msg) => <MessageItem key={msg.id} message={msg} />}
/>
// 全局历史记录复用
<VirtualList
  messageIds={globalHistoryIds}
  renderItem={(msg) => <HistoryItem message={msg} />}
  // 不传 loadMore，就没有加载更多功能
/>
```

## 四、怎么讲才能让面试官觉得你懂？

### 4.1 不要一上来就讲代码，先讲「设计思路」

> “我们首先明确了一个原则：**虚拟列表只负责‘怎么显示’，不负责‘怎么拿数据’**。所以我们将数据管理完全交给 Redux，VirtualList 只接收一个 `messageIds` 数组。这样，不管是会话列表还是全局搜索，只要把对应的 ID 列表传进去，就能复用同一套滚动逻辑。”

### 4.2 讲坑的时候要带出「为什么会有这个坑」

> “比如图片消息的高度问题，是因为 IM 的图片缩略图是异步下载的，下载之前我们不知道宽高。如果不做特殊处理，就会出现‘滚动到某个位置，图片突然加载完，整个列表高度变了，滚动位置全乱’的情况。我们的解法是：先按消息元数据里的宽高比给一个预估值，加载完后再精确修正，并且提供‘重置高度’的接口让虚拟列表重新计算。”

### 4.3 讲完每个问题，都要说明「效果」

> “经过这些优化，我们的虚拟列表能支持单个会话 10000+ 条消息流畅滚动（60fps），图片加载前后滚动位置保持稳定，未读气泡跳转精准度在 1 条消息以内，整个模块在三个场景复用，开发效率提升了 40%。”

### 4.4 加分项：如果你知道 `getSnapshotBeforeUpdate` 和 `componentDidUpdate` 的配合

> “在消息列表头部插入新消息时，为了保持滚动位置不动，我们利用了 React 16.3 引入的 `getSnapshotBeforeUpdate` 生命周期。在渲染前记录滚动偏移量，渲染后将偏移量补偿回去，实现‘无感知加载更多’。”

```javascript
// 伪代码：VirtualList 类组件中的实现
getSnapshotBeforeUpdate(prevProps, prevState) {
  // 如果在列表顶部插入了新消息（新增 ID 在头部）
  if (this.props.messageIds.length > prevProps.messageIds.length) {
    return {
      prevScrollHeight: this.listRef.current.scrollHeight,
      prevScrollTop: this.listRef.current.scrollTop,
    };
  }
  return null;
}

componentDidUpdate(prevProps, prevState, snapshot) {
  if (snapshot) {
    const delta = this.listRef.current.scrollHeight - snapshot.prevScrollHeight;
    // 补偿滚动偏移，让用户感觉没有跳变
    this.listRef.current.scrollTop = snapshot.prevScrollTop + delta;
  }
}
```

## 五、最终的完整话术（把它当成一个小演讲）

> “面试官您好，在 WeLink 的 IM 模块中，我深度参与了**消息列表虚拟滚动组件**的维护和优化。这是一个**基于 Redux + react-window 的类组件实现**，在会话列表、全局历史记录、搜索结果三个场景中复用。
> 
> **核心挑战有三个**：
> 
> 第一，**消息类型多、高度不定**。文本、图片、文件、系统消息高度各异，甚至同类消息因内容不同高度也不同。我们通过 **`itemSize` 动态函数 + 每条消息渲染后的 `ref` 真实高度采集** 来解决，并维护了一个 **`heightCache`**，避免重复计算。
> 
> 第二，**图片缩略图异步加载导致高度变化**。这是最棘手的场景。我们的做法是：先按消息元数据的宽高比给一个预估值，下载完成后调用 `resetAfterIndex` 重新计算，同时配合 `getSnapshotBeforeUpdate` 做滚动补偿，保证用户视角不跳。
> 
> 第三，**分片加载与滚动位置的联动**。首屏只加载 10 条未读消息，点击未读气泡加载 20 条，滚动到顶部加载更多历史。每次在列表头部插入新消息时，我们通过 `getSnapshotBeforeUpdate` 记录滚动偏移，在 `componentDidUpdate` 中补偿回来，实现无感知加载。
> 
> **工程层面**：我们通过 **数据源抽象**（只传 `messageIds`）和 **渲染函数注入**（`renderItem`），让虚拟列表在三个场景无缝复用。最终效果是：单个会话 10000+ 条消息流畅滚动（60fps），图片加载前后滚动位置稳定，未读气泡跳转精准。”
> 
> “以上就是我在这块的设计思路和踩坑经历。如果让我现在重新设计，我会考虑用 **`react-window` 的 `VariableSizeList` + `useMemo` + `IntersectionObserver` 做懒加载**，以及用 **`ResizeObserver`** 监听高度变化，让代码更简洁。”

---

## 六、遇到答不上来的细节怎么办？

万一面试官追问“你们 `heightCache` 具体是用什么数据结构存的？”而你不知道——

**不要慌，用这句话兜底**：

> “这块当时是由另一位同事主力开发的，我主要负责的是**虚拟列表在业务层的接入和性能调优**，比如如何配合 Redux 的分片加载、如何做滚动补偿、如何在三个场景中复用。具体的缓存实现细节我可以快速查一下，但设计思想我理解得很透彻。”

然后顺势把话题拉回到你熟悉的领域：

> “不过我可以说一下我们在 `resetAfterIndex` 调用时机上的优化……（讲你知道的部分）”

这样既坦诚，又展示了你对整体架构的掌控力，面试官也不会死抠你没写的代码。加油！
