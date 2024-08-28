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
    const entity = "supplier"
    const filters = ref({
      supplierName: false,
      address: false,
      communicationLang: false,
      taxNumber: false,
      companyCode: false,
      reconciliationAcct: false,
      termsOfPayment: false,
      checkDoubleInvoice: false,
      clerkName: false,
      purchasingOrg: false,
      orderCurrency: false,
      paymentTerms: false,
      partnerFunctions: false,
      streetAddress: false,
      postalCode: false,
      country: false,
      region: false,
      city: false,
      contactInfo: false,
      discountConditions: false,
      userID: true,  // Keep this true as per instruction
      supplierID: true  // Keep this true as per instruction
    })
    const tableData = ref([])

    const titleFieldsMapping = [
      [
        "Address Information",
        ["supplierName", "address", "streetAddress", "postalCode", "city", "region", "country"],
        ["desc", "desc", "desc", "desc", "desc", "desc", "desc"]
      ],
      [
        "Communication",
        ["communicationLang", "contactInfo", "clerkName"],
        ["desc", "desc", "desc"]
      ],
      [
        "Financial Data",
        ["taxNumber", "companyCode", "reconciliationAcct", "orderCurrency", "paymentTerms", "discountConditions"],
        ["desc", "desc", "desc", "desc", "desc", "desc"]
      ],
      [
        "Purchasing Information",
        ["termsOfPayment", "checkDoubleInvoice", "purchasingOrg", "partnerFunctions"],
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
