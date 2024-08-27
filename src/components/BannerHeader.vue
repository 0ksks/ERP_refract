<template>
  <!-- 最外层容器，垂直布局 -->
  <div class="verticalContainer">
    <!-- 内层容器，水平布局 -->
    <div class="horizontalContainer">
      <!-- 使用 v-for 循环渲染 componentRouteMapping 数组中的每一项 -->
      <div v-for="(item, index) in [['ArrowLeft',-1],...componentRouteMapping]" :key="index">
        <!-- Icon 点击时，导航到对应的路由 -->
        <el-icon @click="navigateTo(item[1])">
          <!-- 动态加载组件，组件名称通过 resolvedComponent 方法解析 -->
          <component :is="resolvedComponent(item[0])"></component>
        </el-icon>
      </div>
      <!-- 标题文本，居中显示 -->
      <h3>
        {{ headingString }}
      </h3>
    </div>
    <!-- 分割线，设置白色边框及上下间距 -->
    <el-divider style="border-color: white; margin-top: 15px; padding-bottom: 25px"></el-divider>
  </div>
</template>

<script>
import { resolveComponent } from "vue"

export default {
  name: "BannerHeader",
  props: {
    headingString: {
      type: String,
      required: true, // 标题字符串，必须传递
    },
    componentRouteMapping: {
      type: Array,
      required: true, // 组件和路由的映射数组，必须传递
    },
  },
  methods: {
    // 动态解析组件名称为实际的 Vue 组件
    resolvedComponent(componentName) {
      return resolveComponent(componentName)
    },
    navigateTo(url) {
      if (url === -1) {
        this.$router.go(-1)
      } else if (url.includes("html")) {
        document.location.href = url;
      } else {
        this.$router.push(url)
      }
    }
  },
}
</script>

<style lang="css" scoped>
/* 外层垂直容器样式 */
.verticalContainer {
  color: white; /* 设置文本颜色为白色 */
  margin-top: 20px; /* 上边距为20px */
}
.verticalContainer hr {
  border-bottom: black; /* 设置 hr 元素的底部边框为黑色 */
}
/* 内层水平容器样式 */
.horizontalContainer {
  display: flex; /* 使用 flex 布局 */
  align-items: center; /* 垂直居中对齐 */
  position: relative; /* 相对定位 */
  gap: 10px; /* 子元素之间的间距为10px */
  font-size: 1em; /* 字体大小为1em */
  height: 30px; /* 高度为30px */
}
/* 水平容器内的 h3 标题样式 */
.horizontalContainer h3 {
  position: absolute; /* 绝对定位 */
  left: 50%; /* 水平居中，左边距为50% */
  transform: translateX(-50%); /* 将元素向左移动自身宽度的50%以实现真正居中 */
}
/* el-icon 组件的样式 */
.el-icon {
  font-size: 1.5em; /* 字体大小为1.5em */
}
/* 当鼠标悬停在 el-icon 上时，颜色变为激活状态颜色 */
.el-icon:hover {
  color: var(--background-hover); /* 使用CSS变量定义的激活颜色 */
}
</style>
