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
                :placeholder="`Enter ${$sentenceCase(key)}...`"
              >
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
      >
        <!-- 定义表格列，动态显示实体ID -->
        <el-table-column
          :prop="`${entity}ID`"
          :label="`${$sentenceCase(entity)} ID`"
        ></el-table-column>
        <!-- 定义表格列，动态显示实体名称 -->
        <el-table-column
          :prop="`${entity}Name`"
          :label="`${$sentenceCase(entity)} Name`"
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
import { ref, computed, watch } from "vue";
import apiClient from "@/axios";

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
    }
  },
  setup(props, { emit }) {
    const localFilters = ref({});
    const selectFieldsDialogVisible = ref(false);
    const localFiltersSelection = ref({});

    watch(
      () => props.filters,
      (newFilters) => {
        localFilters.value = Object.fromEntries(
          Object.entries(newFilters)
            .filter(([_, value]) => value === true)
            .map(([key]) => [key, ""])
        );
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
          .map(([key]) => [key, ""])
      );
      selectFieldsDialogVisible.value = false;
    };

    const applyFilter = async () => {
      try {
        const response = await apiClient.post("/api/material/query");
        const body = response.data
        emit("update-table-data", body.data)
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

    const handleRowClick = (row) => {
      emit("select-entity", row);
    };

    return {
      localFilters,
      filteredKeys,
      selectFieldsDialogVisible,
      localFiltersSelection,
      openSelectFieldsDialog,
      applySelectedFields,
      applyFilter,
      splitFilters,
      handleRowClick
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
