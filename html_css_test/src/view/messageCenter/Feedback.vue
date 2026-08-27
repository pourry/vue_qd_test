<template>
  <div class="feedback-container">
    <!-- 左侧：反馈表单 -->
    <div class="feedback-form-section">
      <div class="section-header">
        <h2 class="section-title">提交反馈</h2>
        <span class="section-desc">您的反馈将帮助我们改进产品</span>
      </div>
      <div class="feedback-form">
        <div class="form-item">
          <label class="form-label required">反馈类型</label>
          <select v-model="feedbackForm.type" class="form-select">
            <option value="">请选择反馈类型</option>
            <option value="bug">Bug报告</option>
            <option value="feature">功能建议</option>
            <option value="improvement">改进建议</option>
            <option value="other">其他问题</option>
          </select>
        </div>
        <div class="form-item">
          <label class="form-label required">标题</label>
          <input v-model="feedbackForm.title" type="text" class="form-input" placeholder="请简要描述您的问题或建议" maxlength="100" />
        </div>
        <div class="form-item">
          <label class="form-label required">详细描述</label>
          <textarea v-model="feedbackForm.description" class="form-textarea" placeholder="请详细描述问题的复现步骤或建议的具体内容..." rows="5" maxlength="1000"></textarea>
          <span class="char-counter">{{ feedbackForm.description.length }}/1000</span>
        </div>
        <div class="form-item">
          <label class="form-label">联系方式（可选）</label>
          <input v-model="feedbackForm.contact" type="text" class="form-input" placeholder="邮箱或手机号，方便我们回复您" />
        </div>
        <div class="form-item">
          <label class="form-label">上传图片（可选，最多6张）</label>
          <div class="upload-area">
            <div class="upload-list">
              <div v-for="(img, idx) in uploadedImages" :key="idx" class="upload-item">
                <img :src="img" class="upload-preview" />
                <span class="upload-remove" @click="removeImage(idx)">×</span>
                <div v-if="uploadingIndex === idx" class="upload-progress">上传中...</div>
              </div>
              <div v-if="uploadedImages.length < 6" class="upload-trigger" @click="triggerUpload">
                <span class="upload-icon">+</span>
                <span class="upload-text">添加图片</span>
              </div>
            </div>
            <input ref="fileInputRef" type="file" accept="image/*" multiple style="display:none" @change="handleFileChange" />
          </div>
          <span class="upload-hint">支持 JPG、PNG 格式，单张不超过 5MB</span>
        </div>
        <div class="form-actions">
          <button class="submit-btn" :disabled="!canSubmit || submitting" @click="handleSubmit">{{ submitting ? '提交中...' : '提交反馈' }}</button>
          <button class="reset-btn" @click="handleReset">重置</button>
        </div>
      </div>
    </div>

    <!-- 右侧：我的反馈历史 -->
    <div class="feedback-history-section">
      <div class="section-header">
        <h2 class="section-title">我的反馈</h2>
        <span class="history-count">共 {{ pagination.total }} 条</span>
      </div>
      <div class="history-list">
        <div v-for="item in feedbackList" :key="item.id" class="history-item">
          <div class="history-header">
            <span class="history-title">{{ item.title }}</span>
            <span class="history-status" :class="item.status">{{ getStatusText(item.status) }}</span>
          </div>
          <div class="history-desc">{{ item.description }}</div>
          <div v-if="item.images && item.images.length > 0" class="history-images">
            <img v-for="(img, idx) in item.images" :key="idx" :src="img" class="history-image" @click="previewImage(img)" />
          </div>
          <div class="status-progress">
            <div v-for="(step, idx) in statusSteps" :key="step.key" class="progress-step" :class="{ active: isStepActive(item.status, idx), completed: isStepCompleted(item.status, idx) }">
              <div class="step-indicator">{{ isStepCompleted(item.status, idx) ? '✓' : idx + 1 }}</div>
              <span class="step-label">{{ step.label }}</span>
              <div v-if="idx < statusSteps.length - 1" class="step-line"></div>
            </div>
          </div>
          <div class="history-meta">
            <span class="history-time">{{ formatTime(item.timestamp) }}</span>
            <div class="history-actions">
              <span v-if="item.status === 'pending'" class="action-btn" @click="handleEdit(item)">编辑</span>
              <span v-if="item.status === 'pending'" class="action-btn danger" @click="handleDelete(item)">撤销</span>
              <span v-if="item.reply" class="history-reply" @click="toggleReply(item)">{{ showReplyId === item.id ? '收起回复' : '查看回复' }}</span>
            </div>
          </div>
          <div v-if="showReplyId === item.id && item.reply" class="reply-content">
            <div class="reply-header">管理员回复</div>
            <div class="reply-text">{{ item.reply }}</div>
          </div>
        </div>
        <div v-if="feedbackList.length === 0 && !loading" class="empty-state">
          <div class="empty-icon">📝</div>
          <div class="empty-text">暂无反馈记录</div>
          <div class="empty-hint">您提交的反馈将会出现在这里</div>
        </div>
        <div v-if="loading" class="loading-state"><span>加载中...</span></div>
        <!-- 分页 -->
        <div v-if="!loading && pagination.total > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="pagination.page"
            v-model:page-size="pagination.size"
            :page-sizes="[5, 10, 20, 50]"
            :total="pagination.total"
            layout="total, sizes, prev, pager, next, jumper"
            background
            small
            @size-change="handlePageChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>
    
    <!-- 图片预览对话框 -->
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
    
    <!-- 编辑反馈对话框 -->
    <div v-if="editingItem" class="dialog-overlay" @click.self="closeEdit">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>编辑反馈</h3>
          <span class="dialog-close" @click="closeEdit">×</span>
        </div>
        <div class="dialog-body">
          <div class="form-item">
            <label class="form-label required">反馈类型</label>
            <select v-model="editForm.type" class="form-select">
              <option value="">请选择反馈类型</option>
              <option value="bug">Bug报告</option>
              <option value="feature">功能建议</option>
              <option value="improvement">改进建议</option>
              <option value="other">其他问题</option>
            </select>
          </div>
          <div class="form-item">
            <label class="form-label required">标题</label>
            <input v-model="editForm.title" type="text" class="form-input" placeholder="请简要描述" maxlength="100" />
          </div>
          <div class="form-item">
            <label class="form-label required">详细描述</label>
            <textarea v-model="editForm.description" class="form-textarea" placeholder="请详细描述问题..." rows="4" maxlength="1000"></textarea>
          </div>
          <div class="form-item">
            <label class="form-label">联系方式（可选）</label>
            <input v-model="editForm.contact" type="text" class="form-input" placeholder="邮箱或手机号" />
          </div>
          <div class="form-item">
            <label class="form-label">上传图片（可选，最多6张）</label>
            <div class="upload-area">
              <div class="upload-list">
                <div v-for="(img, idx) in editImages" :key="idx" class="upload-item">
                  <img :src="img" class="upload-preview" />
                  <span class="upload-remove" @click="removeEditImage(idx)">×</span>
                  <div v-if="editUploadingIdx === idx" class="upload-progress">上传中...</div>
                </div>
                <div v-if="editImages.length < 6" class="upload-trigger" @click="triggerEditUpload">
                  <span class="upload-icon">+</span>
                  <span class="upload-text">添加图片</span>
                </div>
              </div>
              <input ref="editFileInputRef" type="file" accept="image/*" multiple style="display:none" @change="handleEditFileChange" />
            </div>
            <span class="upload-hint">支持 JPG、PNG 格式，单张不超过 5MB</span>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="reset-btn" @click="closeEdit">取消</button>
          <button class="submit-btn" :disabled="!editCanSubmit" @click="handleUpdate">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import messageCenterApi from '@/api/messageCenter'
