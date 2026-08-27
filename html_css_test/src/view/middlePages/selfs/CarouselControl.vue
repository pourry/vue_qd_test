<template>
  <div class="carousel-control-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>走马灯控制</h2>
      <p class="page-desc">管理首页走马灯的图片展示与跳转链接</p>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <el-button type="primary" :icon="Plus" @click="openAddDialog">
        新增走马灯
      </el-button>
      <el-button :icon="Refresh" @click="loadCarousel">
        刷新
      </el-button>
      <el-button :icon="Delete" @click="clearAll" v-if="carouselList.length > 0">
        清空全部
      </el-button>
    </div>

    <!-- 走马灯列表 -->
    <div class="carousel-list" v-if="carouselList.length > 0">
      <div
        v-for="(item, index) in carouselList"
        :key="item.id"
        class="carousel-item"
        :class="{ disabled: !item.enabled }"
      >
        <!-- 排序手柄 -->
        <div class="sort-handle">
          <el-icon v-if="index > 0" class="sort-icon" @click="moveUp(index)"><ArrowUp /></el-icon>
          <el-icon v-if="index < carouselList.length - 1" class="sort-icon" @click="moveDown(index)"><ArrowDown /></el-icon>
        </div>

        <!-- 图片预览 -->
        <div class="image-preview" @click="previewImage(item.pictureUrl)">
          <img v-if="item.pictureUrl" :src="item.pictureUrl" :alt="item.title" />
          <el-icon v-else class="no-image"><Picture /></el-icon>
          <span v-if="!item.enabled" class="disabled-mask">已禁用</span>
          <div v-if="item.pictureUrl" class="preview-hover-tip">🔍 点击预览</div>
        </div>

        <!-- 信息区 -->
        <div class="item-info">
          <div class="item-title">
            <el-tooltip :content="item.title || '无标题'" placement="top">
              {{ item.title || '无标题' }}
            </el-tooltip>
          </div>
          <div class="item-url">
            <el-tooltip :content="item.linkUrl || '无链接'" placement="top">
              <span>{{ item.linkUrl || '无链接' }}</span>
            </el-tooltip>
          </div>
          <div class="item-tags">
            <el-tag :type="getLinkTargetTagType(item.linkTarget)" size="small" effect="plain">
              {{ getLinkTargetLabel(item.linkTarget) }}
            </el-tag>
            <el-tag :type="getObjectFitTagType(item.objectFit)" size="small" effect="plain">
              {{ getObjectFitLabel(item.objectFit) }}
            </el-tag>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="item-actions">
          <el-switch
            v-model="item.enabled"
            @change="onToggleEnabled(item)"
            active-text="启用"
            inactive-text="禁用"
          />
          <el-button size="small" :icon="Edit" @click="openEditDialog(item)">
            编辑
          </el-button>
          <el-button size="small" type="danger" :icon="Delete" @click="removeItem(index)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="暂无走马灯，点击上方按钮新增" />

    <!-- 分页组件 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑走马灯' : '新增走马灯'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="90px"
        label-position="right"
      >
        <!-- 图片上传 -->
        <el-form-item label="走马灯图" prop="pictureUrl">
          <el-upload
            class="carousel-uploader"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            list-type="picture"
            accept="image/*"
          >
            <div v-if="!form.pictureUrl" class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <span>点击上传图片</span>
            </div>
            <img v-else :src="form.pictureUrl" class="upload-preview" />
          </el-upload>
          <div class="upload-tip">支持 JPG、PNG 格式，建议尺寸 800×300</div>
        </el-form-item>

        <!-- 标题 -->
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="30" show-word-limit placeholder="请输入走马灯标题" />
        </el-form-item>

        <!-- 跳转链接 -->
        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入点击后跳转的 URL" type="url" />
        </el-form-item>

        <!-- 跳转方式 -->
        <el-form-item label="跳转方式" prop="linkTarget">
          <el-select v-model="form.linkTarget" placeholder="请选择跳转方式">
            <el-option
              v-for="opt in linkTargetOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            >
              <div style="display: flex; justify-content: space-between; width: 100%;">
                <span>{{ opt.label }}</span>
                <span style="color: var(--theme-text-secondary); font-size: 12px;">{{ opt.desc }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="upload-tip">选择点击走马灯后的打开方式</div>
        </el-form-item>

        <!-- 图片填充样式 -->
        <el-form-item label="填充样式" prop="objectFit">
          <el-select v-model="form.objectFit" placeholder="请选择图片填充样式">
            <el-option
              v-for="opt in objectFitOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            >
              <div style="display: flex; justify-content: space-between; width: 100%;">
                <span>{{ opt.label }}</span>
                <span style="color: var(--theme-text-secondary); font-size: 12px;">{{ opt.desc }}</span>
              </div>
            </el-option>
          </el-select>
          <div class="upload-tip">选择图片在走马灯中的显示方式</div>
        </el-form-item>

        <!-- 启用状态 -->
        <el-form-item label="启用状态">
          <el-switch v-model="form.enabled" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <div v-if="previewVisible" class="preview-overlay" @click.self="closePreview">
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
  </div>
</template>

<script setup>
/**
 * 走马灯控制页面
 * 功能：管理首页走马灯的图片上传、跳转链接绑定、排序、启用/禁用
 * 图片存储：遵循后端全局策略（localPictureSave / ossPictureSave）
 */
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Refresh, ArrowUp, ArrowDown, Picture } from '@element-plus/icons-vue'
import carouselapi from '@/api/carousel'

