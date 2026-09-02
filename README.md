# 校园需求墙 (Campus Hub)

校园需求发布与接单平台，包含两个版本的实现。

## 项目结构

```
Exercise4webpage/
├── vanilla/    ← 原生 HTML/CSS/JS 版本（无需构建工具）
├── vue/        ← Vue 3 + Vite 版本（组件化架构）
└── AI4SE-反思.md  ← AI 辅助开发实践反思
```

## 两个版本对比

| | vanilla 版本 | Vue 版本 |
|---|---|---|
| 技术栈 | HTML + CSS + 原生 JS | Vue 3 + Vite |
| 文件结构 | 3 个文件 | 组件化（5 个组件 + 模拟 API） |
| 运行方式 | 直接打开 index.html | `npm install` → `npm run dev` |
| 数据管理 | 全局变量 | Vue 响应式（ref + computed） |
| 组件通信 | 无 | Props + Emits |
| 适合场景 | 快速原型 | 可维护的中大型项目 |

## 功能

- 需求列表展示（卡片布局 + 分类筛选）
- 发布新需求（表单验证）
- 接单功能（同一时间只能接一单）
- 已接单需求 1 分钟后自动消失

## 快速开始

### Vanilla 版本
直接用浏览器打开 `vanilla/index.html`

### Vue 版本
```bash
cd vue
npm install
npm run dev
```
访问 http://localhost:5173
