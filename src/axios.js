import axios from "axios";
import router from "@/router"; // 引入 Vue Router

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
    // 如果不是登录请求，添加 token 到请求头
    console.log(config.headers)
    if (config.url !== "/login") {
      const token = localStorage.getItem("token"); // 从 localStorage 获取 token
      if (token!="") {
        config.headers.Authorization = `Bearer ${token}`; // 设置 Authorization 头
      } else {
        router.push("/login")
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
      // 清除可能存在的无效 token
      localStorage.removeItem("token");
      // 跳转到登录页面
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
