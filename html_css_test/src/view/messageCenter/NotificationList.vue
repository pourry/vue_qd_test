<template>
  <div class="notification-list">
    <!-- 头部操作栏 -->
    <div class="list-header">
      <div class="header-left">
        <h2 class="list-title">系统通知</h2>
        <span class="unread-badge" v-if="unreadCount > 0">
          {{ unreadCount }} 条未读
        </span>
      </div>
      <div class="header-actions">
        <button
          class="mark-all-btn"
          :disabled="unreadCount === 0 || loading"
          @click="handleMarkAllAsRead"
        >
          全部已读
        </button>
      </div>
    </div>

    <!-- 查询条件 -->
    <div class="filter-bar">
      <div class="filter-item">
        <label>通知类型</label>
        <el-select v-model="filters.type" placeholder="全部类型" clearable size="small">
          <el-option label="信息" value="info" />
          <el-option label="警告" value="warning" />
          <el-option label="成功" value="success" />
          <el-option label="公告" value="announcement" />
        </el-select>
      </div>
      <div class="filter-item">
        <label>已读状态</label>
        <el-select v-model="filters.readStatus" placeholder="全部状态" clearable size="small">
          <el-option label="未读" value="unread" />
          <el-option label="已读" value="read" />
        </el-select>
      </div>
      <div class="filter-item keyword-filter">
        <label>关键词</label>
        <el-input
          v-model="filters.keyword"
          placeholder="搜索标题或内容"
          clearable
          size="small"
          @keyup.enter="handleSearch"
        />
      </div>
      <div class="filter-actions">
        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        <el-button size="small" @click="handleResetFilters">重置</el-button>
      </div>
    </div>

    <!-- 通知列表 -->
    <div class="list-body">

      <div
        v-for="item in notificationList"
        :key="item.id"
        class="notification-item"
        :class="{ unread: !item.read }"
        @click="handleMarkAsRead(item)"
      >
        <!-- 类型图标 -->
        <div class="notification-icon" :class="item.type">
          <span>{{ getTypeIcon(item.type) }}</span>
        </div>

        <!-- 通知内容 -->
        <div class="notification-content">
          <div class="notification-header">
            <span class="notification-title">{{ item.title }}</span>
            <span class="notification-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <div class="notification-desc">{{ item.description }}</div>
          <div class="notification-type-tag" :class="item.type">
            {{ getTypeText(item.type) }}
          </div>
        </div>

        <!-- 操作区域 -->
        <div class="notification-actions">
          <el-button
            type="danger"
            size="small"
            plain
            :loading="deletingId === item.id"
            @click.stop="handleDelete(item)"
          >
            删除
          </el-button>
        </div>

        <!-- 未读标记 -->
        <div v-if="!item.read" class="unread-dot"></div>
      </div>

      <!-- 空状态 -->
      <div v-if="!loading && notificationList.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-text">暂无通知</div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <span>加载中...</span>
      </div>

      <!-- 分页组件 -->
      <div v-if="!loading && notificationList.length > 0" class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          background
          small
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

import messageCenterApi from '@/api/messageCenter'
import { ElMessage, ElMessageBox } from 'element-plus'
import { on as socketOn, off as socketOff } from '@/utils/websocket/notificationSocket'

/** 通知类型枚举 */
type NotificationType = 'info' | 'warning' | 'success' | 'announcement'

/** 通知接口 */
interface Notification {
  id: string | number
  title: string
  description: string
  type: NotificationType
  read: boolean
  timestamp: string
}

const emit = defineEmits<{
  (e: 'update:count', count: number): void
}>()

/** 加载状态 */
const loading = ref<boolean>(false)

/** 正在删除的通知ID */
const deletingId = ref<string | number | null>(null)

/** 分页数据 */
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

/** 查询条件 */
const filters = reactive({
  type: '',
  readStatus: '',
  keyword: ''
})
const appliedFilters = reactive({
  type: '',
  readStatus: '',
  keyword: ''
})

/** 通知列表 */
const notificationList = ref<Notification[]>([])

/** 未读数 */
const unreadCount = computed<number>(() => {
  return notificationList.value.filter(n => !n.read).length
})

/** 类型图标映射 */
const typeIconMap: Record<NotificationType, string> = {
  info: 'ℹ️',
  warning: '⚠️',
  success: '✅',
  announcement: '📢'
}

/** 类型文字映射 */
const typeTextMap: Record<NotificationType, string> = {
  info: '信息',
  warning: '警告',
  success: '成功',
  announcement: '公告'
}

/** 获取类型图标 */
const getTypeIcon = (type: NotificationType): string => {
  return typeIconMap[type] || '📌'
}

/** 获取类型文字 */
const getTypeText = (type: NotificationType): string => {
  return typeTextMap[type] || '未知'
}

/** 格式化时间 */
const formatTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

/** 更新未读数事件 */
const emitUnreadCount = (): void => {
  emit('update:count', unreadCount.value)
}

