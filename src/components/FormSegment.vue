<template>
  <div>
    <p class="text-title">
      {{ title }}
    </p>
    <el-divider class="divider"></el-divider>
    <el-form :model="localForm" label-width="auto" label-position="left">
      <el-row :gutter="20">
        <el-col v-for="(_, key, index) in filtForm" :key="index" :span="8">
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
              v-model="filtForm[key]"
              class="text-value"
              @input="updateForm(key, filtForm[key])"
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
  data() {
    return {
      localForm: JSON.parse(JSON.stringify(this.form)), // 深拷贝form到localForm
      filtForm: this.filterFormFields(this.form, this.fields), // 过滤后的字段
    };
  },
  methods: {
    filterFormFields(form, fields) {
      const filteredForm = {};
      fields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(form, field)) {
          filteredForm[field] = form[field];
        }
      });
      return filteredForm;
    },
    updateForm(key, value) {
      this.localForm[key] = value;
      this.$emit("update:form", { ...this.localForm }); // 向父组件发射事件，更新form
    },
  },
  watch: {
    form: {
      handler(newVal) {
        this.localForm = JSON.parse(JSON.stringify(newVal)); // 更新本地表单
        this.filtForm = this.filterFormFields(newVal, this.fields);
      },
      deep: true,
    },
    filtForm: {
      handler(newVal) {
        Object.keys(newVal).forEach((key) => {
          this.localForm[key] = newVal[key];
          this.$emit("update:form", { ...this.localForm });
        });
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.text-title {
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 10px;
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
