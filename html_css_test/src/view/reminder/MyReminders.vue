<template>
  <div class="reminder-page">
    <!-- 搜索筛选栏 -->
    <div class="filter-bar">
      <el-select
        v-model="searchStatus"
        placeholder="状态"
        clearable
        style="width:140px"
      >
        <el-option label="待触发" value="pending" />
        <el-option label="已触发" value="triggered" />
        <el-option label="已取消" value="cancelled" />
      </el-select>
      <el-select
        v-model="searchTargetType"
        placeholder="类型"
        clearable
        style="width:120px"
      >
        <el-option label="动画" value="animation" />
        <el-option label="漫画" value="comic" />
        <el-option label="小说" value="novel" />
        <el-option label="游戏" value="game" />
      </el-select>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索名称或消息"
        clearable
        @keyup.enter="applyFilter"
        style="flex:1"
      />
      <el-button type="primary" :icon="Search" @click="applyFilter">查询</el-button>
      <el-button :icon="Refresh" @click="resetFilter">重置</el-button>
      <el-tag v-if="pendingCount > 0" type="warning" effect="light" round>
        {{ pendingCount }} 条待触发
      </el-tag>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrapper" v-if="loading">
      <el-icon :size="40" class="loading-icon"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div class="empty-wrapper" v-else-if="list.length === 0">
      <el-icon :size="60" class="empty-icon"><Bell /></el-icon>
      <p>暂无提醒，快去收藏页面设置提醒吧</p>
    </div>

    <!-- 列表内容 -->
    <div class="list-content" v-else>
      <div class="reminder-list">
        <div
          v-for="item in list"
          :key="item.id"
          class="reminder-item"
          :class="'status-' + item.status"
        >
          <div class="reminder-left">
            <div class="type-icon" :class="'type-' + item.targetType">
              <el-icon :size="20">
                <component :is="getTypeIcon(item.targetType)" />
              </el-icon>
            </div>
          </div>
          <div class="reminder-center">
            <div class="reminder-title">
              <span class="target-name">{{ item.targetName }}</span>
              <el-tag
                :type="getStatusTagType(item.status)"
                effect="light"
                size="small"
              >
                {{ getStatusLabel(item.status) }}
              </el-tag>
              <el-tag
                :type="getTypeTagType(item.targetType)"
                effect="dark"
                size="small"
                class="type-tag"
              >
                {{ getTypeLabel(item.targetType) }}
              </el-tag>
            </div>
            <div class="reminder-info">
              <div class="info-row">
                <el-icon :size="14"><Clock /></el-icon>
                <span>提醒时间：{{ formatTime(item.remindTime) }}</span>
              </div>
              <div class="info-row" v-if="item.remindMsg">
                <el-icon :size="14"><ChatDotRound /></el-icon>
                <span class="msg-content">{{ item.remindMsg }}</span>
              </div>
              <div class="info-row" v-if="item.triggerTime">
                <el-icon :size="14"><CircleCheck /></el-icon>
                <span>触发时间：{{ formatTime(item.triggerTime) }}</span>
              </div>
            </div>
          </div>
          <div class="reminder-right">
            <el-button
              v-if="item.status === 'pending'"
              type="primary"
              size="small"
              @click="handleCancel(item)"
            >取消</el-button>
            <el-button
              v-if="item.status === 'pending'"
              size="small"
              @click="handleDelete(item)"
            >删除</el-button>
            <el-button
              v-else
              type="danger"
              size="small"
              plain
              @click="handleDelete(item)"
            >删除</el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          background
          @size-change="loadList"
          @current-change="loadList"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import reminderApi from '@/api/reminder'

import {
  Bell, Loading, Search, Refresh, Clock, ChatDotRound,
  CircleCheck, VideoCamera, Reading, Notebook, Goods
} from '@element-plus/icons-vue'

