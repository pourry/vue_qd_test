<template>
  <div class="message-center">
    <!-- 头部：页面标题和用户信息 -->
    <div class="message-center-header">
      <h1 class="page-title">消息中心</h1>
      <div class="header-actions">
        <span class="user-info">{{ displayName }}</span>
      </div>
    </div>

    <!-- Tab导航：聊天室、通知、反馈 -->
    <div class="tab-navigation">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-text">{{ tab.name }}</span>
        <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- 内容区：根据activeTab切换显示对应组件 -->
    <div class="tab-content">
      <ChatRoom v-if="activeTab === 'chat'" />
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
const activeTab = ref<string>('chat')

/** 用户信息（从Vuex获取） */
const userInfo = computed(() => store.getters.getUserInfo || {})

/** 显示名称 */
const displayName = computed<string>(() => {
  return userInfo.value?.nickName || userInfo.value?.username || '用户'
})

/** Tab配置 */
const tabs = ref<TabItem[]>([
  { id: 'chat', name: '聊天室', icon: '💬', count: 0 },
  { id: 'notification', name: '通知', icon: '🔔', count: 0 },
  { id: 'feedback', name: '反馈', icon: '📝', count: 0 }
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

/** 生命周期：初始化 */
onMounted(() => {
  updateNotificationCount()
  // 处理从 Top.vue 跳转过来时携带的目标 tab
  const target = sessionStorage.getItem('mc_target_tab')
  if (target && ['chat', 'notification', 'feedback'].includes(target)) {
    activeTab.value = target
    sessionStorage.removeItem('mc_target_tab')
  }
})
</script>

<style scoped>
.message-center {
  width: 100%;
  height: 100%;
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
  font-size: 16px;
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