import { ElMessage, ElMessageBox } from 'element-plus'

type FeedbackStatus = 'pending' | 'processing' | 'resolved' | 'closed'
type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other'

interface FeedbackFormData {
  type: FeedbackType | ''
  title: string
  description: string
  contact: string
}

interface FeedbackItem {
  id: string | number
  type: FeedbackType | ''
  title: string
  description: string
  contact: string
  status: FeedbackStatus
  timestamp: string
  reply?: string
  images?: string[]
}

const store = useStore()
const submitting = ref<boolean>(false)
const loading = ref<boolean>(false)
const feedbackForm = reactive<FeedbackFormData>({ type: '', title: '', description: '', contact: '' })
const feedbackList = ref<FeedbackItem[]>([])
const showReplyId = ref<string | number | null>(null)

/** 分页状态 */
const pagination = reactive({
  page: 1,
  size: 5,
  total: 0
})

// 图片上传相关
const uploadedImages = ref<string[]>([])
const uploadingIndex = ref<number>(-1)
const fileInputRef = ref<HTMLElement | null>(null)

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

const downloadImage = (): void => {
  if (!previewUrl.value) return
  // 从URL中提取文件名
  let fileName = 'image.png'
  const urlParts = previewUrl.value.split('/')
  if (urlParts.length > 0) {
    fileName = urlParts[urlParts.length - 1] || 'image.png'
  }
  // 创建下载链接
  const link = document.createElement('a')
  link.href = previewUrl.value
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const statusSteps: { key: FeedbackStatus; label: string }[] = [
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' },
  { key: 'closed', label: '已关闭' }
]

const statusTextMap: Record<FeedbackStatus, string> = {
  pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭'
}

const isStepCompleted = (status: FeedbackStatus, idx: number): boolean => {
  const currentIdx = statusSteps.findIndex(s => s.key === status)
  if (status === 'closed') return idx < 3
  return idx < currentIdx
}

const isStepActive = (status: FeedbackStatus, idx: number): boolean => {
  const currentIdx = statusSteps.findIndex(s => s.key === status)
  if (status === 'closed') return idx === 3
  return idx === currentIdx
}

const getStatusText = (status: FeedbackStatus): string => statusTextMap[status] || '未知'

const formatTime = (timestamp: string): string => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const canSubmit = computed<boolean>(() => {
  return !!feedbackForm.type && feedbackForm.title.trim().length > 0 && feedbackForm.description.trim().length > 0
})

const toggleReply = (item: FeedbackItem): void => {
  showReplyId.value = showReplyId.value === item.id ? null : item.id
}

const handleSubmit = async (): Promise<void> => {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    const payload = { 
      type: feedbackForm.type, 
      title: feedbackForm.title.trim(), 
      description: feedbackForm.description.trim(), 
      contact: feedbackForm.contact.trim(),
      images: JSON.stringify(uploadedImages.value)
    }
    const res: any = await messageCenterApi.submitFeedback(payload)
    if (res?.code === 200) {
      ElMessage.success('反馈提交成功，感谢您的宝贵意见！')
      handleReset()
      loadFeedbackList()
    } else {
      ElMessage.error(res?.resultValue || '提交失败，请重试')
    }
  } catch (e) {
    console.warn('提交反馈失败:', e)
    ElMessage.error('提交失败，请检查网络后重试')
  } finally {
    submitting.value = false
  }
}

