<!-- .vitepress/theme/components/BookShelfReader.vue -->
<template>
  <div class="bookshelf-reader">
    <!-- 书架区域 -->
    <div class="bookshelf">
      <h3>📚 我的书架</h3>
      <div class="book-list">
        <div v-for="book in books" :key="book.src" class="book-item" :class="{ active: currentBook?.src === book.src }"
          @click="switchBook(book)">
          <div class="book-cover">
            <!-- 如果有封面图片可以显示，没有则显示默认图标 -->
            <span class="book-icon">📖</span>
          </div>
          <div class="book-title">{{ book.name }}</div>
        </div>
      </div>
    </div>

    <!-- 阅读器区域 -->
    <div class="reader-area">
      <h4 v-if="currentBook">正在阅读：《{{ currentBook.name }}》</h4>
      <AsyncEpubReader v-if="currentBook" :src="currentBook.src" :key="currentBook.src" />
      <div v-else class="no-book">请从书架选择一本书开始阅读</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineClientComponent } from 'vitepress'

const AsyncEpubReader = defineClientComponent(() => {
  return import('./EpubReader.vue')
})

// 书籍列表配置（可以硬编码，也可以动态获取）
const books = ref([
  { name: '剑来（1-49册）(烽火戏诸侯)', src: '/books/剑来（1-49册）(烽火戏诸侯).epub' },
  { name: '小岛经济学', src: '/books/小岛经济学.epub' },
  { name: '精进：从平凡到卓越的七大启示 (【美】史蒂芬·柯维)', src: '/books/096-精进：从平凡到卓越的七大启示 (【美】史蒂芬·柯维).epub' },
  { name: '拆商：解决你人生99的难题 (笛子)', src: '/books/030-拆商：解决你人生99的难题 (笛子).epub' }
])

const currentBook = ref(null)

// 切换书籍
const switchBook = (book) => {
  currentBook.value = book
  // 可选：保存最近阅读的书籍到 localStorage，以便刷新后恢复
  localStorage.setItem('lastReadBook', book.src)
}

// 恢复上次阅读的书籍
onMounted(() => {
  const lastSrc = localStorage.getItem('lastReadBook')
  if (lastSrc) {
    const lastBook = books.value.find(b => b.src === lastSrc)
    if (lastBook) {
      currentBook.value = lastBook
      return
    }
  }
  // 默认选择第一本
  if (books.value.length) {
    currentBook.value = books.value[0]
  }
})
</script>

<style scoped>
.bookshelf-reader {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
}

.bookshelf {
  flex: 0 0 260px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
}

.bookshelf h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.book-item:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.book-item.active {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
}

.book-cover {
  width: 40px;
  height: 50px;
  background: #e0e0e0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.book-title {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.reader-area {
  flex: 1;
  min-width: 0;
  /* 防止溢出 */
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.reader-area h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #666;
  font-weight: normal;
}

.no-book {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.1rem;
}
</style>