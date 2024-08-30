<template>
  <div>
    <!-- 顶部的标题文本 -->
    <div class="find-text">
      Find
    </div>
    <!-- 侧边栏内容容器 -->
    <div class="sidebar-content">
      <!-- 筛选条件的标题，动态显示实体名称 -->
      <div class="filter-header">
        Find {{ $sentenceCase(entity) }} By :
      </div>
      <!-- 使用el-row和el-col布局 -->
      <el-row>
        <el-col :span="24">
          <!-- 表单组件，用于输入筛选条件 -->
          <el-form label-position="left" label-width="auto">
            <!-- 遍历filteredKeys数组，生成表单项 -->
            <el-form-item
              label-position="left"
              v-for="key in filteredKeys"
              :key="key"
            >
              <!-- 表单项标签，使用$sentenceCase转换为句子形式 -->
              <template #label>
                {{ $sentenceCase(key) }}
              </template>
              <!-- 输入框，绑定到localFilters对象的相应字段 -->
              <el-input
                v-model="localFilters[key]"
                @dblclick="clearInput(key)"
                :placeholder="`Enter ${$sentenceCase(key)}...`"
              >
                <template #append>
                  <el-button 
                    class="copy-button"
                    :icon="CopyDocument"
                    @click="handleCopyPaste(key)"
                  />
                </template>
              </el-input>
            </el-form-item>
            <!-- 按钮，点击时应用筛选条件 -->
            <div class="button-container">
              <el-button 
                type="primary"
                plain
                @click="applyFilter"
              >
                Find
              </el-button>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <br />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, getCurrentInstance } from "vue";
import {useUserStore} from "@/store"
import apiClient from "@/axios";
import { CopyDocument } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus";

export default {
  props: {
    entity: {
      type: String,
      required: true,
    },
    filters: {
      type: Object,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      CopyDocument
    }
  },
  methods: {
    clearInput(key) {
      this.localFilters[key] = ""
    },
    async handleCopyPaste(key) {

      const value = this.localFilters[key];
      console.log(value)
      if (value) {
        // 复制输入框的值
        try {
          await navigator.clipboard.writeText(value);
          this.$message.success("copied");
        } catch (err) {
          this.$message.error("failed");
        }
      } else {
        // 粘贴剪贴板的内容到输入框
        try {
          const text = await navigator.clipboard.readText();
          console.log(text)
          this.localFilters[key] = text
        } catch (err) {
          this.$message.error(err);
        }
      }
    }
  },
  setup(props, { emit }) {
    const localFilters = ref({});
    const selectFieldsDialogVisible = ref(false);
    const localFiltersSelection = ref({});
    const store = useUserStore()
    const instance = getCurrentInstance()
    const snakeCase = instance.proxy.$snakeCase

    watch(
      () => props.filters,
      (newFilters) => {
        localFilters.value = Object.fromEntries(
          Object.entries(newFilters)
            .filter(([_, value]) => value === true)
            .map(([key]) => [key, key === "userID" ? JSON.parse(atob(store.token)).userID : ""])
        );
        console.log("token",atob(store.token))
        localFiltersSelection.value = { ...newFilters };
      },
      { immediate: true }
    );

    const filteredKeys = computed(() => Object.keys(localFilters.value));

    const applyFilter = async () => {
      try {
        const requestBody = Object.fromEntries(
          Object.entries(localFilters.value).filter(([_, value]) => value !== "")
        );
        const response = await apiClient.post("/"+snakeCase(props.entity)+"/display", requestBody);
        const responseBody = response.data;
        console.log(responseBody)
        emit("update-table-data", responseBody.data);
      } catch (error) {
        console.error("Error:", error);  // 处理错误
      }
    };

    const splitFilters = computed(() => {
      const keys = Object.keys(props.filters);
      const columns = [[], [], [], []];
      keys.forEach((key, index) => {
        columns[index % 4].push(key);
      });
      return columns;
    });

    const handleCellClick = async (row, column, cell, event) => {
      const cellValue = row[column.property];
      if (cellValue) {
        try {
          await navigator.clipboard.writeText(cellValue);
          ElMessage.success("copied")
        } catch (err) {
          ElMessage.error("failed")
        }
      }
    }

    return {
      localFilters,
      filteredKeys,
      selectFieldsDialogVisible,
      localFiltersSelection,
      applyFilter,
      splitFilters,
      handleCellClick,
      store
    };
  },
};
</script>

<style scoped>
.find-text {
  color: #498be6;
  font-weight: bold;
  margin-bottom: 10px;
}

.sidebar-content {
  margin-top: 20px;
}

.filter-header {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.button-container {
  overflow: hidden;
  .el-button {
    float: right;
  }
}
</style>
