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
        <AsideLayout
          :entity="entity"
          :filters="filters"
          :tableData="tableData"
          @update-table-data="updateTableData"
          @select-entity="updateMainForm"
        />
      </el-aside>
      <el-main class="inner-content">
        <MainLayout
          :entity="entity"
          :titleFieldsMapping="titleFieldsMapping"
          :form="mainForm"
        />
      </el-main>
    </el-container>
    <el-footer height="80px"></el-footer>
  </el-container>
</template>

<script>
import { ref,toRaw } from "vue"
import AsideLayout from "@/layout/AsideLayout.vue"
import MainLayout from "@/layout/MainLayout.vue"

export default {
  components: {
    AsideLayout,
    MainLayout,
  },
  setup() {
    const entity = "goodsReceipt"
    const filters = ref({
      purchaseOrderID: false,
      materialID: false,
      supplierID: false,
      receiptDate: false,
      documentDate: false,
      postingDate: false,
      movementType: false,
      quantity: false,
      stockLocation: false,
      batch: false,
      plant: false,
      userID: true,  // Keep this true as per instruction
      goodsReceiptID: true  // Keep this true as per instruction
    })
    const tableData = ref([])

    const titleFieldsMapping = [
      [
        "Receipt Information",
        ["purchaseOrderID", "materialID", "supplierID", "receiptDate", "documentDate", "postingDate", "movementType"],
        ["desc", "desc", "desc", "desc", "desc", "desc", "desc"]
      ],
      [
        "Quantity Data",
        ["quantity", "stockLocation", "batch", "plant"],
        ["desc", "desc", "desc", "desc"]
      ]
    ]

    const mainForm = ref({});
    Object.keys(filters.value).forEach(key => {
      if (key!==entity+"ID" && key!=="userID") {
        mainForm[key] = "";
      }
    });

    const updateTableData = (newData) => {
      tableData.value = newData
      console.log("newData:",toRaw(newData))
      console.log("mainForm:",toRaw(mainForm))
    };

    const updateMainForm = (newForm) => { 
      mainForm.value = newForm
    }

    return {
      entity,
      mainForm,
      filters,
      tableData,
      titleFieldsMapping,
      updateTableData,
      updateMainForm
    }
  },
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
