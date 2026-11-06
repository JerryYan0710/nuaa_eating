# 🍱 这顿吃啥 — Nanjing University Aeronautics & Astronautics 食堂随机神器

> 告别选择困难！38 家南航食堂窗口 + 夜市 + 外卖，一键随机抽今天吃啥。

## ✨ 功能

| 功能 | 说明 |
|------|------|
| 🎲 **随机抽取** | 大按钮点一下，2 秒滚动动画后定格结果，支持分类筛选 |
| 🚫 **加权随机** | 爱吃的店给个高权重，更常被抽到 |
| 📚 **店铺管理** | 自由增/删/改/临时禁用店铺，搜索 + 分类筛选 |
| ⚙️ **设置** | 深色模式、JSON 备份导出/导入、一键重置 |
| 📱 **PWA** | 手机浏览器「添加到主屏幕」即可当 App 用，离线可用 |
| 💾 **零后端** | 数据全存浏览器 LocalStorage，不采集任何隐私 |

## 🖼️ 截图

> TODO: 用完后可以把下面的替换成真实截图（手机 / 电脑各一张）

![首页抽取](https://raw.githubusercontent.com/nuaa-eating/nuaa-eating/main/docs/screenshot-home.png)
![店铺管理](https://raw.githubusercontent.com/nuaa-eating/nuaa-eating/main/docs/screenshot-manage.png)

## 🚀 快速开始

### 方式 1：GitHub Pages 在线访问（推荐）

如果你已经部署了 Pages，直接打开：
```
https://你的用户名.github.io/nuaa_eating/
```
**手机端**：浏览器菜单里点「添加到主屏幕」→ 就有一个原生 App 图标。

### 方式 2：本地运行（最简单）

零依赖，双击就跑：

```bash
# 1. clone
git clone https://github.com/你的用户名/nuaa_eating.git
cd nuaa_eating

# 2a. 双击打开（最简单）
# 直接双击 index.html 即可

# 2b. 本地服务器（推荐，Service Worker 完整生效）
python -m http.server 8080
# 然后浏览器访问 http://localhost:8080
```

手机跑本地版：电脑起服务器 → 手机连同一 WiFi → 访问 `http://电脑IP:8080` → 添加到主屏幕。

## 📂 项目结构

```
nuaa_eating/
├── index.html              主页面（抽取 / 管理 / 设置 三个 Tab）
├── manifest.json           PWA 配置
├── sw.js                   Service Worker（离线可用）
├── css/style.css           全部样式（响应式 + 动画 + 深色模式）
├── icons/                  PWA 图标
│   ├── icon-192.png
│   └── icon-512.png
├── js/
│   ├── utils.js            加权随机 + 工具函数
│   ├── data.js             种子数据（38 家南航店铺）
│   ├── storage.js          LocalStorage 封装
│   └── app.js              主逻辑
├── .github/workflows/
│   └── deploy.yml          GitHub Pages 自动部署
├── .gitignore
└── README.md
```

## 🔧 自定义数据（改成你自己学校的）

打开 `js/data.js`，照着模板改就行：

```javascript
{
  id: 'id_xxx',               // 唯一 ID（或用 uid() 自动生成）
  name: "二食堂三楼 黄焖鸡",    // 店铺名
  category: "食堂",            // 食堂 | 夜市 | 外卖 | 自定义
  subCategory: "二食堂",       // 子分类（如具体食堂名）
  tags: ["辣", "下饭"],        // 标签，用于搜索
  weight: 4,                   // 权重 1-5，越高越容易抽到
  disabled: false              // 是否临时禁用
}
```

> 💡 更简单的方式：**直接在应用里改**（📚 店铺 Tab → ✏️ / ➕），然后设置页点 **📤 导出 JSON** 备份，数据自动会保存到你浏览器里。

## 📦 部署到 GitHub Pages

项目已内置 GitHub Actions 自动部署配置：

1. 在 GitHub 创建一个仓库（如 `nuaa_eating`）
2. 本地推送代码：
   ```bash
   git remote add origin https://github.com/你的用户名/nuaa_eating.git
   git branch -M main
   git push -u origin main
   ```
3. 打开仓库 Settings → Pages → Source 选择 **GitHub Actions**
4. 等 1-2 分钟，Actions 跑完后就能在 `https://你的用户名.github.io/nuaa_eating/` 访问了

## 🧩 技术栈

- **原生 HTML + CSS + JavaScript** —— 零构建、零依赖
- **PWA** —— manifest.json + Service Worker
- **LocalStorage** —— 纯前端持久化，无需后端
- **加权随机算法** —— 保证爱吃的店更常被抽到

## 🤝 贡献

欢迎 PR，尤其是：
- 补充更多南航店铺数据
- 适配其他学校的数据（欢迎建分支）
- UI / 动画优化

## 📜 License

MIT —— 随便用，随便改。
