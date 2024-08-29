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
                <el-icon :id="key" class="help-info">
                  <InfoFilled />
                </el-icon>
                
                <template #popper>
                  <p>
                    {{ desc[index] }}
                  </p>
                </template>
              </VTooltip>
            </template>
            <el-tooltip
              :visible="inputFocused[index] && isOverflow[index]"
              placement="bottom"
              popper-style="max-width: 200px; background-color: black;"
            >
              <template #content>
                {{ form[key] }}
              </template>
              <div class="input-wrapper">
                <el-input
                  v-model="form[key]"
                  ref="inputRefs"
                  :disabled="disabled"
                  @dblclick="clearInput(key)"
                  @focus="handleFocus(index)"
                  @blur="handleBlur(index)"
                  @input="checkOverflow(index)"
                >
                  <template  #append>
                    <el-button 
                      class="copy-button"
                      :icon="CopyDocument"
                      @click="handleCopyPaste(key)"
                    />
                  </template>
                </el-input>
              </div>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { CopyDocument } from "@element-plus/icons-vue";

export default {
  props: {
    form: { type: Object, required: true },
    title: { type: String, required: true },
    fields: { type: Array, required: true },
    desc: { type: Array, required: true },
    disabled: {type: Boolean, default: false}
  },
  data() {
    return {
      CopyDocument,
      isOverflow: this.fields.map(() => false),
      inputFocused: this.fields.map(() => false)
    };
  },
  methods: {
    clearInput(key) {
      this.form[key] = ""
    },
    handleFocus(index) {
      this.inputFocused[index] = true;
      this.checkOverflow(index);
    },
    handleBlur(index) {
      this.inputFocused[index] = false;
      this.isOverflow[index] = false;  // 失去焦点时隐藏 Tooltip
    },
    checkOverflow(index) {
      this.$nextTick(() => {
        const inputElement = this.$refs.inputRefs[index].$el.querySelector("input");
        this.isOverflow[index] = inputElement.scrollWidth > inputElement.clientWidth;
      });
    },
    async handleCopyPaste(key) {
      const value = this.form[key];
      if (value) {
        try {
          await navigator.clipboard.writeText(value);
          this.$message.success("copied");
        } catch (err) {
          this.$message.error("failed");
        }
      } else {
        try {
          const text = await navigator.clipboard.readText();
          this.form[key] = text;
        } catch (err) {
          this.$message.error("failed");
        }
      }
    }
  }
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
  font-family: "Inter", sans-serif;
}
</style>
