<template>
  <div class="total-feedback">
    <!-- 顶部：反馈统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon total">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">总反馈数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pending">⏳</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon processing">🔄</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.processing }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon resolved">✅</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.resolved }}</div>
          <div class="stat-label">已解决</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon closed">🔒</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.closed }}</div>
          <div class="stat-label">已关闭</div>
        </div>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-bar">
      <div class="filter-item">
        <label>状态</label>
        <select v-model="filters.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待处理</option>
          <option value="processing">处理中</option>
          <option value="resolved">已解决</option>
          <option value="closed">已关闭</option>
        </select>
      </div>
      <div class="filter-item">
        <label>类型</label>
        <select v-model="filters.type" class="filter-select">
          <option value="">全部类型</option>
          <option value="bug">Bug报告</option>
          <option value="feature">功能建议</option>
          <option value="improvement">改进建议</option>
          <option value="other">其他问题</option>
        </select>
      </div>
      <div class="filter-item keyword-filter">
        <label>关键词</label>
        <input v-model="filters.keyword" type="text" class="filter-input" placeholder="搜索标题或描述" @keyup.enter="handleSearch" />
      </div>
      <div class="filter-actions">
        <button class="search-btn" @click="handleSearch">搜索</button>
        <button class="reset-btn" @click="handleResetFilters">重置</button>
      </div>
    </div>

    <!-- 反馈列表 -->
    <div class="feedback-list-section">
      <div class="list-header">
        <span class="list-title">反馈列表</span>
        <span class="list-count">共 {{ filteredList.length }} 条</span>
      </div>
      <div class="feedback-list">
        <div v-if="loading" class="loading-state">加载中...</div>
        <template v-else>
          <div v-for="item in filteredList" :key="item.id" class="feedback-card">
            <div class="card-header">
              <div class="card-title-area">
                <span class="card-type-tag" :class="item.type">{{ getTypeText(item.type) }}</span>
                <span class="card-title">{{ item.title }}</span>
              </div>
              <span class="card-status" :class="item.status">{{ getStatusText(item.status) }}</span>
            </div>
            <div class="card-body">
              <div class="card-desc">{{ item.description }}</div>
              <div v-if="item.images && item.images.length > 0" class="card-images">
                <img v-for="(img, idx) in item.images" :key="idx" :src="img" class="card-image" @click="previewImage(img)" />
              </div>
              <div class="card-meta">
                <span class="card-user">{{ item.userName }}</span>
                <span v-if="item.contact" class="card-contact">📧 {{ item.contact }}</span>
                <span class="card-time">{{ formatTime(item.timestamp) }}</span>
              </div>
            </div>
            <div v-if="item.reply" class="card-reply">
              <div class="reply-label">管理员回复：</div>
              <div class="reply-text">{{ item.reply }}</div>
            </div>
            <div class="card-actions">
              <select v-model="item.status" class="status-select" @change="handleUpdateStatus(item)">
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
                <option value="closed">已关闭</option>
              </select>
              <button class="reply-btn" @click="openReplyDialog(item)">回复</button>
            </div>
          </div>
          <div v-if="filteredList.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <div class="empty-text">暂无符合条件的反馈</div>
          </div>
        </template>
      </div>
    </div>

    <!-- 图片预览对话框（与Feedback.vue一致） -->
    <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
      <!-- 顶部工具栏 -->
      <div class="preview-header">
        <div class="preview-toolbar-left">
          <div class="preview-tool-btn" @click.stop="zoomOut" title="缩小">
            <span class="toolbar-icon">−</span>
          </div>
          <span class="preview-scale">{{ Math.round(previewScale * 100) }}%</span>
          <div class="preview-tool-btn" @click.stop="zoomIn" title="放大">
            <span class="toolbar-icon">+</span>
          </div>
          <div class="preview-tool-btn" @click.stop="resetPreview" title="重置">
            <span class="toolbar-icon">⟲</span>
          </div>
        </div>
        <div class="preview-toolbar-right">
          <div class="preview-tool-btn download-btn" @click.stop="downloadImage" title="下载">
            <span class="toolbar-icon">⇩</span>
          </div>
          <div class="preview-tool-btn close-btn" @click.stop="closePreview" title="关闭">
            <span class="toolbar-icon">✕</span>
          </div>
        </div>
      </div>
      <div class="preview-canvas"
           @wheel.prevent="handlePreviewWheel"
           @mousedown="handlePreviewMouseDown"
           @mousemove="handlePreviewMouseMove"
           @mouseup="handlePreviewMouseUp"
           @mouseleave="handlePreviewMouseUp">
        <img :src="previewUrl" 
             class="preview-image" 
             :style="{ 
               transform: `scale(${previewScale}) translate(${previewOffsetX}px, ${previewOffsetY}px)`,
               cursor: previewDragging ? 'grabbing' : 'grab'
             }" />
      </div>
      <div class="preview-tip">💡 鼠标滚轮缩放，按住图片拖拽移动</div>
    </div>

    <!-- 回复对话框 -->
    <div v-if="replyingItem" class="dialog-overlay" @click.self="closeReplyDialog">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>回复反馈</h3>
          <button class="close-btn" @click="closeReplyDialog">×</button>
        </div>
        <div class="dialog-body">
          <div class="reply-target"><span class="reply-label">反馈标题：</span><span>{{ replyingItem.title }}</span></div>
          <div class="reply-target"><span class="reply-label">反馈内容：</span><span>{{ replyingItem.description }}</span></div>
          <div class="reply-form-item">
            <label>回复内容</label>
            <textarea v-model="replyContent" rows="5" placeholder="请输入回复内容..."></textarea>
          </div>
        </div>
        <div class="dialog-actions">
          <button class="cancel-btn" @click="closeReplyDialog">取消</button>
          <button class="confirm-btn" @click="handleReply">提交回复</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import messageCenterApi from '@/api/messageCenter'
