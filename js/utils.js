// ========= 工具函数库 =========

/** 生成简易 UUID */
function uid() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

/**
 * 加权随机抽取
 * @param {Array} items - 店铺数组，每项含 weight（1-5）和 disabled（可选）
 * @returns {Object|null} 抽中的条目；若没有有效条目返回 null
 */
function weightedPick(items) {
  // 过滤掉禁用的店铺
  const pool = items.filter((i) => !i.disabled);
  if (pool.length === 0) return null;

  // 计算总权重
  const total = pool.reduce((sum, item) => sum + (item.weight || 1), 0);
  let r = Math.random() * total;

  for (const item of pool) {
    r -= item.weight || 1;
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

/**
 * 根据分类（可选）过滤店铺
 * @param {Array} items - 全部店铺
 * @param {string} category - 'all' 或具体分类名
 */
function filterByCategory(items, category) {
  if (!category || category === 'all') return items;
  return items.filter((i) => i.category === category);
}

/** 格式化日期为 YYYY-MM-DD */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** 防抖函数 */
function debounce(fn, delay = 200) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 暴露到全局（因为是原生 JS，不使用模块）
window.U = { uid, weightedPick, filterByCategory, todayStr, debounce };
