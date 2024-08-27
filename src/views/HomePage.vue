<template>
  <el-container class="outer-container">
    <el-header class="outer-header">
      <BannerHeader
        :componentRouteMapping="[['User', '/user']]"
        headingString="Home"
      /></el-header>
    <div class="CardContainer">
      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'material'"
        @mouseleave="hoveredCard = null"
        @click="this.$router.push('/main')"
      >
        <template #header>
          <div>
            <el-icon>
              <Box />
            </el-icon>Material
          </div>
        </template>
        <template v-if="hoveredCard === 'material'">{{
          materialDesc
        }}</template>
      </el-card>

      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'supplier'"
        @mouseleave="hoveredCard = null"
      >
        <template #header>
          <div>
            <el-icon>
              <Van />
            </el-icon>Supplier
          </div>
        </template>
        <template v-if="hoveredCard === 'supplier'">{{
          supplierDesc
        }}</template>
      </el-card>

      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'stock'"
        @mouseleave="hoveredCard = null"
      >
        <template #header>
          <div>
            <el-icon>
              <DataLine />
            </el-icon>Stock
          </div>
        </template>
        <template v-if="hoveredCard === 'stock'">
          {{ stockDesc }}
        </template>
      </el-card>

      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'purchaseOrder'"
        @mouseleave="hoveredCard = null"
      >
        <template #header>
          <div>
            <el-icon>
              <DocumentAdd />
            </el-icon>Purchase Order
          </div>
        </template>
        <template v-if="hoveredCard === 'purchaseOrder'">
          {{ purchaseOrderDesc }}
        </template>
      </el-card>

      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'goodsReceipt'"
        @mouseleave="hoveredCard = null"
      >
        <template #header>
          <div>
            <el-icon>
              <DocumentChecked />
            </el-icon>Goods Receipt
          </div>
        </template>
        <template v-if="hoveredCard === 'goodsReceipt'">{{
          goodsReceiptDesc
        }}</template>
      </el-card>

      <el-card
        class="FlexCard"
        shadow="never"
        @mouseover="hoveredCard = 'documentFlow'"
        @mouseleave="hoveredCard = null"
      >
        <template #header>
          <div>
            <el-icon>
              <Document />
            </el-icon>Document Flow
          </div>
        </template>
        <template v-if="hoveredCard === 'documentFlow'">{{
          documentFlowDesc
        }}</template>
      </el-card>
    </div>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      materialDesc: "Material Desc",
      stockDesc: "Stock Desc",
      supplierDesc: "Supplier Desc",
      purchaseOrderDesc: "Purchase Order Desc",
      goodsReceiptDesc: "Goods Receipt Desc",
      documentFlowDesc: "Document Flow Desc",
      hoveredCard: null, // 用于跟踪当前悬停的卡片
    }
  },
}
</script>

<style lang="css" scoped>
.CardContainer {
  display: flex;
  justify-content: space-between;
  padding-left: var(--window-margin);
  padding-right: var(--window-margin);
}
.FlexCard {
  flex: 1; /* 每个卡片平分宽度 */
  margin: 0 10px; /* 控制卡片之间的间距 */
  height: 200px;
}
.FlexCard:last-child {
  margin-right: 0; /* 去掉最后一个卡片的右侧间距 */
}
.FlexCard:first-child {
  margin-left: 0; /* 去掉第一个卡片的左侧间距 */
}
.FlexCard:hover {
  color: var(--activate);
}
</style>
