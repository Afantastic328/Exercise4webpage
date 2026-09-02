# DemandList 需求列表 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现校园需求列表页面，包含需求展示（带分类筛选）、发布表单、视觉样式。

**Architecture:** Vue 3 + Vite 项目。父组件 DemandList 管理数据和状态，拆分为 CategoryFilter（筛选）、DemandCard（卡片）、PublishForm（发布表单）三个子组件。模拟 API 提供假数据。左右两栏布局，左侧列表右侧表单。

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), Vite, 纯 CSS

## Global Constraints

- Vue 3 with `<script setup>` 语法
- 代码包含逐行中文注释（学习项目）
- 浅紫色页面背景 `#f3e8ff`，白色卡片，深紫色刘海 `#7c3aed`，紫色按钮 `#8b5cf6`
- 按钮必须有 hover（放大+变色）和 active（缩小+变色）反馈
- 不使用任何第三方 UI 库或路由库

---

### Task 1: Mock API

**Files:**
- Create: `src/api/mock.js`

**Interfaces:**
- Produces: `fetchDemands()` → 返回 Promise，resolve 后返回 8 条需求对象数组

- [ ] **Step 1: 创建 mock.js 文件**

```js
// 模拟需求数据
const mockData = [
  { id: 1, title: '丢失黑色钱包', category: '失物招领', description: '在图书馆三楼遗失，内有校园卡和身份证', time: '周三 14:00', location: '图书馆三楼' },
  { id: 2, title: '捡到蓝色雨伞', category: '失物招领', description: '在食堂门口捡到一把蓝色折叠伞', time: '周二 12:30', location: '第一食堂' },
  { id: 3, title: '出售高数教材', category: '二手交易', description: '高等数学第七版，九成新，附赠笔记', time: '随时', location: '宿舍楼A区' },
  { id: 4, title: '转让自行车', category: '二手交易', description: '捷安特山地车，骑了一年，车况良好', time: '周末', location: '校门口' },
  { id: 5, title: '咖啡店招兼职', category: '兼职招聘', description: '校内咖啡店招周末兼职，15元/小时', time: '周末 9:00-17:00', location: '学生活动中心一楼' },
  { id: 6, title: '招家教', category: '兼职招聘', description: '辅导初二数学，每周两次，待遇优厚', time: '工作日晚', location: '校外（可公交直达）' },
  { id: 7, title: '校园歌手大赛', category: '校园活动', description: '第十届校园歌手大赛报名开始，奖金丰厚', time: '下周五 19:00', location: '大礼堂' },
  { id: 8, title: '编程马拉松', category: '校园活动', description: '48小时编程马拉松，组队参赛，免费餐饮', time: '下周末', location: '计算机学院报告厅' },
]

// 模拟网络请求，800ms 延迟后返回数据
export function fetchDemands() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockData])
    }, 800)
  })
}
```

- [ ] **Step 2: 验证文件无语法错误**

Run: `node -e "import('./src/api/mock.js').then(m => m.fetchDemands()).then(d => console.log(d.length))"`
Expected: `8`

---

### Task 2: DemandCard 组件

**Files:**
- Create: `src/components/DemandCard.vue`

**Interfaces:**
- Consumes: demand 对象 `{ id, title, category, description, time, location }`
- Produces: emits `view-detail` 事件，payload 为 demand.id

- [ ] **Step 1: 创建 DemandCard.vue**

```vue
<!-- DemandCard.vue：展示单条需求信息的卡片组件 -->
<script setup>
// 定义这个组件接收的 props（从父组件传来的数据）
defineProps({
  // demand 是一个对象，包含 id、title、category、description、time、location
  demand: {
    type: Object,
    required: true  // 必须传入，不能为空
  }
})

// 定义这个组件能向父组件发出的事件
const emit = defineEmits(['view-detail'])
</script>

<template>
  <!-- 卡片整体容器 -->
  <div class="demand-card">
    <!-- 深紫色刘海区域：显示标题 -->
    <div class="card-header">
      <!-- 白色加粗标题，用双花括号显示 demand 对象里的 title 字段 -->
      <h3>{{ demand.title }}</h3>
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-body">
      <!-- 分类标签 -->
      <span class="category-tag">{{ demand.category }}</span>
      <!-- 描述文字 -->
      <p class="description">{{ demand.description }}</p>
      <!-- 时间信息 -->
      <div class="meta-info">
        <span>🕐 {{ demand.time }}</span>
        <!-- 地点信息 -->
        <span>📍 {{ demand.location }}</span>
      </div>
      <!-- 接单按钮：点击时触发 view-detail 事件，把 demand.id 传给父组件 -->
      <button class="action-btn" @click="emit('view-detail', demand.id)">
        我要接单
      </button>
    </div>
  </div>
</template>

<style scoped>
/* .demand-card：白色圆角卡片，带阴影 */
.demand-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
}

/* .card-header：深紫色刘海，高度 60px */
.card-header {
  background: #7c3aed;
  padding: 16px 20px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 刘海里的标题：白色、加粗 */
.card-header h3 {
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  font-size: 18px;
}

/* .card-body：卡片内容区域 */
.card-body {
  padding: 16px 20px;
}

/* 分类标签：紫色小标签 */
.category-tag {
  display: inline-block;
  background: #f3e8ff;
  color: #7c3aed;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 12px;
  margin-bottom: 8px;
}

/* 描述文字 */
.description {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  margin: 8px 0 12px;
}

/* 时间和地点信息行 */
.meta-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

/* .action-btn：紫色圆角按钮 */
.action-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

/* 鼠标悬停时：颜色变深 + 微微放大 */
.action-btn:hover {
  background: #7c3aed;
  transform: scale(1.05);
}

/* 鼠标按下时：颜色更深 + 缩小（"按下去"的感觉） */
.action-btn:active {
  background: #6d28d9;
  transform: scale(0.95);
}
</style>
```

