<template>
  <div class="chat-room">
    <!-- 侧边：在线用户列表 -->
    <div class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">在线用户</span>
        <span class="online-count">({{ onlineUsers.length }})</span>
      </div>
      <div class="online-user-list">
        <div
          v-for="user in onlineUsers"
          :key="user.id"
          class="online-user-item"
        >
          <div class="user-avatar" :style="{ background: user.color }">
            {{ user.nickname?.charAt(0) || '?' }}
          </div>
          <div class="user-detail">
            <span class="user-name">{{ user.nickname }}</span>
            <span class="user-status online">在线</span>
          </div>
        </div>
        <div v-if="onlineUsers.length === 0" class="empty-tip">
          暂无在线用户
        </div>
      </div>
    </div>

    <!-- 主区域：消息显示 + 输入 -->
    <div class="main-area">
      <!-- 断线 / 重连状态条 -->
      <div v-if="wsStatus !== 'connected'" class="ws-banner" :class="wsStatus">
        <span class="ws-banner-text">{{ wsBannerText }}</span>
        <button v-if="wsStatus === 'failed'" class="ws-banner-btn" @click="manualReconnect">重新连接</button>
      </div>

      <!-- 消息显示区域 -->
      <div
        class="message-area"
        ref="messageAreaRef"
        @scroll="handleScroll"
      >
        <!-- 加载更多提示（按钮化，避免误触） -->
        <div class="load-more-wrap">
          <div v-if="loadingMore" class="load-more-tip">加载中...</div>
          <div v-else-if="hasMoreHistory" class="load-more-btn" @click="loadMoreHistory">
            ↑ 加载更多历史消息
          </div>
          <div v-else-if="messageList.length > 0" class="load-more-tip">已经是最早的消息了</div>
        </div>

        <!-- 消息流（已按日期分组 + 连续同用户合并） -->
        <template v-for="(item, idx) in enrichedList" :key="item.key">
          <!-- 日期分隔条 -->
          <div v-if="item.type === 'date'" class="date-divider">
            <span class="date-divider-line"></span>
            <span class="date-divider-text">{{ item.label }}</span>
            <span class="date-divider-line"></span>
          </div>

          <!-- 消息 -->
          <div
            v-else
            class="message-item"
            :class="{
              'self-message': item.msg.isSelf,
              'system-message': item.msg.isSystem,
              'other-message': !item.msg.isSelf && !item.msg.isSystem,
              'failed-message': item.msg.status === 'failed',
              'compact-message': !item.showHeader
            }"
          >
            <!-- 系统消息 -->
            <template v-if="item.msg.isSystem">
              <div class="system-msg-content">
                <span class="system-msg-text">{{ item.msg.content }}</span>
              </div>
            </template>

            <!-- 普通消息 -->
            <template v-else>
              <!-- 头像占位（合并时占位也要保留以对齐） -->
              <div v-if="!item.showHeader && !item.msg.isSelf" class="msg-avatar-placeholder"></div>
              <div
                v-else-if="!item.msg.isSelf"
                class="msg-avatar"
                :style="{ background: item.msg.avatarColor }"
              >
                {{ item.msg.sender?.charAt(0) || '?' }}
              </div>

              <div class="msg-body">
                <!-- 头部（昵称+时间），仅 showHeader 时显示 -->
                <div v-if="item.showHeader" class="msg-meta">
                  <span class="msg-sender">{{ item.msg.sender }}</span>
                  <span class="msg-time">{{ formatTime(item.msg.timestamp) }}</span>
                  <span v-if="item.msg.status === 'sending'" class="msg-status sending">发送中</span>
                  <span v-else-if="item.msg.status === 'failed'" class="msg-status failed">发送失败</span>
                </div>
                <!-- 紧凑模式下（连续消息的最后一条）显示一个轻量时间提示 -->
                <div v-else class="msg-meta-compact">
                  <span v-if="item.msg.status === 'sending'" class="msg-status sending">发送中</span>
                  <span v-else-if="item.msg.status === 'failed'" class="msg-status failed">发送失败</span>
                  <span v-else class="msg-time-hint">{{ formatTime(item.msg.timestamp) }}</span>
                </div>

                <div class="msg-bubble-wrap" :class="{ 'first-in-group': item.showHeader }">
                  <div
                    class="msg-bubble"
                    :class="{
                      'self-bubble': item.msg.isSelf,
                      'failed-bubble': item.msg.status === 'failed',
                      'compact-bubble': !item.showHeader
                    }"
                  >
                    {{ item.msg.content }}
                  </div>
                  <!-- 失败重发按钮 -->
                  <button
                    v-if="item.msg.isSelf && item.msg.status === 'failed'"
                    class="resend-btn"
                    title="重新发送"
                    @click="resendMessage(item.msg)"
                  >↻ 重发</button>
                  <!-- 删除按钮（只能删除已发送成功的自己的消息） -->
                  <span
                    v-else-if="item.msg.isSelf && !item.msg.isDeleted && item.msg.status !== 'sending'"
                    class="delete-btn"
                    title="删除消息"
                    @click="handleDeleteMessage(item.msg)"
                  >×</span>
                </div>
                <!-- 已删除提示 -->
                <div v-if="item.msg.isDeleted" class="deleted-tip">
                  <span>此消息已被删除</span>
                </div>
              </div>

              <div
                v-if="item.msg.isSelf"
                class="msg-avatar self-avatar"
                :style="{ background: item.msg.avatarColor }"
              >
                {{ item.msg.sender?.charAt(0) || '我' }}
              </div>
            </template>
          </div>
        </template>

        <div v-if="messageList.length === 0" class="empty-tip center">
          暂无消息，快来发送第一条消息吧
        </div>

        <!-- "X 条新消息"浮层（仅在用户离开底部时显示） -->
        <transition name="fade-up">
          <div
            v-if="newMessageCount > 0 && !atBottom"
            class="new-msg-indicator"
            @click="scrollToBottomAndClear"
          >
            <span>{{ newMessageCount }} 条新消息</span>
            <span class="arrow">↓</span>
          </div>
        </transition>

        <!-- "回到顶部"按钮（用户翻阅历史、消息很长时快速回到最旧） -->
        <transition name="fade-up">
          <div
            v-if="!atTop && messageList.length > 30"
            class="back-to-top"
            @click="scrollToTop"
            title="回到最早消息"
          >
            <span class="arrow">↑</span>
            <span>顶部</span>
          </div>
        </transition>
      </div>

      <!-- 消息输入区域 -->
      <div class="input-area">
        <textarea
          v-model="inputMessage"
          class="message-input"
          placeholder="输入消息，按 Enter 发送，Shift + Enter 换行"
          rows="2"
          :disabled="sending"
          @keydown.enter.exact.prevent="handleSend"
        />
        <div class="input-actions">
          <span class="char-count" :class="{ 'over-limit': inputMessage.length > maxLength }">
            {{ inputMessage.length }}/{{ maxLength }}
          </span>
          <span v-if="cooldownLeft > 0" class="cooldown-tip">{{ cooldownLeft }}s 后可再发</span>
          <span v-else-if="!wsConnected" class="ws-status offline">连接断开，消息将通过HTTP发送</span>
          <button
            class="send-btn"
            :disabled="!canSend || sending"
            @click="handleSend"
          >
            {{ sending ? '发送中' : '发送' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useStore } from 'vuex'
import messageCenterApi from '@/api/messageCenter'
import { ElMessage, ElMessageBox } from 'element-plus'

/** 在线用户接口 */
interface OnlineUser {
  id: string | number
  nickname: string
  color: string
}

/** 消息状态 */
type MessageStatus = 'sending' | 'sent' | 'failed'

/** 聊天消息接口 */
interface ChatMessage {
  id: string | number
  sender: string
  content: string
  timestamp: string
  isSelf: boolean
  isSystem: boolean
  isDeleted?: boolean
  avatarColor: string
  status?: MessageStatus
  clientMessageId?: string
  /** 解析后的 Date 时间戳（缓存，避免重复 new Date） */
  _ts?: number
  /** 解析后的 YYYY-MM-DD（用于日期分组） */
  _dayKey?: string
}

/** 富化后的列表项：可能是日期分隔条或消息 */
type EnrichedItem =
  | { type: 'date'; key: string; label: string }
  | { type: 'msg'; key: string; msg: ChatMessage; showHeader: boolean }

const store = useStore()

/** 最大消息长度（与后端同步） */
const maxLength = 500

/** 在线用户列表 */
const onlineUsers = ref<OnlineUser[]>([])

/** 消息列表（按时间升序，UI 直接用） */
const messageList = ref<ChatMessage[]>([])

/** 消息索引（O(1) 去重 & 更新） */
const messageMap = reactive(new Map<string, ChatMessage>())

/** 历史消息分页大小 */
const PAGE_SIZE = 50

/** 已加载的最早消息ID（用于分页） */
const oldestLoadedId = ref<number | null>(null)

/** 是否还有更多历史消息 */
const hasMoreHistory = ref(false)

/** 是否正在加载更多 */
const loadingMore = ref(false)

/** 输入框内容 */
const inputMessage = ref<string>('')

/** 是否正在发送（防止重复点击） */
const sending = ref(false)

/** 发送冷却（秒），避免连点 */
const cooldownLeft = ref(0)
let cooldownTimer: number | null = null

/** 消息区域引用 */
const messageAreaRef = ref<HTMLElement | null>(null)

/** 当前用户信息 */
const currentUser = computed(() => store.getters.getUserInfo || {})

/** 头像颜色池（稳定映射，避免每次刷新颜色乱跳） */
const avatarColors = [
  '#0082F4', '#52c41a', '#faad14', '#eb2f96',
  '#722ed1', '#13c2c2', '#fa541c', '#818cf8'
]

/** WebSocket 连接 */
const wsRef = ref<WebSocket | null>(null)
const wsStatus = ref<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting')
const wsConnected = computed(() => wsStatus.value === 'connected')
let reconnectAttempts = 0
const MAX_RECONNECT = 10
let reconnectTimer: number | null = null
let heartbeatTimer: number | null = null
let destroyed = false

/** 用户是否在底部（容差 30px） */
const atBottom = ref(true)

/** 用户是否在顶部（容差 30px） */
const atTop = ref(true)

/** 离开底部期间收到的新消息数（用于底部浮层） */
const newMessageCount = ref(0)

/** 连续同用户合并的间隔阈值（毫秒），默认 5 分钟 */
const MERGE_INTERVAL_MS = 5 * 60 * 1000

/** 解析时间戳为 number + YYYY-MM-DD */
const parseTs = (msg: ChatMessage): { ts: number; dayKey: string } => {
  if (msg._ts !== undefined && msg._dayKey !== undefined) {
    return { ts: msg._ts, dayKey: msg._dayKey }
  }
  let ts = 0
  if (msg.timestamp) {
    const normalized = msg.timestamp.includes('T') ? msg.timestamp : msg.timestamp.replace(' ', 'T')
    const d = new Date(normalized)
    if (!Number.isNaN(d.getTime())) ts = d.getTime()
  }
  const d = new Date(ts)
  const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  msg._ts = ts
  msg._dayKey = dayKey
  return { ts, dayKey }
}

/** 把日期 key 转成显示文字（今天 / 昨天 / 具体日期） */
const toDateLabel = (dayKey: string, ts: number): string => {
  const d = new Date(ts)
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const yestMs = today.getTime() - 86400000
  const yest = new Date(yestMs)
  const yestKey = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`
  if (dayKey === todayKey) {
    return `今天 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  if (dayKey === yestKey) {
    return `昨天 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  // 今年的只显示 MM-DD，否则显示完整日期
  if (d.getFullYear() === today.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 富化后的消息列表：插入日期分隔条 + 给每条消息打上"是否显示头部"标记。
 * 这样渲染时不再是一坨，而是按日期分块、相邻同用户合并。
 */
const enrichedList = computed<EnrichedItem[]>(() => {
  const result: EnrichedItem[] = []
  const list = messageList.value
  if (list.length === 0) return result

  let prevDayKey: string | null = null
  let prevMsg: ChatMessage | null = null
  for (let i = 0; i < list.length; i++) {
    const msg = list[i]
    if (msg.isSystem) {
      // 系统消息自带样式，不需要合并、也不需要日期分组
      result.push({ type: 'msg', key: `m-${msg.id}`, msg, showHeader: true })
      prevMsg = null
      // 系统消息不参与日期分组（它会自己显示）
      continue
    }
    const { ts, dayKey } = parseTs(msg)
    // 跨天了插入日期分隔
    if (dayKey !== prevDayKey) {
      result.push({ type: 'date', key: `d-${dayKey}`, label: toDateLabel(dayKey, ts) })
      prevDayKey = dayKey
      prevMsg = null
    }
    // 决定是否显示头部：上一条非空、是同一人、时间间隔 < 5 分钟 → 合并
    const canMerge = !!prevMsg
      && !prevMsg.isSystem
      && !msg.isSystem
      && prevMsg.isSelf === msg.isSelf
      && String(prevMsg.sender) === String(msg.sender)
      && prevMsg._ts !== undefined
      && (ts - (prevMsg._ts || 0)) < MERGE_INTERVAL_MS
    const showHeader = !canMerge
    result.push({ type: 'msg', key: `m-${msg.id}`, msg, showHeader })
    prevMsg = msg
  }
  return result
})

/** WebSocket 状态条文案 */
const wsBannerText = computed(() => {
  switch (wsStatus.value) {
    case 'connecting':
      return '正在连接聊天室…'
    case 'disconnected':
      return `连接已断开，正在重连（${reconnectAttempts}/${MAX_RECONNECT}）…`
    case 'failed':
      return '连接失败，请检查网络或点击重新连接'
    default:
      return ''
  }
})

/** 判断是否可以发送 */
const canSend = computed<boolean>(() => {
  if (sending.value) return false
  if (cooldownLeft.value > 0) return false
  const v = inputMessage.value
  return v.trim().length > 0 && v.length <= maxLength
})

/** 格式化时间 */
const formatTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const normalized = timestamp.includes('T') ? timestamp : timestamp.replace(' ', 'T')
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/** 滚动到底部（带"用户是否在底部"判断） */
const scrollToBottom = (force = false): void => {
  nextTick(() => {
    if (!messageAreaRef.value) return
    if (force || atBottom.value) {
      messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight
      newMessageCount.value = 0
    }
  })
}

/** 强制滚到底部并清除未读计数（用于"X 条新消息"点击） */
const scrollToBottomAndClear = (): void => {
  if (!messageAreaRef.value) return
  messageAreaRef.value.scrollTop = messageAreaRef.value.scrollHeight
  atBottom.value = true
  newMessageCount.value = 0
}

/** 根据用户ID/昵称稳定生成颜色 */
const getColorByKey = (key: string | number): string => {
  const str = String(key ?? '')
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return avatarColors[hash % avatarColors.length]
}

const isSameUser = (a: any, b: any): boolean => String(a ?? '') === String(b ?? '')

/** 推送系统消息 */
const pushSystemMessage = (content: string): void => {
  const id = `system-${Date.now()}-${Math.random().toString(16).slice(2)}`
  if (messageMap.has(id)) return
  const msg: ChatMessage = {
    id,
    sender: '系统',
    content,
    timestamp: new Date().toISOString(),
    isSelf: false,
    isSystem: true,
    avatarColor: 'transparent'
  }
  parseTs(msg)
  messageMap.set(id, msg)
  messageList.value.push(msg)
  scrollToBottom()
}

/** 处理滚动事件，更新"是否在底部"和加载更多 */
const handleScroll = (): void => {
  const el = messageAreaRef.value
  if (!el) return
  const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight
  atBottom.value = distanceToBottom <= 30
  atTop.value = el.scrollTop <= 30
  if (atBottom.value) {
    newMessageCount.value = 0
  }
}

/** 回到顶部（最早消息） */
const scrollToTop = (): void => {
  if (!messageAreaRef.value) return
  messageAreaRef.value.scrollTo({ top: 0, behavior: 'smooth' })
}

/** 加载更多历史消息 */
const loadMoreHistory = async (): Promise<void> => {
  if (loadingMore.value || !hasMoreHistory.value) return

  loadingMore.value = true
  try {
    const params: any = { limit: PAGE_SIZE }
    if (oldestLoadedId.value !== null) {
      params.lastId = oldestLoadedId.value
    }

    const res: any = await messageCenterApi.getChatMessagesByPage(params)
    if (res?.code === 200 && res?.resultValue) {
      const { list, hasMore, lastId } = res.resultValue

      // 保存当前滚动位置
      const prevScrollHeight = messageAreaRef.value?.scrollHeight || 0
      const prevScrollTop = messageAreaRef.value?.scrollTop || 0

      // 转换数据并添加到列表开头
      const newMessages: ChatMessage[] = []
      for (const item of (list || [])) {
        const idStr = String(item.id)
        if (messageMap.has(idStr)) continue
        const msg: ChatMessage = {
          id: item.id,
          sender: item.senderName || '匿名',
          content: item.content || '',
          timestamp: item.createTime || new Date().toISOString(),
          isSelf: isSameUser(item.senderId, currentUser.value?.id),
          isSystem: item.type === 'system',
          avatarColor: getColorByKey(item.senderId ?? item.senderName),
          status: 'sent'
        }
        parseTs(msg)
        messageMap.set(idStr, msg)
        newMessages.push(msg)
      }

      // 保持滚动位置
      messageList.value = [...newMessages, ...messageList.value]

      // 更新分页状态
      hasMoreHistory.value = hasMore
      if (lastId !== null && lastId !== undefined) {
        oldestLoadedId.value = lastId
      }

      // 调整滚动条：保持当前视口内容不动
      nextTick(() => {
        if (messageAreaRef.value) {
          const newScrollHeight = messageAreaRef.value.scrollHeight
          const delta = newScrollHeight - prevScrollHeight
          messageAreaRef.value.scrollTop = prevScrollTop + delta
        }
      })
    }
  } catch (e) {
    console.warn('加载历史消息失败:', e)
    ElMessage.warning('加载历史消息失败')
  } finally {
    loadingMore.value = false
  }
}

/** 加载在线用户列表 */
const loadOnlineUsers = async (): Promise<void> => {
  try {
    const res: any = await (messageCenterApi.getRealOnlineUsers
      ? messageCenterApi.getRealOnlineUsers()
      : messageCenterApi.getOnlineUsers())
    if (res?.code === 200 && Array.isArray(res.resultValue)) {
      applyOnlineUsers(res.resultValue)
    }
  } catch (e) {
    console.warn('获取在线用户失败:', e)
    onlineUsers.value = []
  }
}

/** 加载历史消息（初始化时加载最新的消息） */
const loadMessages = async (): Promise<void> => {
  try {
    const res: any = await messageCenterApi.getChatMessagesByPage({ limit: PAGE_SIZE })
    if (res?.code === 200 && res?.resultValue) {
      const { list, hasMore, lastId } = res.resultValue

      // 清空旧状态
      messageList.value = []
      messageMap.clear()

      for (const item of (list || [])) {
        const idStr = String(item.id)
        const msg: ChatMessage = {
          id: item.id,
          sender: item.senderName || '匿名',
          content: item.content || '',
          timestamp: item.createTime || new Date().toISOString(),
          isSelf: isSameUser(item.senderId, currentUser.value?.id),
          isSystem: item.type === 'system',
          avatarColor: getColorByKey(item.senderId ?? item.senderName),
          status: 'sent'
        }
        parseTs(msg)
        messageMap.set(idStr, msg)
        messageList.value.push(msg)
      }

      hasMoreHistory.value = hasMore
      if (lastId !== null && lastId !== undefined) {
        oldestLoadedId.value = lastId
      }
      scrollToBottom(true)
    } else {
      messageList.value = []
      hasMoreHistory.value = false
    }
  } catch (e) {
    console.warn('获取聊天消息失败:', e)
    messageList.value = []
    hasMoreHistory.value = false
    pushSystemMessage('欢迎来到聊天室，请文明交流！')
  }
}

/** 删除消息 */
const handleDeleteMessage = async (msg: ChatMessage): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条消息吗？删除后将无法恢复。',
      '删除确认',
      { confirmButtonText: '确定删除', cancelButtonText: '取消', type: 'warning' }
    )

    const res: any = await messageCenterApi.deleteChatMessage(msg.id)
    if (res?.code === 200) {
      msg.isDeleted = true
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res?.resultValue || '删除失败')
    }
  } catch (e) {
    // 用户取消
  }
}

/** 构建 WebSocket 地址 */
const buildWsUrl = (): string => {
  const token = localStorage.getItem('Authorization') || ''
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}/api/ws/chat?token=${encodeURIComponent(token)}`
}

const stopTimers = (): void => {
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (heartbeatTimer) {
    window.clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
  if (cooldownTimer) {
    window.clearInterval(cooldownTimer)
    cooldownTimer = null
  }
}

const sendWs = (payload: any): boolean => {
  if (wsRef.value && wsRef.value.readyState === WebSocket.OPEN) {
    try {
      wsRef.value.send(JSON.stringify(payload))
      return true
    } catch (e) {
      console.warn('WebSocket send error:', e)
    }
  }
  return false
}

const startHeartbeat = (): void => {
  if (heartbeatTimer) window.clearInterval(heartbeatTimer)
  heartbeatTimer = window.setInterval(() => {
    sendWs({ type: 'heartbeat', messageId: `hb-${Date.now()}`, data: {} })
  }, 30000)
}

const scheduleReconnect = (): void => {
  if (destroyed) return
  if (reconnectTimer) return
  if (reconnectAttempts >= MAX_RECONNECT) {
    wsStatus.value = 'failed'
    return
  }
  reconnectAttempts++
  const delay = Math.min(30000, 1000 * Math.pow(2, Math.min(reconnectAttempts - 1, 5)))
  wsStatus.value = 'disconnected'
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = null
    if (destroyed) return
    connectWebSocket()
  }, delay)
}

const manualReconnect = (): void => {
  reconnectAttempts = 0
  if (reconnectTimer) {
    window.clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  connectWebSocket()
}

const applyOnlineUsers = (list: any[]): void => {
  if (!Array.isArray(list)) return
  onlineUsers.value = list.map((item: any) => ({
    id: item.id,
    nickname: item.nickname || item.username || '用户',
    color: getColorByKey(item.id ?? item.nickname ?? item.username)
  }))
}

const appendIncomingChat = (data: any): void => {
  if (!data) return
  const incomingId = String(data.id ?? `srv-${Date.now()}`)

  // O(1) 去重
  if (messageMap.has(incomingId)) return

  const self = isSameUser(data.senderId, currentUser.value?.id)
  const msg: ChatMessage = {
    id: incomingId,
    sender: data.senderName || '匿名',
    content: data.content || '',
    timestamp: data.createTime || new Date().toISOString(),
    isSelf: self,
    isSystem: data.type === 'system',
    avatarColor: getColorByKey(data.senderId ?? data.senderName),
    status: 'sent'
  }
  parseTs(msg)
  messageMap.set(incomingId, msg)
  messageList.value.push(msg)

  if (atBottom.value) {
    scrollToBottom(true)
  } else {
    newMessageCount.value++
  }
}

const replaceOptimisticMessage = (clientId: string, serverId: string | number, data: any): void => {
  const old = messageMap.get(clientId)
  if (old) {
    messageMap.delete(clientId)
    const newMsg: ChatMessage = {
      ...old,
      id: serverId,
      timestamp: data.createTime || old.timestamp,
      status: 'sent'
    }
    parseTs(newMsg)
    messageMap.set(String(serverId), newMsg)
    if (atBottom.value) {
      scrollToBottom(true)
    }
  }
}

const handleMessageDeleted = (data: any): void => {
  if (!data?.messageId) return
  const idStr = String(data.messageId)
  const m = messageMap.get(idStr)
  if (m) {
    m.isDeleted = true
  }
}

const connectWebSocket = (): void => {
  if (destroyed) return
  const token = localStorage.getItem('Authorization')
  if (!token) {
    wsStatus.value = 'failed'
    return
  }

  if (wsRef.value && (wsRef.value.readyState === WebSocket.OPEN || wsRef.value.readyState === WebSocket.CONNECTING)) {
    return
  }

  wsStatus.value = 'connecting'
  try {
    const ws = new WebSocket(buildWsUrl())
    wsRef.value = ws

    ws.onopen = () => {
      wsStatus.value = 'connected'
      reconnectAttempts = 0
      startHeartbeat()
    }

    ws.onmessage = (evt: MessageEvent) => {
      try {
        const payload = JSON.parse(evt.data)
        const type = payload?.type
        const data = payload?.data

        switch (type) {
          case 'connect':
            applyOnlineUsers(data?.onlineUsers)
            break
          case 'online':
            applyOnlineUsers(data?.onlineUsers)
            break
          case 'offline':
            applyOnlineUsers(data?.onlineUsers)
            break
          case 'chat':
            appendIncomingChat(data)
            break
          case 'messageDeleted':
            handleMessageDeleted(data)
            break
          case 'ack': {
            const mid = data?.messageId
            const sid = data?.serverMessageId
            if (mid && sid) {
              replaceOptimisticMessage(String(mid), sid, data)
            }
            break
          }
          case 'error':
            ElMessage.error(data?.message || '聊天室发生错误')
            break
          default:
            break
        }
      } catch (e) {
        console.warn('解析WebSocket消息失败:', e)
      }
    }

    ws.onclose = () => {
      wsStatus.value = 'disconnected'
      stopHeartbeatOnly()
      scheduleReconnect()
    }

    ws.onerror = () => {
      wsStatus.value = 'disconnected'
    }
  } catch (e) {
    console.warn('WebSocket连接失败:', e)
    wsStatus.value = 'disconnected'
    scheduleReconnect()
  }
}

const stopHeartbeatOnly = (): void => {
  if (heartbeatTimer) {
    window.clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

const startCooldown = (seconds = 1): void => {
  cooldownLeft.value = seconds
  if (cooldownTimer) window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldownLeft.value--
    if (cooldownLeft.value <= 0) {
      window.clearInterval(cooldownTimer!)
      cooldownTimer = null
    }
  }, 1000)
}

const markFailed = (clientId: string): void => {
  const m = messageMap.get(clientId)
  if (m) {
    m.status = 'failed'
  }
}

const doSend = async (clientId: string, content: string): Promise<void> => {
  if (sendWs({ type: 'chat', messageId: clientId, data: { content, messageType: 'text' } })) {
    return
  }
  try {
    const res: any = await messageCenterApi.sendChatMessage({ content })
    if (res?.code === 200 && res?.resultValue?.id) {
      replaceOptimisticMessage(clientId, res.resultValue.id, res.resultValue)
    } else {
      markFailed(clientId)
      ElMessage.warning(res?.resultValue || res?.msg || '消息发送失败，请重试')
    }
  } catch (e) {
    console.warn('发送消息失败:', e)
    markFailed(clientId)
    ElMessage.warning('消息发送失败，请检查网络后重试')
  }
}

const handleSend = async (): Promise<void> => {
  if (!canSend.value) return

  const content = inputMessage.value.trim()
  const clientMessageId = `c-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const selfMsg: ChatMessage = {
    id: clientMessageId,
    sender: currentUser.value?.nickName || currentUser.value?.username || '我',
    content,
    timestamp: new Date().toISOString(),
    isSelf: true,
    isSystem: false,
    avatarColor: getColorByKey(currentUser.value?.id ?? 'self'),
    status: 'sending',
    clientMessageId
  }
  parseTs(selfMsg)

  messageMap.set(clientMessageId, selfMsg)
  messageList.value.push(selfMsg)
  inputMessage.value = ''
  scrollToBottom(true)

  sending.value = true
  try {
    await doSend(clientMessageId, content)
  } finally {
    sending.value = false
    startCooldown(1)
  }
}

const resendMessage = async (msg: ChatMessage): Promise<void> => {
  if (sending.value) return
  msg.status = 'sending'
  sending.value = true
  try {
    if (msg.clientMessageId) {
      await doSend(msg.clientMessageId, msg.content)
    } else {
      await doSend(String(msg.id), msg.content)
    }
  } finally {
    sending.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadOnlineUsers(), loadMessages()])
  connectWebSocket()
})

onBeforeUnmount(() => {
  destroyed = true
  stopTimers()
  try {
    wsRef.value?.close()
  } catch (e) {
    // ignore
  } finally {
    wsRef.value = null
  }
})
</script>

<style scoped>
/* ============== 根容器：flex 嵌套关键 ============== */
/* 关键：所有 flex item 都要 min-height: 0，否则 message-area 会按内容撑开，
   撑爆 main-area，导致整个 main-area 可滚动、输入框被推到屏幕外 */
.chat-room {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.sidebar {
  width: 220px;
  background: var(--theme-bg-card);
  border-right: 1px solid var(--theme-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: var(--theme-spacing-md);
  border-bottom: 1px solid var(--theme-border-light);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.online-count {
  font-size: 12px;
  color: var(--theme-text-secondary);
}

.online-user-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--theme-spacing-sm);
}

.online-user-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--theme-radius-md);
  transition: background 0.2s;
}

.online-user-item:hover {
  background: var(--theme-bg-hover);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-light);
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-detail {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-size: 13px;
  color: var(--theme-text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  font-size: 11px;
  color: var(--theme-success);
}

.main-area {
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--theme-bg-middle);
  position: relative;
}

.ws-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 6px 16px;
  font-size: 12px;
  flex-shrink: 0;
  background: var(--theme-warning-bg, #fffbe6);
  color: var(--theme-warning, #faad14);
  border-bottom: 1px solid var(--theme-warning-border, #ffe58f);
}
.ws-banner.failed {
  background: var(--theme-error-bg, #fff2f0);
  color: var(--theme-error, #ff4d4f);
  border-bottom-color: var(--theme-error-border, #ffccc7);
}
.ws-banner-btn {
  background: transparent;
  border: 1px solid currentColor;
  color: inherit;
  font-size: 12px;
  padding: 2px 10px;
  border-radius: var(--theme-radius-sm, 4px);
  cursor: pointer;
}
.ws-banner-btn:hover {
  background: rgba(255, 77, 79, 0.08);
}

.message-area {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--theme-spacing-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  /* 内容多时给 input-area 区域留出一点视觉间距 */
  padding-bottom: 16px;
  scroll-behavior: smooth;
}

.load-more-wrap {
  display: flex;
  justify-content: center;
  min-height: 32px;
  align-items: center;
}
.load-more-tip,
.load-more-btn {
  text-align: center;
  padding: 8px 16px;
  font-size: 12px;
  color: var(--theme-text-secondary);
}
.load-more-btn {
  cursor: pointer;
  color: var(--theme-primary);
  transition: color 0.2s;
  user-select: none;
}
.load-more-btn:hover {
  color: var(--theme-primary-dark);
  text-decoration: underline;
}

/* ============== 日期分隔条 ============== */
.date-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0 8px;
  flex-shrink: 0;
}
.date-divider-line {
  flex: 1;
  height: 1px;
  background: var(--theme-border-light, #e5e7eb);
  opacity: 0.6;
}
.date-divider-text {
  font-size: 12px;
  color: var(--theme-text-placeholder);
  font-weight: 500;
  padding: 2px 10px;
  background: var(--theme-bg-middle);
  border-radius: 10px;
  flex-shrink: 0;
}

/* ============== 消息项 ============== */
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 100%;
  margin-top: 8px;
}
.message-item.compact-message {
  margin-top: 2px;
}
.message-item.self-message {
  flex-direction: row-reverse;
}
.message-item.system-message {
  justify-content: center;
  margin-top: 4px;
}

.system-msg-content {
  max-width: 80%;
}
.system-msg-text {
  display: inline-block;
  padding: 6px 16px;
  background: var(--theme-primary-bg);
  color: var(--theme-text-secondary);
  font-size: 12px;
  border-radius: var(--theme-radius-lg);
  text-align: center;
  font-style: italic;
}

/* 头像 + 占位（合并消息的占位） */
.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-light);
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.msg-avatar-placeholder {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.msg-body {
  display: flex;
  flex-direction: column;
  max-width: 65%;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.self-message .msg-meta {
  flex-direction: row-reverse;
}
.msg-sender {
  font-size: 12px;
  font-weight: 500;
  color: var(--theme-text-regular);
}
.msg-time {
  font-size: 11px;
  color: var(--theme-text-placeholder);
}

/* 紧凑模式下的元信息（右侧小时间） */
.msg-meta-compact {
  display: flex;
  align-items: center;
  height: 14px;
  margin-bottom: 2px;
  justify-content: flex-end;
}
.self-message .msg-meta-compact {
  justify-content: flex-start;
}
.msg-time-hint {
  font-size: 10px;
  color: var(--theme-text-placeholder);
  opacity: 0;
  transition: opacity 0.2s;
}
.compact-message:hover .msg-time-hint {
  opacity: 0.8;
}

.msg-status {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 8px;
}
.msg-status.sending {
  color: var(--theme-text-secondary);
  background: var(--theme-bg-hover);
}
.msg-status.failed {
  color: var(--theme-error, #ff4d4f);
  background: var(--theme-error-bg, #fff2f0);
}

.msg-bubble-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
}
.self-message .msg-bubble-wrap {
  flex-direction: row-reverse;
}

.msg-bubble {
  display: inline-block;
  padding: 10px 14px;
  background: var(--theme-bg-card);
  color: var(--theme-text-primary);
  border-radius: var(--theme-radius-lg);
  box-shadow: var(--theme-shadow-xs);
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.5;
  font-size: 14px;
  max-width: 100%;
}
.msg-bubble.compact-bubble {
  /* 紧凑模式：圆角改小一点，与上一条视觉相连 */
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.self-message .msg-bubble.compact-bubble {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.msg-bubble.self-bubble {
  background: var(--theme-primary);
  color: var(--theme-text-light);
}
.msg-bubble.failed-bubble {
  background: var(--theme-error-bg, #fff2f0);
  color: var(--theme-error, #ff4d4f);
  border: 1px dashed var(--theme-error, #ff4d4f);
}

.delete-btn {
  display: none;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  background: var(--theme-text-placeholder);
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.msg-bubble-wrap:hover .delete-btn {
  display: inline-block;
}
.delete-btn:hover {
  background: var(--theme-error, #ff4d4f);
}

.resend-btn {
  font-size: 12px;
  padding: 2px 8px;
  border: 1px solid var(--theme-error, #ff4d4f);
  background: transparent;
  color: var(--theme-error, #ff4d4f);
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
}
.resend-btn:hover {
  background: var(--theme-error, #ff4d4f);
  color: white;
}

.deleted-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--theme-text-placeholder);
  font-style: italic;
}

.input-area {
  background: var(--theme-bg-card);
  border-top: 1px solid var(--theme-border);
  padding: var(--theme-spacing-md);
  padding-bottom: calc(var(--theme-spacing-md) + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  /* 向上阴影：消息区滚到底时最后几条消息有"被输入区盖住"的视觉 */
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

.message-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-bg-middle);
  color: var(--theme-text-primary);
  font-size: 14px;
  resize: none;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.message-input:focus {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 2px var(--theme-primary-bg);
}
.message-input:disabled {
  background: var(--theme-bg-hover);
  cursor: not-allowed;
  opacity: 0.7;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  font-size: 12px;
  color: var(--theme-text-placeholder);
}
.char-count.over-limit {
  color: var(--theme-error, #ff4d4f);
  font-weight: 600;
}

.cooldown-tip {
  font-size: 12px;
  color: var(--theme-warning, #faad14);
  margin-right: 8px;
}

.ws-status {
  font-size: 12px;
  color: var(--theme-warning, #faad14);
  margin-right: 8px;
}

.send-btn {
  padding: 8px 24px;
  background: var(--theme-primary);
  color: var(--theme-text-light);
  border: none;
  border-radius: var(--theme-radius-md);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn:hover:not(:disabled) {
  background: var(--theme-primary-dark);
}
.send-btn:disabled {
  background: var(--theme-text-placeholder);
  cursor: not-allowed;
}

.empty-tip {
  text-align: center;
  color: var(--theme-text-placeholder);
  font-size: 13px;
  padding: 20px;
}
.empty-tip.center {
  margin: auto;
}

.new-msg-indicator {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--theme-primary);
  color: var(--theme-text-light);
  font-size: 12px;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  user-select: none;
  transition: background 0.2s, transform 0.2s;
}
.new-msg-indicator:hover {
  background: var(--theme-primary-dark);
}
.new-msg-indicator .arrow {
  font-size: 14px;
}

/* "回到顶部"按钮：在用户离开顶部时显示（消息长时使用） */
.back-to-top {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: var(--theme-bg-card);
  color: var(--theme-text-regular);
  font-size: 12px;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--theme-border-light);
  z-index: 10;
  user-select: none;
  transition: all 0.2s;
}
.back-to-top:hover {
  background: var(--theme-primary-bg);
  color: var(--theme-primary);
  border-color: var(--theme-primary);
}
.back-to-top .arrow {
  font-size: 14px;
  font-weight: 600;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 10px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.message-area::-webkit-scrollbar,
.online-user-list::-webkit-scrollbar {
  width: 6px;
}
.message-area::-webkit-scrollbar-track,
.online-user-list::-webkit-scrollbar-track {
  background: transparent;
}
.message-area::-webkit-scrollbar-thumb,
.online-user-list::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: 3px;
}
.message-area::-webkit-scrollbar-thumb:hover,
.online-user-list::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-placeholder);
}

/* ============== 响应式：小屏隐藏侧边栏，给聊天区更多空间 ============== */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  .msg-body {
    max-width: 80%;
  }
  .input-area {
    padding: 10px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
  }
  .message-input {
    padding: 8px 10px;
  }
  .send-btn {
    padding: 6px 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .msg-body {
    max-width: 88%;
  }
  .msg-avatar {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }
  .msg-bubble {
    padding: 8px 10px;
    font-size: 13px;
  }
  .back-to-top {
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    font-size: 11px;
  }
}
</style>
