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
          prefix-icon="el-icon-user"
        ></el-input>
        <el-input
          placeholder="Password"
          v-model="password"
          prefix-icon="el-icon-lock"
          show-password
        ></el-input>
        <div class="buttons">
          <el-button type="primary" @click="login">
            Log On
          </el-button>
          <el-button type="default" @click="showChangePasswordDialog">
            Change Password
          </el-button>
          <el-button
            type="text"
            class="frameless-button"
            @click="showRegisterDialog"
          >
            Register One
          </el-button>
        </div>
        

        <!-- Registration Dialog -->
        <el-dialog
          title="Register"
          v-model="registerDialogVisible"
          width="400px"
        >
          <el-input
            placeholder="Username"
            v-model="registerUsername"
            prefix-icon="el-icon-user"
          ></el-input>
          <el-input
            placeholder="Password"
            v-model="registerPassword"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
          <el-input
            placeholder="Confirm Password"
            v-model="registerConfirmPassword"
            prefix-icon="el-icon-check"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="registerDialogVisible = false">
              Cancel
            </el-button>
            <el-button type="primary" @click="register">
              Register
            </el-button>
          </span>
        </el-dialog>

        <!-- Change Password Dialog -->
        <el-dialog
          title="Change Password"
          v-model="changePasswordDialogVisible"
          width="400px"
        >
          <el-input
            placeholder="Current Password"
            v-model="currentPassword"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
          <el-input
            placeholder="New Password"
            v-model="newPassword"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
          <el-input
            placeholder="Confirm New Password"
            v-model="confirmNewPassword"
            prefix-icon="el-icon-check"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="changePasswordDialogVisible = false">
              Cancel
            </el-button>
            <el-button type="primary" @click="changePassword">
              Change Password
            </el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import {useUserStore} from "@/store"
import { useRouter } from "vue-router";
import { ref, getCurrentInstance } from "vue";
import apiClient from "@/axios.js";

const store = useUserStore();
const router = useRouter();

const userID = ref("");
const password = ref("");

const registerDialogVisible = ref(false);
const changePasswordDialogVisible = ref(false);

const registerUsername = ref("");
const registerPassword = ref("");
const registerConfirmPassword = ref("");

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");

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

const showChangePasswordDialog = () => {
  changePasswordDialogVisible.value = true;
};

const changePassword = () => {
  if (newPassword.value !== confirmNewPassword.value) {
    proxy.$message.error("New password does not match");
    return;
  }
  const userID = JSON.parse(atob(store.token)).userID
  const changePasswordData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    userID: userID
  };

  apiClient
    .post("/user/change_password", changePasswordData)
    .then((response) => {
      const res = response.data;
      if (res.code === 200) {
        proxy.$message({
          message: "Password changed successfully!",
          type: "success",
        });
        changePasswordDialogVisible.value = false;
      } else {
        proxy.$message.error(res.message);
      }
    })
    .catch((error) => {
      console.error("Error during password change:", error);
      proxy.$message.error("An error occurred while trying to change the password.");
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

.el-button {
  width: 100%;
  margin-bottom: 10px;
}

.frameless-button {
  margin-top: 10px;
  padding: 0;
  width: 100%;
  text-align: center;
}
.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
