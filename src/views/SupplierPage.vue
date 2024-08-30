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
          :entity            = "entity"
          :filters           = "filters"
          :tableData         = "tableData"
          @update-table-data = "updateTableData"
          @select-entity     = "updateMainForm"
        />
      </el-aside>
      <el-main class="inner-content">
        <MainLayout
          :entity             = "entity"
          :titleFieldsMapping = "titleFieldsMapping"
          :form               = "mainForm"
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
      supplierName      : false,
      address           : false,
      communicationLang : false,
      taxNumber         : false,
      companyCode       : false,
      reconciliationAcct: false,
      termsOfPayment    : false,
      checkDoubleInvoice: false,
      clerkName         : false,
      purchasingOrg     : false,
      orderCurrency     : false,
      paymentTerms      : false,
      partnerFunctions  : false,
      streetAddress     : false,
      postalCode        : false,
      country           : false,
      region            : false,
      city              : false,
      contactInfo       : false,
      discountConditions: false,
      userID            : true,  // Keep this true as per instruction
      supplierID        : true  // Keep this true as per instruction
    })
    const tableData = ref([])

    const titleFieldsMapping = [
      [
        "Address Information",
        ["supplierName", "streetAddress", "postalCode", "city", "region", "country"],
        ["Standard price of materials", "Supplier's street address", "The postal code of the supplier's address", "City where the supplier is located", "The region or province where the supplier is located", "The country where the supplier is located"]
      ],
      [
        "Communication",
        ["communicationLang", "contactInfo", "clerkName"],
        ["Common language for communication with suppliers", "Supplier's contact information, including phone numbers, etc", "Supplier's contact person name"]
      ],
      [
        "Financial Data",
        ["taxNumber", "companyCode", "reconciliationAcct", "orderCurrency",  "discountConditions"],
        ["Supplier's tax registration number", "Company code for transactions with suppliers", "Supplier's reconciliation account, used for accounting reconciliation", "Currency type for transactions with suppliers", "desc"]
      ],
      [
        "Purchasing Information",
        ["termsOfPayment", "checkDoubleInvoice", "purchasingOrg", "partnerFunctions"],
        ["Specific payment terms reached with suppliers", "Check for duplicate invoices", "The unique identifier of the procurement team responsible for managing the procurement activities of the supplier", "The role or function of suppliers in transactions"]
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
  display         : flex;
  height          : 100vh;
  width           : 100%;
  overflow        : hidden;
  padding-left    : var(--window-margin);
  padding-right   : var(--window-margin);
}
.inner-aside {
  background-color: #f5f4f4;
  padding         : 20px;
  overflow-y      : scroll;
  height          : 100%;
  flex-grow       : 1;
  border-radius   : 10px 0 0 10px;
}
.inner-content {
  background-color: #fff;
  overflow-y      : scroll;
  height          : 100%;
  flex-grow       : 1;
  border-radius   :  0 10px 10px 0;
}
</style>
