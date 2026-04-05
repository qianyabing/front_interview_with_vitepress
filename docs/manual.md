---
title: PDF 
date: 2026-03-29 21:25:02
permalink: /pdf/manual
categories:
  - pdf
tags:
  - pdf
---

<div style="display: flex; gap: 24px;">
  <div style="width: 260px; flex-shrink: 0; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; background: #fafbfc;">
    <el-tree
      :data="treeData"
      @node-click="handleNodeClick"
      highlight-current
      default-expand-all
      style="width: 100%; height: 100%;"
    />
  </div>
  <div style="flex: 1; width: 1028px; overflow: auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px;">
    <ClientOnly>
      <PDFViewer
        :src="currentPdf"
        :theme="{
          preference: 'system',
          light: {
            accent: {
              primary: '#42b883' // 自定义主题色
            }
          }
        }"
        :disabledCategories="['annotation', 'print', 'export']"
      />
    </ClientOnly>
  </div>
</div>

<script setup>
import { ref } from 'vue'
import { ElTree } from 'element-plus'
import 'element-plus/dist/index.css'
import PDFViewer from './.vitepress/theme/components/PDFViewer.vue';

const treeData = ref([
  {
    label: '一套pdf资料',
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
  }
])
const currentPdf = ref(treeData.value[0].children[0].url)
const handleNodeClick = (data) => {
  if (data.url) {
    currentPdf.value = data.url
  }
}
</script>
