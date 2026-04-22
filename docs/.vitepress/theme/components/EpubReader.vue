<template>
  <div class="epub-reader-container">
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="loading" class="loading">正在加载书籍…</div>
    <template v-else>
      <div class="toolbar">
        <button @click="setTheme('light')">🌞 亮色</button>
        <button @click="setTheme('dark')">🌙 暗色</button>
        <button @click="changeFontSize(1)">🔍 放大</button>
        <button @click="changeFontSize(-1)">🔍 缩小</button>
        <button @click="toggleFlow">{{ isScrolled ? '📄 分页模式' : '📜 滚动模式' }}</button>
      </div>
      <div class="toc-sidebar" v-if="showToc">
        <h3>📑 目录</h3>
        <ul><li v-for="(ch, idx) in toc" :key="idx"><a href="#" @click.prevent="goToChapter(ch.href)">{{ ch.label }}</a></li></ul>
      </div>
      <div ref="viewerRef" class="epub-viewer"></div>
      <div class="nav-controls">
        <button @click="prevPage">◀ 上一页</button>
        <button @click="nextPage">下一页 ▶</button>
        <button @click="toggleToc">{{ showToc ? '隐藏目录' : '显示目录' }}</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import ePub from 'epubjs'

const props = defineProps({ src: { type: String, required: true } })

const viewerRef = ref(null)
let book = null
let rendition = null
const toc = ref([])
const showToc = ref(false)
const isScrolled = ref(false)
const loading = ref(true)
const error = ref('')

// 保存进度
const saveLocation = (cfi) => {
  if (cfi) localStorage.setItem(`epub-last-${props.src}`, cfi)
}

// 初始化渲染器（依赖 viewerRef 已存在）
const initRendition = async () => {
  if (!viewerRef.value) {
    error.value = '渲染容器未找到'
    return false
  }
  try {
    rendition = book.renderTo(viewerRef.value, {
      width: '100%',
      height: '100%',
      method: 'default',
      allowScriptedContent: true   // 允许执行 EPUB 内的脚本
    })
    const lastCfi = localStorage.getItem(`epub-last-${props.src}`)
    if (lastCfi) {
      await rendition.display(lastCfi)
    } else {
      await rendition.display()
    }
    rendition.on('relocated', (location) => {
      if (location?.start) saveLocation(location.start.cfi)
    })
    return true
  } catch (err) {
    error.value = `渲染失败: ${err.message}`
    return false
  }
}

// 加载书籍元数据
const loadBook = async () => {
  loading.value = true
  error.value = ''
  try {
    // 1. 创建实例
    book = ePub(props.src)
    
    // 2. 等待书籍打开
    await book.opened
    
    // 3. 获取导航信息
    const navigation = await book.loaded.navigation
    toc.value = navigation.toc
    // 元数据加载完成，允许显示 viewer 容器
    loading.value = false
    // 等待 DOM 更新，确保 viewerRef 已渲染
    await nextTick()
    await initRendition()
  } catch (err) {
    console.error(err)
    error.value = `加载失败: ${err.message || '请检查文件路径'}`
    loading.value = false
  }
}

// 监听 src 变化（书架切换书籍时重新加载）
watch(() => props.src, () => {
  if (rendition) {
    rendition.destroy()
    rendition = null
  }
  if (book) {
    book.destroy()
    book = null
  }
  loadBook()
})

onMounted(() => {
  loadBook()
})

onBeforeUnmount(() => {
  rendition?.destroy()
  book?.destroy()
})

// 以下方法保持不变
const setTheme = (theme) => {
  if (!rendition) return
  if (theme === 'dark') {
    rendition.themes.register('dark', { body: { 'background-color': '#1a1a1a', color: '#e0e0e0' } })
    rendition.themes.select('dark')
  } else {
    rendition.themes.select('default')
  }
}

const changeFontSize = (delta) => {
  if (!rendition) return
  const current = parseInt(rendition.themes.fontSize() || '16px', 10)
  const newSize = Math.max(12, Math.min(32, current + delta))
  rendition.themes.fontSize(`${newSize}px`)
}

const toggleFlow = () => {
  if (!rendition) return
  isScrolled.value = !isScrolled.value
  rendition.flow(isScrolled.value ? 'scrolled' : 'paginated')
}

const goToChapter = (href) => {
  if (!rendition) return
  rendition.display(href)
  showToc.value = false
}

const prevPage = () => rendition?.prev()
const nextPage = () => rendition?.next()
const toggleToc = () => { showToc.value = !showToc.value }
</script>

<style scoped>
.epub-reader-container {
  position: relative;
  width: 100%;
  /* 修正高度：减去 VitePress 导航栏高度和上下边距 */
  height: calc(100vh - var(--vp-nav-height, 64px) - 2rem);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.toolbar, .nav-controls {
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.nav-controls {
  border-bottom: none;
  border-top: 1px solid #ddd;
  justify-content: center;
}

.toc-sidebar {
  position: absolute;
  left: 0;
  top: 48px;
  width: 260px;
  max-height: calc(100% - 96px);
  background: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
  padding: 12px;
  z-index: 10;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
}

.epub-viewer {
  flex: 1;
  overflow: auto;
  background: #fafafa;
}

.error-message {
  padding: 20px;
  color: #d32f2f;
  background: #ffebee;
  border-radius: 4px;
  text-align: center;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

button {
  padding: 4px 12px;
  cursor: pointer;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  transition: all 0.2s;
}
button:hover {
  background: #e0e0e0;
}
</style>