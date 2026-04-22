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

<div class="layout">
  <div class="sidebar" :class="{ 'is-collapse': isCollapse }">
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :collapse-transition="false"
      background-color="#fafbfc"
      text-color="#303133"
      active-text-color="#409EFF"
      @select="handleMenuSelect"
    >
      <MenuItem
        v-for="item in menuData"
        :key="item.url"
        :item="item"
      ></MenuItem>
    </el-menu>
    <div class="collapse-btn" @click="toggleCollapse">
      <el-icon :size="20">
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
  </div>
  <div class="pdf-viewer">
      <AsyncPDFReader :src="currentPdf" />
  </div>
</div>

<script setup>
import { ref } from 'vue'
import { ElMenu, ElIcon } from 'element-plus'
import 'element-plus/dist/index.css'
import { Fold, Expand } from '@element-plus/icons-vue';
import MenuItem from './.vitepress/theme/components/MenuItem.vue';
import { defineClientComponent } from 'vitepress'

const AsyncPDFReader = defineClientComponent(() => {
  // return import('./.vitepress/theme/components/PDFViewerIframe.vue')
  return import('./.vitepress/theme/components/PDFViewer.vue')
})

const menuData = ref([
  {
    label: 'pdf资料',
    icon: 'Document',
    url: '',
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
    url: '',
  }
])

// 状态变量
const activeMenu = ref('')
const isCollapse = ref(false)
const currentPdf = ref(menuData.value[0].children[0].url)

// 菜单点击事件
const handleMenuSelect = (url) => {
  activeMenu.value = url
  currentPdf.value = url
}

// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.layout {
  display: flex;
  gap: 24px;
}

.sidebar {
  position: relative;
  width: 260px;
  flex-shrink: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafbfc;
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 折叠时宽度缩小到 64px（el-menu 默认折叠宽度） */
.sidebar.is-collapse {
  width: 64px;
}

/* 让 el-menu 占满剩余高度，不显示默认右边框 */
.el-menu {
  border-right: none;
  flex: 1;
  margin-top: 34px;
}

/* 折叠按钮样式 */
.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}
.collapse-btn:hover {
  background-color: #f0f2f5;
}

/* 右侧 PDF 区域 */
.pdf-viewer {
  flex: 1;
  overflow: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  min-width: 0; /* 防止内容溢出 */
}
</style>
