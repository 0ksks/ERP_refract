<template>
  <el-container class="out-wrapper">
    <el-main class="content-wrapper">
      <div
        :id="seg_idx"
        v-for="(item, seg_idx) in titleFieldsMapping"
        :key="seg_idx"
      >
        <FormSegment
          :form="form"
          :title="item[0]"
          :fields="item[1]"
          :desc="item[2]"
          @update:form="handleFormUpdate"
        />
      </div>
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
    FormSegment,
  },
  props: {
    titleFieldsMapping: {
      type: Array,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handleFormUpdate(updatedForm) {
      // 更新MainPage.vue中的mainForm
      Object.assign(this.form, updatedForm);
    },
    save() {
      console.log("save clicked, the form is", this.form);
    },
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
