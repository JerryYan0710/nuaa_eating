// ========= LocalStorage 封装 =========

const STORAGE_KEY = 'nuaa_eating_shops_v1';
const SETTINGS_KEY = 'nuaa_eating_settings_v1';

const Store = {
  /** 读取店铺（首次使用返回种子数据） */
  getShops() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    // 首次启动：写入种子数据
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.SEED_SHOPS));
    return window.SEED_SHOPS.slice();
  },

  /** 保存店铺 */
  saveShops(shops) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shops));
  },

  /** 追加店铺 */
  addShop(shop) {
    const shops = this.getShops();
    shops.unshift(shop);
    this.saveShops(shops);
  },

  /** 更新店铺 */
  updateShop(id, patch) {
    const shops = this.getShops();
    const idx = shops.findIndex((s) => s.id === id);
    if (idx !== -1) {
      shops[idx] = { ...shops[idx], ...patch };
      this.saveShops(shops);
    }
  },

  /** 删除店铺 */
  deleteShop(id) {
    const shops = this.getShops().filter((s) => s.id !== id);
    this.saveShops(shops);
  },

  /** 重置为种子数据 */
  resetToSeed() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.SEED_SHOPS));
    return window.SEED_SHOPS.slice();
  },

  /** 导出全部数据 */
  exportAll() {
    return JSON.stringify({
      shops: this.getShops(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  /** 导入数据 */
  importAll(jsonStr) {
    const data = JSON.parse(jsonStr);
    if (data.shops && Array.isArray(data.shops)) {
      this.saveShops(data.shops);
    }
    if (data.settings) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    }
  },

  // ===== 设置 =====
  getSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { darkMode: false };
  },

  saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  }
};

window.Store = Store;