---

### Task 3: CategoryFilter 组件

**Files:**
- Create: `src/components/CategoryFilter.vue`

**Interfaces:**
- Consumes: `modelValue` (String, 当前选中分类), `categories` (Array, 可选分类列表)
- Produces: emits `update:modelValue` 事件（支持 v-model）

- [ ] **Step 1: 创建 CategoryFilter.vue**

```vue
<!-- CategoryFilter.vue：分类筛选下拉框组件 -->
<script setup>
// 定义 props：modelValue 是当前选中的值（配合 v-model 使用），categories 是选项列表
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  categories: {
    type: Array,
    required: true
  }
})

// 定义 emits：update:modelValue 是 v-model 要求的标准事件名
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <!-- 筛选栏容器 -->
  <div class="filter-bar">
    <label class="filter-label">分类筛选：</label>
    <!--
      select 是 HTML 原生的下拉框元素
      @change 监听选择变化事件
      $event.target.value 获取用户选择的值
      emit 把这个值发给父组件，完成 v-model 的双向绑定
    -->
    <select
      class="filter-select"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <!-- v-for 遍历 categories 数组，为每个分类生成一个 option -->
      <option v-for="cat in categories" :key="cat" :value="cat">
        {{ cat }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.filter-label {
  font-size: 14px;
  color: #4b5563;
  font-weight: 500;
}

/* 下拉框样式 */
.filter-select {
  padding: 8px 12px;
  border: 2px solid #e9d5ff;
  border-radius: 8px;
  font-size: 14px;
  color: #4b5563;
  background: #ffffff;
  outline: none;
  cursor: pointer;
}

/* 下拉框聚焦时边框变深紫 */
.filter-select:focus {
  border-color: #7c3aed;
}
</style>
```

---

### Task 4: PublishForm 组件

**Files:**
- Create: `src/components/PublishForm.vue`

**Interfaces:**
- Produces: emits `publish` 事件，payload 为 `{ title, category, description, time, location }`

- [ ] **Step 1: 创建 PublishForm.vue**

