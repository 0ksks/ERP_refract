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
    const entity = "material"
    const filters = ref({
      materialID: true,
      materialName: false,
      description: false,
      baseUnit: false,
      materialGroup: false,
      division: false,
      grossWeight: false,
      netWeight: false,
      weightUnit: false,
      volume: false,
      volumeUnit: false,
      transportationGroup: false,
      packMaterial: false,
      availabilityCheck: false,
      loadingGroup: false,
      mrpType: false,
      mrpController: false,
      lotSize: false,
      minimumLotSize: false,
      plannedDeliveryTime: false,
      valuationClass: false,
      movingPrice: false,
      priceUnit: false,
      standardPrice: false,
      userID: true
    })
    const tableData = ref([])

    
    const titleFieldsMapping = [
      [
        "General",
        ["materialName", "description", "baseUnit", "materialGroup", "division"],
        ["desc",         "desc",        "desc",     "desc",          "desc"    ]
      ],
      [
        "Dimensions",
        ["grossWeight", "netWeight", "weightUnit", "volume", "volumeUnit"],
        ["desc",        "desc",      "desc",       "desc",   "desc"      ]
      ],
      [
        "Shipping Data (times in days)",
        ["transportationGroup", "packMaterial", "availabilityCheck", "loadingGroup"],
        ["desc",                "desc",         "desc",              "desc"        ]
      ],
      [
        "MRP Procedure",
        ["mrpType", "mrpController"],
        ["desc",    "desc"         ]
      ],
      [
        "Lot Size Data",
        ["lotSize", "minimumLotSize"],
        ["desc",    "desc"          ]
      ],
      [
        "Scheduling",
        ["plannedDeliveryTime"],
        ["desc"               ]
      ],
      [
        "Accounting",
        ["valuationClass", "movingPrice", "priceUnit", "standardPrice"],
        ["desc",           "desc",        "desc",      "desc"         ]
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