const props = defineProps({
  userId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:count'])

const router = useRouter()

const list = ref([])
const loading = ref(false)
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const searchStatus = ref('')
const searchTargetType = ref('')
const searchKeyword = ref('')

const appliedFilters = ref({ status: '', targetType: '', keyword: '' })

const pendingCount = computed(() => {
  return list.value.filter(item => item.status === 'pending').length
})

const getTypeIcon = (type) => {
  const icons = {
    animation: VideoCamera,
    comic: Reading,
    novel: Notebook,
    game: Goods
  }
  return markRaw(icons[type] || Bell)
}

const getTypeLabel = (type) => {
  const labels = { animation: '动画', comic: '漫画', novel: '小说', game: '游戏' }
  return labels[type] || type
}

const getTypeTagType = (type) => {
  const types = { animation: 'danger', comic: 'primary', novel: 'success', game: 'warning' }
  return types[type] || 'info'
}

const getStatusLabel = (status) => {
  const labels = { pending: '待触发', triggered: '已触发', cancelled: '已取消' }
  return labels[status] || status
}

const getStatusTagType = (status) => {
  const types = { pending: 'warning', triggered: 'success', cancelled: 'info' }
  return types[status] || 'info'
}

const formatTime = (time) => {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 19)
}

const applyFilter = () => {
  appliedFilters.value = {
    status: searchStatus.value,
    targetType: searchTargetType.value,
    keyword: searchKeyword.value
  }
  currentPage.value = 1
  loadList()
}

const resetFilter = () => {
  searchStatus.value = ''
  searchTargetType.value = ''
  searchKeyword.value = ''
  appliedFilters.value = { status: '', targetType: '', keyword: '' }
  currentPage.value = 1
  loadList()
}

const loadList = async () => {
  const userId = props.userId || localStorage.getItem('userId')
  if (!userId) {
    ElMessage.warning('请先登录')
    return
  }

  loading.value = true
  try {
    const params = {
      userId,
      page: currentPage.value,
      size: pageSize.value,
      ...appliedFilters.value
    }
    const res = await reminderApi.getMyReminders(params)
    if (res.successful && res.resultValue) {
      list.value = res.resultValue.list || []
      total.value = res.resultValue.total || 0
    } else {
      list.value = []
      total.value = 0
    }
    // 通知父组件更新待触发数量
    const pendingNum = list.value.filter(item => item.status === 'pending').length
    emit('update:count', pendingNum)
  } catch (error) {
    ElMessage.error('加载提醒列表失败')
    list.value = []
  } finally {
    loading.value = false
  }
}

const handleCancel = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要取消提醒「${item.targetName}」吗？`,
      '取消提醒',
      { confirmButtonText: '确定取消', cancelButtonText: '返回', type: 'warning' }
    )
    await reminderApi.cancelReminder(item.id)
    ElMessage.success('提醒已取消')
    loadList()
  } catch (e) {
    // 用户取消操作
  }
}

const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除提醒「${item.targetName}」吗？删除后无法恢复。`,
      '删除提醒',
      { confirmButtonText: '确定删除', cancelButtonText: '返回', type: 'warning' }
    )
    await reminderApi.deleteReminder(item.id)
    ElMessage.success('提醒已删除')
    loadList()
  } catch (e) {
    // 用户取消操作
  }
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.reminder-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
  gap: 12px;
  overflow: hidden;
}

/* ========== 搜索筛选栏 ========== */
.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  flex-shrink: 0;
}

/* ========== 加载/空状态 ========== */
.loading-wrapper,
.empty-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--theme-text-placeholder);
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: var(--theme-primary);
}

.empty-icon {
  color: var(--theme-border);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== 列表内容 ========== */
.list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
}

.reminder-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
  min-height: 0;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 4px solid var(--theme-warning, #f59e0b);
}

.reminder-item.status-triggered {
  border-left-color: var(--theme-success, #10b981);
  opacity: 0.85;
}

.reminder-item.status-cancelled {
  border-left-color: var(--theme-text-placeholder);
  opacity: 0.6;
}

.reminder-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 左侧类型图标 */
.reminder-left {
  flex-shrink: 0;
}

.type-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff;
}

.type-icon.type-animation { background: #e74c3c; }
.type-icon.type-comic { background: #3498db; }
.type-icon.type-novel { background: #2ecc71; }
.type-icon.type-game { background: #9b59b6; }

/* 中间信息 */
.reminder-center {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.target-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.type-tag {
  font-size: 11px;
}

.reminder-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: var(--theme-text-regular);
}

.info-row .el-icon {
  color: var(--theme-text-placeholder);
  flex-shrink: 0;
  margin-top: 2px;
}

.msg-content {
  word-break: break-all;
  line-height: 1.5;
}

/* 右侧操作 */
.reminder-right {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
}

/* ========== 分页 ========== */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
  flex-shrink: 0;
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .reminder-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .reminder-right {
    width: 100%;
    justify-content: flex-end;
  }

  .filter-bar {
    flex-wrap: wrap;
  }

  .filter-bar .el-select,
  .filter-bar .el-input {
    flex: 1;
    min-width: 100px;
  }

  .desc {
    display: none;
  }

  .page-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .reminder-page {
    padding: 12px;
  }

  .reminder-right {
    flex-wrap: wrap;
  }
}
</style>
