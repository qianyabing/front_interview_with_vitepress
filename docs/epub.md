---
title: EPUB
date: 2026-04-12 21:25:02
categories:
  - epub
tags:
  - epub
sidebar: false
articleShare: false
outline: false
aside: false
---

<script setup>
import { useData } from 'vitepress'
// import EpubReader from './.vitepress/theme/components/EpubReader.vue'
import BookShelfReader from './.vitepress/theme/components/BookShelfReader.vue'
const { site } = useData()
// const epubUrl = '/ebooks/ccc.epub'
// const epubUrl = '/ebooks/《Web前端工程师修炼之道（原书第4版）[精品]》Jennifer Niederst Robbins.epub'
</script>

<div class="ebook-reader-wrapper">
  <h1>{{ site.title }} - 在线阅读</h1>
    <!-- <EpubReader :epubUrl="epubUrl" :bookId="epubUrl" /> -->
    <BookShelfReader />
</div>
