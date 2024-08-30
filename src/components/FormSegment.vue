<template>
  <div>
    <!-- 标题显示 -->
    <p class="text-title">
      {{ title }}
    </p>
    <!-- 分割线 -->
    <el-divider class="divider"></el-divider>
    <!-- model         : 绑定表单数据对象 -->
    <!-- label-width   : 自动设置标签宽度 -->
    <!-- label-position: 标签位置在左侧 -->
    <el-form 
      :model         = "form"
      label-width    = "auto"
      label-position = "left"
    >
      <!-- gutter: 每个列之间的间距 -->
      <el-row :gutter="20">
        <!-- v-for: 循环生成表单项 -->
        <!-- key  : 循环项的唯一标识 -->
        <!-- span : 每个表单项占8列 -->
        <el-col 
          v-for = "(key, index) in fields" 
          :key  = "index" 
          :span = "8"
        >
          <el-form-item>
            <!-- 表单标签 -->
            <template #label>
              {{ $sentenceCase(key) }}
              <!-- placement: 提示信息显示位置 -->
              <!-- triggers : 触发提示信息显示的方式 -->
              <!-- auto-hide: 是否自动隐藏提示信息 -->
              <!-- theme    : 提示信息的主题样式 -->
              <VTooltip
                placement  = "top-start"
                :triggers  = "['click']"
                :auto-hide = "false"
                theme      = "info-tooltip"
              >
                <!-- id: 图标的唯一标识 -->
                <!-- class: 图标的样式类 -->
                <el-icon :id="key" class="help-info">
                  <InfoFilled />
                </el-icon>

                <!-- 提示信息内容 -->
                <template #popper>
                  <p>
                    {{ desc[index] }}
                  </p>
                </template>
              </VTooltip>
            </template>

            <!-- visible     : 是否显示提示信息 -->
            <!-- placement   : 提示信息显示位置 -->
            <!-- popper-style: 提示信息的样式 -->
            <el-tooltip
              :visible     = "inputFocused[index] && isOverflow[index]"
              placement    = "bottom"
              popper-style = "max-width: 200px; background-color: black;"
            >
              <!-- content: 提示信息内容 -->
              <template #content>
                {{ form[key] }}
              </template>
              
              <div class="input-wrapper">
                <!-- v-model  : 绑定输入框数据 -->
                <!-- ref      : 引用输入框的实例 -->
                <!-- disabled : 输入框是否禁用 -->
                <!-- @dblclick: 双击事件处理 -->
                <!-- @focus   : 获得焦点事件处理 -->
                <!-- @blur    : 失去焦点事件处理 -->
                <!-- @input   : 输入事件处理 -->
                <el-input
                  v-model   = "form[key]"
                  ref       = "inputRefs"
                  :disabled = "disabled"
                  @dblclick = "clearInput(key)"
                  @focus    = "handleFocus(index)"
                  @blur     = "handleBlur(index)"
                  @input    = "checkOverflow(index)"
                >
                  <!-- 追加在输入框后的按钮 -->
                  <template #append>
                    <!-- class : 按钮的样式类 -->
                    <!-- icon  : 按钮的图标 -->
                    <!-- @click: 点击事件处理 -->
                    <el-button 
                      class ="copy-button"
                      :icon ="CopyDocument"
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
    // 传递到组件的表单对象
    form    : { type: Object, required: true },
    // 传递到组件的标题
    title   : { type: String, required: true },
    // 传递到组件的字段数组
    fields  : { type: Array,  required: true },
    // 传递到组件的描述数组
    desc    : { type: Array,  required: true },
    // 传递到组件的禁用状态
    disabled: {type: Boolean, default : false}
  },
  data() {
    return {
      // 引入的图标
      CopyDocument,
      // 输入框是否溢出的状态
      isOverflow: this.fields.map(() => false),
      // 输入框是否获得焦点的状态
      inputFocused: this.fields.map(() => false)
    };
  },
  methods: {
    // 清空输入框内容
    clearInput(key) {
      this.form[key] = ""
    },
    // 处理输入框获得焦点事件
    handleFocus(index) {
      this.inputFocused[index] = true;
      this.checkOverflow(index);  // 检查是否溢出
    },
    // 处理输入框失去焦点事件
    handleBlur(index) {
      this.inputFocused[index] = false;
      this.isOverflow[index] = false;  // 失去焦点时隐藏 Tooltip
    },
    // 检查输入框内容是否溢出
    checkOverflow(index) {
      this.$nextTick(() => {
        const inputElement = this.$refs.inputRefs[index].$el.querySelector("input");
        this.isOverflow[index] = inputElement.scrollWidth > inputElement.clientWidth;
      });
    },
    // 处理复制或粘贴事件
    async handleCopyPaste(key) {
      const value = this.form[key];
      if (value) {
        try {
          // 复制到剪贴板
          await navigator.clipboard.writeText(value);
          this.$message.success("copied");
        } catch (err) {
          this.$message.error("failed");
        }
      } else {
        try {
          // 从剪贴板粘贴内容
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
  font-size:   15px;
  font-weight: bold;
  text-align:  left;
}

.divider {
  margin-top:    15px;
  margin-bottom: 15px;
}

.text-value {
  font-size:     14px;
  margin-bottom: 20px;
  display:       inline-block;
  width:         190px;
  font-family:   "Inter", sans-serif;
}
</style>
