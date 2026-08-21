<template>
  <div class="multi-widget">
    <!-- Trigger button with notification badge -->
    <div 
      v-if="!isOpen" 
      class="widget-trigger" 
      @click="toggleWidget"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
      </svg>
      <div v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</div>
    </div>

    <!-- Multi-function window -->
    <div v-if="isOpen" class="multi-window" :class="{ minimized: isMinimized }">
      <!-- Window header -->
      <div class="window-header">
        <div class="window-title">
          <span>消息中心</span>
          <span class="online-status">在线</span>
        </div>
        <div class="window-controls">
          <button @click="toggleMinimize" class="minimize-btn">
            {{ isMinimized ? '□' : '_' }}
          </button>
          <button @click="closeWidget" class="close-btn">×</button>
        </div>
      </div>

      <!-- Tab navigation -->
      <div v-if="!isMinimized" class="tab-navigation">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span>{{ tab.name }}</span>
          <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Tab content (hidden when minimized) -->
      <div v-if="!isMinimized" class="tab-content">
        
        <!-- 聊天室 Tab -->
        <div v-if="activeTab === 'chat'" class="chat-tab">
          <div class="messages-area" ref="messagesArea">
            <div 
              v-for="message in chatMessages" 
              :key="message.id"
              class="message"
              :class="{ 'user-message': message.isUser, 'system-message': message.isSystem }"
            >
              <div class="message-avatar">
                <span v-if="message.isUser">我</span>
                <span v-else-if="message.isSystem">系统</span>
                <span v-else>{{ message.sender }}</span>
              </div>
              <div class="message-content">
                <div class="message-text">{{ message.text }}</div>
                <div class="message-time">{{ message.time }}</div>
              </div>
            </div>
          </div>
          <div class="input-area">
            <div class="input-container">
              <input 
                v-model="newChatMessage" 
                @keyup.enter="sendChatMessage"
                placeholder="输入消息..."
                class="message-input"
              />
              <button @click="sendChatMessage" class="send-btn" :disabled="!newChatMessage.trim()">
                发送
              </button>
            </div>
          </div>
        </div>

        <!-- 消息通知 Tab -->
        <div v-if="activeTab === 'notifications'" class="notifications-tab">
          <div class="notifications-header">
            <h3>系统通知</h3>
            <button @click="markAllAsRead" class="mark-read-btn">全部已读</button>
          </div>
          <div class="notifications-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id"
              class="notification-item"
              :class="{ unread: !notification.read }"
              @click="markAsRead(notification.id)"
            >
              <div class="notification-icon" :class="notification.type">
                <span v-if="notification.type === 'info'">ℹ️</span>
                <span v-else-if="notification.type === 'warning'">⚠️</span>
                <span v-else-if="notification.type === 'success'">✅</span>
                <span v-else>📢</span>
              </div>
              <div class="notification-content">
                <div class="notification-title">{{ notification.title }}</div>
                <div class="notification-text">{{ notification.text }}</div>
                <div class="notification-time">{{ notification.time }}</div>
              </div>
              <div v-if="!notification.read" class="unread-dot"></div>
            </div>
          </div>
        </div>

        <!-- 问题反馈 Tab -->
        <div v-if="activeTab === 'feedback'" class="feedback-tab">
          <div class="feedback-form">
            <h3>问题反馈</h3>
            
            <div class="form-group">
              <label>反馈类型</label>
              <select v-model="feedbackForm.type" class="form-select">
                <option value="">请选择反馈类型</option>
                <option value="bug">Bug报告</option>
                <option value="feature">功能建议</option>
                <option value="improvement">改进建议</option>
                <option value="other">其他问题</option>
              </select>
            </div>

            <div class="form-group">
              <label>问题标题</label>
              <input 
                v-model="feedbackForm.title" 
                type="text" 
                placeholder="请简要描述问题"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label>详细描述</label>
              <textarea 
                v-model="feedbackForm.description" 
                placeholder="请详细描述遇到的问题或建议..."
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div class="form-group">
              <label>联系方式（可选）</label>
              <input 
                v-model="feedbackForm.contact" 
                type="text" 
                placeholder="邮箱或手机号"
                class="form-input"
              />
            </div>

            <div class="form-actions">
              <button @click="submitFeedback" class="submit-btn" :disabled="!canSubmitFeedback">
                提交反馈
              </button>
              <button @click="resetFeedbackForm" class="reset-btn">
                重置
              </button>
            </div>
          </div>

          <!-- 历史反馈 -->
          <div class="feedback-history">
            <h4>我的反馈记录</h4>
            <div class="feedback-list">
              <div 
                v-for="feedback in feedbackHistory" 
                :key="feedback.id"
                class="feedback-item"
              >
                <div class="feedback-status" :class="feedback.status">
                  {{ getStatusText(feedback.status) }}
                </div>
                <div class="feedback-info">
                  <div class="feedback-title">{{ feedback.title }}</div>
                  <div class="feedback-time">{{ feedback.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

// 接口定义
interface Message {
  id: number
  text: string
  isUser: boolean
  isSystem: boolean
  sender: string
  time: string
}

interface Notification {
  id: number
  type: 'info' | 'warning' | 'success' | 'announcement'
  title: string
  text: string
  time: string
  read: boolean
}

interface Tab {
  id: string
  name: string
  icon: string
  count: number
}

interface FeedbackForm {
  type: string
  title: string
  description: string
  contact: string
}

interface FeedbackItem {
  id: number
  title: string
  status: 'pending' | 'processing' | 'resolved' | 'closed'
  time: string
}

// 响应式数据
const isOpen = ref<boolean>(false)
const isMinimized = ref<boolean>(false)
const activeTab = ref<string>('chat')
const newChatMessage = ref<string>('')
const messagesArea = ref<HTMLElement | null>(null)

// Tab configuration
const tabs = ref<Tab[]>([
  { id: 'chat', name: '聊天室', icon: '💬', count: 0 },
  { id: 'notifications', name: '通知', icon: '🔔', count: 3 },
  { id: 'feedback', name: '反馈', icon: '📝', count: 0 }
])

// Chat messages
const chatMessages = ref<Message[]>([
  {
    id: 1,
    text: '欢迎来到聊天室！',
    isUser: false,
    isSystem: true,
    sender: '系统',
    time: '14:30'
  },
  {
    id: 2,
    text: '大家好，有什么问题可以在这里讨论',
    isUser: false,
    isSystem: false,
    sender: '管理员',
    time: '14:32'
  }
])

// Notifications
const notifications = ref<Notification[]>([
  {
    id: 1,
    type: 'info',
    title: '系统更新通知',
    text: '系统将于今晚22:00进行维护更新，预计耗时2小时',
    time: '2小时前',
    read: false
  },
  {
    id: 2,
    type: 'success',
    title: '账户验证成功',
    text: '您的账户已通过实名验证，现在可以使用全部功能',
    time: '1天前',
    read: false
  },
  {
    id: 3,
    type: 'warning',
    title: '密码安全提醒',
    text: '建议您定期更换密码以保证账户安全',
    time: '3天前',
    read: false
  },
  {
    id: 4,
    type: 'announcement',
    title: '新功能上线',
    text: '我们上线了全新的消息中心功能，快来体验吧！',
    time: '1周前',
    read: true
  }
])

// Feedback form
const feedbackForm = ref<FeedbackForm>({
  type: '',
  title: '',
  description: '',
  contact: ''
})

// Feedback history
const feedbackHistory = ref<FeedbackItem[]>([
  {
    id: 1,
    title: '登录页面加载缓慢',
    status: 'resolved',
    time: '2024-01-15'
  },
  {
    id: 2,
    title: '建议增加夜间模式',
    status: 'processing',
    time: '2024-01-20'
  },
  {
    id: 3,
    title: '移动端适配问题',
    status: 'pending',
    time: '2024-01-25'
  }
])

// 计算属性
const unreadCount = computed<number>(() => {
  return notifications.value.filter(n => !n.read).length
})

const canSubmitFeedback = computed<boolean>(() => {
  return !!(feedbackForm.value.type && 
           feedbackForm.value.title.trim() && 
           feedbackForm.value.description.trim())
})

// 方法
const toggleWidget = (): void => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    isMinimized.value = false
    nextTick(() => {
      if (activeTab.value === 'chat') {
        scrollToBottom()
      }
    })
  }
}