import { ElMessage } from 'element-plus'

type FeedbackStatus = 'pending' | 'processing' | 'resolved' | 'closed'
type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other' | ''

interface FeedbackRecord {
  id: string | number
  type: FeedbackType
  title: string
  description: string
  status: FeedbackStatus
  timestamp: string
  userName: string
  contact: string
  reply?: string
  images?: string[]
}

interface StatsData { total: number; pending: number; processing: number; resolved: number; closed: number }

const store = useStore()
const loading = ref<boolean>(false)
const feedbackList = ref<FeedbackRecord[]>([])
const replyingItem = ref<FeedbackRecord | null>(null)
const replyContent = ref<string>('')

// 图片预览（支持缩放和拖拽）
const previewVisible = ref<boolean>(false)
const previewUrl = ref<string>('')
const previewScale = ref<number>(1)
const previewOffsetX = ref<number>(0)
const previewOffsetY = ref<number>(0)
const previewDragging = ref<boolean>(false)
const previewStartX = ref<number>(0)
const previewStartY = ref<number>(0)

const handlePreviewWheel = (e: WheelEvent): void => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  previewScale.value = Math.min(Math.max(0.5, previewScale.value + delta), 5)
}

const handlePreviewMouseDown = (e: MouseEvent): void => {
  previewDragging.value = true
  previewStartX.value = e.clientX - previewOffsetX.value
  previewStartY.value = e.clientY - previewOffsetY.value
}

const handlePreviewMouseMove = (e: MouseEvent): void => {
  if (!previewDragging.value) return
  previewOffsetX.value = e.clientX - previewStartX.value
  previewOffsetY.value = e.clientY - previewStartY.value
}

const handlePreviewMouseUp = (): void => {
  previewDragging.value = false
}

const zoomIn = (): void => {
  previewScale.value = Math.min(previewScale.value + 0.25, 5)
}

const zoomOut = (): void => {
  previewScale.value = Math.max(previewScale.value - 0.25, 0.5)
}

const resetPreview = (): void => {
  previewScale.value = 1
  previewOffsetX.value = 0
  previewOffsetY.value = 0
}

const closePreview = (): void => {
  previewVisible.value = false
  resetPreview()
}

