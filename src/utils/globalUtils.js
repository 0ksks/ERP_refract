export const globalUtils = {
  install(app) {
    app.config.globalProperties.$sentenceCase = (name) => {
      return name
        .replace(/([a-z])([A-Z])/g, "$1 $2") // 在小写字母和大写字母之间添加空格
        .replace(/^./, (str) => str.toUpperCase()) // 将首字母大写
    }
  },
}
