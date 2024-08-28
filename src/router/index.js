import { createRouter, createWebHistory } from "vue-router"
import HomePage from "@/views/HomePage.vue"
import MaterialPage from "@/views/MaterialPage.vue"
import UserPage from "@/views/UserPage.vue"
import LoginPage from "@/views/LoginPage.vue"
import SupplierPage from "@/views/SupplierPage.vue"
import StockPage from "@/views/StockPage.vue"
import PurchaseOrderPage from "@/views/PurchaseOrderPage.vue"
import GoodsReceiptPage from "@/views/GoodsReceiptPage.vue"

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/material",
    name: "MaterialPage",
    component: MaterialPage,
  },
  {
    path: "/user",
    name: "UserPage",
    component: UserPage,
  },
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/supplier",
    name: "SupplierPage",
    component: SupplierPage,
  },
  {
    path: "/stock",
    name: "StockPage",
    component: StockPage,
  },
  {
    path: "/purchase_order",
    name: "PurchaseOrderPage",
    component: PurchaseOrderPage,
  },
  {
    path: "/goods_receipt",
    name: "GoodsReceiptPage",
    component: GoodsReceiptPage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