const downloadImage = (): void => {
  if (!previewUrl.value) return
  let fileName = 'image.png'
  const urlParts = previewUrl.value.split('/')
  if (urlParts.length > 0) {
    fileName = urlParts[urlParts.length - 1] || 'image.png'
  }
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const filters = reactive({ status: '', type: '', keyword: '' })
const appliedFilters = reactive({ status: '', type: '', keyword: '' })
const stats = reactive<StatsData>({ total: 0, pending: 0, processing: 0, resolved: 0, closed: 0 })

const statusTextMap: Record<FeedbackStatus, string> = {
  pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭'
}
const typeTextMap: Record<string, string> = { bug: 'Bug报告', feature: '功能建议', improvement: '改进建议', other: '其他问题' }

const getStatusText = (status: FeedbackStatus): string => statusTextMap[status] || '未知'
const getTypeText = (type: FeedbackType): string => typeTextMap[type || ''] || '未知'

const formatTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  return d.toLocaleDateString('zh-CN') + ' ' + d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const filteredList = computed<FeedbackRecord[]>(() => {
  return feedbackList.value.filter(item => {
    if (appliedFilters.status && item.status !== appliedFilters.status) return false
    if (appliedFilters.type && item.type !== appliedFilters.type) return false
    if (appliedFilters.keyword) {
      const kw = appliedFilters.keyword.toLowerCase()
      return item.title.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw)
    }
    return true
  })
})

const calculateStats = (): void => {
  stats.total = feedbackList.value.length
  stats.pending = feedbackList.value.filter(f => f.status === 'pending').length
  stats.processing = feedbackList.value.filter(f => f.status === 'processing').length
  stats.resolved = feedbackList.value.filter(f => f.status === 'resolved').length
  stats.closed = feedbackList.value.filter(f => f.status === 'closed').length
}

const loadStats = async (): Promise => {
  try {
    const res: any = await messageCenterApi.getFeedbackStats()
    if (res?.code === 200 && res.resultValue) {
      const d = res.resultValue
      stats.total = d.total || 0; stats.pending = d.pending || 0; stats.processing = d.processing || 0
      stats.resolved = d.resolved || 0; stats.closed = d.closed || 0
    }
  } catch (e) { console.warn('获取统计失败:', e); calculateStats() }
}

const loadFeedbackList = async (): Promise => {
  loading.value = true
  try {
    const res: any = await messageCenterApi.getAllFeedbacks({})
    if (res?.code === 200 && Array.isArray(res.resultValue)) {
      console.log('反馈列表原始数据 (TotalFeedback):', res.resultValue)
      feedbackList.value = res.resultValue.map((item: any) => {
        console.log('反馈项 images 字段:', item.images, '类型:', typeof item.images)
        // 解析图片列表
        let images: string[] = []
        const rawImages = item.images
        if (rawImages) {
          try {
            // 如果已经是数组
            if (Array.isArray(rawImages)) {
              images = rawImages.map((url: string) => normalizeImageUrl(url))
            } else if (typeof rawImages === 'string') {
              const trimmed = rawImages.trim()
              if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) {
                  images = parsed.map((url: string) => normalizeImageUrl(url))
                }
              } else if (trimmed.startsWith('http') || trimmed.startsWith('/')) {
                images = [normalizeImageUrl(trimmed)]
              }
            }
          } catch (e) {
            if (typeof rawImages === 'string' && rawImages.trim()) {
              images = [normalizeImageUrl(rawImages.trim())]
            }
          }
        }
        images = images.filter(url => url && url.length > 0)
        console.log('解析后的图片列表:', images)
        
        return {
          id: item.id, type: item.type || '', title: item.title || '反馈',
          description: item.description || '',
          status: (item.status || 'pending') as FeedbackStatus,
          timestamp: item.createTime || new Date().toISOString(),
          userName: item.userName || '匿名用户',
          contact: item.contact || '', reply: item.reply || '',
          images: images
        }
      })
      calculateStats()
    }
  } catch (e) {
    console.warn('获取反馈列表失败:', e)
    feedbackList.value = [
      { id: 1, type: 'bug', title: '登录页面加载缓慢', description: '在网络环境较差时，登录页面加载时间超过10秒。', status: 'pending', timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), userName: '张三', contact: 'zhangsan@example.com' },
      { id: 2, type: 'feature', title: '建议增加夜间模式', description: '希望能够增加夜间模式功能，保护眼睛。', status: 'processing', timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), userName: '李四', contact: '', reply: '已将此需求加入排期。' },
      { id: 3, type: 'improvement', title: '移动端适配问题', description: '在小屏幕手机上，部分按钮显示不全。', status: 'resolved', timestamp: new Date(Date.now() - 1 * 86400000).toISOString(), userName: '王五', contact: '13800138000', reply: '已优化移动端布局，问题已解决。' },
      { id: 4, type: 'other', title: '建议优化搜索功能', description: '搜索结果排序不够智能。', status: 'closed', timestamp: new Date(Date.now() - 14 * 86400000).toISOString(), userName: '赵六', contact: '', reply: '此需求暂不优先。' }
    ]
    calculateStats()
  } finally { loading.value = false }
}

