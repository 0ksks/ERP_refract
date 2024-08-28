import { createRouter, createWebHistory } from "vue-router"
import HomePage from "@/views/HomePage.vue"
import MaterialPage from "@/views/MaterialPage.vue"
import UserPage from "@/views/UserPage.vue"
import LoginPage from "@/views/LoginPage.vue"
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
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