const closeWidget = (): void => {
  isOpen.value = false
  isMinimized.value = false
}

const toggleMinimize = (): void => {
  isMinimized.value = !isMinimized.value
}

// Chat methods
const sendChatMessage = (): void => {
  if (!newChatMessage.value.trim()) return
  
  const message: Message = {
    id: Date.now(),
    text: newChatMessage.value,
    isUser: true,
    isSystem: false,
    sender: '我',
    time: new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  chatMessages.value.push(message)
  newChatMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })
  
  // 模拟其他用户回复
  setTimeout(() => {
    simulateReply()
  }, 1000)
}

const simulateReply = (): void => {
  const replies: string[] = [
    '收到您的消息！',
    '这个问题我也遇到过',
    '让我来帮您解答',
    '好的，我了解了',
    '感谢分享！'
  ]
  
  const senders: string[] = ['小明', '客服', '管理员', '小红']
  
  const reply: Message = {
    id: Date.now(),
    text: replies[Math.floor(Math.random() * replies.length)],
    isUser: false,
    isSystem: false,
    sender: senders[Math.floor(Math.random() * senders.length)],
    time: new Date().toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  chatMessages.value.push(reply)
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = (): void => {
  if (messagesArea.value) {
    messagesArea.value.scrollTop = messagesArea.value.scrollHeight
  }
}

// Notification methods
const markAsRead = (notificationId: number): void => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    updateTabCounts()
  }
}

