import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import MaterialPage from "@/views/MaterialPage.vue";
import UserPage from "@/views/UserPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import SupplierPage from "@/views/SupplierPage.vue";
import StockPage from "@/views/StockPage.vue";
import PurchaseOrderPage from "@/views/PurchaseOrderPage.vue";
import GoodsReceiptPage from "@/views/GoodsReceiptPage.vue";
import DocumentFlowPage from "@/views/DocumentFlowPage.vue";
import { useUserStore } from "@/store"; // 导入 Pinia store

const routes = [
  {
    path     : "/",
    name     : "HomePage",
    component: HomePage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/material",
    name     : "MaterialPage",
    component: MaterialPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/user",
    name     : "UserPage",
    component: UserPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/login",
    name     : "LoginPage",
    component: LoginPage
  },
  {
    path     : "/supplier",
    name     : "SupplierPage",
    component: SupplierPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/stock",
    name     : "StockPage",
    component: StockPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/purchase_order",
    name     : "PurchaseOrderPage",
    component: PurchaseOrderPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/goods_receipt",
    name     : "GoodsReceiptPage",
    component: GoodsReceiptPage,
    meta     : { requiresAuth: true },
  },
  {
    path     : "/document_flow",
    name     : "DocumentFlowPage",
    component: DocumentFlowPage,
    meta     : { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // 获取用户 store 实例

  if (to.meta.requiresAuth && !userStore.token) {
    // 如果访问的页面需要授权，并且用户未登录，跳转到登录页面
    next({ name: "LoginPage" });
  } else {
    // 如果用户已登录或访问的页面不需要授权，继续访问
    next();
  }
});

export default router;
