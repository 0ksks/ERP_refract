import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", // 存储用户登录的 token
    userInfo: null, // 存储用户信息
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    logout() {
      this.token = "";
      this.userInfo = null;
    },
  },
  persist: {
    storage: localStorage, // 持久化的存储方式，默认为 localStorage
  },
});
