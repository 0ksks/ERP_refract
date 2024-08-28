import { createApp } from "vue"
import App from "./App.vue"
const app = createApp(App)

// 引入element-plus
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
// 引入所有的图标
import * as Icons from "@element-plus/icons-vue"
// 引入BannerHeader
import BannerHeader from "./components/BannerHeader.vue"
// 引入Tooltip
import FloatingVue from "floating-vue"
// 引入Tooltip默认CSS
import "floating-vue/dist/style.css"
// 引入全局css变量
import "./assets/variables.css"
// 引入全局css属性
import "./assets/globalCss.css"
// 引入全局函数
import { globalUtils } from "./utils/globalUtils"
// 引入router
import router from "./router"
// 引入store
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 使用element-plus
app.use(ElementPlus)
// 使用router
app.use(router)
// 注册所有图标组件
for (const [key, component] of Object.entries(Icons)) {
  app.component(key, component)
}
// 注册BannerHeader
app.component("BannerHeader", BannerHeader)
// 注册tooltip
app.use(FloatingVue, {
  themes: {
    "info-tooltip": {
      $extend: "tooltip",
      $resetCss: true,
    },
  },
})
// 使用全局函数
app.use(globalUtils)
// 使用Pinia
app.use(pinia)
app.mount("#app")

