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
import BookShelfReader from './.vitepress/theme/components/BookShelfReader.vue'
const { site } = useData()
</script>

<div class="ebook-reader-wrapper">
  <h1>{{ site.title }} - 在线阅读</h1>
    <BookShelfReader />
</div>