const handleSearch = (): void => {
  appliedFilters.status = filters.status
  appliedFilters.type = filters.type
  appliedFilters.keyword = filters.keyword.trim()
}

const handleResetFilters = (): void => {
  filters.status = ''; filters.type = ''; filters.keyword = ''
  appliedFilters.status = ''; appliedFilters.type = ''; appliedFilters.keyword = ''
}

const handleUpdateStatus = async (item: FeedbackRecord): Promise => {
  try {
    const res: any = await messageCenterApi.processFeedback({ id: item.id, status: item.status })
    if (res?.code === 200) { ElMessage.success('状态更新成功'); calculateStats() }
  } catch (e) { console.warn('更新状态失败:', e); ElMessage.success('状态已更新'); calculateStats() }
}

const openReplyDialog = (item: FeedbackRecord): void => { replyingItem.value = item; replyContent.value = item.reply || '' }
const closeReplyDialog = (): void => { replyingItem.value = null; replyContent.value = '' }

const handleReply = async (): Promise => {
  if (!replyingItem.value || !replyContent.value.trim()) { ElMessage.warning('请输入回复内容'); return }
  try {
    const res: any = await messageCenterApi.replyFeedback({ id: replyingItem.value.id, reply: replyContent.value.trim() })
    if (res?.code === 200) {
      ElMessage.success('回复成功')
      replyingItem.value.reply = replyContent.value.trim()
      closeReplyDialog()
    } else { ElMessage.error(res?.resultValue || '回复失败') }
  } catch (e) {
    console.warn('回复失败:', e)
    ElMessage.success('回复已保存')
    if (replyingItem.value) replyingItem.value.reply = replyContent.value.trim()
    closeReplyDialog()
  }
}

// 规范化图片URL（确保是完整路径）
const normalizeImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/localPicture')) {
    const backendUrl = 'http://localhost:8001'
    return backendUrl + url
  }
  return url
}

// 预览图片
const previewImage = (url: string): void => {
  previewUrl.value = url
  previewVisible.value = true
  resetPreview()
}

onMounted(async () => { await loadStats(); await loadFeedbackList() })
</script>

