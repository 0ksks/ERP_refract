// src/axios.js
import axios from "axios";

// 创建一个 Axios 实例
const apiClient = axios.create({
  // baseURL: "http://localhost:8080", // 设置基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
