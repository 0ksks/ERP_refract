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
              ><template #append>
                <el-button 
                  class="copy-button"
                  :icon="CopyDocument"
                  @click="handleCopyPaste(key)"
                />
              </template>
              </el-input>
            </el-form-item>
            <!-- 按钮，用于选择字段 -->
            <el-button 
              type="primary"
              plain
              @click="openSelectFieldsDialog"
            >Select Fields</el-button>
            <!-- 按钮，点击时应用筛选条件 -->
            <el-button 
              type="primary"
              plain
              @click="applyFilter"
            >Find
            </el-button>
          </el-form>
        </el-col>
      </el-row>
      <br />
      <!-- 显示结果的标题 -->
      <div class="result-text">
        Results:
      </div>
      <!-- 表格组件，显示筛选结果 -->
      <el-table
        :data="tableData"
        highlight-current-row
        @row-click="handleRowClick"
        @cell-dblclick="handleCellClick"
      >
        <!-- 定义表格列，动态显示实体ID -->
        <el-table-column
          :prop="`${entity}ID`"
          :label="`${$sentenceCase(entity)} ID`"
        ></el-table-column>
        <!-- 定义表格列，动态显示实体名称 -->
        <el-table-column
          v-for="(column, index) in resolvedOptionColumn"
          :key="index"
          :prop="`${column[0]}`"
          :label="`${column[1]}`"
        ></el-table-column>
        <!-- 固定显示用户ID列 -->
        <el-table-column prop="userID" label="User ID"></el-table-column>
      </el-table>
    </div>
    
    <!-- 选择字段的对话框 -->
    <el-dialog
      title="Select Fields"
      v-model="selectFieldsDialogVisible"
      width="70%"
      style="border-radius: 10px;"
    >
      <el-form>
        <el-row :gutter="20"> <!-- 添加 gutter 来增加列之间的间距 -->
          <el-col :span="6">
            <el-form-item
              v-for="key in splitFilters[0]"
              :key="key"
            >
              <el-checkbox v-model="localFiltersSelection[key]">
                {{ $sentenceCase(key) }}
              </el-checkbox>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              v-for="key in splitFilters[1]"
              :key="key"
            >
              <el-checkbox v-model="localFiltersSelection[key]">
                {{ $sentenceCase(key) }}
              </el-checkbox>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              v-for="key in splitFilters[2]"
              :key="key"
            >
              <el-checkbox v-model="localFiltersSelection[key]">
                {{ $sentenceCase(key) }}
              </el-checkbox>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              v-for="key in splitFilters[3]"
              :key="key"
            >
              <el-checkbox v-model="localFiltersSelection[key]">
                {{ $sentenceCase(key) }}
              </el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="selectFieldsDialogVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" plain @click="applySelectedFields">
          Confirm
        </el-button>
      </div>
    </el-dialog>
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
    optionColumns: {
      type: Array,
      default: null,
    },
  },
  computed: {
    resolvedOptionColumn() {
      if (this.optionColumns) {
        return this.optionColumns.map(column => [column, this.$sentenceCase(column)]);
      }
      return [[this.entity + "Name", this.$sentenceCase(this.entity) + " Name"]];
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

    const openSelectFieldsDialog = () => {
      selectFieldsDialogVisible.value = true;
    };

    const applySelectedFields = () => {
      localFilters.value = Object.fromEntries(
        Object.entries(localFiltersSelection.value)
          .filter(([_, value]) => value)
          .map(([key]) => [key, key === "userID" ? JSON.parse(atob(store.token)).userID : ""])
      );
      selectFieldsDialogVisible.value = false;
    };

    const applyFilter = async () => {
      try {
        const requestBody = Object.fromEntries(
          Object.entries(localFilters.value).filter(([_, value]) => value !== "")
        );
        const response = await apiClient.post("/"+snakeCase(props.entity)+"/query", requestBody);
        const responseBody = response.data;
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

    const handleRowClick = async (row) => {
      emit("select-entity", row);
    };

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
      openSelectFieldsDialog,
      applySelectedFields,
      applyFilter,
      splitFilters,
      handleRowClick,
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

.result-text {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
}

.dialog-footer {
  text-align: right;
}
</style>