```vue
<!-- PublishForm.vue：发布新需求的表单组件 -->
<script setup>
// 从 vue 导入 ref，用来创建响应式数据（数据变化时页面自动更新）
import { ref } from 'vue'

// 定义 emit：这个组件能发出 'publish' 事件
const emit = defineEmits(['publish'])

// 用 ref 创建表单的响应式数据，每个字段初始值为空字符串
const newTitle = ref('')
const newDescription = ref('')
const newCategory = ref('失物招领')
const newTime = ref('')
const newLocation = ref('')

// 分类选项列表
const categoryOptions = ['失物招领', '二手交易', '兼职招聘', '校园活动']

// 提交表单的函数
function handleSubmit() {
  // 简单验证：标题不能为空
  if (!newTitle.value.trim()) return

  // 把表单数据打包成一个对象，通过 publish 事件发给父组件
  emit('publish', {
    title: newTitle.value,
    category: newCategory.value,
    description: newDescription.value,
    time: newTime.value,
    location: newLocation.value
  })

  // 提交后清空表单，方便下次填写
  newTitle.value = ''
  newDescription.value = ''
  newCategory.value = '失物招领'
  newTime.value = ''
  newLocation.value = ''
}
</script>

<template>
  <!-- 表单卡片，和左边的需求卡片风格统一 -->
  <div class="publish-card">
    <!-- 深紫色刘海 -->
    <div class="card-header">
      <h3>发布需求</h3>
    </div>

    <!-- 表单内容区域 -->
    <div class="card-body">
      <!-- @submit.prevent 阻止表单默认提交行为，改为调用 handleSubmit -->
      <form @submit.prevent="handleSubmit">
        <!-- 标题输入 -->
        <div class="form-group">
          <label>标题</label>
          <input v-model="newTitle" class="form-input" placeholder="输入需求标题" />
        </div>

        <!-- 分类选择 -->
        <div class="form-group">
          <label>分类</label>
          <select v-model="newCategory" class="form-input">
            <option v-for="cat in categoryOptions" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <!-- 描述输入 -->
        <div class="form-group">
          <label>描述</label>
          <textarea v-model="newDescription" class="form-input" placeholder="输入需求描述" rows="3"></textarea>
        </div>

        <!-- 时间输入 -->
        <div class="form-group">
          <label>时间</label>
          <input v-model="newTime" class="form-input" placeholder="例如：周三 14:00" />
        </div>

        <!-- 地点输入 -->
        <div class="form-group">
          <label>地点</label>
          <input v-model="newLocation" class="form-input" placeholder="例如：图书馆三楼" />
        </div>

        <!-- 发布按钮 -->
        <button type="submit" class="action-btn">发布需求</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* 发布卡片：白色圆角，带阴影 */
.publish-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 深紫色刘海 */
.card-header {
  background: #7c3aed;
  padding: 16px 20px;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h3 {
  color: #ffffff;
  font-weight: 700;
  margin: 0;
  font-size: 18px;
}

.card-body {
  padding: 20px;
}

/* 每个表单字段的容器 */
.form-group {
  margin-bottom: 14px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
}

/* 输入框统一样式：浅紫色边框 */
.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 2px solid #e9d5ff;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
}

/* 输入框聚焦时边框变深紫 */
.form-input:focus {
  border-color: #7c3aed;
}

/* 发布按钮：和"我要接单"按钮风格一致 */
.action-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 4px;
}

.action-btn:hover {
  background: #7c3aed;
  transform: scale(1.05);
}

.action-btn:active {
  background: #6d28d9;
  transform: scale(0.95);
}
</style>
```

---

### Task 5: DemandList 父组件 + App.vue 集成

**Files:**
- Create: `src/components/DemandList.vue`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `fetchDemands()` from `src/api/mock.js`
- Uses: `DemandCard`, `CategoryFilter`, `PublishForm` 子组件

- [ ] **Step 1: 创建 DemandList.vue**