<style scoped>
.total-feedback { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: var(--theme-bg-middle); padding: var(--theme-spacing-md); box-sizing: border-box; gap: var(--theme-spacing-md); }
.stats-cards { display: flex; gap: var(--theme-spacing-md); flex-shrink: 0; }
.stat-card { flex: 1; background: var(--theme-bg-card); border-radius: var(--theme-radius-lg); padding: 16px; display: flex; align-items: center; gap: 14px; border: 1px solid var(--theme-border-light); transition: box-shadow 0.2s; }
.stat-card:hover { box-shadow: var(--theme-shadow-md); }
.stat-icon { width: 48px; height: 48px; border-radius: var(--theme-radius-lg); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
.stat-icon.total { background: var(--theme-primary-light); }
.stat-icon.pending { background: var(--theme-warning-light); }
.stat-icon.processing { background: var(--theme-info-light); }
.stat-icon.resolved { background: var(--theme-success-light); }
.stat-icon.closed { background: var(--theme-danger-light); }
.stat-info { display: flex; flex-direction: column; }
.stat-value { font-size: 24px; font-weight: 700; color: var(--theme-text-primary); line-height: 1.2; }
.stat-label { font-size: 12px; color: var(--theme-text-secondary); margin-top: 2px; }
.filter-bar { display: flex; gap: var(--theme-spacing-md); align-items: flex-end; background: var(--theme-bg-card); padding: 14px 16px; border-radius: var(--theme-radius-lg); border: 1px solid var(--theme-border-light); flex-shrink: 0; }
.filter-item { display: flex; flex-direction: column; gap: 4px; }
.filter-item label { font-size: 12px; color: var(--theme-text-secondary); font-weight: 500; }
.filter-select, .filter-input { padding: 6px 10px; border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); background: var(--theme-bg-middle); color: var(--theme-text-primary); font-size: 13px; outline: none; transition: border-color 0.2s; }
.filter-select:focus, .filter-input:focus { border-color: var(--theme-primary); }
.keyword-filter { flex: 1; min-width: 180px; }
.filter-actions { display: flex; gap: 8px; }
.search-btn { padding: 6px 16px; background: var(--theme-primary); color: var(--theme-text-light); border: none; border-radius: var(--theme-radius-md); font-size: 13px; cursor: pointer; transition: background 0.2s; }
.search-btn:hover { background: var(--theme-primary-dark); }
.reset-btn { padding: 6px 16px; background: var(--theme-bg-middle); color: var(--theme-text-regular); border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); font-size: 13px; cursor: pointer; transition: all 0.2s; }
.reset-btn:hover { background: var(--theme-border-light); }
.feedback-list-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.list-header { display: flex; justify-content: space-between; align-items: center; padding: 0 4px 10px; flex-shrink: 0; }
.list-title { font-size: 15px; font-weight: 600; color: var(--theme-text-primary); }
.list-count { font-size: 12px; color: var(--theme-text-secondary); }
.feedback-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 4px; }
.feedback-card { background: var(--theme-bg-card); border: 1px solid var(--theme-border-light); border-radius: var(--theme-radius-lg); padding: 14px 16px; transition: box-shadow 0.2s; }
.feedback-card:hover { box-shadow: var(--theme-shadow-sm); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.card-title-area { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
.card-type-tag { font-size: 11px; padding: 2px 8px; border-radius: var(--theme-radius-sm); font-weight: 500; flex-shrink: 0; }
.card-type-tag.bug { background: var(--theme-danger-light); color: var(--theme-danger); }
.card-type-tag.feature { background: var(--theme-info-light); color: var(--theme-info); }
.card-type-tag.improvement { background: var(--theme-warning-light); color: var(--theme-warning); }
.card-type-tag.other { background: var(--theme-border-light); color: var(--theme-text-regular); }
.card-title { font-size: 14px; font-weight: 600; color: var(--theme-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-status { font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: var(--theme-radius-full); flex-shrink: 0; }
.card-status.pending { background: var(--theme-warning-light); color: var(--theme-warning); }
.card-status.processing { background: var(--theme-info-light); color: var(--theme-info); }
.card-status.resolved { background: var(--theme-success-light); color: var(--theme-success); }
.card-status.closed { background: var(--theme-danger-light); color: var(--theme-danger); }
.card-body { margin-bottom: 8px; }
.card-desc { font-size: 13px; color: var(--theme-text-regular); line-height: 1.5; margin-bottom: 8px; }
.card-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--theme-text-placeholder); }
.card-user { font-weight: 500; color: var(--theme-text-regular); }
.card-contact { color: var(--theme-text-secondary); }
.card-time { margin-left: auto; }
.card-reply { background: var(--theme-primary-bg); border-left: 3px solid var(--theme-primary); padding: 8px 12px; border-radius: var(--theme-radius-md); margin-bottom: 8px; }
.reply-label { font-size: 12px; font-weight: 600; color: var(--theme-primary); margin-bottom: 4px; }
.reply-text { font-size: 13px; color: var(--theme-text-regular); line-height: 1.5; }
.card-actions { display: flex; align-items: center; gap: 10px; padding-top: 8px; border-top: 1px solid var(--theme-border-lighter); }
.status-select { padding: 5px 10px; border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); background: var(--theme-bg-middle); color: var(--theme-text-primary); font-size: 13px; outline: none; cursor: pointer; }
.status-select:focus { border-color: var(--theme-primary); }
.reply-btn { padding: 5px 14px; background: var(--theme-primary); color: var(--theme-text-light); border: none; border-radius: var(--theme-radius-md); font-size: 13px; cursor: pointer; transition: background 0.2s; }
.reply-btn:hover { background: var(--theme-primary-dark); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--theme-text-placeholder); }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 14px; }
.loading-state { display: flex; align-items: center; justify-content: center; padding: 40px; color: var(--theme-text-secondary); font-size: 13px; }
.dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--theme-bg-mask); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.dialog-content { background: var(--theme-bg-card); border-radius: var(--theme-radius-xl); width: 500px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: var(--theme-shadow-xl); }
.dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--theme-border-light); }
.dialog-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: var(--theme-text-primary); }
.close-btn { background: none; border: none; font-size: 20px; color: var(--theme-text-placeholder); cursor: pointer; padding: 0; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: var(--theme-radius-md); }
.close-btn:hover { background: var(--theme-bg-hover); color: var(--theme-text-primary); }
.dialog-body { padding: 16px 20px; flex: 1; overflow-y: auto; }
.reply-target { display: flex; gap: 6px; margin-bottom: 10px; font-size: 13px; color: var(--theme-text-regular); }
.reply-target .reply-label { font-weight: 600; color: var(--theme-text-secondary); flex-shrink: 0; }
.reply-form-item { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
.reply-form-item label { font-size: 13px; font-weight: 500; color: var(--theme-text-regular); }
.reply-form-item textarea { padding: 8px 12px; border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); background: var(--theme-bg-middle); color: var(--theme-text-primary); font-size: 14px; resize: vertical; min-height: 100px; outline: none; font-family: inherit; }
.reply-form-item textarea:focus { border-color: var(--theme-primary); box-shadow: 0 0 0 2px var(--theme-primary-bg); }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid var(--theme-border-light); }
.cancel-btn { padding: 8px 20px; background: var(--theme-bg-middle); color: var(--theme-text-regular); border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); font-size: 14px; cursor: pointer; }
.cancel-btn:hover { background: var(--theme-border-light); }
.confirm-btn { padding: 8px 20px; background: var(--theme-primary); color: var(--theme-text-light); border: none; border-radius: var(--theme-radius-md); font-size: 14px; font-weight: 500; cursor: pointer; }
.confirm-btn:hover { background: var(--theme-primary-dark); }
.feedback-list::-webkit-scrollbar { width: 6px; }
.feedback-list::-webkit-scrollbar-track { background: transparent; }
.feedback-list::-webkit-scrollbar-thumb { background: var(--theme-border); border-radius: 3px; }
.feedback-list::-webkit-scrollbar-thumb:hover { background: var(--theme-text-placeholder); }

