<template>
    <div class="pdf-viewer-container">
        <PDFViewer style="height: calc(100vh - 90px);" :config="config" @ready="onReady" />
    </div>
</template>

<script setup>
import { PDFViewer } from '@embedpdf/vue-pdf-viewer';

// 定义组件接收的属性
const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    theme: {
        type: Object,
        default: () => ({ preference: 'light' }),
    },
    disabledCategories: {
        type: Array,
        default: () => [],
    },
});

// PDF查看器的配置项
const config = {
    src: props.src,
    theme: props.theme,
    disabledCategories: props.disabledCategories,
};

// 当查看器准备就绪时触发
const onReady = (registry) => {
    console.log('PDF viewer is ready', registry);
};
</script>

<style scoped>
.pdf-viewer-container {
    height: 100%;
    width: 100%;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
}
</style>