```vue
<!-- DemandList.vue：需求列表父组件，负责数据加载、状态管理、页面布局 -->
<script setup>
// ref：创建响应式数据，数据变化时页面自动更新
// computed：计算属性，依赖其他响应式数据，自动重新计算
// onMounted：组件挂载到页面后自动执行的函数
import { ref, computed, onMounted } from 'vue'

// 导入模拟 API 函数
import { fetchDemands } from '../api/mock.js'

// 导入子组件
import CategoryFilter from './CategoryFilter.vue'
import DemandCard from './DemandCard.vue'
import PublishForm from './PublishForm.vue'

// ===== 响应式状态 =====
// demands：存储从 API 获取的需求数据数组
const demands = ref([])
// selectedCategory：当前选中的分类，默认是"全部"
const selectedCategory = ref('全部')
// loading：是否正在加载数据
const loading = ref(true)
// error：错误信息，null 表示没有错误
const error = ref(null)

// 分类选项列表（"全部" + 四个具体分类）
const categories = ['全部', '失物招领', '二手交易', '兼职招聘', '校园活动']

// ===== 计算属性 =====
// filteredDemands：根据 selectedCategory 过滤后的需求数组
// 当选"全部"时返回所有数据，否则只返回匹配分类的数据
const filteredDemands = computed(() => {
  if (selectedCategory.value === '全部') {
    return demands.value
  }
  return demands.value.filter(d => d.category === selectedCategory.value)
})

// ===== 函数 =====
// 加载数据的函数（组件挂载时调用，重试按钮也调用）
async function loadData() {
  loading.value = true   // 开始加载，设为 true
  error.value = null     // 清除之前的错误
  try {
    // await 等待异步操作完成（模拟 800ms 网络延迟）
    demands.value = await fetchDemands()
  } catch (e) {
    error.value = '加载失败，请重试'  // 出错时记录错误信息
  } finally {
    loading.value = false  // 无论成功还是失败，都结束加载状态
  }
}

// 处理"我要接单"按钮点击事件
function handleViewDetail(id) {
  console.log('查看需求详情，ID:', id)
}

// 处理发布新需求事件
function handlePublish(newDemand) {
  // 生成新 ID（取当前最大 ID + 1）
  const maxId = demands.value.length > 0 ? Math.max(...demands.value.map(d => d.id)) : 0
  // 把新需求添加到数组最前面（unshift 添加到开头）
  demands.value.unshift({ id: maxId + 1, ...newDemand })
}

// ===== 生命周期 =====
// 组件挂载到页面后，自动加载数据
onMounted(() => {
  loadData()
})
</script>

<template>
  <!-- 页面整体容器：浅紫色背景 -->
  <div class="page-container">
    <!-- 页面标题 -->
    <h1 class="page-title">校园需求墙</h1>

    <!-- 左右两栏布局容器 -->
    <div class="layout">
      <!-- 左侧：需求列表区域 -->
      <div class="left-panel">
        <!-- v-if/v-else-if/v-else：根据状态显示不同内容 -->

        <!-- 状态1：正在加载中 -->
        <div v-if="loading" class="status-box">
          <p>加载中...</p>
        </div>

        <!-- 状态2：加载出错 -->
        <div v-else-if="error" class="status-box error-box">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="loadData">重试</button>
        </div>

        <!-- 状态3：加载成功 -->
        <div v-else>
          <!-- 分类筛选下拉框，v-model 双向绑定 selectedCategory -->
          <CategoryFilter v-model="selectedCategory" :categories="categories" />

          <!-- 状态4：筛选后没有数据 -->
          <div v-if="filteredDemands.length === 0" class="status-box">
            <p>暂无相关需求</p>
          </div>

          <!-- 状态5：有数据，用 v-for 遍历渲染每张卡片 -->
          <div v-else>
            <!--
              v-for 循环遍历 filteredDemands 数组
              :key 是 Vue 用来识别每个元素的唯一标识（必须唯一）
              :demand 把当前这条数据传给 DemandCard 组件
              @view-detail 监听子组件发出的事件
            -->
            <DemandCard
              v-for="demand in filteredDemands"
              :key="demand.id"
              :demand="demand"
              @view-detail="handleViewDetail"
            />
          </div>
        </div>
      </div>

      <!-- 右侧：发布需求表单 -->
      <div class="right-panel">
        <PublishForm @publish="handlePublish" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器：浅紫色背景，最小高度撑满屏幕 */
.page-container {
  min-height: 100vh;
  background: #f3e8ff;
  padding: 32px 24px;
}

/* 页面标题 */
.page-title {
  text-align: center;
  color: #7c3aed;
  font-size: 28px;
  margin-bottom: 24px;
}

/* 左右两栏布局：flex 容器 */
.layout {
  display: flex;
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

/* 左侧面板：占 65% 宽度 */
.left-panel {
  flex: 0 0 65%;
}

/* 右侧面板：占剩余空间 */
.right-panel {
  flex: 1;
}

/* 状态提示框（加载中、错误、空列表） */
.status-box {
  text-align: center;
  padding: 48px 0;
  color: #6b7280;
  font-size: 16px;
}

/* 错误状态的样式 */
.error-box p {
  color: #ef4444;
  margin-bottom: 12px;
}

/* 重试按钮 */
.retry-btn {
  background: #8b5cf6;
  color: #ffffff;
  border: none;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #7c3aed;
  transform: scale(1.05);
}

.retry-btn:active {
  background: #6d28d9;
  transform: scale(0.95);
}

/* 响应式：小屏幕时改为上下布局 */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
  .left-panel {
    flex: 1;
  }
}
</style>
```

- [ ] **Step 2: 修改 App.vue，替换 HelloWorld 为 DemandList**

将 `src/App.vue` 内容替换为：

```vue
<!-- App.vue：根组件，显示 DemandList -->
<script setup>
import DemandList from './components/DemandList.vue'
</script>

<template>
  <DemandList />
</template>
```

- [ ] **Step 3: 启动开发服务器验证**

Run: `npm run dev`
Expected: 页面显示浅紫色背景，左侧显示加载状态后出现需求卡片列表，右侧显示发布表单

---

### Task 6: 最终验证

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev`

- [ ] **Step 2: 检查以下功能**

1. 页面加载时显示"加载中..."，800ms 后出现 8 张需求卡片
2. 下拉筛选切换分类，卡片正确过滤
3. 选择某个分类后若无匹配数据，显示"暂无相关需求"
4. 每张卡片：深紫色刘海 + 白色标题 + 分类标签 + 描述 + 时间地点 + "我要接单"按钮
5. "我要接单"按钮悬停变色放大、点击缩小
6. 右侧发布表单可填写并提交，新卡片出现在列表顶部
7. 页面背景为浅紫色，卡片为白色