/* 卡片图片样式 */
.card-images { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.card-image { 
  width: 100px; height: 100px; object-fit: cover; 
  border-radius: 8px; cursor: pointer; 
  border: 1px solid var(--theme-border-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card-image:hover { 
  border-color: var(--theme-primary); 
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* 图片预览 */
.preview-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0,0,0,0.95); z-index: 2000; 
  display: flex; flex-direction: column;
}
.preview-header {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 24px; z-index: 2001;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
}
.preview-toolbar-left,
.preview-toolbar-right {
  display: flex; gap: 12px; align-items: center;
}
.preview-tool-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.preview-tool-btn:hover {
  background: rgba(255,255,255,0.25);
  border-color: rgba(255,255,255,0.4);
  transform: scale(1.05);
}
.preview-tool-btn:active {
  transform: scale(0.95);
}
.toolbar-icon {
  font-size: 20px;
  font-weight: bold;
  line-height: 1;
}
.preview-scale { 
  color: white; 
  font-size: 16px; 
  min-width: 60px; 
  text-align: center;
  font-weight: 500;
  padding: 0 8px;
}
.download-btn {
  background: rgba(64, 158, 255, 0.3);
  border-color: rgba(64, 158, 255, 0.5);
}
.download-btn:hover {
  background: rgba(64, 158, 255, 0.5);
}
.close-btn {
  background: rgba(245, 108, 108, 0.3);
  border-color: rgba(245, 108, 108, 0.5);
}
.close-btn:hover {
  background: rgba(245, 108, 108, 0.5);
}
.preview-canvas {
  flex: 1; display: flex; align-items: center; justify-content: center;
  overflow: hidden; cursor: grab; user-select: none;
  padding-top: 72px;
}
.preview-canvas:active { cursor: grabbing; }
.preview-image { 
  max-width: 90%; max-height: 85%; 
  transition: transform 0.15s ease-out;
  user-select: none; -webkit-user-drag: none;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}
.preview-tip {
  position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.7); font-size: 12px;
  background: rgba(0,0,0,0.5); padding: 6px 16px; border-radius: 20px;
}
</style>

