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
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
}

.widget-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
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
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 600px;
}

.multi-window.minimized {
  height: 50px;
}

/* Window header */
.window-header {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
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
  background: #4CAF50;
  color: white;
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
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.minimize-btn:hover, .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Tab navigation */
.tab-navigation {
  display: flex;
  background: #e9ecef;
  border-bottom: 1px solid #ced4da;
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
  color: #6c757d;
  transition: all 0.2s;
  position: relative;
}

.tab-btn:hover {
  background: #dee2e6;
  color: #343a40;
}

.tab-btn.active {
  background: white;
  color: #495057;
  border-bottom: 2px solid #6c757d;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  background: #dc3545;
  color: white;
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
  background: #f1f3f4;
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
  color: white;
  flex-shrink: 0;
}

.message:not(.user-message):not(.system-message) .message-avatar {
  background: #6c757d;
}

.message.user-message .message-avatar {
  background: #495057;
}

.message.system-message .message-avatar {
  background: #6c757d;
}

.message-content {
  max-width: 70%;
}

.message-text {
  background: white;
  padding: 10px 15px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

.message.user-message .message-text {
  background: #6c757d;
  color: white;
}

.message.system-message .message-text {
  background: #e9ecef;
  color: #6c757d;
  font-style: italic;
  font-size: 13px;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.message.user-message .message-time {
  text-align: left;
}

.input-area {
  padding: 20px;
  background: white;
  border-top: 1px solid #eee;
}

.input-container {
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.message-input:focus {
  border-color: #6c757d;
}

.send-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.send-btn:hover:not(:disabled) {
  background: #5a6268;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Notifications tab */
.notifications-tab {
  height: 100%;
  overflow-y: auto;
  background: #f1f3f4;
}

.notifications-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #ced4da;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h3 {
  margin: 0;
  color: #495057;
}

.mark-read-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.mark-read-btn:hover {
  background: #5a6268;
}

.notifications-list {
  padding: 10px;
}

.notification-item {
  background: white;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.notification-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  border-left: 4px solid #6c757d;
  background: #f8f9fa;
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
  background: #e2e3e5;
  color: #6c757d;
}

.notification-icon.warning {
  background: #fff3cd;
  color: #856404;
}

.notification-icon.success {
  background: #d1e7dd;
  color: #0f5132;
}

.notification-icon.announcement {
  background: #e2e3e5;
  color: #6c757d;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #212529;
  margin-bottom: 4px;
}

.notification-text {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
}

.notification-time {
  color: #adb5bd;
  font-size: 12px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: #6c757d;
  border-radius: 50%;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* Feedback tab */
.feedback-tab {
  height: 100%;
  overflow-y: auto;
  background: #f1f3f4;
}

.feedback-form {
  background: white;
  padding: 20px;
  border-bottom: 1px solid #ced4da;
}

.feedback-form h3 {
  margin: 0 0 20px 0;
  color: #495057;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-select, .form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #6c757d;
  box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.25);
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
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.submit-btn {
  background: #6c757d;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6268;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.reset-btn {
  background: #6c757d;
  color: white;
}

.reset-btn:hover {
  background: #5a6268;
}

.feedback-history {
  padding: 20px;
}

.feedback-history h4 {
  margin: 0 0 15px 0;
  color: #495057;
}

.feedback-list {
  space-y: 10px;
}

.feedback-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
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
  background: #fff3cd;
  color: #856404;
}

.feedback-status.processing {
  background: #cce5ff;
  color: #004085;
}

.feedback-status.resolved {
  background: #d4edda;
  color: #155724;
}

.feedback-status.closed {
  background: #f8d7da;
  color: #721c24;
}

.feedback-info {
  flex: 1;
}

.feedback-title {
  font-weight: 500;
  color: #212529;
  margin-bottom: 4px;
}

.feedback-time {
  color: #6c757d;
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
  background: #f1f1f1;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb,
.notifications-tab::-webkit-scrollbar-thumb,
.feedback-tab::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.messages-area::-webkit-scrollbar-thumb:hover,
.notifications-tab::-webkit-scrollbar-thumb:hover,
.feedback-tab::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>