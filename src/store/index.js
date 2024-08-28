import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", // 存储用户登录的 token
  }),
  actions: {
    setToken(token) {
      this.token = token;
    },
    logout() {
      this.token = "";
    },
  },
  persist: {
    storage: localStorage, // 持久化的存储方式，默认为 localStorage
  },
});