const handleReset = (): void => {
  feedbackForm.type = ''
  feedbackForm.title = ''
  feedbackForm.description = ''
  feedbackForm.contact = ''
  uploadedImages.value = []
}

// 触发文件选择
const triggerUpload = (): void => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return
  
  const remaining = 6 - uploadedImages.value.length
  const filesToUpload = Array.from(files).slice(0, remaining)
  
  for (let i = 0; i < filesToUpload.length; i++) {
    const file = filesToUpload[i]
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.warning(`文件 ${file.name} 不是图片，已跳过`)
      continue
    }
    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.warning(`文件 ${file.name} 超过 5MB，已跳过`)
      continue
    }
    
    uploadingIndex.value = uploadedImages.value.length
    try {
      const res: any = await messageCenterApi.uploadFeedbackImage(file)
      if (res?.code === 200 && res?.resultValue?.url) {
        const url = res.resultValue.url
        // 添加完整的访问路径
        const fullUrl = url
        uploadedImages.value.push(fullUrl)
      } else {
        ElMessage.error(`上传 ${file.name} 失败`)
      }
    } catch (e) {
      console.error('上传失败:', e)
      ElMessage.error(`上传 ${file.name} 失败`)
    }
  }
  
  uploadingIndex.value = -1
  // 清空 input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 移除图片
const removeImage = (index: number): void => {
  uploadedImages.value.splice(index, 1)
}

// 规范化图片URL
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

const closePreview = (): void => {
  previewVisible.value = false
  resetPreview()
}

// 编辑相关
const editingItem = ref<FeedbackItem | null>(null)
const editForm = reactive<FeedbackFormData>({ type: '', title: '', description: '', contact: '' })
const editImages = ref<string[]>([])
const editUploadingIdx = ref<number>(-1)
const editFileInputRef = ref<HTMLElement | null>(null)

