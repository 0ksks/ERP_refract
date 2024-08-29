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
        <el-avatar :src="avatarUrl" size="large" />
        <div class="user-info">
          <el-input
            v-model="username"
            :disabled="!isEditing"
            placeholder="Username"
            class="username-input"
          ></el-input>
          <el-tag type="info" class="role">
            {{ parsedToken.role }}
          </el-tag>
          <el-tag type="success" class="user-id">
            ID: {{ parsedToken.userID }}
          </el-tag>
        </div>
        <div class="buttons">
          <el-button type="primary" plain @click="toggleEdit">
            {{ editButtonText }}
          </el-button>
          <el-button @click="logOut">
            Log Out
          </el-button>
        </div>
      </el-card>

      <!-- 欢迎消息区域 -->
      <h2>
        Welcome to the SAP MM module!
      </h2>
      <p>
        Join us to explore innovative material management solutions with
        millions of businesses globally and embark on a path to success
        together!
      </p>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/store";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import apiClient from "@/axios.js"
import BannerHeader from "@/components/BannerHeader.vue";

// 使用 Pinia store
const store = useUserStore();
const token = store.token;
const parsedToken = JSON.parse(atob(token))
const router = useRouter()

// 定义响应式状态
const username = ref(parsedToken.username)
const avatarUrl = ref("profile-placeholder.jpeg");
const isEditing = ref(false);

// 计算编辑按钮的文本
const editButtonText = computed(() => (isEditing.value ? "Save" : "Edit"));

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
</style>
