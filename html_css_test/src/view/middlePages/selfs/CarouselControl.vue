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
        <div class="image-preview">
          <img v-if="item.pictureUrl" :src="item.pictureUrl" :alt="item.title" />
          <el-icon v-else class="no-image"><Picture /></el-icon>
          <span v-if="!item.enabled" class="disabled-mask">已禁用</span>
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

// ===== 表单数据 =====
const form = reactive({
  id: null,
  title: '',
  pictureUrl: '',     // 后端返回的完整访问URL
  linkUrl: '',
  enabled: true,
  sort: 0
})

// ===== 表单校验规则 =====
const formRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
}

// ===== 方法 =====

/** 从后端加载走马灯列表 */
const loadCarousel = function() {
  carouselapi.querylist().then(res => {
    if (res.successful) {
      carouselList.value = res.resultValue || []
    } else {
      ElMessage.error(res.resultValue || '加载失败')
    }
  }).catch(() => {
    ElMessage.error('加载失败，请检查后端连接')
  })
}

/** 重置表单 */
const resetForm = function() {
  form.id = null
  form.title = ''
  form.pictureUrl = ''
  form.linkUrl = ''
  form.enabled = true
  form.sort = 0
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
  form.enabled = item.enabled
  form.sort = item.sort
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
  formData.append('enabled', form.enabled)
  formData.append('sort', form.sort)
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
    enabled: String(item.enabled)
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
  // 保存两个的排序
  carouselapi.toggleEnabled({
    id: current.id,
    enabled: String(current.enabled)
  })
  carouselapi.toggleEnabled({
    id: prev.id,
    enabled: String(prev.enabled)
  })
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
  carouselapi.toggleEnabled({
    id: current.id,
    enabled: String(current.enabled)
  })
  carouselapi.toggleEnabled({
    id: next.id,
    enabled: String(next.enabled)
  })
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
</style>
