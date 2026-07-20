# 二、DOM与事件模型



|主题|核心知识点|概览|
|---|---|---|
|[1\.事件流：捕获与冒泡](https://w0hog67yl81.feishu.cn/wiki/KUAIwk1PtiMvmmkoHDecqbCenFg)|• 描述 DOM 的事件流|**建立心智模型**。了解一个事件从外到内（捕获）再从内到外（冒泡）的完整路径。|
|[2\.事件委托：更高效的监听](https://w0hog67yl81.feishu.cn/wiki/NT2dwqrRyivoqBkAZwAcVmKjnXb)<br>|• 什么是事件委托及其优点<br>• `event.target` vs `event.currentTarget`<br>|**核心实战技巧**。基于“冒泡”原理，引出事件委托，对比为每个子元素绑定事件与在父元素上统一监听的优劣，并解释`target`与`currentTarget`的区别。|
|[3\.阻止冒泡与默认行为](https://w0hog67yl81.feishu.cn/wiki/VY5awlXTgiEEjakoOJFcx3Ozn3e)|• `event.stopPropagation()`<br>•`event.preventDefault()`|**掌握控制权**。用清晰的示例分别演示如何阻止事件继续传播，以及如何阻止链接跳转、表单提交等浏览器默认行为。|
|[4\.深入 addEventListener](https://w0hog67yl81.feishu.cn/wiki/ROixwGDGNi5yFXkhYUgcWCtCnyb)<br>|• `useCapture` 和 `passive` 的作用|**性能与控制**。讲解`addEventListener`的第三个参数。`useCapture`关联到捕获阶段，而`passive: true`则是一个重要的滚动性能优化点。|



