<template>
  <div>
    <p class="text-title">
      {{ title }}
    </p>
    <el-divider class="divider"></el-divider>
    <el-form :model="form" label-width="auto" label-position="left">
      <el-row :gutter="20">
        <el-col v-for="(key, index) in fields" :key="index" :span="8">
          <el-form-item>
            <template #label>
              {{ $sentenceCase(key) }}
              <VTooltip
                placement="top-start"
                :triggers="['click']"
                :auto-hide="false"
                theme="info-tooltip"
              >
                <el-icon
                  :id="key"
                  class="help-info"
                >
                  <InfoFilled />
                </el-icon>
                <template #popper>
                  <p>
                    {{ desc[index] }}
                  </p>
                </template>
              </VTooltip>
            </template>
            <el-input
              v-model="form[key]"
              class="text-value"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    form: { type: Object, required: true },
    title: { type: String, required: true },
    fields: { type: Array, required: true },
    desc: { type: Array, required: true },
  },
};
</script>

<style scoped>
.text-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}

.divider {
  margin-top: 15px;
  margin-bottom: 15px;
}

.text-value {
  font-size: 14px;
  margin-bottom: 20px;
  display: inline-block;
  width: 190px;
  font-family: "Inter", sans;
}
</style>
