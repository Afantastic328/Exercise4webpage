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
// acceptedIds：记录已被接单的需求 ID（用数组，Vue 对数组响应更可靠）
const acceptedIds = ref([])

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
  // 如果已经有需求被接单了，不能再接新单
  if (acceptedIds.value.length > 0) return
  // 如果这条已经被接单了（防御性检查），也不处理
  if (acceptedIds.value.includes(id)) return

  // 标记为已接单
  acceptedIds.value = [...acceptedIds.value, id]
  console.log('接单成功，ID:', id)

  // 1 分钟后（60000 毫秒）自动从列表删除，同时解除接单限制
  setTimeout(() => {
    demands.value = demands.value.filter(d => d.id !== id)
    acceptedIds.value = acceptedIds.value.filter(i => i !== id)
  }, 60000)
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
              :accepted="acceptedIds.includes(demand.id)"
              :disabled="acceptedIds.length > 0 && !acceptedIds.includes(demand.id)"
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
  flex: 0 0 45%;
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
