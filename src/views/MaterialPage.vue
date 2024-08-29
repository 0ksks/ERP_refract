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
import { ref } from "vue"
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
      userID: true,
      materialID: true,
    })
    const tableData = ref([])

    const titleFieldsMapping = [
      [
        "General",
        ["materialName", "description", "baseUnit", "materialGroup", "division"],
        ["Name of material", "Detailed description of materials", "The basic unit of measurement for materials, such as units, kilograms, etc", "The classification or group to which the material belongs", "The department or business area of the company to which the material belongs"]
      ],
      [
        "Dimensions",
        ["grossWeight", "netWeight", "weightUnit", "volume", "volumeUnit"],
        ["The weight of the material and its packaging",        "Weight of materials without packaging", "The unit of measurement for material weight, such as kilograms, tons, etc", "Volume of materials", "The unit of measurement for material volume, such as cubic meters, etc"]
      ],
      [
        "Shipping Data (times in days)",
        ["transportationGroup", "packMaterial", "availabilityCheck", "loadingGroup"],
        ["The transportation group of materials, used for transportation planning", "Types of materials used for packaging materials", "When creating a production or procurement plan, the system checks the availability of materials to ensure the feasibility of the plan", "The loading group of materials, used for loading planning"]
      ],
      [
        "MRP Procedure",
        ["mrpType", "mrpController"],
        ["Material Requirements Planning (MRP) type for materials", "The MRP controller responsible for this materia"]
      ],
      [
        "Lot Size Data",
        ["lotSize", "minimumLotSize"],
        ["Batch size of materials", "Minimum batch size of materials"]
      ],
      [
        "Scheduling",
        ["plannedDeliveryTime"],
        ["The planned delivery time of materials, measured in days"]
      ],
      [
        "Accounting",
        ["valuationClass", "movingPrice", "priceUnit", "standardPrice"],
        ["Valuation category of materials, used for financial accounting", "A method for estimating inventory value: the average price of all purchases and inventory received to determine the current valuation of materials", "Unit of measurement for material prices", "Standard price of materials"]
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