const markAllAsRead = (): void => {
  notifications.value.forEach(n => n.read = true)
  updateTabCounts()
}

const updateTabCounts = (): void => {
  const notificationTab = tabs.value.find(t => t.id === 'notifications')
  if (notificationTab) {
    notificationTab.count = unreadCount.value
  }
}

// Feedback methods
const submitFeedback = (): void => {
  if (!canSubmitFeedback.value) return
  
  const newFeedback: FeedbackItem = {
    id: Date.now(),
    title: feedbackForm.value.title,
    status: 'pending',
    time: new Date().toLocaleDateString('zh-CN')
  }
  
  feedbackHistory.value.unshift(newFeedback)
  resetFeedbackForm()
  
  // 显示成功提示
  alert('反馈提交成功！我们会尽快处理您的问题。')
}

const resetFeedbackForm = (): void => {
  feedbackForm.value = {
    type: '',
    title: '',
    description: '',
    contact: ''
  }
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'processing': '处理中',
    'resolved': '已解决',
    'closed': '已关闭'
  }
  return statusMap[status] || status
}

// 生命周期
onMounted(() => {
  updateTabCounts()
})
</script>

<style scoped>
.multi-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Widget trigger button */
.widget-trigger {
  width: 60px;
  height: 60px;
  background: var(--theme-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px var(--theme-primary-bg);
  transition: all 0.3s ease;
  position: relative;
}

.widget-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px var(--theme-primary-bg);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--theme-danger);
  color: var(--theme-text-light);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Multi-function window */
.multi-window {
  width: 400px;
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-xl);
  box-shadow: var(--theme-shadow-xl);
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 600px;
}

.multi-window.minimized {
  height: 50px;
}

/* Window header */
.window-header {
  background: var(--theme-primary);
  color: var(--theme-text-light);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.window-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.online-status {
  background: var(--theme-success);
  color: var(--theme-text-light);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.window-controls {
  display: flex;
  gap: 5px;
}

.minimize-btn, .close-btn {
  background: none;
  border: none;
  color: var(--theme-text-light);
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: var(--theme-radius-sm);
  transition: background-color 0.2s;
}

.minimize-btn:hover, .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Tab navigation */
.tab-navigation {
  display: flex;
  background: var(--theme-bg-middle);
  border-bottom: 1px solid var(--theme-border);
}

.tab-btn {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  color: var(--theme-text-regular);
  transition: all 0.2s;
  position: relative;
}

.tab-btn:hover {
  background: var(--theme-bg-hover);
  color: var(--theme-text-primary);
}

.tab-btn.active {
  background: var(--theme-bg-card);
  color: var(--theme-primary);
  border-bottom: 2px solid var(--theme-primary);
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  background: var(--theme-danger);
  color: var(--theme-text-light);
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  min-width: 16px;
  text-align: center;
}

/* Tab content */
.tab-content {
  height: 500px;
  overflow: hidden;
}

/* Chat tab */
.chat-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: var(--theme-bg-middle);
}

.message {
  display: flex;
  margin-bottom: 15px;
  align-items: flex-start;
  gap: 10px;
}

.message.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-text-light);
  flex-shrink: 0;
}

.message:not(.user-message):not(.system-message) .message-avatar {
  background: var(--theme-text-secondary);
}

.message.user-message .message-avatar {
  background: var(--theme-primary);
}

.message.system-message .message-avatar {
  background: var(--theme-text-placeholder);
}

.message-content {
  max-width: 70%;
}

.message-text {
  background: var(--theme-bg-card);
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: var(--theme-shadow-xs);
  word-wrap: break-word;
}

.message.user-message .message-text {
  background: var(--theme-primary);
  color: var(--theme-text-light);
}

.message.system-message .message-text {
  background: var(--theme-primary-light);
  color: var(--theme-text-regular);
  font-style: italic;
  font-size: 13px;
}

.message-time {
  font-size: 11px;
  color: var(--theme-text-placeholder);
  margin-top: 5px;
  text-align: right;
}

.message.user-message .message-time {
  text-align: left;
}

