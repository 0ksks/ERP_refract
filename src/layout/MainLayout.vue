<template>
  <!-- 使用el-container布局组件，外层容器 -->
  <el-container class="out-wrapper">
    <!-- 主体内容容器 -->
    <el-main class="content-wrapper">
      <!-- 遍历titleFieldsMapping数组，为每个表单段创建一个FormSegment组件 -->
      <div
        :id="seg_idx"
        v-for="(item, seg_idx) in titleFieldsMapping"
        :key="seg_idx"
      >
        <!-- 渲染FormSegment组件，传递表单数据、标题、字段和描述 -->
        <FormSegment
          :form="form"
          :title="item[0]"
          :fields="item[1]"
          :desc="item[2]"
        />
      </div>
      <!-- 保存按钮，点击时调用saveMaterial方法 -->
      <el-button type="primary" plain @click="save">
        Save
      </el-button>
    </el-main>
  </el-container>
</template>

<script>
import FormSegment from "@/components/FormSegment.vue";

export default {
  components: {
    FormSegment, // 引入并注册FormSegment组件
  },
  props: {
    titleFieldsMapping: {
      type: Array,
      required: true, // 传递的titleFieldsMapping数组，用于配置每个表单段的标题、字段和描述
    },
    form: {
      type: Object,
      required: true,
    },
  },
  methods: {
    save() {
      console.log("save clicked, the form is", this.form);
    }
  },
  setup() {
  },
};
</script>

<style lang="css">
/* 外层容器样式 */
.out-wrapper {
  width: 100%;
  height: 100%;
}

/* 内容容器样式 */
.content-wrapper {
  height: 100%; /* 限制高度以触发滚动 */
  position: relative;
  width: 100%;
  overflow-y: scroll; /* 允许垂直方向滚动 */
}
</style>
