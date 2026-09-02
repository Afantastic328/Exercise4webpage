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
const newName = ref('')
const newStudentId = ref('')

// 分类选项列表
const categoryOptions = ['失物招领', '二手交易', '兼职招聘', '校园活动']

// 从 vue 导入 computed，用来创建计算属性
import { computed } from 'vue'

// 计算属性：所有字段都填了才算有效（trim 去掉前后空格）
const isFormValid = computed(() => {
  return (
    newTitle.value.trim() !== '' &&
    newDescription.value.trim() !== '' &&
    newTime.value.trim() !== '' &&
    newLocation.value.trim() !== '' &&
    newName.value.trim() !== '' &&
    newStudentId.value.trim() !== ''
  )
})

// 提交表单的函数
function handleSubmit() {
  // 所有字段必填，没填完就不提交
  if (!isFormValid.value) return

  // 把表单数据打包成一个对象，通过 publish 事件发给父组件
  emit('publish', {
    title: newTitle.value,
    category: newCategory.value,
    description: newDescription.value,
    time: newTime.value,
    location: newLocation.value,
    publisher: newName.value + ' ' + newStudentId.value
  })

  // 提交后清空表单，方便下次填写
  newTitle.value = ''
  newDescription.value = ''
  newCategory.value = '失物招领'
  newTime.value = ''
  newLocation.value = ''
  newName.value = ''
  newStudentId.value = ''
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

        <!-- 发布者姓名 -->
        <div class="form-group">
          <label>姓名</label>
          <input v-model="newName" class="form-input" placeholder="输入你的姓名" />
        </div>

        <!-- 发布者学号 -->
        <div class="form-group">
          <label>学号</label>
          <input v-model="newStudentId" class="form-input" placeholder="输入你的学号" />
        </div>

        <!-- 发布按钮：所有字段填完才能点，文案根据状态切换 -->
        <button type="submit" class="action-btn" :disabled="!isFormValid">
          {{ isFormValid ? '发布需求卡' : '填写完信息后才可发布' }}
        </button>
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
  color: #ffffff;
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

/* 按钮禁用时：灰色背景，鼠标变成禁止图标，不能点击 */
.action-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}
</style>
