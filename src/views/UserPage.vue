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
            Administrator
          </el-tag>
          <el-tag type="success" class="user-id">
            ID: 0000001
          </el-tag>
        </div>
        <div class="buttons">
          <el-button type="primary" plain @click="toggleEdit">
            {{ editButtonText }}
          </el-button>
          <el-button @click="this.$router.push('/login')">
            Sign Out
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
import { ElMessageBox } from "element-plus";
import BannerHeader from "@/components/BannerHeader.vue";

// 使用 Pinia store
const store = useUserStore();
const token = store.token;

// 定义响应式状态
const username = ref("learn-000");
const avatarUrl = ref("profile-placeholder.jpeg");
const isEditing = ref(false);

// 计算编辑按钮的文本
const editButtonText = computed(() => (isEditing.value ? "Save" : "Edit"));

// 编辑按钮点击处理逻辑
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // 保存逻辑
    fetch("/save-username", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username.value }),
    })
      .then((response) => {
        if (!response.ok) {
          ElMessageBox.alert(
            "Failed to save username.",
            "Save Failed",
            {
              confirmButtonText: "OK",
              type: "error",
            }
          );
        }
      })
      .catch((error) => {
        console.error("Error saving username:", error);
      });
  }
};

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
