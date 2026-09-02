<!-- DemandCard.vue：展示单条需求信息的卡片组件 -->
<script setup>
// 定义这个组件接收的 props（从父组件传来的数据）
const props = defineProps({
  // demand 是一个对象，包含 id、title、category、description、time、location
  demand: {
    type: Object,
    required: true  // 必须传入，不能为空
  },
  // accepted：这条需求是否已被接单（布尔值，默认 false）
  accepted: {
    type: Boolean,
    default: false
  },
  // disabled：其他需求已接单时，这条不能再接（布尔值，默认 false）
  disabled: {
    type: Boolean,
    default: false
  }
})

// 定义这个组件能向父组件发出的事件
const emit = defineEmits(['view-detail'])

// 接单按钮点击：只有未接单且未禁用时才能点击
function handleClick() {
  if (!props.accepted && !props.disabled) {
    emit('view-detail', props.demand.id)
  }
}
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
      <!-- 发布者信息 -->
      <div class="publisher-info">
        👤 发布者：{{ demand.publisher }}
      </div>
      <!--
        接单按钮的三种状态：
        1. 正常状态：紫色，显示"我要接单"，可以点击
        2. 悬停状态（hover）：颜色变深 + 放大（CSS 控制）
        3. 已接单状态：绿色，显示"接单成功"，不可再点击
        4. 禁用状态：灰色，显示"我要接单"，不可点击（其他需求已接单时）
      -->
      <button
        class="action-btn"
        :class="{ accepted: accepted, 'btn-disabled': disabled }"
        :disabled="accepted || disabled"
        @click="handleClick"
      >
        {{ accepted ? '接单成功' : '我要接单' }}
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
  margin-bottom: 8px;
}

/* 发布者信息 */
.publisher-info {
  font-size: 13px;
  color: #9ca3af;
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

/* 已接单状态：绿色背景，不能点击，显示"接单成功" */
.action-btn.accepted {
  background: #22c55e;
  cursor: not-allowed;
  transform: none;
}

/* 已接单时悬停不做任何变化（覆盖 hover） */
.action-btn.accepted:hover {
  background: #22c55e;
  transform: none;
}

/* 禁用状态：灰色背景，不能点击，鼠标变成禁止图标 */
.action-btn.btn-disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* 禁用时悬停不做任何变化 */
.action-btn.btn-disabled:hover {
  background: #d1d5db;
  transform: none;
}
</style>
