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
          :disabled="disabled || mode==='deleting'"
          @update:form="handleFormUpdate"
        />
      </div>
    </el-main>
    <el-footer style="height: 25px;padding-top: 5px"><el-button type="primary" plain @click="save" :disabled="disabled">
      Confirm
    </el-button></el-footer>
  </el-container>
</template>

<script>
import FormSegment from "@/components/FormSegment.vue";
import { useUserStore } from "@/store"
import { ElMessage, ElMessageBox } from "element-plus"
import { ref,h,computed } from "vue"
import { CirclePlus, Upload, Delete } from "@element-plus/icons-vue"
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
        const data = JSON.parse(JSON.stringify(this.form))
        if (this.mode === "creating") {
          delete data[this.entity + "ID"]
        }
        let response = 0
        if (this.mode !== "deleting") {
          response = await apiClient[mapping.method]("/" + this.$snakeCase(this.entity) + "/" + mapping.proto, data)
        } else {
          response = await apiClient.delete("/" + this.$snakeCase(this.entity) + "/delete/" + data[this.entity + "ID"])
        }
        if (response.data.code === 200 || response.data.code === 201) {
          ElMessage({
            type: mapping.type,
            message: mapping.proto + " success",
            icon: mapping.icon
          })
        } else {
          ElMessage({
            type: "error",
            showClose: true, 
            duration: 0,
            message: response.data.message
          })
        }
      }).catch(() => {
        ElMessage({
          type: "info",
          message: mapping.proto + " cancelled"
        })
      })
    },
  },
  setup(props) {
    const mode = ref("creating")
    let store = useUserStore()
    store = JSON.parse(atob(store.token))
    const disabled = computed(() => {
      const userRole = store.role
      if (userRole==="guest"){
        return true
      } else if (userRole === "admin") {
        return false
      } else if (!props.form.userID) {
        return false
      }
      else {
        return store.userID !== props.form.userID
      }
    })
    const modeMapping = {
      creating: {
        proto: "create",
        type: "success",
        icon: CirclePlus,
        color: "#67c23a",
        method: "post"
      },
      updating: {
        proto: "update",
        type: "warning",
        icon: Upload, 
        color: "#e6a23c",
        method: "patch"},
      deleting: {
        proto: "delete",
        type: "error",
        icon: Delete,
        color: "#f56c6c",
        method: "delete"
      }
    }
    const handleClick = (tab) => {
      console.log(tab.props.name)
    }
    return {
      mode,
      handleClick,
      modeMapping,
      disabled
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
