---
title: PDF
date: 2026-04-12 21:25:02
categories:
  - pdf
tags:
  - pdf
sidebar: false
articleShare: false
outline: false
aside: false
---

<div class="pdf-layout">
<client-only>
  <!-- 顶部菜单栏 -->
  <div class="top-navbar">
    <el-menu
      :default-active="activeMenu"
      :ellipsis="false"
      mode="horizontal"
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#409EFF"
      @select="handleMenuSelect"
      class="top-menu"
    >
      <MenuItem
        v-for="item in menuData"
        :key="item.label"
        :item="item"
      />
    </el-menu>
  </div>
  <div class="pdf-viewer-container">
    <AsyncPDFReader :src="currentPdf" />
  </div>
</client-only>
</div>

<script setup>
import { ref } from 'vue'
import { ElMenu } from 'element-plus'
import 'element-plus/dist/index.css'
import MenuItem from './.vitepress/theme/components/MenuItem.vue'
import { defineClientComponent } from 'vitepress'

const AsyncPDFReader = defineClientComponent(() => {
  return import('./.vitepress/theme/components/PDFViewerIframe.vue')
  // return import('./.vitepress/theme/components/PDFViewer.vue')
})

// 菜单数据
const menuData = ref([
  {
    label: 'pdf资料',
    icon: 'Document',
    url: '1.1',
    children: [
      { label: "1.JavaScript-210页", url: "/pdfs/manual/1.JavaScript面试真题-210页.pdf" },
      { label: "2.CSS-127页", url: "/pdfs/manual/2.CSS面试真题-127页.pdf" },
      { label: "3.ES6-84页", url: "/pdfs/manual/3.ES6面试真题-84页.pdf" },
      { label: "4.Vue-237页", url: "/pdfs/manual/4.Vue面试真题-237页.pdf" },
      { label: "5.Vue3-44页", url: "/pdfs/manual/5.Vue3面试真题-44页.pdf" },
      { label: "6.React-156页", url: "/pdfs/manual/6.React面试真题-156页.pdf" },
      { label: "7.Node.js-71页", url: "/pdfs/manual/7.Node.js面试真题-71页.pdf" },
      { label: "8.小程序-37页", url: "/pdfs/manual/8.小程序面试真题-37页.pdf" },
      { label: "9.HTTP-62页", url: "/pdfs/manual/9.HTTP面试真题-62页.pdf" },
      { label: "10.Typescript-62页", url: "/pdfs/manual/10.Typescript面试真题-62页.pdf" },
      { label: "11.Webpack-59页", url: "/pdfs/manual/11.Webpack面试真题-59页.pdf" },
      { label: "12.Git-43页", url: "/pdfs/manual/12.Git面试真题-43页.pdf" },
      { label: "13.Linux-34页", url: "/pdfs/manual/13.Linux面试真题-34页.pdf" },
      { label: "14.算法-82页", url: "/pdfs/manual/14.算法面试真题-82页.pdf" },
      { label: "15.设计模式-31页", url: "/pdfs/manual/15.设计模式面试真题-31页.pdf" },
    ]
  },
  {
    label: 'pdf读物',
    icon: 'Document',
    url: '1.2',
    children: [
      { label: "跨越圈层：让自己不断变好的底层逻辑 (苏星宁)", url: "/pdfs/other/109-跨越圈层：让自己不断变好的底层逻辑 (苏星宁).pdf" },
    ]
  }
])

// 状态变量
const activeMenu = ref(menuData.value[0].children[0].url)
const currentPdf = ref(menuData.value[0].children[0].url)

// 菜单点击事件
const handleMenuSelect = (url) => {
  if (!url) return
  activeMenu.value = url
  currentPdf.value = url
}
</script>

<style scoped>
.pdf-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航栏容器 */
.top-navbar {
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
}

/* 水平菜单强制不换行，支持横滑滚动 */
.top-menu {
  display: inline-flex;
  border-bottom: none;
  white-space: nowrap;
}

/* 覆盖 Element Plus 默认样式，让菜单项在一行内展示 */
.top-menu :deep(.el-menu--horizontal) {
  display: inline-flex;
  flex-wrap: nowrap;
}

.top-menu :deep(.el-menu-item),
.top-menu :deep(.el-sub-menu__title) {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

/* 自定义滚动条 */
.top-navbar::-webkit-scrollbar {
  height: 4px;
}
.top-navbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}
.top-navbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

/* PDF 阅读区域，占满剩余空间 */
.pdf-viewer-container {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
  padding: 16px;
  min-height: 0;
}

/* 移动端优化：阅读区域占满屏幕宽度 */
@media (max-width: 768px) {
  .pdf-viewer-container {
    padding: 8px;
  }
}

/* 确保 PDF 阅读器组件占满容器 */
.pdf-viewer-container :deep(> *) {
  width: 100%;
  height: 100%;
}

.vp-doc li + li {
  margin-top: 0;
}
</style>
