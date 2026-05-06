<template>
  <!-- 有子菜单：使用 el-sub-menu -->
  <el-sub-menu 
    v-if="hasChildren" 
    :index="item.url"
    :popper-append-to-body="true"
  >
    <template #title>
      <el-icon v-if="item.icon && item.icon !== 'Document'">
        <component :is="getIconComponent(item.icon)" />
      </el-icon>
      <el-icon v-else-if="item.icon === 'Document'">
        <Document />
      </el-icon>
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
  <el-menu-item 
    v-else 
    :index="item.url"
    :disabled="!item.url"
  >
    <el-icon v-if="item.icon && item.icon !== 'Document'">
      <component :is="getIconComponent(item.icon)" />
    </el-icon>
    <el-icon v-else-if="item.icon === 'Document'">
      <Document />
    </el-icon>
    <template #title>{{ item.label }}</template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'  // 关键：导入 computed
import { ElMenuItem, ElIcon, ElSubMenu } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
// import MenuItem from './MenuItem.vue'  // 递归引用自身

const props = defineProps({
  item: {
    type: Object,
    required: true,
    validator: (val) => typeof val.url === 'string' && typeof val.label === 'string'
  }
})

// 判断是否有子菜单
const hasChildren = computed(() => props.item.children && props.item.children.length)

// 图标映射，便于扩展
const getIconComponent = (iconName) => {
  const icons = {
    Document
  }
  return icons[iconName] || Document
}
</script>

<style scoped>
:deep(.el-sub-menu__title) {
  transition: all 0.3s ease;
}
:deep(.el-menu--horizontal .el-menu-item.is-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  color: #c0c4cc;
}
@media (max-width: 768px) {
  :deep(.el-sub-menu__title),
  :deep(.el-menu-item) {
    touch-action: manipulation;
  }
}
</style>