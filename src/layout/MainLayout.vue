<template>
  <el-container class="out-wrapper">
    <el-tabs v-model="mode" @tab-click="handleClick">
      <el-tab-pane label="Create" name="creating"></el-tab-pane>
      <el-tab-pane label="Update" name="updating"></el-tab-pane>
      <el-tab-pane label="Delete" name="deleting"></el-tab-pane>
    </el-tabs>
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
    </el-main>
    <el-footer style="height: 25px;padding-top: 5px"><el-button type="primary" plain @click="save">
      Confirm
    </el-button></el-footer>
  </el-container>
</template>

<script>
import FormSegment from "@/components/FormSegment.vue";
import { ElMessage, ElMessageBox } from "element-plus"
import { ref,h } from "vue"
import { Edit, CirclePlus, Delete } from "@element-plus/icons-vue"
import apiClient from "@/axios";

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
    entity:{
      type: String,
      required: true
    }
  },
  methods: {
    handleFormUpdate(updatedForm) {
      // 更新MainPage.vue中的mainForm
      Object.assign(this.form, updatedForm);
    },
    save() {
      console.log("under ", this.mode);
      const mapping = this.modeMapping[this.mode]
      ElMessageBox.confirm(
        "You are " + this.mode + " a "+this.$sentenceCase(this.entity) + ". Continue?",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          icon: {
            render() {
              return h(
                mapping.icon, {color: mapping.color }
              )
            },
          },
          customClass: "custom-confirm-button",
        }
      ).then(async () => {
        await apiClient.post("/"+this.$snakeCase(this.entity) + "/" + mapping.proto)
        ElMessage({
          type: mapping.type,
          message: mapping.proto + " success",
          icon: mapping.icon
        })
      }).catch(() => {
        ElMessage({
          type: "info",
          message: mapping.proto + " cancelled"
        })
      })
    },
  },
  setup() {
    const mode = ref("creating")
    const modeMapping = {
      creating: {proto: "create", type: "success", icon: CirclePlus, color: "#67c23a"},
      updating: {proto: "update", type: "warning", icon: Edit, color: "#e6a23c"},
      deleting: {proto: "delete", type: "error", icon: Delete, color: "#f56c6c"}
    }
    const handleClick = (tab) => {
      console.log(tab.props.name)
    }
    return {
      mode,
      handleClick,
      modeMapping
    }
  }
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

.custom-confirm-button .el-message-box__btns .el-button--primary {
  background-color: #ecf5ff !important;
  border-color: #a0cfff !important;
  color: #409eff !important;
}
.custom-confirm-button .el-message-box__btns .el-button--primary:hover {
  background-color: #409eff !important;
  color: #fff !important;
}
.modify-icon {
  color: #67c23a !important;
}
</style>
