# DemandList 需求列表组件设计文档

## 概述

为 campus-hub 项目实现一个需求列表页面，展示校园内的各类需求信息，支持分类筛选、状态管理和事件交互。这是一个 Vue 3 学习项目，代码将包含详细注释以帮助理解。

## 文件结构

```
src/
├── api/
│   └── mock.js              # 模拟 API 数据和请求函数
├── components/
│   ├── DemandList.vue       # 父组件：数据加载 + 状态管理 + 左右布局
│   ├── CategoryFilter.vue   # 子组件：分类下拉筛选
│   ├── DemandCard.vue       # 子组件：单条需求卡片
│   └── PublishForm.vue      # 子组件：发布需求表单
```

## 数据模型

每条需求包含以下字段：

| 字段        | 类型   | 说明           |
|-------------|--------|----------------|
| id          | Number | 唯一标识       |
| title       | String | 需求标题       |
| category    | String | 所属分类       |
| description | String | 需求描述       |
| time        | String | 时间（如"周三 14:00"） |
| location    | String | 地点（如"图书馆三楼"） |

### 分类列表

- 全部
- 失物招领
- 二手交易
- 兼职招聘
- 校园活动

## Mock API 设计

文件：`src/api/mock.js`

导出一个 `fetchDemands()` 函数，返回 Promise：
- 模拟 800ms 网络延迟
- 返回包含 8 条模拟数据的数组（每个分类 2 条）
- 覆盖所有四个分类

## 组件设计

### DemandList.vue（父组件）

**职责：** 加载数据、管理加载状态、筛选逻辑、左右布局、组装子组件

**响应式状态：**
- `demands`：从 API 获取的原始数据数组
- `selectedCategory`：当前选中的分类（默认"全部"）
- `loading`：是否正在加载（布尔值）
- `error`：错误信息（null 或字符串）

**计算属性：**
- `filteredDemands`：根据 selectedCategory 过滤后的数组。当 selectedCategory 为"全部"时返回所有数据，否则按 category 字段过滤

**生命周期：**
- `onMounted` 时调用 `fetchDemands()`，管理 loading → success/error 状态转换

**模板结构（左右布局）：**
- 外层是一个 flex 容器，左侧放需求列表，右侧放发布表单
- 左侧（约 65% 宽度）：
  1. loading 为 true → 显示"加载中..."
  2. error 不为 null → 显示错误信息 + 重试按钮（点击后重新调用 fetchDemands）
  3. 否则 → 显示 CategoryFilter + 需求列表
  4. filteredDemands 为空 → 显示"暂无相关需求"
  5. filteredDemands 不为空 → v-for 渲染 DemandCard
- 右侧（约 35% 宽度）：
  - 显示 PublishForm 组件

**事件处理：**
- 监听 DemandCard 的 `view-detail` 事件，打印到控制台
- 监听 PublishForm 的 `publish` 事件，将新需求添加到 demands 数组头部

### CategoryFilter.vue（子组件）

**职责：** 展示分类下拉菜单

**Props：**
- `modelValue`：当前选中的分类（String）
- `categories`：可选分类列表（Array）

**Emits：**
- `update:modelValue`：选择变化时触发（支持 v-model）

**模板：**
- 一个 `<select>` 下拉框，使用 v-model 双向绑定

### DemandCard.vue（子组件）

**职责：** 展示单条需求信息

**Props：**
- `demand`：需求对象（包含 id、title、category、description、time、location）

**Emits：**
- `view-detail`：点击"我要接单"按钮时触发，传递 demand.id

**模板：**
- 顶部深紫色刘海区域：白色加粗 title
- 中间内容区域：category 标签、description、time 和 location 信息
- 底部"我要接单"按钮

### PublishForm.vue（子组件）

**职责：** 发布新需求的表单

**响应式状态（组件内部管理）：**
- `newTitle`：标题输入（String，默认空）
- `newDescription`：描述输入（String，默认空）
- `newCategory`：分类选择（String，默认"失物招领"）
- `newTime`：时间输入（String，默认空）
- `newLocation`：地点输入（String，默认空）

**Emits：**
- `publish`：点击"发布需求"按钮时触发，传递包含以上字段的新需求对象（id 由父组件生成）

**模板：**
- 表单容器，包含：标题输入框、分类下拉选择、描述文本框、时间输入框、地点输入框
- 底部"发布需求"按钮（紫色，样式与"我要接单"一致）
- 提交后清空表单

## 状态流转图

```
组件挂载
   ↓
loading = true → 显示"加载中"
   ↓
调用 fetchDemands()
   ↓
  ┌─ 成功 → loading = false, demands = 数据 → 显示列表
  └─ 失败 → loading = false, error = 错误信息 → 显示错误
```

## 视觉设计

### 色彩方案

| 用途       | 颜色                          |
|------------|-------------------------------|
| 页面背景   | 浅紫色（`#f3e8ff`）           |
| 卡片背景   | 白色（`#ffffff`）             |
| 卡片刘海   | 深紫色（`#7c3aed`）           |
| 刘海标题   | 白色加粗                      |
| 按钮背景   | 紫色（`#8b5cf6`）             |
| 按钮悬停   | 深紫（`#7c3aed`），微微放大   |
| 按钮点击   | 更深紫（`#6d28d9`），缩小反馈 |

### 页面整体

- 浅紫色背景铺满
- 左右两栏布局（flex）：左侧 65% 放需求列表，右侧 35% 放发布表单
- 两栏之间有间距

### 卡片样式

- 白色圆角卡片，带轻微阴影
- 顶部有深紫色"刘海"（高度约 60px 的色块），上面居中显示白色加粗的 title
- 刘海下方显示：category 标签、description、time（时间图标+文字）、location（地点图标+文字）
- 底部有"我要接单"按钮

### "我要接单"按钮

- 紫色圆角按钮
- 悬停（hover）：颜色变深 + 微微放大（`transform: scale(1.05)`）
- 点击（active）：颜色更深 + 缩小（`transform: scale(0.95)`），给用户"按下去"的感觉

### PublishForm 样式

- 白色圆角卡片，带轻微阴影，与左侧卡片风格统一
- 顶部深紫色刘海，白色加粗显示"发布需求"
- 表单输入框使用浅紫色边框，聚焦时边框变深紫
- "发布需求"按钮样式与"我要接单"一致

### DemandCard 事件

- `view-detail` 事件由"我要接单"按钮触发，而非整张卡片点击

## App.vue 集成

将 App.vue 中的 HelloWorld 替换为 DemandList 组件。