const editCanSubmit = computed(() => {
  return editForm.title.trim() !== '' && editForm.description.trim() !== ''
})

const handleEdit = (item: FeedbackItem): void => {
  editingItem.value = item
  editForm.type = item.type
  editForm.title = item.title
  editForm.description = item.description
  editForm.contact = item.contact
  // 加载已有图片
  editImages.value = item.images ? [...item.images] : []
}

const closeEdit = (): void => {
  editingItem.value = null
  editImages.value = []
}

const handleUpdate = async (): Promise<void> => {
  if (!editingItem.value || !editCanSubmit.value) return
  try {
    const payload = {
      id: editingItem.value.id,
      type: editForm.type,
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      contact: editForm.contact.trim(),
      images: JSON.stringify(editImages.value)
    }
    const res: any = await messageCenterApi.updateFeedback(payload)
    if (res?.code === 200) {
      ElMessage.success('更新成功')
      closeEdit()
      await loadFeedbackList()
    } else {
      ElMessage.error(res?.resultValue || '更新失败')
    }
  } catch (e) {
    console.warn('更新失败:', e)
    ElMessage.error('更新失败')
  }
}

// 编辑时图片管理
const triggerEditUpload = (): void => {
  editFileInputRef.value?.click()
}

const handleEditFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return
  
  const remaining = 6 - editImages.value.length
  const filesToUpload = Array.from(files).slice(0, remaining)
  
  for (let i = 0; i < filesToUpload.length; i++) {
    const file = filesToUpload[i]
    if (!file.type.startsWith('image/')) {
      ElMessage.warning(`文件 ${file.name} 不是图片，已跳过`)
      continue
    }
    if (file.size > 5 * 1024 * 1024) {
      ElMessage.warning(`文件 ${file.name} 超过 5MB，已跳过`)
      continue
    }
    
    editUploadingIdx.value = editImages.value.length
    try {
      const res: any = await messageCenterApi.uploadFeedbackImage(file)
      if (res?.code === 200 && res?.resultValue?.url) {
        const url = res.resultValue.url
        const fullUrl = url
        editImages.value.push(fullUrl)
      } else {
        ElMessage.error(`上传 ${file.name} 失败`)
      }
    } catch (e) {
      console.error('上传失败:', e)
      ElMessage.error(`上传 ${file.name} 失败`)
    }
  }
  
  editUploadingIdx.value = -1
  if (editFileInputRef.value) {
    editFileInputRef.value.value = ''
  }
}

const removeEditImage = (index: number): void => {
  editImages.value.splice(index, 1)
}

