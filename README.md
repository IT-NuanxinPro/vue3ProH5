# Vue3ProH5 - 移动端地图应用

<p align="center">
  <img src="https://img.shields.io/badge/vue-v3.x-green.svg" alt="vue3" />
  <img src="https://img.shields.io/badge/vite-v4.x-purple.svg" alt="vite" />
  <img src="https://img.shields.io/badge/vant-v4.x-blue.svg" alt="vant" />
  <img src="https://img.shields.io/badge/element--plus-latest-blue.svg" alt="element-plus" />
  <img src="https://img.shields.io/badge/高德地图-v2.0-red.svg" alt="amap" />
</p>

## 项目介绍

Vue3ProH5 是一个基于 Vue 3 + Vite 构建的移动端地图应用项目。项目集成了高德地图、百度地图和腾讯地图的导航功能，以及天津地图的数据可视化展示。主要使用了 Vue 3 的 Composition API，结合 Vant UI 和 Element Plus 组件库，打造了一个现代化的移动端 H5 应用。

## 主要特性

- 🌍 多地图源支持
  - 高德地图导航
  - 百度地图导航
  - 腾讯地图导航
  - 天津地图数据可视化

- 🚀 核心功能
  - 地址搜索与自动补全
  - 2D/3D 视图切换
  - 实时天气信息显示
  - 多种出行方式规划（驾车、步行、骑行）
  - 路线距离和时间计算
  - 地图数据可视化展示

- 💡 技术亮点
  - Vue 3 Composition API
  - Vite 构建工具
  - Vant 移动端组件库
  - Element Plus 组件库
  - Pinia 状态管理
  - SCSS 样式处理
  - 响应式设计

## 环境要求

- Node.js >= 14.x
- npm >= 6.x

## 快速开始

1. 克隆项目
```bash
git clone https://github.com/IT-NuanxinPro/vue3ProH5.git
cd vue3ProH5
```

2. 安装依赖
```bash
npm install
# 或者使用 yarn
yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或者使用 yarn
yarn dev
```

4. 构建生产版本
```bash
npm run build
# 或者使用 yarn
yarn build
```

## 项目结构

```
vue3ProH5
├── src
│   ├── assets        # 静态资源
│   ├── components    # 公共组件
│   ├── hooks         # 组合式函数
│   ├── router        # 路由配置
│   ├── stores        # Pinia 状态管理
│   ├── views         # 页面视图
│   └── App.vue       # 根组件
├── vite              # Vite 配置
├── public            # 公共资源
└── index.html        # HTML 模板
```

## 主要依赖

- Vue 3
- Vite
- Vant
- Element Plus
- Pinia
- Vue Router
- SCSS
- ECharts (地图可视化)
- 高德地图 JS API

## 功能预览

### 地图功能
- 📍 位置搜索与导航
- 🌤 实时天气显示
- 🚗 多种出行方式
- 🔄 2D/3D 视图切换
- 📏 距离和时间计算
- 🗺 数据可视化展示

## 开发团队

- IT-NuanxinPro

## License

[MIT License](LICENSE)

## 联系我们

如果你在使用过程中遇到问题，或有好的建议，欢迎提出 Issue 或 Pull Request。