// ===== 响应式数据 =====
const carouselList = ref([])       // 走马灯列表
const dialogVisible = ref(false)   // 弹窗显示状态
const isEditing = ref(false)       // 是否编辑模式
const formRef = ref(null)          // 表单引用
const uploadFile = ref(null)       // 待上传的文件

// ===== 分页相关数据 =====
const currentPage = ref(1)         // 当前页码
const pageSize = ref(10)           // 每页条数
const total = ref(0)               // 总条数

// ===== 图片填充样式选项 =====
const objectFitOptions = [
  { value: 'cover', label: '裁剪填满', desc: '裁剪图片填满容器（推荐）' },
  { value: 'contain', label: '完整显示', desc: '保持比例完整显示图片' },
  { value: 'fill', label: '拉伸填满', desc: '拉伸图片填满容器（可能变形）' },
  { value: 'none', label: '原始尺寸', desc: '保持原始尺寸不缩放' },
  { value: 'scale-down', label: '缩小适配', desc: '缩小图片以适配容器' }
]

/** 获取填充样式标签显示文本 */
const getObjectFitLabel = function(value) {
  const found = objectFitOptions.find(o => o.value === value)
  return found ? found.label : '裁剪填满'
}

/** 获取填充样式标签类型（颜色） */
const getObjectFitTagType = function(value) {
  const typeMap = {
    'cover': '',       // 默认蓝色
    'contain': 'success',  // 绿色
    'fill': 'warning',     // 橙色
    'none': 'info',        // 灰色
    'scale-down': 'danger' // 红色
  }
  return typeMap[value] || ''
}

// ===== 跳转方式选项 =====
const linkTargetOptions = [
  { value: 'blank', label: '打开新窗口', desc: '在新浏览器标签页打开链接' },
  { value: 'self', label: '本页面跳转', desc: '在当前页面跳转链接（替换当前页）' },
  { value: 'router', label: '路由内部跳转', desc: '使用站内路由跳转（仅限站内路径）' }
]

/** 获取跳转方式标签显示文本 */
const getLinkTargetLabel = function(value) {
  const found = linkTargetOptions.find(o => o.value === value)
  return found ? found.label : '打开新窗口'
}

