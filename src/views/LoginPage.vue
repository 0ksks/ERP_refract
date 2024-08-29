<template>
  <el-container style="height: 100vh;">
    <el-main class="main-container">
      <el-card class="login-card" shadow="hover">
        <div slot="header" class="card-header">
          <span>
            Login
          </span>
        </div>
        <el-input
          placeholder="User ID"
          v-model="userID"
          :prefix-icon="User"
        ></el-input>
        <el-input
          placeholder="Password"
          v-model="password"
          :prefix-icon="Lock"
          show-password
        ></el-input>
        <div class="buttons">
          <div class="button-container">
            <el-button type="primary" plain @click="login">
              Log In
            </el-button>
          </div>
          <div class="button-container">
            <el-button
              type="text"
              class="frameless-button"
              @click="showRegisterDialog"
            >
              Register
            </el-button>
          </div>
        </div>
        

        <!-- Registration Dialog -->
        <el-dialog
          title="Register"
          v-model="registerDialogVisible"
          width="400px"
          center
          align-center
        >
          <el-input
            placeholder="Username"
            v-model="registerUsername"
            :prefix-icon="User"
          ></el-input>
          <el-input
            placeholder="Password"
            v-model="registerPassword"
            :prefix-icon="Lock"
            show-password
          ></el-input>
          <el-input
            placeholder="Confirm Password"
            v-model="registerConfirmPassword"
            :prefix-icon="Check"
          ></el-input>
          <div class="dialog-footer">
            <div class="button-container">
              <el-button @click="registerDialogVisible = false">
                Cancel
              </el-button>
            </div>
            <div class="button-container">
              <el-button type="primary" plain @click="register">
                Register
              </el-button>
            </div>
          </div>
        </el-dialog>

      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import {useUserStore} from "@/store"
import { useRouter } from "vue-router";
import { ref, getCurrentInstance } from "vue";
import {Check, Lock, User} from "@element-plus/icons-vue"

import apiClient from "@/axios.js";

const store = useUserStore();
const router = useRouter();

const userID = ref("");
const password = ref("");

const registerDialogVisible = ref(false);

const registerUsername = ref("");
const registerPassword = ref("");
const registerConfirmPassword = ref("");

// 获取当前实例
const { proxy } = getCurrentInstance();

const login = () => {
  const loginData = {
    userID: parseInt(userID.value),
    password: password.value,
  };

  apiClient
    .post("/user/login", loginData)
    .then((response) => {
      const res = response.data;
      if (res.code === 201) {
        store.setToken(res.data.token);
        proxy.$message({
          message: `Login successful! Welcome ${res.data.username} (${res.data.role})`,
          type: "success"
        });
        router.push("/");
      } else {
        proxy.$message.error(res.message);
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      proxy.$message.error("An error occurred while trying to log in.");
    });
};

const showRegisterDialog = () => {
  registerDialogVisible.value = true;
};

const register = () => {
  if (registerPassword.value !== registerConfirmPassword.value) {
    proxy.$message.error("Password do not match");
    return;
  }

  const registerData = {
    username: registerUsername.value,
    password: registerPassword.value,
    role: "guest"
  };

  apiClient
    .post("/user/register", registerData)
    .then((response) => {
      const res = response.data;
      if (res.code === 201) {
        proxy.$message({
          message: `Registration successful! Your UserID is ${res.data.userID}`,
          type: "success",
          showClose: true,
          duration: 0
        });
        registerDialogVisible.value = false;
      } else {
        proxy.$message.error(res.message);
      }
    })
    .catch((error) => {
      console.error("注册时发生错误:", error);
      proxy.$message.error("注册时发生错误。");
    });
};
</script>


<style scoped>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: url("@/assets/index_bg.jpg") no-repeat center center fixed;
  background-size: cover;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
}

.el-input {
  margin-bottom: 20px;
}

.button-container {
  width: 100%;
  .el-button {
    width: 100%
  }
}

.el-dialog .dialog-footer {
  display: flex;
  flex-direction: column; 
  gap: 10px;
  /* 纵向排列 */
}
.el-button {
  width: 100%;
  margin-bottom: 10px;
}


.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
