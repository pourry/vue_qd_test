<template>
  <div class="message-center-entry">
    <!-- 悬浮按钮 -->
    <transition name="fade">
      <div
        v-if="!isOpen"
        class="widget-trigger"
        @click="toggleWidget"
      >
        <!-- 消息中心 SVG 图标 - 简洁信封 -->
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="1.8"/>
          <path d="M3 7L12 13L21 7" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div v-if="totalCount > 0" class="notification-badge">
          {{ totalCount > 99 ? '99+' : totalCount }}
        </div>
        <div v-if="isAnimating" class="pulse-ring"></div>
      </div>
    </transition>

    <!-- 弹出面板 -->
    <transition name="popup">
      <div v-if="isOpen" class="popup-panel">
        <div class="popup-header">
          <div class="header-left">
            <span class="popup-title">消息中心</span>
            <span v-if="totalCount > 0" class="unread-tag">{{ totalCount }} 条未读</span>
          </div>
          <div class="popup-actions">
            <button class="goto-btn" @click="goToTab(activeTab)">
              查看全部
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button class="close-btn" @click="closeWidget">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="popup-body">
          <!-- 快捷Tab -->
          <div class="quick-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="quick-tab"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span class="tab-icon" v-html="tab.icon"></span>
              <span class="tab-name">{{ tab.name }}</span>
              <span v-if="tab.count > 0" class="tab-count">{{ tab.count > 99 ? '99+' : tab.count }}</span>
            </button>
          </div>

          <!-- 快捷内容区 -->
          <div class="quick-content">
            <!-- ============== 提醒 Tab ============== -->
            <div v-if="activeTab === 'reminder'" class="reminder-section">
              <div v-if="loadingReminder" class="loading-state">加载中...</div>
              <div v-else-if="reminderList.length === 0" class="empty-state">
                <div class="empty-icon-svg">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25"/>
                    <path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" fill-opacity="0.25"/>
                  </svg>
                </div>
                <div class="empty-text">暂无提醒</div>
                <div class="empty-hint">您还没有设置任何提醒</div>
              </div>
              <div v-else>
                <div class="reminder-list">
                  <div
                    v-for="item in reminderList.slice(0, 5)"
                    :key="item.id"
                    class="reminder-item"
                    :class="{ cancelled: item.status === 'cancelled' }"
                  >
                    <div class="reminder-icon-wrap" :class="item.targetType">
                      {{ getReminderTypeIcon(item.targetType) }}
                    </div>
                    <div class="reminder-main">
                      <div class="reminder-row1">
                        <span class="reminder-title">{{ item.targetName || '提醒' }}</span>
                        <span class="reminder-status" :class="item.status">{{ getReminderStatusText(item.status) }}</span>
                      </div>
                      <div class="reminder-row2">
                        <span class="reminder-time">
                          {{ formatReminderTime(item.remindTime) }}
                        </span>
                      </div>
                      <div v-if="item.remindMsg" class="reminder-msg" :title="item.remindMsg">
                        {{ item.remindMsg }}
                      </div>
                    </div>
                    <div v-if="item.status === 'pending'" class="reminder-actions">
                      <span
                        class="cancel-btn"
                        @click="handleCancelReminder(item)"
                      >取消</span>
                      <span
                        class="delete-btn"
                        @click.stop="handleDeleteReminder(item)"
                      >×</span>
                    </div>
                    <div v-else class="reminder-actions">
                      <span
                        class="delete-btn"
                        @click="handleDeleteReminder(item)"
                      >×</span>
                    </div>
                  </div>
                </div>
                <div v-if="reminderList.length > 5" class="more-link has-more" @click="goToTab('reminder')">
                  还有 {{ reminderList.length - 5 }} 条提醒，查看全部 →
                </div>
                <div v-else class="more-link" @click="goToTab('reminder')">前往提醒页 →</div>
              </div>
            </div>

            <!-- ============== 通知 Tab ============== -->
            <div v-else-if="activeTab === 'notification'" class="preview-section">
              <div v-if="loading" class="loading-state">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
              </div>
              <div v-else-if="notificationList.length === 0" class="empty-state">
                <div class="empty-icon-svg">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3C9.24 3 7 5.24 7 8V12L4 15H20L17 12V8C17 5.24 14.76 3 12 3Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linejoin="round"/>
                    <path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linecap="round"/>
                    <circle cx="12" cy="3" r="1" fill="currentColor" fill-opacity="0.25"/>
                  </svg>
                </div>
                <div class="empty-text">暂无通知</div>
                <div class="empty-hint">您目前没有新的通知</div>
              </div>
              <div v-else class="preview-list">
                <div
                  v-for="item in notificationList.slice(0, 5)"
                  :key="item.id"
                  class="preview-item"
                  :class="{ unread: !item.read }"
                  @click="handleMarkAsRead(item)"
                >
                  <div class="preview-icon-wrap" :class="item.type" v-html="getTypeIcon(item.type)">
                  </div>
                  <div class="preview-content">
                    <div class="preview-title-row">
                      <span class="preview-title">{{ item.title }}</span>
                      <span v-if="!item.read" class="unread-dot"></span>
                    </div>
                    <div class="preview-desc">{{ item.description }}</div>
                    <div class="preview-meta">
                      <span class="preview-type" :class="item.type">{{ getTypeText(item.type) }}</span>
                      <span class="preview-time">{{ formatTime(item.timestamp) }}</span>
                    </div>
                  </div>
                  <div class="preview-actions">
                    <span
                      class="delete-btn"
                      @click.stop="handleDelete(item)"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H21M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M10 11V17M14 11V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div v-if="notificationList.length > 5" class="more-link" @click="goToTab('notification')">
                查看更多 →
              </div>
            </div>

            <!-- ============== 聊天室 Tab（简易聊天） ============== -->
            <div v-else-if="activeTab === 'chat'" class="chat-section">
              <div class="chat-section-header">
                <span class="chat-section-title">在线 {{ onlineCount }} 人</span>
                <button class="chat-enter-full" @click="goToTab('chat')">进入完整版</button>
              </div>

              <div class="chat-mini-body" ref="chatBodyRef">
                <div v-if="loadingChat" class="loading-state">
                  <div class="loading-spinner"></div>
                  <span>加载中...</span>
                </div>
                <div v-else-if="chatMessages.length === 0" class="empty-state">
                  <div class="empty-icon-svg">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H13L9 19V16H5C4.45 16 4 15.55 4 15V5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-opacity="0.25"/>
                      <circle cx="8.5" cy="10" r="0.8" fill="currentColor" fill-opacity="0.25"/>
                      <circle cx="12" cy="10" r="0.8" fill="currentColor" fill-opacity="0.25"/>
                      <circle cx="15.5" cy="10" r="0.8" fill="currentColor" fill-opacity="0.25"/>
                    </svg>
                  </div>
                  <div class="empty-text">暂无消息</div>
                  <div class="empty-hint">说点什么吧</div>
                </div>
                <div v-else class="chat-mini-list">
                  <div
                    v-for="msg in chatMessages"
                    :key="msg.id"
                    class="chat-mini-item"
                    :class="{ 'self': isSelf(msg) }"
                  >
                    <div
                      v-if="!isSelf(msg)"
                      class="chat-mini-avatar"
                      :style="{ background: getColorByKey(msg.senderId ?? msg.senderName) }"
                    >{{ (msg.senderName || '?').charAt(0) }}</div>
                    <div class="chat-mini-main">
                      <div class="chat-mini-meta">
                        <span class="chat-mini-name">{{ msg.senderName || '匿名' }}</span>
                        <span class="chat-mini-time">{{ formatChatTime(msg.createTime) }}</span>
                      </div>
                      <div
                        class="chat-mini-bubble"
                        :class="{ 'self-bubble': isSelf(msg), 'failed-bubble': msg.status === 'failed' }"
                      >
                        {{ msg.content }}
                        <span v-if="msg.status === 'sending'" class="chat-mini-status">发送中</span>
                        <button v-else-if="msg.status === 'failed'" class="chat-mini-resend" @click="resendChat(msg)">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M23 4V10H17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M20.49 15C19.98 16.93 18.85 18.6 17.21 19.77C15.58 20.94 13.64 21.5 11.67 21.44C9.7 21.38 7.82 20.72 6.37 19.53C4.92 18.34 3.97 16.7 3.7 14.89C3.43 13.08 3.86 11.23 4.94 9.76C6.02 8.29 7.66 7.28 9.5 6.95C11.34 6.62 13.25 7 14.81 8.05C16.37 9.1 17.52 10.76 18.13 12.63" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      v-if="isSelf(msg)"
                      class="chat-mini-avatar self-avatar"
                      :style="{ background: getColorByKey(msg.senderId ?? msg.senderName) }"
                    >{{ (msg.senderName || '?').charAt(0) }}</div>
                  </div>
                </div>
              </div>

              <div class="chat-mini-input">
                <textarea
                  v-model="chatInput"
                  class="chat-mini-textarea"
                  rows="2"
                  placeholder="说点什么..."
                  :maxlength="chatMaxLength"
                  :disabled="sendingChat"
                  @keydown.enter.exact.prevent="handleSendChat"
                />
                <div class="chat-mini-input-row">
                  <span class="chat-mini-count" :class="{ 'over-limit': chatInput.length > chatMaxLength }">
                    {{ chatInput.length }}/{{ chatMaxLength }}
                  </span>
                  <button
                    class="chat-mini-send"
                    :disabled="!canSendChat || sendingChat"
                    @click="handleSendChat"
                  >{{ sendingChat ? '发送中' : '发送' }}</button>
                </div>
              </div>
            </div>

            <!-- ============== 反馈 Tab ============== -->
            <div v-else-if="activeTab === 'feedback'" class="feedback-section">
              <div v-if="loadingFeedback" class="loading-state">
                <div class="loading-spinner"></div>
                <span>加载中...</span>
              </div>
              <div v-else-if="feedbackList.length === 0" class="empty-state">
                <div class="empty-icon-svg">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M7 3H14L20 9V20C20 20.55 19.55 21 19 21H7C6.45 21 6 20.55 6 20V4C6 3.45 6.45 3 7 3Z" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linejoin="round"/>
                    <path d="M14 3V9H20" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linejoin="round"/>
                    <path d="M9 13H15M9 16H13" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.25" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="empty-text">暂无反馈记录</div>
                <div class="empty-hint">提交反馈请到反馈页面</div>
                <button class="enter-btn" @click="goToTab('feedback')">前往反馈页</button>
              </div>
              <div v-else>
                <div class="feedback-list">
                  <div
                    v-for="item in feedbackList.slice(0, 5)"
                    :key="item.id"
                    class="feedback-item"
                    @click="goToTab('feedback')"
                  >
                    <div class="feedback-icon-wrap" :class="item.type" v-html="getFeedbackTypeIcon(item.type)">
                    </div>
                    <div class="feedback-main">
                      <div class="feedback-row1">
                        <span class="feedback-title">{{ item.title || '反馈' }}</span>
                        <span class="feedback-status" :class="item.status">{{ getFeedbackStatusText(item.status) }}</span>
                      </div>
                      <div class="feedback-row2">
                        <span class="feedback-time">{{ formatTime(item.createTime) }}</span>
                        <span v-if="item.reply" class="feedback-replied">已回复</span>
                        <span v-else class="feedback-no-reply">未回复</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="feedbackList.length > 5" class="more-link has-more" @click="goToTab('feedback')">
                  还有 {{ feedbackList.length - 5 }} 条反馈，查看全部
                </div>
                <div v-else class="more-link" @click="goToTab('feedback')">前往反馈页</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import messageCenterApi from '@/api/messageCenter'