/** 获取跳转方式标签类型（颜色） */
const getLinkTargetTagType = function(value) {
  const typeMap = {
    'blank': '',         // 默认蓝色
    'self': 'success',   // 绿色
    'router': 'warning'  // 橙色
  }
  return typeMap[value] || ''
}

// ===== 表单数据 =====
const form = reactive({
  id: null,
  title: '',
  pictureUrl: '',     // 后端返回的完整访问URL
  linkUrl: '',
  linkTarget: 'blank',// 跳转方式：blank-新窗口、self-本页面、router-路由跳转
  enabled: true,
  sort: 0,
  objectFit: 'cover'  // 图片填充样式
})

// ===== 表单校验规则 =====
const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}

// ===== 方法 =====

/** 从后端加载走马灯列表（分页） */
const loadCarousel = function() {
  carouselapi.queryPage({
    page: currentPage.value,
    size: pageSize.value
  }).then(res => {
    if (res.successful) {
      const result = res.resultValue || {}
      const list = (result.list || []).map(item => ({
        ...item,
        enabled: typeof item.enabled === 'boolean' ? item.enabled : 
                 (item.enabled === 'true' || item.enabled === 1 || item.enabled === '1')
      }))
      carouselList.value = list
      total.value = result.total || 0
    } else {
      ElMessage.error(res.resultValue || '加载失败')
    }
  }).catch(() => {
    ElMessage.error('加载失败，请检查后端连接')
  })
}

/** 分页大小变化 */
const onSizeChange = function(size) {
  pageSize.value = size
  currentPage.value = 1
  loadCarousel()
}

/** 当前页变化 */
const onCurrentChange = function(page) {
  currentPage.value = page
  loadCarousel()
}

/** 重置表单 */
const resetForm = function() {
  form.id = null
  form.title = ''
  form.pictureUrl = ''
  form.linkUrl = ''
  form.linkTarget = 'blank'
  form.enabled = true
  form.sort = 0
  form.objectFit = 'cover'
  uploadFile.value = null
  formRef.value?.resetFields()
}

/** 打开新增弹窗 */
const openAddDialog = function() {
  isEditing.value = false
  resetForm()
  dialogVisible.value = true
}

/** 打开编辑弹窗 */
const openEditDialog = function(item) {
  isEditing.value = true
  form.id = item.id
  form.title = item.title
  form.pictureUrl = item.pictureUrl
  form.linkUrl = item.linkUrl
  form.linkTarget = item.linkTarget || 'blank'
  form.enabled = item.enabled
  form.sort = item.sort
  form.objectFit = item.objectFit || 'cover'
  uploadFile.value = null
  dialogVisible.value = true
}

/** 处理图片选择（保存文件引用，预览用 base64） */
const handleImageChange = function(uploadFileObj) {
  const file = uploadFileObj.raw || uploadFileObj
  if (!file) return
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请上传图片文件')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过 2MB')
    return
  }
  uploadFile.value = file
  // 本地预览
  const reader = new FileReader()
  reader.onload = function(e) {
    form.pictureUrl = e.target.result
  }
  reader.readAsDataURL(file)
}

/** 保存表单（新增或编辑） */
const saveForm = async function() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  // 构造 FormData（multipart 上传）
  const formData = new FormData()
  formData.append('id', form.id || '')
  formData.append('title', form.title)
  formData.append('linkUrl', form.linkUrl)
  formData.append('linkTarget', form.linkTarget)
  formData.append('enabled', form.enabled)
  formData.append('sort', form.sort)
  formData.append('objectFit', form.objectFit)
  if (uploadFile.value) {
    formData.append('file', uploadFile.value)
  }

  if (isEditing.value) {
    // 编辑模式
    carouselapi.toedit(formData).then(res => {
      if (res.successful) {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        loadCarousel()
      } else {
        ElMessage.error(res.resultValue || '编辑失败')
      }
    })
  } else {
    // 新增模式（必须有图片）
    if (!uploadFile.value) {
      ElMessage.warning('请上传走马灯图片')
      return
    }
    carouselapi.toadd(formData).then(res => {
      if (res.successful) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadCarousel()
      } else {
        ElMessage.error(res.resultValue || '新增失败')
      }
    })
  }
}

