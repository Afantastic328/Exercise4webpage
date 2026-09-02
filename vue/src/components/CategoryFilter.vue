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