import reminderApi from '@/api/reminder'

const router = useRouter()
const store = useStore()

const isOpen = ref<boolean>(false)
const isAnimating = ref<boolean>(false)
const activeTab = ref<string>('reminder')
const notificationList = ref<any[]>([])
const chatMessageCount = ref<number>(0)
const feedbackCount = ref<number>(0)
const reminderCount = ref<number>(0) // 提醒数量
const loading = ref<boolean>(false)

// 聊天室简易功能状态
const chatMessages = ref<any[]>([])
const loadingChat = ref<boolean>(false)
const onlineCount = ref<number>(0)
const chatInput = ref<string>('')
const sendingChat = ref<boolean>(false)
const chatMaxLength = 500
let chatCooldown = false
let chatPollTimer: number | null = null
const chatBodyRef = ref<HTMLElement | null>(null)

// 反馈预览状态
const feedbackList = ref<any[]>([])
const loadingFeedback = ref<boolean>(false)

// 提醒预览状态
const reminderList = ref<any[]>([])
const loadingReminder = ref<boolean>(false)

/** Tab配置：提醒 → 聊天室 → 通知 → 反馈 */
const tabs = computed(() => [
  { 
    id: 'reminder', 
    name: '提醒', 
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
    count: reminderCount.value 
  },
  { 
    id: 'chat', 
    name: '聊天室', 
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H13L9 19V16H5C4.45 16 4 15.55 4 15V5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="8.5" cy="10" r="0.8" fill="currentColor"/><circle cx="12" cy="10" r="0.8" fill="currentColor"/><circle cx="15.5" cy="10" r="0.8" fill="currentColor"/></svg>',
    count: chatMessageCount.value 
  },
  { 
    id: 'notification', 
    name: '通知', 
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3C9.24 3 7 5.24 7 8V12L4 15H20L17 12V8C17 5.24 14.76 3 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="3" r="1" fill="currentColor"/></svg>',
    count: unreadCount.value 
  },
  { 
    id: 'feedback', 
    name: '反馈', 
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V5H19C19.55 5 20 5.45 20 6V18C20 18.55 19.55 19 19 19H16V20C16 20.55 15.55 21 15 21H9C8.45 21 8 20.55 8 20V19H5C4.45 19 4 18.55 4 18V6C4 5.45 4.45 5 5 5H8V4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 9H15M9 13H14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    count: feedbackCount.value 
  }
])

