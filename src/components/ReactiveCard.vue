<template>
  <!-- 使用el-card组件，定义为一个具有灵活布局的卡片，阴影效果设置为never -->
  <el-card class="flex-card-private" shadow="never">
    <!-- 使用插槽，允许父组件向ReactiveCard中传递内容 -->
    <slot></slot>
  </el-card>
</template>

<script>
export default {
  name: "ReactiveCard", // 组件名称为ReactiveCard
}
</script>
