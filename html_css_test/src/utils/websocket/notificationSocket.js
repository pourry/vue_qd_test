/**
 * 通知 WebSocket 服务
 * 负责接收后端推送的通知消息
 */

let notificationSocket = null
let reconnectTimer = null
let listeners = new Map()
let isConnecting = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_DELAY = 3000

/**
 * 连接 WebSocket
 */
export function connectNotificationSocket(token) {
  if (!token) {
    console.warn('WebSocket连接失败：缺少token')
    return
  }
  
  if (notificationSocket && notificationSocket.readyState === WebSocket.OPEN) {
    return notificationSocket
  }
  
  if (isConnecting) {
    return
  }
  
  isConnecting = true
  
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = 'localhost:8001'
  const url = protocol + '//' + host + '/ws/chat?token=' + encodeURIComponent(token)
  
  try {
    notificationSocket = new WebSocket(url)
    
    notificationSocket.onopen = () => {
      console.log('通知 WebSocket 连接成功')
      isConnecting = false
      reconnectAttempts = 0
      clearTimeout(reconnectTimer)
      emit('connected', {})
    }
    
    notificationSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch (e) {
        console.error('解析消息失败:', e)
      }
    }
    
    notificationSocket.onclose = (event) => {
      console.log('通知 WebSocket 连接关闭', event.code)
      isConnecting = false
      emit('disconnected', { code: event.code })
      attemptReconnect(token)
    }
    
    notificationSocket.onerror = (error) => {
      console.error('通知 WebSocket 错误:', error)
      isConnecting = false
      emit('error', { error })
    }
  } catch (e) {
    console.error('创建 WebSocket 连接失败:', e)
    isConnecting = false
    attemptReconnect(token)
  }
  
  return notificationSocket
}

/**
 * 尝试重连
 */
function attemptReconnect(token) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn('WebSocket 重连次数已达上限')
    emit('maxReconnectReached', {})
    return
  }
  
  reconnectAttempts++
  const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempts - 1)
  
  reconnectTimer = setTimeout(() => {
    connectNotificationSocket(token)
  }, delay)
}

/**
 * 处理接收到的消息
 */
function handleMessage(message) {
  const { type, data } = message
  
  switch (type) {
    case 'notification':
      emit('notification', data)
      break
    case 'connect':
      emit('connect', data)
      break
    case 'online':
      emit('online', data)
      break
    case 'chat':
      emit('chat', data)
      break
    case 'error':
      emit('error', data)
      break
    default:
      emit('message', message)
  }
}

/**
 * 注册事件监听
 */
export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, new Set())
  }
  listeners.get(event).add(callback)
  
  return () => off(event, callback)
}

/**
 * 取消事件监听
 */
export function off(event, callback) {
  if (listeners.has(event)) {
    if (callback) {
      listeners.get(event).delete(callback)
    } else {
      listeners.delete(event)
    }
  }
}

/**
 * 触发事件
 */
function emit(event, data) {
  if (listeners.has(event)) {
    listeners.get(event).forEach(callback => {
      try {
        callback(data)
      } catch (e) {
        console.error('事件回调执行失败:', e)
      }
    })
  }
}

/**
 * 断开 WebSocket 连接
 */
export function disconnectNotificationSocket() {
  clearTimeout(reconnectTimer)
  reconnectAttempts = 0
  
  if (notificationSocket) {
    notificationSocket.close()
    notificationSocket = null
  }
  
  isConnecting = false
  listeners.clear()
}

/**
 * 获取连接状态
 */
export function getConnectionStatus() {
  if (!notificationSocket) {
    return 'disconnected'
  }
  
  switch (notificationSocket.readyState) {
    case WebSocket.CONNECTING:
      return 'connecting'
    case WebSocket.OPEN:
      return 'connected'
    case WebSocket.CLOSING:
      return 'closing'
    case WebSocket.CLOSED:
      return 'closed'
    default:
      return 'unknown'
  }
}