/** 头像颜色池（与 ChatRoom 一致） */
const avatarColors = [
  '#0082F4', '#52c41a', '#faad14', '#eb2f96',
  '#722ed1', '#13c2c2', '#fa541c', '#818cf8'
]
const getColorByKey = (key: any): string => {
  const str = String(key ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return avatarColors[hash % avatarColors.length]
}

const currentUser = computed(() => store.getters.getUserInfo || {})
const isSelf = (msg: any): boolean => String(msg.senderId ?? '') === String(currentUser.value?.id ?? '')

const unreadCount = computed(() => notificationList.value.filter(n => !n.read).length)
const totalCount = computed(() => unreadCount.value + chatMessageCount.value + reminderCount.value)
const canSendChat = computed(() => {
  if (sendingChat.value || chatCooldown) return false
  const v = chatInput.value
  return v.trim().length > 0 && v.length <= chatMaxLength
})

const typeIconMap: Record<string, string> = {
  info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path d="M12 7V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 20H21L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>',
  success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  announcement: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 10C3 8.9 3.9 8 5 8H8L14 4V20L8 16H5C3.9 16 3 15.1 3 14V10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 9C17.2 10.2 17.5 11.5 17.5 12C17.5 12.5 17.2 13.8 16 15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
}
const typeTextMap: Record<string, string> = {
  info: '信息', warning: '警告', success: '成功', announcement: '公告'
}

const getTypeIcon = (type: string): string => typeIconMap[type] || '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>'
const getTypeText = (type: string): string => typeTextMap[type] || '未知'

const feedbackTypeIconMap: Record<string, string> = {
  bug: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="5" ry="8" stroke="currentColor" stroke-width="1.6"/><path d="M7 7L4 5M17 7L20 5M7 17L4 19M17 17L20 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 12H17M7 9.5H17M7 14.5H17" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>',
  feature: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L14.5 8H20L15.5 11L17 16L12 13L7 16L8.5 11L4 8H9.5L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  improvement: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 18L8 10L12 14L16 8L20 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 21H20" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16 8H18V10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  other: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 8V12L15 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
}
const feedbackStatusTextMap: Record<string, string> = {
  pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭'
}
const getFeedbackTypeIcon = (type: string): string => feedbackTypeIconMap[type] || feedbackTypeIconMap.other
const getFeedbackStatusText = (status: string): string => feedbackStatusTextMap[status] || '未知'

const formatTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return ''
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

/** 聊天消息用的更紧凑时间（HH:mm） */
const formatChatTime = (ts: string): string => {
  if (!ts) return ''
  const d = new Date(ts.includes('T') ? ts : ts.replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const toggleWidget = (): void => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    isAnimating.value = false
    // 打开时按需加载
    if (activeTab.value === 'reminder') loadReminderList()
    else if (activeTab.value === 'notification') loadNotificationList()
    else if (activeTab.value === 'chat') loadChatData()
    else if (activeTab.value === 'feedback') loadFeedbackList()
  } else {
    stopChatPolling()
  }
}

const closeWidget = (): void => {
  isOpen.value = false
  stopChatPolling()
}

const goToMessageCenter = (tabId?: string): void => {
  isOpen.value = false
  stopChatPolling()
  // 如果指定了 tab，存储到 sessionStorage 供消息中心页面读取
  if (tabId && ['reminder', 'chat', 'notification', 'feedback'].includes(tabId)) {
    sessionStorage.setItem('mc_target_tab', tabId)
  }
  router.push('/messageCenter')
}

/** 快捷跳转到指定 tab */
const goToTab = (tabId: string): void => {
  goToMessageCenter(tabId)
}

/** 切换 tab 时按需加载 */
watch(activeTab, (val) => {
  if (!isOpen.value) return
  if (val === 'reminder') loadReminderList()
  else if (val === 'notification') loadNotificationList()
  else if (val === 'chat') {
    loadChatData()
    startChatPolling()
  } else if (val === 'feedback') loadFeedbackList()
  if (val !== 'chat') stopChatPolling()
})

/* ============== 通知 ============== */
const handleMarkAsRead = async (item: any): Promise<void> => {
  if (item.read) return
  try {
    await messageCenterApi.markAsRead(item.id)
  } catch (e) { /* 失败也继续 */ }
  item.read = true
}

const handleDelete = async (item: any): Promise<void> => {
  try {
    await ElMessageBox.confirm('确定要删除这条通知吗？', '删除确认', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    const res: any = await messageCenterApi.deleteNotification(item.id)
    if (res?.code === 200) {
      const idx = notificationList.value.findIndex(n => n.id === item.id)
      if (idx !== -1) notificationList.value.splice(idx, 1)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res?.resultValue || '删除失败')
    }
  } catch (e) { /* 用户取消 */ }
}

const loadNotificationList = async (): Promise<void> => {
  loading.value = true
  try {
    const res: any = await messageCenterApi.getNotifications({})
    if (res?.code === 200 && Array.isArray(res.resultValue)) {
      notificationList.value = res.resultValue.map((item: any) => {
        let raw = item.isRead ?? item.is_read ?? item.read ?? false
        let read = false
        if (typeof raw === 'boolean') read = raw
        else if (typeof raw === 'number') read = raw === 1
        else if (typeof raw === 'string') read = raw.toLowerCase() === 'true' || raw === '1'
        else read = Boolean(raw)
        return {
          id: item.id,
          title: item.title || '通知',
          description: item.description || item.content || '',
          type: item.type || 'info',
          read,
          timestamp: item.createTime || item.create_time || new Date().toISOString()
        }
      })
    } else {
      notificationList.value = []
    }
  } catch (e) {
    console.warn('获取通知失败:', e)
    notificationList.value = []
  } finally {
    loading.value = false
  }
}

/* ============== 聊天室（简易） ============== */

/** 拉最近聊天消息 + 在线人数 */
const loadChatData = async (): Promise<void> => {
  loadingChat.value = true
  try {
    const [msgRes, onlineRes] = await Promise.all([
      messageCenterApi.getRecentChatMessages({ limit: 8 }),
      messageCenterApi.getRealOnlineUsers ? messageCenterApi.getRealOnlineUsers() : Promise.resolve(null)
    ])
    if (msgRes?.code === 200 && Array.isArray(msgRes.resultValue)) {
      chatMessages.value = msgRes.resultValue.map((m: any) => ({
        ...m,
        id: String(m.id),
        status: 'sent'
      }))
      nextTick(scrollChatToBottom)
    } else {
      chatMessages.value = []
    }
    if (onlineRes?.code === 200 && Array.isArray(onlineRes.resultValue)) {
      onlineCount.value = onlineRes.resultValue.length
    } else {
      onlineCount.value = 0
    }
  } catch (e) {
    console.warn('加载聊天室失败:', e)
    chatMessages.value = []
  } finally {
    loadingChat.value = false
  }
}

/** 启动轮询：每 5s 拉一次最新（轻量、只读） */
const startChatPolling = (): void => {
  stopChatPolling()
  chatPollTimer = window.setInterval(() => {
    if (!isOpen.value || activeTab.value !== 'chat') return
    // 静默拉一次最新 8 条，不显示 loading
    messageCenterApi.getRecentChatMessages({ limit: 8 }).then((res: any) => {
      if (res?.code === 200 && Array.isArray(res.resultValue)) {
        // 与现有列表合并（按 id 去重）
        const incoming = res.resultValue
        const existingIds = new Set(chatMessages.value.map(m => String(m.id)))
        let changed = false
        for (const m of incoming) {
          const idStr = String(m.id)
          if (!existingIds.has(idStr)) {
            chatMessages.value.push({ ...m, id: idStr, status: 'sent' })
            changed = true
          }
        }
        if (changed) {
          // 保持最多 30 条
          if (chatMessages.value.length > 30) {
            chatMessages.value = chatMessages.value.slice(-30)
          }
          scrollChatToBottom()
        }
      }
    }).catch(() => { /* 静默失败 */ })
  }, 5000)
}

const stopChatPolling = (): void => {
  if (chatPollTimer) {
    window.clearInterval(chatPollTimer)
    chatPollTimer = null
  }
}

const scrollChatToBottom = (): void => {
  nextTick(() => {
    if (chatBodyRef.value) {
      chatBodyRef.value.scrollTop = chatBodyRef.value.scrollHeight
    }
  })
}

const handleSendChat = async (): Promise<void> => {
  if (!canSendChat.value) return
  const content = chatInput.value.trim()
  const clientId = `mini-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const me = currentUser.value || {}
  const optimistic = {
    id: clientId,
    senderId: me.id,
    senderName: me.nickName || me.username || '我',
    content,
    createTime: new Date().toISOString(),
    status: 'sending'
  }
  chatMessages.value.push(optimistic)
  chatInput.value = ''
  scrollChatToBottom()

  sendingChat.value = true
  chatCooldown = true
  setTimeout(() => { chatCooldown = false }, 1500)
  try {
    const res: any = await messageCenterApi.sendChatMessage({ content })
    if (res?.code === 200 && res?.resultValue?.id) {
      // 用服务端返回的 ID 替换临时 ID
      const idx = chatMessages.value.findIndex(m => m.id === clientId)
      if (idx >= 0) {
        chatMessages.value[idx] = {
          ...chatMessages.value[idx],
          id: String(res.resultValue.id),
          status: 'sent',
          createTime: res.resultValue.createTime || chatMessages.value[idx].createTime
        }
      }
    } else {
      markChatFailed(clientId)
      ElMessage.warning(res?.resultValue || res?.msg || '发送失败')
    }
  } catch (e) {
    markChatFailed(clientId)
    ElMessage.warning('发送失败，请重试')
  } finally {
    sendingChat.value = false
  }
}

const markChatFailed = (id: string): void => {
  const m = chatMessages.value.find(x => x.id === id)
  if (m) m.status = 'failed'
}

const resendChat = async (msg: any): Promise<void> => {
  if (sendingChat.value) return
  msg.status = 'sending'
  sendingChat.value = true
  try {
    const res: any = await messageCenterApi.sendChatMessage({ content: msg.content })
    if (res?.code === 200 && res?.resultValue?.id) {
      const idx = chatMessages.value.findIndex(m => m.id === msg.id)
      if (idx >= 0) {
        chatMessages.value[idx] = {
          ...chatMessages.value[idx],
          id: String(res.resultValue.id),
          status: 'sent'
        }
      }
    } else {
      msg.status = 'failed'
    }
  } catch (e) {
    msg.status = 'failed'
  } finally {
    sendingChat.value = false
  }
}

/* ============== 提醒 ============== */

/** 提醒类型图标映射 */
const reminderTypeIconMap: Record<string, string> = {
  animation: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M10 9L15 12L10 15V9Z" fill="currentColor"/></svg>',
  comic: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  novel: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4H16C17.1 4 18 4.9 18 6V20L14 18L10 20L6 18L2 20V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 8H12M7 11H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  game: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="10" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="13" r="1.2" fill="currentColor"/><circle cx="16" cy="13" r="1.2" fill="currentColor"/><path d="M10 10H14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  exam: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 7H16M8 11H16M8 15H12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  appointment: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 3V7M16 3V7M3 10H21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  medicine: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="8" width="18" height="8" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 8V16M7 12H17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  report: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 3H14L20 9V20C20 20.55 19.55 21 19 21H7C6.45 21 6 20.55 6 20V4C6 3.45 6.45 3 7 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3V9H20" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 13H15M9 16H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  other: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 8V12L15 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
}

/** 提醒状态文本映射 */
const reminderStatusTextMap: Record<string, string> = {
  pending: '待触发',
  cancelled: '已取消',
  triggered: '已触发',
  expired: '已过期'
}

const getReminderTypeIcon = (type: string): string => reminderTypeIconMap[type] || reminderTypeIconMap.other
const getReminderStatusText = (status: string): string => reminderStatusTextMap[status] || '未知'

/** 格式化提醒时间（显示日期和时间） */
const formatReminderTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return ''
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor(diff / 60000)
  
  if (days < 0) {
    return date.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }
  if (days === 0 && hours === 0) {
    if (mins > 0) return `${mins}分钟后`
    return '即将触发'
  }
  if (days === 0) return `今天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  if (days === 1) return `明天 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  if (days < 7) return `${days}天后 ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/** 加载提醒列表 */
const loadReminderList = async (): Promise<void> => {
  loadingReminder.value = true
  try {
    const userInfo = store.getters.getUserInfo || {}
    const userId = userInfo?.id || localStorage.getItem('userId') || ''
    const res: any = await reminderApi.getMyReminders({ userId, page: 1, size: 50 })
    if (res?.code === 200) {
      const data = res.resultValue
      // 处理分页或数组格式
      const list = Array.isArray(data) ? data : (data?.list || data?.records || [])
      // 只显示未取消的提醒
      reminderList.value = list.filter((item: any) => item.status !== 'cancelled').slice(0, 5)
      // 更新数量
      const total = Array.isArray(data) ? data.length : (data?.total || list.length)
      reminderCount.value = total
    } else {
      reminderList.value = []
      reminderCount.value = 0
    }
  } catch (e) {
    console.warn('加载提醒列表失败:', e)
    reminderList.value = []
    reminderCount.value = 0
  } finally {
    loadingReminder.value = false
  }
}

/** 取消提醒 */
const handleCancelReminder = async (item: any): Promise<void> => {
  try {
    await ElMessageBox.confirm('确定要取消这个提醒吗？', '取消确认', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    const res: any = await reminderApi.cancelReminder(item.id)
    if (res?.code === 200) {
      // 更新本地状态
      item.status = 'cancelled'
      reminderCount.value = Math.max(0, reminderCount.value - 1)
      ElMessage.success('提醒已取消')
    } else {
      ElMessage.error(res?.resultValue || '取消失败')
    }
  } catch (e) { /* 用户取消 */ }
}

/** 删除提醒 */
const handleDeleteReminder = async (item: any): Promise<void> => {
  try {
    await ElMessageBox.confirm('确定要删除这个提醒吗？', '删除确认', {
      confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
    })
    const res: any = await reminderApi.deleteReminder(item.id)
    if (res?.code === 200) {
      const idx = reminderList.value.findIndex(r => r.id === item.id)
      if (idx !== -1) {
        reminderList.value.splice(idx, 1)
        reminderCount.value = Math.max(0, reminderCount.value - 1)
      }
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res?.resultValue || '删除失败')
    }
  } catch (e) { /* 用户取消 */ }
}

/* ============== 反馈 ============== */
const loadFeedbackList = async (): Promise<void> => {
  loadingFeedback.value = true
  try {
    const res: any = await messageCenterApi.getRecentFeedbacks({ limit: 5 })
    if (res?.code === 200 && Array.isArray(res.resultValue)) {
      feedbackList.value = res.resultValue
    } else {
      feedbackList.value = []
    }
  } catch (e) {
    console.warn('加载反馈预览失败:', e)
    feedbackList.value = []
  } finally {
    loadingFeedback.value = false
  }
}

/* ============== 生命周期 ============== */
let notifTimer: number | null = null

// 监听未读数变化，触发动画提醒
watch(unreadCount, (newVal, oldVal) => {
  if (newVal > oldVal && !isOpen.value) {
    isAnimating.value = true
    setTimeout(() => { isAnimating.value = false }, 2000)
  }
})

onMounted(() => {
  // 默认激活提醒Tab，加载提醒数据
  loadReminderList()
  // 后台每 30s 拉一次通知（与原版一致）
  notifTimer = window.setInterval(() => {
    loadNotificationList()
    // 如果当前在提醒Tab，也刷新提醒数据
    if (activeTab.value === 'reminder' && isOpen.value) {
      loadReminderList()
    }
  }, 30000)
})

onUnmounted(() => {
  if (notifTimer) clearInterval(notifTimer)
  stopChatPolling()
})
</script>

<style scoped>
.message-center-entry {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* 悬浮按钮 */
.widget-trigger {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark, #0066cc) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px var(--theme-primary-bg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.widget-trigger:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 24px var(--theme-primary-shadow);
}

.widget-trigger:active {
  transform: scale(0.95);
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--theme-danger);
  color: var(--theme-text-light);
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  border: 2px solid var(--theme-bg-card);
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.pulse-ring {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--theme-primary);
  animation: pulseRing 1.5s ease-out infinite;
}

@keyframes pulseRing {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}

/* ============== 弹出面板 ============== */
.popup-panel {
  width: 380px;
  max-height: 560px;
  height: 560px;
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-xl);
  box-shadow: var(--shadow-xl, 0 12px 40px rgba(0, 0, 0, 0.4)), 0 0 0 1px var(--theme-border-light);
  overflow: hidden;
  position: absolute;
  bottom: 70px;
  right: 0;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: var(--theme-bg-card);
  color: var(--theme-text-primary);
  flex-shrink: 0;
  border-bottom: 1px solid var(--theme-border-light);
  position: relative;
}

/* 顶部装饰条 - 使用主题色 */
.popup-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--theme-primary) 0%,
    var(--theme-primary-dark) 50%,
    var(--theme-primary) 100%
  );
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup-title {
  font-weight: 600;
  font-size: 15px;
  color: var(--theme-text-primary);
}

