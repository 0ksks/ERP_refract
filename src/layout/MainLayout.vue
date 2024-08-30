<template>
  <!-- 外层容器 -->
  <el-container class="out-wrapper">
    <!-- 标签页，v-model: 绑定当前活动标签的值 -->
    <!-- @tab-click: 标签点击事件处理 -->
    <el-tabs v-model="mode" @tab-click="handleClick">
      <!-- 标签页项 -->
      <!-- label: 标签页项的显示名称 -->
      <!-- name: 标签页项的唯一标识 -->
      <el-tab-pane label="Create" name="creating"></el-tab-pane>
      <el-tab-pane label="Update" name="updating"></el-tab-pane>
      <el-tab-pane label="Delete" name="deleting"></el-tab-pane>
    </el-tabs>
    
    <!-- 主内容区域 -->
    <el-main class="content-wrapper">
      <!-- 循环生成表单片段 -->
      <!-- id: 片段的唯一标识 -->
      <!-- v-for: 遍历生成表单片段 -->
      <!-- :key: 每个片段的唯一标识 -->
      <div
        :id="seg_idx"
        v-for="(item, seg_idx) in titleFieldsMapping"
        :key="seg_idx"
      >
        <!-- 表单片段组件 -->
        <!-- form    : 传递的表单数据对象 -->
        <!-- title   : 表单片段的标题 -->
        <!-- fields  : 表单片段的字段数组 -->
        <!-- desc    : 表单片段的描述数组 -->
        <!-- disabled: 表单片段是否禁用 -->
        <!-- @update : form: 监听表单数据更新事件 -->
        <FormSegment
          :form     = "form"
          :title    = "item[0]"
          :fields   = "item[1]"
          :desc     = "item[2]"
          :disabled = "disabled || mode === 'deleting'"
          @update:form="handleFormUpdate"
        />
      </div>
    </el-main>

    <!-- 页脚区域 -->
    <!-- style: 内联样式，用于设置宽度、高度、内边距等 -->
    <el-footer style="width:100%;height: 30px;padding-top: 10px;">
      <!-- 确认按钮 -->
      <!-- type: 按钮类型，primary表示主要按钮 -->
      <!-- plain: 是否为朴素按钮 -->
      <!-- @click: 点击事件处理 -->
      <!-- :disabled: 按钮是否禁用 -->
      <!-- style: 内联样式，用于浮动按钮 -->
      <el-button 
        type      = "primary" 
        plain 
        @click    = "save" 
        :disabled = "disabled" 
        style     = "float: right;"
      >
        Confirm
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import FormSegment from "@/components/FormSegment.vue";
import { useUserStore } from "@/store"
import { ElMessage, ElMessageBox } from "element-plus"
import { ref, h, computed } from "vue"
import { CirclePlus, Upload, Delete } from "@element-plus/icons-vue"
import apiClient from "@/axios";

export default {
  components: {
    FormSegment,
  },
  props: {
    // titleFieldsMapping: 表单片段的标题、字段和描述映射数组
    titleFieldsMapping: {
      type    : Array,
      required: true,
    },
    // form: 传递的表单数据对象
    form: {
      type    : Object,
      required: true,
    },
    // entity: 实体名称，用于API请求和显示
    entity:{
      type    : String,
      required: true
    }
  },
  methods: {
    // 处理表单更新事件
    handleFormUpdate(updatedForm) {
      // 更新MainPage.vue中的mainForm
      Object.assign(this.form, updatedForm);
    },
    // 保存操作，根据当前模式（创建、更新或删除）进行相应的API调用
    save() {
      console.log("under ", this.mode);
      const mapping = this.modeMapping[this.mode]
      ElMessageBox.confirm(
        "You are " + this.mode + " a "+this.$sentenceCase(this.entity) + ". Continue?",
        {
          confirmButtonText: "OK",
          cancelButtonText : "Cancel",
          icon: {
            render() {
              return h(
                mapping.icon, {color: mapping.color}
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
            type   : mapping.type,
            message: mapping.proto + " success",
            icon   : mapping.icon
          })
        } else {
          ElMessage({
            type     : "error",
            showClose: true, 
            duration : 0,
            message  : response.data.message
          })
        }
      }).catch(() => {
        ElMessage({
          type   : "info",
          message: mapping.proto + " cancelled"
        })
      })
    },
  },
  setup(props) {
    // 模式的状态，默认为"creating"
    const mode = ref("creating")
    let store = useUserStore()
    store = JSON.parse(atob(store.token))

    // 计算属性，用于判断表单是否禁用
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

    // 模式映射，根据当前模式设置相应的操作类型、图标、颜色和API方法
    const modeMapping = {
      creating: {
        proto : "create",
        type  : "success",
        icon  : CirclePlus,
        color : "#67c23a",
        method: "post"
      },
      updating: {
        proto : "update",
        type  : "warning",
        icon  : Upload, 
        color : "#e6a23c",
        method: "patch"
      },
      deleting: {
        proto : "delete",
        type  : "error",
        icon  : Delete,
        color : "#f56c6c",
        method: "delete"
      }
    }

    // 标签页点击事件处理
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
  width : 100%;
  height: 100%;
}

/* 内容容器样式 */
.content-wrapper {
  height    : 100%; /* 限制高度以触发滚动 */
  position  : relative;
  width     : 100%;
  overflow-y: scroll; /* 允许垂直方向滚动 */
}

/* 自定义确认按钮的样式 */
.custom-confirm-button .el-message-box__btns .el-button--primary {
  background-color: #ecf5ff !important;
  border-color    : #a0cfff !important;
  color           : #409eff !important;
}
.custom-confirm-button .el-message-box__btns .el-button--primary:hover {
  background-color: #409eff !important;
  color           : #fff !important;
}

/* 图标样式 */
.modify-icon {
  color: #67c23a !important;
}
</style>
