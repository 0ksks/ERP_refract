<template>
  <el-container class="outer-container">
    <el-header height="80px" class="outer-header">
      <BannerHeader
        :componentRouteMapping="[
          ['User', '/user'],
          ['House', '/'],
        ]"
        :headingString="$sentenceCase(entity)"
      />
    </el-header>
    <el-container class="inner-container">
      <el-aside width="300px" class="inner-aside">
        <DocumentFlowAside 
          :entity="entity"
          :filters="{
            userID: true,
            documentID: true,
            purchaseOrderID: true,
            goodsReceiptID: true,
          }"
          :tableData="tableData"
          @update-table-data="updateTableData"
        />
      </el-aside>
      <el-main class="inner-content">
        <el-table
          :data="tableData"
          @cell-dblclick="handleCellClick"
        >
          <!-- 固定显示用户ID列 -->
          <el-table-column prop="documentID" label="Document ID"></el-table-column>
          <el-table-column prop="purchaseOrderID" label="Purchase Order ID"></el-table-column>
          <el-table-column prop="goodsReceiptID" label="Goods Receipt ID"></el-table-column>
          <el-table-column prop="userID" label="User ID"></el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <el-footer height="80px"></el-footer>
  </el-container>
</template>

<script>
import DocumentFlowAside from "@/layout/DocumentFlowAside.vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";

export default {
  components: {
    DocumentFlowAside
  },
  data(){
    return {
      entity:"documentFlow"
    }
  },
  setup(){
    const tableData = ref([])
    const updateTableData = (newData) => {
      tableData.value = newData
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
      tableData,
      updateTableData,
      handleCellClick
    }
  }
}
</script>

<style scoped>
.inner-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  padding-left: var(--window-margin);
  padding-right: var(--window-margin);
}
.inner-aside {
  background-color: #f5f4f4;
  padding: 20px;
  overflow-y: scroll;
  height: 100%;
  flex-grow: 1;
  border-radius: 10px 0 0 10px;
}
.inner-content {
  background-color: #fff;
  overflow-y: scroll;
  height: 100%;
  flex-grow: 1;
  border-radius: 0 10px 10px 0;
}
</style>