/** 删除单项 */
const removeItem = function(index) {
  ElMessageBox.confirm('确定删除这条走马灯吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const item = carouselList.value[index]
    carouselapi.todelete(item.id).then(res => {
      if (res.successful) {
        ElMessage.success('删除成功')
        // 如果删除后当前页变为空，且不是第一页，则跳转到上一页
        if (carouselList.value.length === 1 && currentPage.value > 1) {
          currentPage.value--
        }
        loadCarousel()
      } else {
        ElMessage.error(res.resultValue || '删除失败')
      }
    })
  }).catch(() => {})
}

/** 清空全部 */
const clearAll = function() {
  ElMessageBox.confirm('确定清空所有走马灯吗？此操作不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = carouselList.value.map(item => item.id)
    let delCount = 0
    ids.forEach(id => {
      carouselapi.todelete(id).then(() => {
        delCount++
        if (delCount === ids.length) {
          ElMessage.success('已清空')
          currentPage.value = 1  // 清空后回到第一页
          loadCarousel()
        }
      })
    })
  }).catch(() => {})
}

/** 启用/禁用切换（调用后端 API） */
const onToggleEnabled = function(item) {
  carouselapi.toggleEnabled({
    id: item.id,
    enabled: item.enabled
  }).then(res => {
    if (res.successful) {
      ElMessage.success(item.enabled ? '已启用' : '已禁用')
    } else {
      // 回滚状态
      item.enabled = !item.enabled
      ElMessage.error(res.resultValue || '操作失败')
    }
  }).catch(() => {
    item.enabled = !item.enabled
    ElMessage.error('操作失败')
  })
}

/** 上移（调整 sort 值） */
const moveUp = function(index) {
  if (index <= 0) return
  const list = carouselList.value
  const current = list[index]
  const prev = list[index - 1]
  // 交换排序值
  const tmpSort = current.sort
  current.sort = prev.sort
  prev.sort = tmpSort
  // 交换位置
  ;[list[index - 1], list[index]] = [list[index], list[index - 1]]
  // 保存排序变更（使用 toedit 接口，携带完整数据）
  saveSort(current)
  saveSort(prev)
}

/** 下移 */
const moveDown = function(index) {
  const list = carouselList.value
  if (index >= list.length - 1) return
  const current = list[index]
  const next = list[index + 1]
  const tmpSort = current.sort
  current.sort = next.sort
  next.sort = tmpSort
  ;[list[index], list[index + 1]] = [list[index + 1], list[index]]
  saveSort(current)
  saveSort(next)
}

/** 保存排序（使用 toedit 接口） */
const saveSort = function(item) {
  const formData = new FormData()
  formData.append('id', item.id)
  formData.append('title', item.title || '')
  formData.append('linkUrl', item.linkUrl || '')
  formData.append('linkTarget', item.linkTarget || 'blank')
  formData.append('enabled', item.enabled)
  formData.append('sort', item.sort)
  formData.append('objectFit', item.objectFit || 'cover')
  carouselapi.toedit(formData).then(() => {
    // 静默保存，不需要提示
  }).catch(() => {
    // 静默失败
  })
}

// ===== 图片预览功能 =====
const previewVisible = ref(false)
const previewUrl = ref('')
const previewScale = ref(1)
const previewOffsetX = ref(0)
const previewOffsetY = ref(0)
const previewDragging = ref(false)
const previewStartX = ref(0)
const previewStartY = ref(0)

const previewImage = (url) => {
  if (!url) return
  previewUrl.value = url
  previewVisible.value = true
  resetPreview()
}

