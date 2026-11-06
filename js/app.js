// ========= 主应用逻辑 =========
(function () {
  'use strict';

  // ===== 状态 =====
  let currentFilter = 'all';          // 首页分类筛选
  let currentManageFilter = 'all';    // 管理页分类筛选
  let spinning = false;               // 是否在动画中
  let editMode = null;                // 编辑中的店铺对象，null 表示新增
  let confirmCallback = null;         // 确认弹窗回调

  // ===== DOM 快捷引用 =====
  const $ = (sel) => document.querySelector(sel);
  const pages = {
    'page-home': $('#page-home'),
    'page-manage': $('#page-manage'),
    'page-settings': $('#page-settings')
  };

  // ========= 初始化 =========
  function init() {
    applyTheme();           // 深色模式
    setupTabBar();          // 底部导航切换
    setupHomePage();        // 首页抽取 + 筛选
    setupManagePage();      // 管理页
    setupSettingsPage();    // 设置页
    setupModals();          // 弹窗事件
    renderShopList();       // 预渲染管理页店铺列表（避免首次进入空白）
  }

  // ========= 深色模式 =========
  function applyTheme() {
    const s = Store.getSettings();
    if (s.darkMode) document.documentElement.setAttribute('data-theme', 'dark');
    $('#toggle-dark').checked = !!s.darkMode;
  }

  // ========= 底部 Tab 切换 =========
  function setupTabBar() {
    document.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab-item');
      if (!tab) return;
      const target = tab.dataset.target;
      // 防御：确保目标页面存在
      const targetPage = pages[target];
      if (!targetPage) return;

      Object.values(pages).forEach((p) => p && p.classList.remove('active'));
      targetPage.classList.add('active');
      // 切换 tab 状态高亮（同一页有两套 tab-bar DOM）
      document.querySelectorAll('.tab-item').forEach((t) => {
        t.classList.toggle('active', t.dataset.target === target);
      });
      // 进入管理页时刷新列表
      if (target === 'page-manage') renderShopList();
    });
  }

  // ========= 首页：抽取 + 筛选 =========
  function setupHomePage() {
    const btn = $('#btn-spin');
    const display = $('#wheel-display');
    const frame = $('.result-frame');
    const detail = $('#result-detail');

    btn.addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      btn.disabled = true;
      frame.classList.add('spinning');
      display.classList.add('rolling');
      detail.classList.add('hidden');

      const shops = Store.getShops();
      const pool = U.filterByCategory(shops, currentFilter);
      if (pool.length === 0) {
        display.textContent = '没有可选的店 🥲';
        display.classList.remove('rolling');
        frame.classList.remove('spinning');
        spinning = false;
        btn.disabled = false;
        return;
      }

      // 滚动动画：快速切换显示随机条目
      const duration = 2000;  // 总时长 2s
      const interval = 70;    // 每 70ms 跳一次
      let elapsed = 0;

      const timer = setInterval(() => {
        const fakePick = pool[Math.floor(Math.random() * pool.length)];
        display.textContent = fakePick.name;
        elapsed += interval;

        if (elapsed >= duration) {
          clearInterval(timer);
          display.classList.remove('rolling');
          frame.classList.remove('spinning');
          frame.classList.add('pop');
          setTimeout(() => frame.classList.remove('pop'), 400);

          // 真正的加权随机
          const winner = U.weightedPick(pool);
          if (winner) {
            display.textContent = winner.name;
            // 显示分类和标签
            $('#result-category').textContent =
              (winner.subCategory ? winner.subCategory + ' · ' : '') + winner.category;
            const tagsContainer = $('#result-tags');
            tagsContainer.innerHTML = '';
            (winner.tags || []).forEach((t) => {
              const span = document.createElement('span');
              span.textContent = '#' + t;
              tagsContainer.appendChild(span);
            });
            detail.classList.remove('hidden');
          } else {
            display.textContent = '没有可选的店 🥲';
          }
          spinning = false;
          btn.disabled = false;
        }
      }, interval);
    });

    // 首页筛选 chip
    document.querySelectorAll('#page-home .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#page-home .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        currentFilter = chip.dataset.filter;
      });
    });
  }

  // ========= 管理页 =========
  function setupManagePage() {
    // 添加按钮
    $('#btn-add-shop').addEventListener('click', () => openShopModal(null));

    // 管理页筛选 chip
    document.querySelectorAll('[data-mfilter]').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-mfilter]').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        currentManageFilter = chip.dataset.mfilter;
        renderShopList();
      });
    });

    // 搜索框（防抖）
    const searchInput = $('#search-input');
    searchInput.addEventListener('input', U.debounce(renderShopList, 200));
  }

  /** 渲染店铺列表 */
  function renderShopList() {
    const ul = $('#shop-list');
    const shops = Store.getShops();
    const keyword = $('#search-input').value.trim().toLowerCase();

    const filtered = shops.filter((s) => {
      // 分类筛选
      if (currentManageFilter !== 'all' && s.category !== currentManageFilter) return false;
      // 搜索
      if (keyword) {
        const hay = (s.name + ' ' + (s.subCategory || '') + ' ' + (s.tags || []).join(' ')).toLowerCase();
        if (!hay.includes(keyword)) return false;
      }
      return true;
    });

    ul.innerHTML = '';
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.style.textAlign = 'center';
      li.style.color = 'var(--text-secondary)';
      li.style.padding = '40px 0';
      li.textContent = '暂无店铺，点右上角 + 添加吧！';
      ul.appendChild(li);
      return;
    }

    // 按分类排序，让列表更整齐
    const catOrder = { '食堂': 0, '夜市': 1, '外卖': 2 };
    filtered.sort((a, b) => {
      const c = (catOrder[a.category] ?? 99) - (catOrder[b.category] ?? 99);
      if (c !== 0) return c;
      return (a.subCategory || '').localeCompare(b.subCategory || '');
    });

    filtered.forEach((shop) => {
      const li = document.createElement('li');
      li.className = 'shop-card';
      li.innerHTML = `
        <div class="shop-info">
          <div class="shop-name">${shop.disabled ? '🚫 ' : ''}${escapeHtml(shop.name)}</div>
          <div class="shop-meta">
            <span>${shop.category}</span>
            ${shop.subCategory ? `<span>· ${escapeHtml(shop.subCategory)}</span>` : ''}
            <span>⭐ ${shop.weight || 1}</span>
            ${(shop.tags || []).slice(0, 3).map((t) => `<span>#${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
        <div class="shop-actions">
          <button data-act="toggle" title="临时禁用/启用">${shop.disabled ? '✓' : '🚫'}</button>
          <button data-act="edit">✏️</button>
          <button data-act="del" class="del">🗑️</button>
        </div>
      `;
      ul.appendChild(li);
    });

    // 事件委托
    ul.querySelectorAll('.shop-actions button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const li = btn.closest('.shop-card');
        // 找到对应 shop
        const allShops = Store.getShops();
        const shop = allShops.find((s) =>
          li.querySelector('.shop-name').textContent.replace(/^🚫 /, '').trim() === s.name.trim()
        );
        if (!shop) return;

        const act = btn.dataset.act;
        if (act === 'toggle') {
          Store.updateShop(shop.id, { disabled: !shop.disabled });
          renderShopList();
        } else if (act === 'edit') {
          openShopModal(shop);
        } else if (act === 'del') {
          showConfirm(`确定删除「${shop.name}」吗？`, () => {
            Store.deleteShop(shop.id);
            renderShopList();
          });
        }
      });
    });
  }

  // ========= 设置页 =========
  function setupSettingsPage() {
    $('#toggle-dark').addEventListener('change', (e) => {
      const s = Store.getSettings();
      s.darkMode = e.target.checked;
      Store.saveSettings(s);
      if (s.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    });

    $('#btn-reset').addEventListener('click', () => {
      showConfirm('确定重置为默认数据？你的自定义店铺会全部丢失！', () => {
        Store.resetToSeed();
        renderShopList();
        flash('已重置为默认数据 ✅');
      });
    });

    $('#btn-export').addEventListener('click', () => {
      const json = Store.exportAll();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nuaa-eating-backup-${U.todayStr()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      flash('导出成功 ✅');
    });

    $('#btn-import').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          Store.importAll(reader.result);
          renderShopList();
          flash('导入成功 ✅');
          // 深色模式同步
          applyTheme();
        } catch (err) {
          flash('导入失败：JSON 格式不对 ❌', true);
        }
        e.target.value = '';
      };
      reader.readAsText(file);
    });
  }

  // ========= 弹窗 =========
  function setupModals() {
    // 关闭弹窗：点击遮罩或取消按钮
    document.querySelectorAll('.modal').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m) closeModal(m);
      });
    });
    $('#btn-cancel-shop').addEventListener('click', () => closeModal($('#modal-shop')));
    $('#btn-confirm-cancel').addEventListener('click', () => {
      closeModal($('#modal-confirm'));
      confirmCallback = null;
    });
    $('#btn-confirm-ok').addEventListener('click', () => {
      if (confirmCallback) confirmCallback();
      confirmCallback = null;
      closeModal($('#modal-confirm'));
    });

    // 权重滑块实时显示
    const weightSlider = document.querySelector('input[name="weight"]');
    if (weightSlider) {
      weightSlider.addEventListener('input', () => {
        $('#weight-display').textContent = weightSlider.value;
      });
    }

    // 表单提交
    $('#shop-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const shop = {
        id: editMode ? editMode.id : U.uid(),
        name: formData.get('name').trim(),
        category: formData.get('category'),
        subCategory: formData.get('subCategory').trim(),
        tags: (formData.get('tags') || '').split(/[,，]/).map((t) => t.trim()).filter(Boolean),
        weight: parseInt(formData.get('weight'), 10) || 3,
        disabled: editMode ? editMode.disabled : false
      };

      if (editMode) {
        Store.updateShop(shop.id, shop);
      } else {
        Store.addShop(shop);
      }
      editMode = null;
      closeModal($('#modal-shop'));
      renderShopList();
      flash(editMode ? '已更新 ✅' : '已添加 ✅');
    });
  }

  /** 打开添加/编辑店铺弹窗 */
  function openShopModal(shop) {
    editMode = shop;
    const modal = $('#modal-shop');
    const form = $('#shop-form');
    form.reset();
    $('#weight-display').textContent = '3';

    if (shop) {
      $('#modal-title').textContent = '编辑店铺';
      form.name.value = shop.name;
      form.category.value = shop.category;
      form.subCategory.value = shop.subCategory || '';
      form.tags.value = (shop.tags || []).join(', ');
      form.weight.value = shop.weight || 3;
      $('#weight-display').textContent = shop.weight || 3;
    } else {
      $('#modal-title').textContent = '添加店铺';
    }
    modal.classList.remove('hidden');
  }

  /** 通用确认弹窗 */
  function showConfirm(message, okCallback) {
    $('#confirm-message').textContent = message;
    confirmCallback = okCallback;
    $('#modal-confirm').classList.remove('hidden');
  }

  function closeModal(m) { m.classList.add('hidden'); }

  /** Toast 提示 */
  function flash(msg, isError = false) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed', top: '30%', left: '50%', transform: 'translateX(-50%)',
      background: isError ? 'var(--danger)' : 'var(--primary)',
      color: '#fff', padding: '12px 24px', borderRadius: '8px',
      zIndex: '500', fontSize: '14px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      animation: 'fadeIn 0.2s'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1800);
  }

  /** 防 XSS */
  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // 启动！
  document.addEventListener('DOMContentLoaded', init);
})();
