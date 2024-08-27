import Mock from "mockjs";

// 定义一个随机值生成的函数，带有一定概率返回相同的值
function randomValueGenerator(template) {
  return Mock.mock(template);
}

function maybeSameField(template, sameProbability = 0.2) {
  const value = randomValueGenerator(template);
  return Math.random() < sameProbability ? value : randomValueGenerator(template);
}

function responseTemplate(code, msg, data) {
  return {
    code: code,
    message: msg,
    data:data
  }
}

const login_success = Mock.mock({ username: "@name", role: "@word", token: "@id"})
Mock.mock("/api/user/login", "post", responseTemplate(201, "success", login_success))

export default Mock