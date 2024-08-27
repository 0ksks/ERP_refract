import Mock from "mockjs";

function createMaterialEntity() {
  return {
    materialID: randomValueGenerator("@integer(1, 1000)"),
    userID: randomValueGenerator("@integer(1, 1000)"),
    materialName: randomValueGenerator("@word"),
    description: randomValueGenerator("@sentence"),
    baseUnit: randomValueGenerator("@word"),
    materialGroup: randomValueGenerator("@word"),
    division: randomValueGenerator("@word"),
    grossWeight: randomValueGenerator("@float(0.1, 100.0, 1, 2)"),
    netWeight: randomValueGenerator("@float(0.1, 100.0, 1, 2)"),
    weightUnit: randomValueGenerator("@word"),
    volume: randomValueGenerator("@float(0.1, 100.0, 1, 2)"),
    volumeUnit: randomValueGenerator("@word"),
    packMaterial: randomValueGenerator("@word"),
    availabilityCheck: randomValueGenerator("@word"),
    transportationGroup: randomValueGenerator("@word"),
    loadingGroup: randomValueGenerator("@word"),
    mrpType: randomValueGenerator("@word"),
    mrpController: randomValueGenerator("@word"),
    lotSize: randomValueGenerator("@word"),
    minimumLotSize: randomValueGenerator("@integer(1, 100)"),
    plannedDeliveryTime: randomValueGenerator("@date('yyyy/MM/dd')"),
    valuationClass: randomValueGenerator("@word"),
    movingPrice: randomValueGenerator("@float(0.1, 100.0, 1, 2)"),
    priceUnit: randomValueGenerator("@word"),
    standardPrice: randomValueGenerator("@float(0.1, 100.0, 1, 2)")
  };
}

// 生成10个实体，其中部分字段有一定概率相同
function generateMaterialEntities(sameProbability = 0.5) {
  const materials = [];
  const sharedFields = {};

  // 先随机生成要共享的字段
  const sharedKeys = ["materialName", "baseUnit", "division", "mrpType", "priceUnit"];
  sharedKeys.forEach(key => {
    sharedFields[key] = randomValueGenerator(`@${key === "plannedDeliveryTime" ? "date('yyyy/MM/dd')" : "word"}`);
  });

  // 生成实体
  for (let i = 0; i < 10; i++) {
    const material = createMaterialEntity();

    // 让部分字段相同
    sharedKeys.forEach(key => {
      material[key] = Math.random() < sameProbability ? sharedFields[key] : material[key];
    });

    materials.push(material);
  }

  return materials;
}
// 定义一个随机值生成的函数，带有一定概率返回相同的值
function randomValueGenerator(template) {
  return Mock.mock(template);
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

// 返回Mock数据
const materialList = generateMaterialEntities();
Mock.mock("/api/material/query", "post", responseTemplate(200, "success", materialList));


export default Mock