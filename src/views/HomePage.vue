<template>
  <el-container class="outer-container">
    <el-header class="outer-header">
      <BannerHeader
        :componentRouteMapping = "[['User', '/user']]"
        headingString          = "Home"
      />
    </el-header>
    <div class="CardContainer">
      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'material'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/material')"
      >
        <template #header>
          <div>
            <el-icon>
              <Box />
            </el-icon>Material
          </div>
        </template>
        <template v-if="hoveredCard === 'material'">
          <p style="font-size: small;">
            {{materialDesc}}
          </p>
        </template>
      </el-card>

      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'supplier'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/supplier')"
      >
        <template #header>
          <div>
            <el-icon>
              <Van />
            </el-icon>Supplier
          </div>
        </template>
        <template v-if="hoveredCard === 'supplier'">
          <p style="font-size: small;">
            {{supplierDesc}}
          </p>
        </template>
      </el-card>

      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'stock'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/stock')"
      >
        <template #header>
          <div>
            <el-icon>
              <DataLine />
            </el-icon>Stock
          </div>
        </template>
        <template v-if="hoveredCard === 'stock'">
          <p style="font-size: small;">
            {{ stockDesc }}
          </p>
        </template>
      </el-card>

      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'purchaseOrder'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/purchase_order')"
      >
        <template #header>
          <div>
            <el-icon>
              <DocumentAdd />
            </el-icon>Purchase Order
          </div>
        </template>
        <template v-if="hoveredCard === 'purchaseOrder'">
          <p style="font-size: small;">
            {{ purchaseOrderDesc }}
          </p>
        </template>
      </el-card>

      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'goodsReceipt'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/goods_receipt')"
      >
        <template #header>
          <div>
            <el-icon>
              <DocumentChecked />
            </el-icon>Goods Receipt
          </div>
        </template>
        <template v-if="hoveredCard === 'goodsReceipt'">
          <p style="font-size: small;">
            {{goodsReceiptDesc}}
          </p>
        </template>
      </el-card>

      <el-card
        class       = "FlexCard"
        shadow      = "never"
        @mouseover  = "hoveredCard = 'documentFlow'"
        @mouseleave = "hoveredCard = null"
        @click      = "this.$router.push('/document_flow')"
      >
        <template #header>
          <div>
            <el-icon>
              <Document />
            </el-icon>Document Flow
          </div>
        </template>
        <template v-if="hoveredCard === 'documentFlow'">
          <p style="font-size: small;">
            {{documentFlowDesc}}
          </p>
        </template>
      </el-card>
    </div>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      materialDesc     : "The physical goods, components, or raw substances that are used in the production process to create finished products",
      stockDesc        : "The stored inventory of materials, components, or finished goods that a business holds to meet production demands and customer orders",
      supplierDesc     : "The company or individual that provides goods, materials, or services to another organization",
      purchaseOrderDesc: "The formal document issued by a buyer to a supplier, detailing the specific goods or services required, along with the agreed-upon quantities, prices, and delivery terms",
      goodsReceiptDesc : "The document or process that confirms the receipt of goods or materials from a supplier, verifying that the delivered items match the purchase order in terms of quantity, quality, and condition",
      documentFlowDesc : "The sequential and organized movement of documents within a business process",
      hoveredCard      : null, // 用于跟踪当前悬停的卡片
    }
  },
}
</script>

<style lang="css" scoped>
.CardContainer {
  display        : flex;
  justify-content: space-between;
  padding-left   : var(--window-margin);
  padding-right  : var(--window-margin);
}
.FlexCard {
  flex           : 1; /* 每个卡片平分宽度 */
  margin         : 0 10px; /* 控制卡片之间的间距 */
  height         : 250px;
}
.FlexCard :last-child {
  margin-right   : 0; /* 去掉最后一个卡片的右侧间距 */
}
.FlexCard :first-child {
  margin-left    : 0; /* 去掉第一个卡片的左侧间距 */
}
.FlexCard :hover {
  color          : var(--blank-hover);
  cursor         : pointer;
}
</style>
