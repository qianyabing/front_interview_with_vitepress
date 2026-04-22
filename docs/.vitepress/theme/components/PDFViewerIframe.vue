<template>
  <div class="pdf-viewer-container">
    <iframe
      style="height: calc(100vh - 90px); width: 100%"
      :src="src"
      frameborder="0"
      @load="onReady"
    ></iframe>
  </div>
</template>

<script setup>
// 定义组件接收的属性
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

// 当查看器准备就绪时触发
const onReady = () => {
  console.log("PDF viewer is ready");
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