/** 加载通知列表 */
/**
 * 转换 isRead 字段为 boolean 类型
 */
const toBool = (val: any): boolean => {
  if (val === true || val === 1 || val === '1' || val === 'true') return true
  return false
}

/** 全部数据（用于前端分页） */
const allNotifications = ref<Notification[]>([])

/** 筛选后的全部数据 */
const filteredNotifications = computed<Notification[]>(() => {
  return allNotifications.value.filter(item => {
    // 类型筛选
    if (appliedFilters.type && item.type !== appliedFilters.type) return false
    // 已读状态筛选
    if (appliedFilters.readStatus === 'unread' && item.read) return false
    if (appliedFilters.readStatus === 'read' && !item.read) return false
    // 关键词筛选
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase()
      return item.title.toLowerCase().includes(kw) || 
             item.description.toLowerCase().includes(kw)
    }
    return true
  })
})

const loadNotifications = async (): Promise<void> => {
  loading.value = true
  try {
    const res: any = await messageCenterApi.getNotifications({})
    console.log('通知接口返回:', res)
    
    // 兼容不同的数据结构
    let list: any[] = []
    if (Array.isArray(res?.resultValue)) {
      list = res.resultValue
    } else if (Array.isArray(res?.data)) {
      list = res.data
    } else if (Array.isArray(res)) {
      list = res
    }
    console.log('解析后的列表:', list.length, '条')
    
    // 转换数据
    const newList: Notification[] = []
    for (const item of list) {
      let raw = item.isRead
      if (raw === undefined || raw === null) raw = item.is_read
      if (raw === undefined || raw === null) raw = false
      
      let read = false
      if (typeof raw === 'boolean') {
        read = raw
      } else if (typeof raw === 'number') {
        read = raw === 1
      } else if (typeof raw === 'string') {
        read = raw.toLowerCase() === 'true' || raw === '1'
      } else {
        read = Boolean(raw)
      }
      
      newList.push({
        id: item.id,
        title: item.title || '通知',
        description: item.description || '',
        type: (item.type || 'info') as NotificationType,
        read: read,
        timestamp: item.createTime || item.create_time || new Date().toISOString()
      })
    }
    
    // 存储全部数据
    allNotifications.value = newList
    
    // 使用筛选后的数据更新分页
    updatePagedList()
  } catch (e) {
    console.warn('获取通知列表失败:', e)
    allNotifications.value = []
    notificationList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
    emitUnreadCount()
  }
}

/** 前端分页计算 */
const updatePagedList = () => {
  const filtered = filteredNotifications.value
  pagination.total = filtered.length
  const start = (pagination.page - 1) * pagination.size
  const end = start + pagination.size
  notificationList.value = filtered.slice(start, end)
}

/** 分页变化处理 */
const handlePageChange = () => {
  updatePagedList()
}

/** 查询 */
const handleSearch = () => {
  appliedFilters.type = filters.type
  appliedFilters.readStatus = filters.readStatus
  appliedFilters.keyword = filters.keyword.trim()
  pagination.page = 1
  updatePagedList()
}

/** 重置查询条件 */
const handleResetFilters = () => {
  filters.type = ''
  filters.readStatus = ''
  filters.keyword = ''
  appliedFilters.type = ''
  appliedFilters.readStatus = ''
  appliedFilters.keyword = ''
  pagination.page = 1
  updatePagedList()
}

/** 标记单条为已读 */
const handleMarkAsRead = async (item: Notification): Promise<void> => {
  if (item.read) return

  try {
    const res: any = await messageCenterApi.markAsRead(item.id)
    if (res?.code === 200 || res?.code === 201) {
      // 本地立即更新 - 创建新对象触发 Vue 响应式
      const idx = notificationList.value.findIndex(n => n.id === item.id)
      if (idx !== -1) {
        notificationList.value[idx] = { ...notificationList.value[idx], read: true }
      }
      emitUnreadCount()
    } else {
      // 失败也本地更新
      item.read = true
      emitUnreadCount()
    }
  } catch (e) {
    item.read = true
    emitUnreadCount()
  }
}

/** 删除通知 */
const handleDelete = async (item: Notification): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条通知吗？删除后不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    deletingId.value = item.id
    const res: any = await messageCenterApi.deleteNotification(item.id)
    if (res?.code === 200) {
      // 从列表中移除
      const idx = notificationList.value.findIndex(n => n.id === item.id)
      if (idx !== -1) {
        notificationList.value.splice(idx, 1)
      }
      emitUnreadCount()
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res?.resultValue || '删除失败，请重试')
    }
  } catch (e) {
    if (e !== 'cancel' && e !== 'close') {
      console.error('删除通知失败:', e)
      ElMessage.error('删除失败，请检查网络后重试')
    }
  } finally {
    deletingId.value = null
  }
}

