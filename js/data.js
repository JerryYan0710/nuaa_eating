// ========= 种子数据：南航将军路校区食堂 + 周边 =========
// 权重说明：1=偶尔吃 3=正常频率 5=最爱

const SEED_SHOPS = [
  // ===== 🍚 一食堂 =====
  { id: uid(), name: "一食堂一楼 麻辣香锅", category: "食堂", subCategory: "一食堂", tags: ["辣", "自选"], weight: 3, disabled: false },
  { id: uid(), name: "一食堂一楼 兰州拉面", category: "食堂", subCategory: "一食堂", tags: ["面食", "快"], weight: 3, disabled: false },
  { id: uid(), name: "一食堂一楼 黄焖鸡米饭", category: "食堂", subCategory: "一食堂", tags: ["下饭", "量大"], weight: 4, disabled: false },
  { id: uid(), name: "一食堂一楼 自选快餐", category: "食堂", subCategory: "一食堂", tags: ["便宜", "自选"], weight: 3, disabled: false },
  { id: uid(), name: "一食堂二楼 冒菜", category: "食堂", subCategory: "一食堂", tags: ["辣", "自选"], weight: 3, disabled: false },
  { id: uid(), name: "一食堂二楼 小火锅", category: "食堂", subCategory: "一食堂", tags: ["聚餐", "贵点"], weight: 2, disabled: false },
  { id: uid(), name: "一食堂二楼 馄饨水饺", category: "食堂", subCategory: "一食堂", tags: ["清淡"], weight: 2, disabled: false },
  { id: uid(), name: "一食堂二楼 烤肉饭", category: "食堂", subCategory: "一食堂", tags: ["下饭"], weight: 3, disabled: false },

  // ===== 🍚 二食堂 =====
  { id: uid(), name: "二食堂一楼 沙县小吃", category: "食堂", subCategory: "二食堂", tags: ["便宜", "快"], weight: 3, disabled: false },
  { id: uid(), name: "二食堂一楼 重庆小面", category: "食堂", subCategory: "二食堂", tags: ["辣", "面食"], weight: 3, disabled: false },
  { id: uid(), name: "二食堂一楼 三汁焖锅", category: "食堂", subCategory: "二食堂", tags: ["慢", "香"], weight: 2, disabled: false },
  { id: uid(), name: "二食堂二楼 自选快餐", category: "食堂", subCategory: "二食堂", tags: ["便宜", "量大"], weight: 4, disabled: false },
  { id: uid(), name: "二食堂二楼 烤肉饭", category: "食堂", subCategory: "二食堂", tags: ["下饭"], weight: 3, disabled: false },
  { id: uid(), name: "二食堂三楼 黄焖鸡", category: "食堂", subCategory: "二食堂", tags: ["下饭", "量大"], weight: 4, disabled: false },
  { id: uid(), name: "二食堂三楼 鸡排饭", category: "食堂", subCategory: "二食堂", tags: ["炸物", "下饭"], weight: 3, disabled: false },
  { id: uid(), name: "二食堂三楼 石锅拌饭", category: "食堂", subCategory: "二食堂", tags: ["韩式"], weight: 3, disabled: false },
  { id: uid(), name: "二食堂三楼 重庆小面", category: "食堂", subCategory: "二食堂", tags: ["辣", "面食"], weight: 3, disabled: false },

  // ===== 🍚 三食堂 =====
  { id: uid(), name: "三食堂 自选快餐", category: "食堂", subCategory: "三食堂", tags: ["便宜"], weight: 3, disabled: false },
  { id: uid(), name: "三食堂 水饺", category: "食堂", subCategory: "三食堂", tags: ["清淡"], weight: 2, disabled: false },
  { id: uid(), name: "三食堂 面条", category: "食堂", subCategory: "三食堂", tags: ["面食"], weight: 2, disabled: false },

  // ===== 🏮 夜市小吃 =====
  { id: uid(), name: "胜太路夜市 炸串", category: "夜市", subCategory: "胜太路夜市", tags: ["炸物", "晚"], weight: 3, disabled: false },
  { id: uid(), name: "胜太路夜市 小龙虾", category: "夜市", subCategory: "胜太路夜市", tags: ["聚餐", "贵", "晚"], weight: 2, disabled: false },
  { id: uid(), name: "胜太路夜市 烤冷面", category: "夜市", subCategory: "胜太路夜市", tags: ["小吃"], weight: 2, disabled: false },
  { id: uid(), name: "胜太路夜市 麻辣烫", category: "夜市", subCategory: "胜太路夜市", tags: ["辣", "自选"], weight: 3, disabled: false },
  { id: uid(), name: "托乐嘉 鸡煲", category: "夜市", subCategory: "托乐嘉", tags: ["聚餐"], weight: 2, disabled: false },
  { id: uid(), name: "托乐嘉 螺蛳粉", category: "夜市", subCategory: "托乐嘉", tags: ["臭香", "辣"], weight: 3, disabled: false },
  { id: uid(), name: "托乐嘉 烧烤", category: "夜市", subCategory: "托乐嘉", tags: ["聚餐", "晚"], weight: 2, disabled: false },
  { id: uid(), name: "地铁站口 鸡蛋灌饼", category: "夜市", subCategory: "门口", tags: ["早餐", "快"], weight: 2, disabled: false },

  // ===== 🛵 外卖 =====
  { id: uid(), name: "老乡鸡", category: "外卖", subCategory: "", tags: ["中式快餐", "干净"], weight: 3, disabled: false },
  { id: uid(), name: "蜜雪冰城", category: "外卖", subCategory: "", tags: ["奶茶", "便宜"], weight: 3, disabled: false },
  { id: uid(), name: "杨国福麻辣烫", category: "外卖", subCategory: "", tags: ["辣", "自选"], weight: 3, disabled: false },
  { id: uid(), name: "华莱士", category: "外卖", subCategory: "", tags: ["炸鸡", "便宜"], weight: 2, disabled: false },
  { id: uid(), name: "肯德基 KFC", category: "外卖", subCategory: "", tags: ["炸鸡", "贵"], weight: 2, disabled: false },
  { id: uid(), name: "麦当劳", category: "外卖", subCategory: "", tags: ["炸鸡"], weight: 2, disabled: false },
  { id: uid(), name: "沙县小吃（外卖）", category: "外卖", subCategory: "", tags: ["便宜", "快"], weight: 3, disabled: false },
  { id: uid(), name: "鱼你在一起", category: "外卖", subCategory: "", tags: ["下饭", "辣"], weight: 3, disabled: false },
  { id: uid(), name: "阿香米线", category: "外卖", subCategory: "", tags: ["面食", "清淡"], weight: 2, disabled: false },
  { id: uid(), name: "塔斯汀汉堡", category: "外卖", subCategory: "", tags: ["炸鸡"], weight: 2, disabled: false },
];

window.SEED_SHOPS = SEED_SHOPS;