.input-area {
  padding: 20px;
  background: var(--theme-bg-card);
  border-top: 1px solid var(--theme-border);
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  background: var(--theme-bg-middle);
  color: var(--theme-text-primary);
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: var(--theme-primary);
}

.send-btn {
  padding: 10px 20px;
  background: var(--theme-primary);
  color: var(--theme-text-light);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: var(--theme-primary-dark);
}

.send-btn:disabled {
  background: var(--theme-text-placeholder);
  cursor: not-allowed;
}

/* Notifications tab */
.notifications-tab {
  height: 100%;
  overflow-y: auto;
  background: var(--theme-bg-middle);
}

.notifications-header {
  padding: 20px;
  background: var(--theme-bg-card);
  border-bottom: 1px solid var(--theme-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h3 {
  margin: 0;
  color: var(--theme-text-primary);
}

.mark-read-btn {
  background: var(--theme-primary);
  color: var(--theme-text-light);
  border: none;
  padding: 6px 12px;
  border-radius: var(--theme-radius-sm);
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.mark-read-btn:hover {
  background: var(--theme-primary-dark);
}

.notifications-list {
  padding: 10px;
}

.notification-item {
  background: var(--theme-bg-card);
  margin-bottom: 10px;
  padding: 15px;
  border-radius: var(--theme-radius-md);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-item:hover {
  box-shadow: var(--theme-shadow-sm);
}

.notification-item.unread {
  border-left: 4px solid var(--theme-primary);
  background: var(--theme-primary-bg);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.notification-icon.info {
  background: var(--theme-info-light);
  color: var(--theme-info);
}

.notification-icon.warning {
  background: var(--theme-warning-light);
  color: var(--theme-warning);
}

.notification-icon.success {
  background: var(--theme-success-light);
  color: var(--theme-success);
}

.notification-icon.announcement {
  background: var(--theme-primary-light);
  color: var(--theme-primary);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 4px;
}

.notification-text {
  color: var(--theme-text-regular);
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.notification-time {
  color: var(--theme-text-secondary);
  font-size: 12px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: var(--theme-primary);
  border-radius: 50%;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* Feedback tab */
.feedback-tab {
  height: 100%;
  overflow-y: auto;
  background: var(--theme-bg-middle);
}

.feedback-form {
  background: var(--theme-bg-card);
  padding: 20px;
  border-bottom: 1px solid var(--theme-border);
}

.feedback-form h3 {
  margin: 0 0 20px 0;
  color: var(--theme-text-primary);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: var(--theme-text-regular);
}

.form-select, .form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-sm);
  font-size: 14px;
  transition: border-color 0.2s;
  background: var(--theme-bg-card);
  color: var(--theme-text-primary);
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 2px var(--theme-primary-bg);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn, .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--theme-radius-sm);
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.submit-btn {
  background: var(--theme-primary);
  color: var(--theme-text-light);
}

.submit-btn:hover:not(:disabled) {
  background: var(--theme-primary-dark);
}

.submit-btn:disabled {
  background: var(--theme-text-placeholder);
  cursor: not-allowed;
}

.reset-btn {
  background: var(--theme-bg-middle);
  color: var(--theme-text-regular);
}

.reset-btn:hover {
  background: var(--theme-border);
}

.feedback-history {
  padding: 20px;
}

.feedback-history h4 {
  margin: 0 0 15px 0;
  color: var(--theme-text-primary);
}

.feedback-item {
  background: var(--theme-bg-card);
  padding: 15px;
  border-radius: var(--theme-radius-md);
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.feedback-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.feedback-status.pending {
  background: var(--theme-warning-light);
  color: var(--theme-warning);
}

.feedback-status.processing {
  background: var(--theme-info-light);
  color: var(--theme-info);
}

.feedback-status.resolved {
  background: var(--theme-success-light);
  color: var(--theme-success);
}

.feedback-status.closed {
  background: var(--theme-danger-light);
  color: var(--theme-danger);
}

.feedback-info {
  flex: 1;
}

.feedback-title {
  font-weight: 500;
  color: var(--theme-text-primary);
  margin-bottom: 4px;
}

.feedback-time {
  color: var(--theme-text-secondary);
  font-size: 12px;
}

/* Scrollbar styling */
.messages-area::-webkit-scrollbar,
.notifications-tab::-webkit-scrollbar,
.feedback-tab::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track,
.notifications-tab::-webkit-scrollbar-track,
.feedback-tab::-webkit-scrollbar-track {
  background: var(--theme-bg-middle);
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb,
.notifications-tab::-webkit-scrollbar-thumb,
.feedback-tab::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb:hover,
.notifications-tab::-webkit-scrollbar-thumb:hover,
.feedback-tab::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-placeholder);
}
</style>