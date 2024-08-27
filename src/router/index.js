import { createRouter, createWebHistory } from "vue-router"
import HomePage from "@/views/HomePage.vue"
import MainPage from "@/views/MainPage.vue"
import UserPage from "@/views/UserPage.vue"
import LoginPage from "@/views/LoginPage.vue"
const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/main",
    name: "MainPage",
    component: MainPage,
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
