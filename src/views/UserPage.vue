<template>
  <el-container class="outer-container">
    <el-header class="outer-header">
      <!-- 使用自定义的 BannerHeader 组件 -->
      <BannerHeader
        :headingString="'User'"
        :componentRouteMapping="[['House','/']]"
      />
    </el-header>
    <el-main>
      <!-- 用户个人信息区域 -->
      <el-card class="user-profile" shadow="never">
        <el-avatar :src="avatarUrl" size="large" class="avatar" />
        <div class="user-info">
          <h2 class="username" id="username-display">
            <input
              v-model="username"
              type="text"
              :disabled="!isEditing"
              placeholder="Username"
              class="username-input"
            />
          </h2>
          
          <p class="role">
            {{ parsedToken.role }}
          </p>
          <p class="user-id">
            {{ parsedToken.userID }}
          </p>
        </div>
        <div class="buttons">
          <el-button type="default" plain @click="toggleEdit" style="width: 50px;">
            {{ editButtonText }}
          </el-button>
          <el-button type="default" plain @click="showChangePasswordDialog">
            Change Password
          </el-button>
          <el-button type="danger" plain @click="logOut">
            Log Out
          </el-button>
        </div>
        <el-dialog
          title="Change Password"
          v-model="changePasswordDialogVisible"
          width="400px"
          center
          align-center
        >
          <el-input
            placeholder="Current Password"
            v-model="currentPassword"
            :prefix-icon="Lock"
            show-password
          ></el-input>
          <el-input
            placeholder="New Password"
            v-model="newPassword"
            :prefix-icon="Lock"
            show-password
          ></el-input>
          <el-input
            placeholder="Confirm New Password"
            v-model="confirmNewPassword"
            :prefix-icon="Check"
          ></el-input>
          <div class="dialog-footer">
            <div class="button-container">
              <el-button @click="changePasswordDialogVisible = false">
                Cancel
              </el-button>
            </div>
            <div class="button-container">
              <el-button type="primary" plain @click="changePassword">
                Change Password
              </el-button>
            </div>
          </div>
        </el-dialog>
      </el-card>

      <!-- 欢迎消息区域 -->
      <div class="welcome-message">
        <h2>
          Welcome to the SAP MM module!
        </h2>
        <p>
          Join us to explore innovative material management solutions with
          millions of businesses globally and embark on a path to success
          together!
        </p>
      </div> 
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import apiClient from "@/axios.js"
import BannerHeader from "@/components/BannerHeader.vue";
import {Check, Lock} from "@element-plus/icons-vue"

// 使用 Pinia store
const store = useUserStore();
const token = store.token;
const parsedToken = JSON.parse(atob(token))
const router = useRouter()
const changePasswordDialogVisible = ref(false);
const { proxy } = getCurrentInstance();

const currentPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");
// 定义响应式状态
const username = ref(parsedToken.username)
const avatarUrl = ref("profile-placeholder.jpeg");
const isEditing = ref(false);

// 计算编辑按钮的文本
const editButtonText = computed(() => (isEditing.value ? "Save" : "Edit"));
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
// 编辑按钮点击处理逻辑
const toggleEdit = async() => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 保存逻辑
    const tokenParsed = JSON.parse(atob(store.token))
    await apiClient.post("/user/change_username", { username: username.value, userID:tokenParsed.userID })
      .then((response) => {
        if (response.status===200) {
          ElMessage.success("change success");
          const newInfo = tokenParsed
          newInfo["username"] = username.value
          const newToken = btoa(JSON.stringify(newInfo))
          store.setToken(newToken)
        }
      })
      .catch((error) => {
        console.error("Error saving username:", error);
      });
  }
};


const logOut = () => {
  store.logout()
  router.push("/login")
}
</script>

<style scoped>
/* 样式部分 */
.user-profile {
  margin: 20px auto;
  max-width: 400px;
  text-align: center;
}

.user-info {
  margin-top: 15px;
}

.username-input {
  margin: 15px 0;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.welcome-message {
  margin: 20px auto;
  max-width: 600px;
  text-align: center;
}

.welcome-message h2 {
  color: #4e91ff;
}
.el-dialog .el-input {
  margin-bottom: 20px;
}

.el-dialog .dialog-footer {
  .button-container {
    width: 100%;
    .el-button {
      width: 100%
    }
  }

}

.el-dialog .dialog-footer {
  display: flex;
  flex-direction: column; 
  gap: 10px;
}

.welcome-message {
  margin: 20px auto;
  max-width: 600px;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.welcome-message h2 {
  font-size: 24px;
  color: #4e91ff;
  margin-bottom: 10px;
}

.welcome-message p {
  font-size: 18px;
  color: #555;
}

.user-profile {
  background: linear-gradient(to bottom, #8ebdf5, #d2e4fd);
  padding: 20px;
  border-radius: 10px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.username {
  font-size: 28px;
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.username input {
  font-size: 28px;
  margin: 10px 0;
  border: none;
  background: transparent;
  text-align: center;
}
.role {
  font-size: 20px;
}
.user-id {
  font-size: 18px;
  margin: 5px 0;
  color: #333;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #fff;
}

.user-info {
  margin: 15px 0;
}
</style>