const handleDelete = async (item: FeedbackItem): Promise<void> => {
  try {
    await ElMessageBox.confirm('确定要撤销这条反馈吗？撤销后将无法恢复。', '撤销确认', {
      confirmButtonText: '确定撤销',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const res: any = await messageCenterApi.deleteFeedback(item.id)
    if (res?.code === 200) {
      ElMessage.success('撤销成功')
      await loadFeedbackList()
    } else {
      ElMessage.error(res?.resultValue || '撤销失败')
    }
  } catch (e) {
    // 用户取消
  }
}

const loadFeedbackList = async (): Promise<void> => {
  loading.value = true
  try {
    const res: any = await messageCenterApi.getMyFeedbacksPaged({
      page: pagination.page,
      size: pagination.size
    })
    if (res?.code === 200 && res?.resultValue) {
      // 新接口：{ list, total, page, size, totalPages }
      const list = Array.isArray(res.resultValue.list) ? res.resultValue.list : []
      pagination.total = res.resultValue.total ?? list.length
      feedbackList.value = list.map((item: any) => {
        return mapFeedbackItem(item)
      })
    } else {
      feedbackList.value = []
      pagination.total = 0
    }
  } catch (e) {
    console.warn('获取反馈列表失败:', e)
    feedbackList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

/** 将后端返回的原始对象映射为 FeedbackItem */
const mapFeedbackItem = (item: any): FeedbackItem => {
  let images: string[] = []
  const rawImages = item.images
  if (rawImages) {
    try {
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
  return {
    id: item.id,
    type: item.type || '',
    title: item.title || '反馈',
    description: item.description || '',
    contact: item.contact || '',
    status: (item.status || 'pending') as FeedbackStatus,
    timestamp: item.createTime || new Date().toISOString(),
    reply: item.reply || '',
    images: images
  }
}

/** 分页/页码变化处理 */
const handlePageChange = (): void => {
  loadFeedbackList()
}

onMounted(() => { loadFeedbackList() })
</script>

<style scoped>
.feedback-container { display: flex; width: 100%; height: 100%; overflow: hidden; background: var(--theme-bg-middle); }
.feedback-form-section { width: 420px; flex-shrink: 0; background: var(--theme-bg-card); border-right: 1px solid var(--theme-border); display: flex; flex-direction: column; overflow: hidden; }
.section-header { padding: var(--theme-spacing-md) var(--theme-spacing-lg); border-bottom: 1px solid var(--theme-border-light); flex-shrink: 0; }
.section-title { font-size: 16px; font-weight: 600; color: var(--theme-text-primary); margin: 0 0 4px 0; }
.section-desc { font-size: 12px; color: var(--theme-text-secondary); }
.feedback-form { flex: 1; overflow-y: auto; padding: var(--theme-spacing-lg); display: flex; flex-direction: column; gap: 18px; }
.form-item { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 500; color: var(--theme-text-regular); }
.form-label.required::before { content: '*'; color: var(--theme-danger); margin-right: 2px; }
.form-input, .form-select, .form-textarea { padding: 8px 12px; border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); background: var(--theme-bg-middle); color: var(--theme-text-primary); font-size: 14px; outline: none; transition: border-color 0.2s; font-family: inherit; box-sizing: border-box; }
.form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--theme-primary); box-shadow: 0 0 0 2px var(--theme-primary-bg); }
.form-textarea { resize: vertical; min-height: 80px; }
.char-counter { font-size: 12px; color: var(--theme-text-placeholder); text-align: right; }
.form-actions { display: flex; gap: 12px; margin-top: 8px; }
.submit-btn { flex: 1; padding: 10px 24px; background: var(--theme-primary); color: var(--theme-text-light); border: none; border-radius: var(--theme-radius-md); font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s; }
.submit-btn:hover:not(:disabled) { background: var(--theme-primary-dark); }
.submit-btn:disabled { background: var(--theme-text-placeholder); cursor: not-allowed; }
.reset-btn { padding: 10px 20px; background: var(--theme-bg-middle); color: var(--theme-text-regular); border: 1px solid var(--theme-border); border-radius: var(--theme-radius-md); font-size: 14px; cursor: pointer; transition: all 0.2s; }
.reset-btn:hover { background: var(--theme-border-light); color: var(--theme-text-primary); }
.feedback-history-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.history-count { font-size: 12px; color: var(--theme-text-secondary); }
.history-list { flex: 1; overflow-y: auto; padding: var(--theme-spacing-md); display: flex; flex-direction: column; gap: 14px; }
.history-item { background: var(--theme-bg-card); border: 1px solid var(--theme-border-light); border-radius: var(--theme-radius-lg); padding: 16px; transition: box-shadow 0.2s; }
.history-item:hover { box-shadow: var(--theme-shadow-sm); }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.history-title { font-size: 14px; font-weight: 600; color: var(--theme-text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
.history-status { font-size: 12px; font-weight: 500; padding: 2px 10px; border-radius: var(--theme-radius-full); flex-shrink: 0; margin-left: 8px; }
.history-status.pending { background: var(--theme-warning-light); color: var(--theme-warning); }
.history-status.processing { background: var(--theme-info-light); color: var(--theme-info); }
.history-status.resolved { background: var(--theme-success-light); color: var(--theme-success); }
.history-status.closed { background: var(--theme-danger-light); color: var(--theme-danger); }
.history-desc { font-size: 13px; color: var(--theme-text-regular); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.status-progress { display: flex; align-items: center; margin-bottom: 12px; padding: 8px 0; background: var(--theme-bg-middle); border-radius: var(--theme-radius-md); padding: 10px 12px; }
.progress-step { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; }
.step-indicator { width: 22px; height: 22px; border-radius: 50%; background: var(--theme-border-light); color: var(--theme-text-placeholder); font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; z-index: 1; transition: all 0.3s; }
.progress-step.active .step-indicator { background: var(--theme-primary); color: var(--theme-text-light); box-shadow: 0 0 0 3px var(--theme-primary-bg); }
.progress-step.completed .step-indicator { background: var(--theme-success); color: var(--theme-text-light); }
.step-label { font-size: 11px; color: var(--theme-text-placeholder); margin-top: 4px; white-space: nowrap; }
.progress-step.active .step-label { color: var(--theme-primary); font-weight: 500; }
.progress-step.completed .step-label { color: var(--theme-success); }
.step-line { position: absolute; top: 11px; left: calc(50% + 12px); right: calc(-50% + 12px); height: 2px; background: var(--theme-border); z-index: 0; }
.progress-step.completed .step-line { background: var(--theme-success); }
.history-meta { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid var(--theme-border-lighter); }
.history-time { font-size: 12px; color: var(--theme-text-placeholder); }
.history-reply { font-size: 12px; color: var(--theme-primary); cursor: pointer; }
.history-reply:hover { text-decoration: underline; }
.reply-content { margin-top: 12px; padding: 12px; background: var(--theme-primary-bg); border-radius: var(--theme-radius-md); border-left: 3px solid var(--theme-primary); }
.reply-header { font-size: 12px; font-weight: 600; color: var(--theme-primary); margin-bottom: 6px; }
.reply-text { font-size: 13px; color: var(--theme-text-regular); line-height: 1.5; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--theme-text-placeholder); }

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0 8px;
  margin-top: 8px;
  border-top: 1px solid var(--theme-border-lighter);
}
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.empty-text { font-size: 14px; margin-bottom: 4px; }
.empty-hint { font-size: 12px; color: var(--theme-text-placeholder); }
.loading-state { display: flex; align-items: center; justify-content: center; padding: 40px; color: var(--theme-text-secondary); font-size: 13px; }
.feedback-form::-webkit-scrollbar, .history-list::-webkit-scrollbar { width: 6px; }
.feedback-form::-webkit-scrollbar-track, .history-list::-webkit-scrollbar-track { background: transparent; }
.feedback-form::-webkit-scrollbar-thumb, .history-list::-webkit-scrollbar-thumb { background: var(--theme-border); border-radius: 3px; }

/* 图片上传样式 */
.upload-area { display: flex; flex-direction: column; gap: 8px; }
.upload-list { display: flex; flex-wrap: wrap; gap: 8px; }
.upload-item { position: relative; width: 72px; height: 72px; border-radius: 6px; overflow: hidden; border: 1px solid var(--theme-border); }
.upload-preview { width: 100%; height: 100%; object-fit: cover; }
.upload-remove { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; background: rgba(0,0,0,0.5); color: white; border-radius: 50%; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; line-height: 1; }
.upload-remove:hover { background: var(--theme-danger); }
.upload-progress { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 10px; text-align: center; padding: 2px; }
.upload-trigger { width: 72px; height: 72px; border: 1px dashed var(--theme-border); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s; background: var(--theme-bg-middle); }
.upload-trigger:hover { border-color: var(--theme-primary); }
.upload-icon { font-size: 24px; color: var(--theme-text-placeholder); }
.upload-text { font-size: 11px; color: var(--theme-text-placeholder); margin-top: 2px; }
.upload-hint { font-size: 11px; color: var(--theme-text-placeholder); }

/* 历史记录图片 */
.history-images { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.history-image { 
  width: 80px; height: 80px; object-fit: cover; 
  border-radius: 8px; cursor: pointer; 
  border: 1px solid var(--theme-border-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.history-image:hover { 
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

/* 对话框样式 */
.dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1500; }
.dialog-content { background: var(--theme-bg-card); border-radius: var(--theme-radius-lg); width: 480px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: var(--theme-shadow-lg); }
.dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--theme-border-light); }
.dialog-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: var(--theme-text-primary); }
.dialog-close { font-size: 20px; color: var(--theme-text-placeholder); cursor: pointer; line-height: 1; }
.dialog-close:hover { color: var(--theme-text-primary); }
.dialog-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; flex: 1; }
.dialog-footer { padding: 16px 20px; border-top: 1px solid var(--theme-border-light); display: flex; justify-content: flex-end; gap: 12px; }

/* 操作按钮 */
.history-actions { display: flex; align-items: center; gap: 12px; }
.action-btn { font-size: 12px; color: var(--theme-primary); cursor: pointer; padding: 4px 8px; border-radius: var(--theme-radius-sm); transition: all 0.2s; }
.action-btn:hover { background: var(--theme-primary-bg); }
.action-btn.danger { color: var(--theme-danger); }
.action-btn.danger:hover { background: var(--theme-danger-light); }
</style>

