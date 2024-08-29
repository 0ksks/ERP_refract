import axios from "axios";
import router from "@/router"; // 引入 Vue Router
import { useUserStore } from "@/store"; // 引入 Pinia 的 store

// 创建一个 Axios 实例
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // 设置基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：在每个请求发出之前执行
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore(); // 获取 Pinia 的 store 实例

    // 如果不是登录请求，添加 token 到请求头
    if (config.url !== "/login") {
      const token = userStore.token; // 从 Pinia store 中获取 token
      console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 设置 Authorization 头
      } else {
        router.push("/login");
      }
    }
    return config;
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器：在每个响应返回时执行
apiClient.interceptors.response.use(
  (response) => {
    // 响应成功处理
    return response;
  },
  (error) => {
    // 如果响应的状态码是 401，跳转到登录页面
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore(); // 获取 Pinia 的 store 实例

      // 清除可能存在的无效 token
      userStore.logout();
      // 跳转到登录页面
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