.unread-tag {
  background: var(--theme-primary);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.popup-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.goto-btn {
  background: var(--theme-primary-bg);
  color: var(--theme-primary);
  border: 1px solid var(--theme-primary);
  padding: 5px 12px;
  border-radius: var(--theme-radius-sm);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}
.goto-btn:hover {
  background: var(--theme-primary);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--theme-primary-shadow);
}

.arrow { transition: transform 0.2s; }
.goto-btn:hover .arrow { transform: translateX(3px); }

.close-btn {
  background: var(--theme-bg-hover);
  border: 1px solid var(--theme-border-light);
  color: var(--theme-text-secondary);
  font-size: 16px;
  cursor: pointer;
  padding: 2px 8px;
  border-radius: var(--theme-radius-sm);
  opacity: 0.8;
  transition: all 0.2s;
  line-height: 1;
}
.close-btn:hover {
  opacity: 1;
  background: var(--theme-error, #ff4d4f);
  color: white;
  border-color: var(--theme-error, #ff4d4f);
}

.popup-body {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: var(--theme-bg-card);
}

/* 快速Tab - 分段控件风格 */
.quick-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  padding: 4px;
  background: var(--theme-bg-hover);
  border-radius: var(--theme-radius-md);
  flex-shrink: 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.quick-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: var(--theme-radius-sm);
  font-size: 12px;
  color: var(--theme-text-secondary);
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  font-weight: 500;
}
.quick-tab:hover {
  background: var(--theme-bg-card);
  color: var(--theme-text-primary);
}
.quick-tab.active {
  background: var(--theme-bg-card);
  color: var(--theme-primary);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.tab-icon { font-size: 14px; }

.tab-count {
  position: absolute;
  top: -2px;
  right: 0;
  background: var(--theme-error, #ff4d4f);
  color: white;
  border-radius: 8px;
  min-width: 14px;
  height: 14px;
  padding: 0 4px;
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* 内容区 */
.quick-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.preview-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

/* ============== 通用：loading / empty ============== */
.loading-state {
  text-align: center;
  padding: 30px 20px;
  color: var(--theme-text-placeholder);
  font-size: 13px;
}

.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: var(--theme-text-placeholder);
}
.empty-icon { font-size: 36px; margin-bottom: 12px; }
.empty-icon-svg { 
  margin-bottom: 12px; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-placeholder);
}
.empty-icon-svg svg {
  display: block;
}
.empty-text { font-size: 14px; font-weight: 500; color: var(--theme-text-primary); margin-bottom: 4px; }
.empty-hint { font-size: 12px; color: var(--theme-text-placeholder); margin-bottom: 12px; }

.enter-btn {
  background: var(--theme-primary);
  color: var(--theme-text-light);
  border: none;
  padding: 8px 20px;
  border-radius: var(--theme-radius-md);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.enter-btn:hover {
  background: var(--theme-primary-dark, #0066cc);
}

.more-link {
  text-align: center;
  padding: 8px;
  font-size: 12px;
  color: var(--theme-primary);
  cursor: pointer;
  margin-top: 8px;
  border-top: 1px solid var(--theme-border-light);
  flex-shrink: 0;
  transition: background 0.2s;
}
.more-link:hover {
  color: var(--theme-primary-dark, #0066cc);
  background: var(--theme-primary-bg, rgba(0, 130, 244, 0.05));
}

/* 有更多数据时的强调样式 */
.more-link.has-more {
  background: var(--theme-primary-bg, rgba(0, 130, 244, 0.08));
  border-radius: var(--theme-radius-md);
  margin: 8px 12px 4px;
  padding: 10px 8px;
  font-weight: 500;
  border-top: none;
}
.more-link.has-more:hover {
  background: var(--theme-primary, #0082F4);
  color: white;
}

/* ============== 通知列表 ============== */
.preview-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.preview-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.preview-item:hover { background: var(--theme-bg-hover); border-color: var(--theme-border-light); }
.preview-item.unread { background: var(--theme-primary-bg); }

.preview-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}
.preview-icon-wrap.info { background: #e3f2fd; }
.preview-icon-wrap.warning { background: #fff3e0; }
.preview-icon-wrap.success { background: #e8f5e9; }
.preview-icon-wrap.announcement { background: #f3e5f5; }

.preview-content { flex: 1; min-width: 0; }
.preview-title-row {
  display: flex; align-items: center; gap: 6px; margin-bottom: 2px;
}
.preview-title {
  font-size: 13px; font-weight: 600; color: var(--theme-text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.unread-dot { width: 6px; height: 6px; background: var(--theme-danger); border-radius: 50%; flex-shrink: 0; }

.preview-desc {
  font-size: 12px; color: var(--theme-text-secondary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;
}
.preview-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--theme-text-placeholder); }
.preview-type { padding: 1px 5px; border-radius: 4px; font-size: 10px; }
.preview-type.info { background: #e3f2fd; color: #1976d2; }
.preview-type.warning { background: #fff3e0; color: #f57c00; }
.preview-type.success { background: #e8f5e9; color: #388e3c; }
.preview-type.announcement { background: #f3e5f5; color: #7b1fa2; }

.preview-actions { flex-shrink: 0; padding-left: 6px; }
.delete-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 18px; height: 18px; border-radius: 50%;
  color: var(--theme-text-placeholder); font-size: 13px; cursor: pointer;
  transition: all 0.2s;
}
.delete-btn:hover { background: var(--theme-danger); color: #fff; }

/* ============== 聊天室（简易） ============== */
.chat-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.chat-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.chat-section-title {
  font-size: 12px;
  color: var(--theme-text-secondary);
}
.chat-enter-full {
  background: transparent;
  border: 1px solid var(--theme-primary);
  color: var(--theme-primary);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.chat-enter-full:hover {
  background: var(--theme-primary);
  color: #fff;
}

.chat-mini-body {
  flex: 1;
  overflow-y: auto;
  min-height: 60px;
  padding: 4px 2px;
}

.chat-mini-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-mini-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.chat-mini-item.self {
  flex-direction: row-reverse;
}

.chat-mini-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}
.chat-mini-avatar.self-avatar {
  color: #fff;
}

.chat-mini-main {
  max-width: 75%;
  display: flex;
  flex-direction: column;
}
.chat-mini-item.self .chat-mini-main {
  align-items: flex-end;
}

.chat-mini-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
  font-size: 11px;
}
.chat-mini-name {
  color: var(--theme-text-secondary);
  font-weight: 500;
}
.chat-mini-time {
  color: var(--theme-text-placeholder);
  font-size: 10px;
}

.chat-mini-bubble {
  display: inline-block;
  padding: 6px 10px;
  background: var(--theme-bg-hover);
  color: var(--theme-text-primary);
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
  max-width: 100%;
  white-space: pre-wrap;
}
.chat-mini-bubble.self-bubble {
  background: var(--theme-primary);
  color: var(--theme-text-light);
}
.chat-mini-bubble.failed-bubble {
  background: var(--theme-error-bg, #fff2f0);
  color: var(--theme-error, #ff4d4f);
  border: 1px dashed var(--theme-error, #ff4d4f);
}

.chat-mini-status {
  font-size: 10px;
  opacity: 0.6;
  margin-left: 4px;
}
.chat-mini-resend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  margin-left: 4px;
  padding: 0 2px;
  vertical-align: middle;
}
.chat-mini-resend:hover { opacity: 0.8; }

/* 聊天输入区 */
.chat-mini-input {
  margin-top: 8px;
  border-top: 1px solid var(--theme-border-light);
  padding-top: 8px;
  flex-shrink: 0;
}
.chat-mini-textarea {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-bg-middle);
  color: var(--theme-text-primary);
  font-size: 13px;
  resize: none;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.chat-mini-textarea:focus {
  border-color: var(--theme-primary);
}
.chat-mini-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.chat-mini-input-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.chat-mini-count {
  font-size: 11px;
  color: var(--theme-text-placeholder);
}
.chat-mini-count.over-limit {
  color: var(--theme-error, #ff4d4f);
}
.chat-mini-send {
  padding: 4px 16px;
  background: var(--theme-primary);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}
.chat-mini-send:hover:not(:disabled) {
  background: var(--theme-primary-dark, #0066cc);
}
.chat-mini-send:disabled {
  background: var(--theme-text-placeholder);
  cursor: not-allowed;
}

/* ============== 反馈 Tab ============== */
.feedback-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.feedback-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid var(--theme-border-light);
}
.feedback-item:hover { background: var(--theme-bg-hover); }

.feedback-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.feedback-icon-wrap.bug { background: var(--theme-danger-light, #ffccc7); }
.feedback-icon-wrap.feature { background: var(--theme-info-light, #d6e8ff); }
.feedback-icon-wrap.improvement { background: var(--theme-success-light, #d9f7be); }
.feedback-icon-wrap.other { background: var(--theme-bg-hover); }

.feedback-main { flex: 1; min-width: 0; }
.feedback-row1 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.feedback-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-text-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.feedback-status {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 500;
  flex-shrink: 0;
}
.feedback-status.pending { background: var(--theme-warning-light, #ffe7ba); color: var(--theme-warning, #faad14); }
.feedback-status.processing { background: var(--theme-info-light, #d6e8ff); color: var(--theme-info, #0082f4); }
.feedback-status.resolved { background: var(--theme-success-light, #d9f7be); color: var(--theme-success, #00b42a); }
.feedback-status.closed { background: var(--theme-danger-light, #ffccc7); color: var(--theme-danger, #ff4d4f); }

.feedback-row2 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--theme-text-placeholder);
}
.feedback-replied {
  color: var(--theme-success, #00b42a);
  background: var(--theme-success-light, #d9f7be);
  padding: 1px 6px;
  border-radius: 8px;
}
.feedback-no-reply {
  color: var(--theme-text-placeholder);
}

/* ============== 提醒 Tab ============== */
.reminder-section {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.reminder-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: var(--theme-radius-md);
  transition: background 0.2s;
  border: 1px solid var(--theme-border-light);
}
.reminder-item:hover { background: var(--theme-bg-hover); }
.reminder-item.cancelled { opacity: 0.6; }

.reminder-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.reminder-icon-wrap.exam { background: var(--theme-info-light, #d6e8ff); }
.reminder-icon-wrap.appointment { background: var(--theme-success-light, #d9f7be); }
.reminder-icon-wrap.medicine { background: var(--theme-warning-light, #ffe7ba); }
.reminder-icon-wrap.report { background: var(--theme-purple-light, #f3e5f5); }
.reminder-icon-wrap.other { background: var(--theme-bg-hover); }

.reminder-main { flex: 1; min-width: 0; }
.reminder-row1 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.reminder-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-text-primary);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.reminder-status {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 8px;
  font-weight: 500;
  flex-shrink: 0;
}
.reminder-status.pending { background: var(--theme-warning-light, #ffe7ba); color: var(--theme-warning, #faad14); }
.reminder-status.cancelled { background: var(--theme-bg-hover); color: var(--theme-text-placeholder); }
.reminder-status.triggered { background: var(--theme-success-light, #d9f7be); color: var(--theme-success, #00b42a); }
.reminder-status.expired { background: var(--theme-danger-light, #ffccc7); color: var(--theme-danger, #ff4d4f); }

.reminder-row2 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--theme-text-placeholder);
}
.reminder-time {
  color: var(--theme-primary);
  font-weight: 500;
}

.reminder-msg {
  font-size: 11px;
  color: var(--theme-text-secondary);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reminder-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.cancel-btn {
  font-size: 11px;
  color: var(--theme-warning, #faad14);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.2s;
}
.cancel-btn:hover {
  background: var(--theme-warning-light, #ffe7ba);
  color: var(--theme-warning-dark, #d48806);
}

/* ============== 动画 ============== */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.popup-enter-active { animation: popupEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.popup-leave-active { animation: popupLeave 0.2s cubic-bezier(0.4, 0, 0.2, 1); }

@keyframes popupEnter {
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes popupLeave {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(10px) scale(0.95); }
}

/* ============== 滚动条 ============== */
.popup-body *::-webkit-scrollbar { width: 5px; }
.popup-body *::-webkit-scrollbar-track { background: transparent; }
.popup-body *::-webkit-scrollbar-thumb { background: var(--theme-border); border-radius: 3px; }
.popup-body *::-webkit-scrollbar-thumb:hover { background: var(--theme-text-placeholder); }
</style>
