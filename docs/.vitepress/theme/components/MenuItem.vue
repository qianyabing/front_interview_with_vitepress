<template>
  <!-- 有子菜单：使用 el-sub-menu -->
  <el-sub-menu v-if="item.children && item.children.length" :index="item.url">
    <template #title>
      <!-- 可选的图标 -->
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span>{{ item.label }}</span>
    </template>
    <!-- 递归渲染子节点 -->
    <MenuItem
      v-for="child in item.children"
      :key="child.url"
      :item="child"
    />
  </el-sub-menu>

  <!-- 无子菜单：使用 el-menu-item -->
  <el-menu-item v-else :index="item.url">
    <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
    <template #title>{{ item.label }}</template>
  </el-menu-item>
</template>

<script setup>
import { ElMenu, ElMenuItem, ElIcon, ElSubMenu } from 'element-plus'
import 'element-plus/dist/index.css'
// 定义 props，接收单个菜单项数据
const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (val) => typeof val.url === 'string' && typeof val.label === 'string'
  }
})
</script>