/** 标记全部为已读 */
const handleMarkAllAsRead = async (): Promise<void> => {
  if (unreadCount.value === 0) return

  try {
    const res: any = await messageCenterApi.markAllAsRead()
    if (res?.code === 200) {
      notificationList.value.forEach(item => {
        item.read = true
      })
      emitUnreadCount()
      ElMessage.success('已将所有通知标记为已读')
    }
  } catch (e) {
    console.warn('全部标记已读失败:', e)
    notificationList.value.forEach(item => {
      item.read = true
    })
    emitUnreadCount()
    ElMessage.success('已将所有通知标记为已读')
  }
}

/** WebSocket 取消监听函数 */
let unsubscribeNotification: (() => void) | null = null

/** 处理接收到的通知推送 */
const handleNotificationPush = (data: any) => {
  if (data?.notification) {
    // 添加新通知到列表顶部
    const newNotification: Notification = {
      id: Date.now(), // 临时ID，实际会从接口获取
      title: data.notification.title || '新通知',
      description: data.notification.description || '',
      type: (data.notification.type || 'info') as NotificationType,
      read: false,
      timestamp: data.notification.createTime || new Date().toISOString()
    }
    
    // 添加到列表顶部
    notificationList.value.unshift(newNotification)
    emitUnreadCount()
    
    // 显示提示
    ElMessage({
      message: data.message || '您有一条新通知',
      type: 'info',
      duration: 3000
    })
  }
}

/** 生命周期 */
onMounted(() => {
  loadNotifications()
  
  // 注册 WebSocket 通知监听
  unsubscribeNotification = socketOn('notification', handleNotificationPush)
})

onUnmounted(() => {
  // 取消 WebSocket 监听
  if (unsubscribeNotification) {
    unsubscribeNotification()
  }
  socketOff('notification', handleNotificationPush)
})
</script>

<style scoped>
.notification-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--theme-spacing-md) var(--theme-spacing-lg);
  background: var(--theme-bg-card);
  border-bottom: 1px solid var(--theme-border);
  flex-shrink: 0;
}

/* 查询条件样式 */
.filter-bar {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  background: var(--theme-bg-card);
  padding: 10px 16px;
  border-bottom: 1px solid var(--theme-border-light);
  flex-shrink: 0;
  flex-wrap: wrap;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 130px;
}
.filter-item label {
  font-size: 11px;
  color: var(--theme-text-secondary);
  font-weight: 500;
}
.keyword-filter {
  flex: 1;
  min-width: 160px;
}
.filter-actions {
  display: flex;
  gap: 6px;
  margin-left: auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
}

.unread-badge {
  background: var(--theme-danger-light);
  color: var(--theme-danger);
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--theme-radius-full);
}

\.header-actions {
  display: flex;
  gap: 8px;
}


.mark-all-btn {
  padding: 6px 16px;
  background: var(--theme-primary);
  color: var(--theme-text-light);
  border: none;
  border-radius: var(--theme-radius-md);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.mark-all-btn:hover:not(:disabled) {
  background: var(--theme-primary-dark);
}

.mark-all-btn:disabled {
  background: var(--theme-text-placeholder);
  cursor: not-allowed;
}

.list-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--theme-spacing-md);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border-light);
  border-radius: var(--theme-radius-lg);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.notification-item:hover {
  box-shadow: var(--theme-shadow-md);
  border-color: var(--theme-primary);
  transform: translateY(-1px);
}

.notification-item.unread {
  background: var(--theme-primary-bg);
  border-left: 3px solid var(--theme-primary);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--theme-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.notification-icon.info {
  background: var(--theme-info-light);
}

.notification-icon.warning {
  background: var(--theme-warning-light);
}

.notification-icon.success {
  background: var(--theme-success-light);
}

.notification-icon.announcement {
  background: var(--theme-primary-light);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 12px;
  color: var(--theme-text-placeholder);
  flex-shrink: 0;
  margin-left: 10px;
}

.notification-desc {
  font-size: 13px;
  color: var(--theme-text-regular);
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notification-type-tag {
  display: inline-block;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--theme-radius-sm);
  font-weight: 500;
}

.notification-type-tag.info {
  background: var(--theme-info-light);
  color: var(--theme-info);
}

.notification-type-tag.warning {
  background: var(--theme-warning-light);
  color: var(--theme-warning);
}

.notification-type-tag.success {
  background: var(--theme-success-light);
  color: var(--theme-success);
}

.notification-type-tag.announcement {
  background: var(--theme-primary-light);
  color: var(--theme-primary);
}

.notification-actions {
  display: flex;
  flex-shrink: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-top: 1px solid var(--theme-border-light);
  margin-top: 8px;
}

.unread-dot {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 8px;
  height: 8px;
  background: var(--theme-primary);
  border-radius: 50%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--theme-text-placeholder);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--theme-text-secondary);
  font-size: 13px;
}

.list-body::-webkit-scrollbar {
  width: 6px;
}

.list-body::-webkit-scrollbar-track {
  background: transparent;
}

.list-body::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: 3px;
}

.list-body::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-placeholder);
}
</style>

