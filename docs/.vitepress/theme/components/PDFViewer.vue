<template>
    <PDFViewer :key="src" :style="{height: 'calc(100vh - 300px)'}" :config="viewerConfig" />
</template>

<script setup>
import { computed } from 'vue'
import { PDFViewer } from '@embedpdf/vue-pdf-viewer';

// 配置 PDF 源文件路径（public 目录下的文件）
const props = defineProps({
  src: {
    type: String,
    required: true,
    default: ''
  },
});

// 配置查看器选项
const viewerConfig = computed(() => ({
  src: props.src,
  theme: {
    preference: 'system', // 主题：'light' | 'dark' | 'system'
  },
  zoom: {
    auto: true, // 启用自适应
    defaultMode: 'page' // 'width' 表示页面宽度适应容器宽度
  },
  // 通过 disabledCategories 禁用不需要的功能，保持界面简洁
  disabledCategories: ['print', 'download'], 
  // 如果需要，可以配置中文界面
  i18n: { defaultLocale: 'zh-CN', fallbackLocale: 'en' },
}));
</script>