const closePreview = () => {
  previewVisible.value = false
  resetPreview()
}

const handlePreviewWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  previewScale.value = Math.min(Math.max(0.5, previewScale.value + delta), 5)
}

const handlePreviewMouseDown = (e) => {
  previewDragging.value = true
  previewStartX.value = e.clientX - previewOffsetX.value
  previewStartY.value = e.clientY - previewOffsetY.value
}

const handlePreviewMouseMove = (e) => {
  if (!previewDragging.value) return
  previewOffsetX.value = e.clientX - previewStartX.value
  previewOffsetY.value = e.clientY - previewStartY.value
}

const handlePreviewMouseUp = () => {
  previewDragging.value = false
}

const zoomIn = () => {
  previewScale.value = Math.min(previewScale.value + 0.25, 5)
}

const zoomOut = () => {
  previewScale.value = Math.max(previewScale.value - 0.25, 0.5)
}

const resetPreview = () => {
  previewScale.value = 1
  previewOffsetX.value = 0
  previewOffsetY.value = 0
}

const downloadImage = () => {
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

// ===== 生命周期 =====
onMounted(() => {
  loadCarousel()
})
</script>

<style scoped>
/* ===== 页面容器 ===== */
.carousel-control-page {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ===== 页面头部 ===== */
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 6px 0;
}
.page-desc {
  font-size: 13px;
  color: var(--theme-text-secondary);
  margin: 0;
}

/* ===== 操作栏 ===== */
.action-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--theme-border);
}

/* ===== 走马灯列表 ===== */
.carousel-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
}

/* ===== 走马灯单项 ===== */
.carousel-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  transition: all 0.2s ease;
}
.carousel-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: var(--theme-primary);
}
.carousel-item.disabled {
  opacity: 0.55;
}
.carousel-item.disabled:hover {
  box-shadow: none;
  border-color: var(--theme-border);
}

/* ===== 排序手柄 ===== */
.sort-handle {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sort-icon {
  font-size: 18px;
  color: var(--theme-text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}
.sort-icon:hover {
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
}

/* ===== 图片预览 ===== */
.image-preview {
  position: relative;
  width: 120px;
  height: 50px;
  background: var(--theme-bg-middle);
  border-radius: var(--theme-radius-sm);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.no-image {
  font-size: 24px;
  color: var(--theme-text-placeholder);
}
.disabled-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== 信息区 ===== */
.item-info {
  flex: 1;
  min-width: 0;
}
.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-url {
  font-size: 12px;
  color: var(--theme-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-tags {
  margin-top: 4px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* ===== 操作按钮 ===== */
.item-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.item-actions .el-button {
  margin: 0;
}

/* ===== 上传组件 ===== */
.carousel-uploader :deep(.el-upload) {
  border: 1px dashed var(--theme-border);
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
}
.carousel-uploader :deep(.el-upload:hover) {
  border-color: var(--theme-primary);
}
.upload-placeholder {
  width: 200px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--theme-text-placeholder);
  font-size: 12px;
}
.upload-icon {
  font-size: 24px;
}
.upload-preview {
  width: 200px;
  height: 75px;
  object-fit: cover;
  display: block;
}
.upload-tip {
  margin-top: 6px;
  font-size: 12px;
  color: var(--theme-text-placeholder);
}

/* ===== 图片预览功能 ===== */
.image-preview {
  cursor: pointer;
  position: relative;
}
.image-preview:hover img {
  opacity: 0.7;
  transition: opacity 0.2s;
}
.preview-hover-tip {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 10px;
  padding: 3px 0;
  text-align: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.image-preview:hover .preview-hover-tip {
  opacity: 1;
}

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

/* ===== 分页组件样式 ===== */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
  border-top: 1px solid var(--theme-border-color, #e4e7ed);
}
.pagination-wrapper .el-pagination {
  flex-wrap: wrap;
  justify-content: center;
}
</style>
