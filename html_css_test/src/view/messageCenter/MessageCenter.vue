<template>
  <div class="message-center" :style="{ height: containerHeight + 'px' }">
    <!-- 头部：页面标题和用户信息 -->
    <div class="message-center-header">
      <h1 class="page-title">消息中心</h1>
      <div class="header-actions">
        <span class="user-info">{{ displayName }}</span>
      </div>
    </div>

    <!-- Tab导航：提醒、聊天室、通知、反馈 -->
    <div class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-icon" v-html="tab.icon"></span>
        <span class="tab-text">{{ tab.name }}</span>
        <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 内容区：根据activeTab切换显示对应组件 -->
    <div class="tab-content">
      <MyReminders
        v-if="activeTab === 'reminder'"
        :userId="userId"
        @update:count="handleReminderCountUpdate"
      />
      <ChatRoom v-else-if="activeTab === 'chat'" />
      <NotificationList
        v-else-if="activeTab === 'notification'"
        @update:count="handleNotificationCountUpdate"
      />
      <Feedback v-else-if="activeTab === 'feedback'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import messageCenterApi from '@/api/messageCenter'
import MyReminders from '@/view/reminder/MyReminders.vue'
import ChatRoom from './ChatRoom.vue'
import NotificationList from './NotificationList.vue'
import Feedback from './Feedback.vue'

/** Tab接口定义 */
interface TabItem {
  id: string
  name: string
  icon: string
  count: number
}

const store = useStore()

/** 当前激活的Tab */
const activeTab = ref<string>('reminder')

/** 用户信息（从Vuex获取） */
const userInfo = computed(() => store.getters.getUserInfo || {})

/** 用户ID */
const userId = computed<string>(() => {
  return userInfo.value?.id || userInfo.value?.userId || localStorage.getItem('userId') || ''
})

/** 显示名称 */
const displayName = computed<string>(() => {
  return userInfo.value?.nickName || userInfo.value?.username || '用户'
})

/** Tab配置：提醒、聊天室、通知、反馈 */
const tabs = ref<TabItem[]>([
  { id: 'reminder', name: '提醒', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>', count: 0 },
  { id: 'chat', name: '聊天室', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H13L9 19V16H5C4.45 16 4 15.55 4 15V5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8.5" cy="10" r="0.8" fill="currentColor"/><circle cx="12" cy="10" r="0.8" fill="currentColor"/><circle cx="15.5" cy="10" r="0.8" fill="currentColor"/></svg>', count: 0 },
  { id: 'notification', name: '通知', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3C9.24 3 7 5.24 7 8V12L4 15H20L17 12V8C17 5.24 14.76 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="3" r="1" fill="currentColor"/></svg>', count: 0 },
  { id: 'feedback', name: '反馈', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V5H19C19.55 5 20 5.45 20 6V18C20 18.55 19.55 19 19 19H16V20C16 20.55 15.55 21 15 21H9C8.45 21 8 20.55 8 20V19H5C4.45 19 4 18.55 4 18V6C4 5.45 4.45 5 5 5H8V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 9H15M9 13H14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>', count: 0 }
])

/** 切换Tab */
const switchTab = (tabId: string): void => {
  activeTab.value = tabId
  // 用户主动切换时清掉 sessionStorage 中的预设
  sessionStorage.removeItem('mc_target_tab')
}

/** 更新通知未读数 */
const updateNotificationCount = async (): Promise<void> => {
  try {
    const res: any = await messageCenterApi.getUnreadCount()
    if (res?.code === 200) {
      const notificationTab = tabs.value.find(t => t.id === 'notification')
      if (notificationTab) {
        notificationTab.count = res.resultValue ?? 0
      }
    }
  } catch (e) {
    console.warn('获取未读通知数量失败:', e)
  }
}

/** 处理通知组件的未读数更新 */
const handleNotificationCountUpdate = (count: number): void => {
  const notificationTab = tabs.value.find(t => t.id === 'notification')
  if (notificationTab) {
    notificationTab.count = count
  }
}

/** 处理提醒组件的待触发数更新 */
const handleReminderCountUpdate = (count: number): void => {
  const reminderTab = tabs.value.find(t => t.id === 'reminder')
  if (reminderTab) {
    reminderTab.count = count
  }
}

/** 计算容器高度：基于父容器实际可用高度 */
const containerHeight = ref(600)

const calcHeight = () => {
  // 通过 router-view 的父元素（.operationcss）获取实际可用高度
  const el = document.querySelector('.operationcss') as HTMLElement
  if (el) {
    containerHeight.value = el.clientHeight
  } else {
    // 降级方案：视口高度 - 顶部导航 - 约底部栏
    containerHeight.value = window.innerHeight - 56 - 140
  }
}

/** 生命周期：初始化 */
onMounted(() => {
  updateNotificationCount()
  // 下一帧计算高度，确保父容器已渲染
  requestAnimationFrame(() => {
    calcHeight()
  })
  // 窗口大小变化时重新计算
  window.addEventListener('resize', calcHeight)

  // 处理从 Top.vue 跳转过来时携带的目标 tab
  const target = sessionStorage.getItem('mc_target_tab')
  if (target && ['reminder', 'chat', 'notification', 'feedback'].includes(target)) {
    activeTab.value = target
    sessionStorage.removeItem('mc_target_tab')
  }
})
</script>

<style scoped>
.message-center {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--theme-bg-middle);
  box-sizing: border-box;
  overflow: hidden;
}

.message-center-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--theme-spacing-md) var(--theme-spacing-lg);
  background: var(--theme-bg-top);
  border-bottom: 1px solid var(--theme-border);
  flex-shrink: 0;
}

.page-title {
  font-size: 1.4em;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--theme-spacing-sm);
}

.user-info {
  color: var(--theme-text-regular);
  font-size: 14px;
  font-weight: 500;
}

/* Tab导航 */
.tab-navigation {
  display: flex;
  background: var(--theme-bg-top);
  border-bottom: 1px solid var(--theme-border);
  padding: 0 var(--theme-spacing-lg);
  flex-shrink: 0;
}

.tab-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--theme-text-regular);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
}

.tab-button:hover {
  color: var(--theme-primary);
  background: var(--theme-bg-hover);
}

.tab-button.active {
  color: var(--theme-primary);
  border-bottom-color: var(--theme-primary);
  font-weight: 600;
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon svg {
  display: block;
}

.tab-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--theme-danger);
  color: var(--theme-text-light);
  border-radius: var(--theme-radius-full);
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
  line-height: 1.4;
}

/* Tab内容区 */
.tab-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  min-height: 0; /* 关键：避免flex子项被内容撑开导致高度计算异常 */
}

/* 确保直接子元素能够占满整个容器高度 */
.tab-content > * {
  height: 100%;
  min-height: 0;
}
</style>
