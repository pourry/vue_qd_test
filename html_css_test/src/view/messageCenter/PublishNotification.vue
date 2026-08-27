<template>
  <div class="publish-notification">
    <!-- 头部区域：标题 + 页签 -->
    <div class="header-section">
      <div class="page-header">
        <h2 class="page-title">发布管理</h2>
        <span class="page-desc">发布系统通知，管理已发布的通知</span>
      </div>
      
      <!-- 页签切换 -->
      <div class="tabs-wrapper">
        <el-tabs v-model="activeTab" tab-position="top" class="publish-tabs" @tab-change="handleTabChange">
        <el-tab-pane label="发布信息" name="publish">
          <!-- 发布表单 -->
          <div class="form-container">
            <el-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              class="publish-form"
            >
              <!-- 通知类型 -->
              <el-form-item label="通知类型" prop="type">
                <div class="type-selector">
                  <div
                    v-for="type in notificationTypes"
                    :key="type.value"
                    class="type-option"
                    :class="{ active: formData.type === type.value }"
                    @click="selectType(type.value)"
                  >
                    <span class="type-icon">{{ getTypeIcon(type.value) }}</span>
                    <span class="type-name">{{ type.label }}</span>
                  </div>
                </div>
              </el-form-item>

              <!-- 通知标题 -->
              <el-form-item label="通知标题" prop="title">
                <el-input
                  v-model="formData.title"
                  placeholder="请输入通知标题"
                  maxlength="50"
                  show-word-limit
                  clearable
                />
              </el-form-item>

              <!-- 通知内容 -->
              <el-form-item label="通知内容" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  placeholder="请输入通知内容"
                  :rows="6"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>

              <!-- 接收者范围 -->
              <el-form-item label="接收范围" prop="scope">
                <el-radio-group v-model="formData.scope" @change="handleScopeChange">
                  <el-radio value="all">全体用户</el-radio>
                  <el-radio value="specific">指定用户</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- 指定用户选择 -->
              <el-form-item v-if="formData.scope === 'specific'" label="选择用户" prop="receiverIds">
                <el-select
                  v-model="formData.receiverIds"
                  multiple
                  placeholder="请选择接收通知的用户"
                  filterable
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 100%"
                >
                  <el-option
                    v-for="user in userList"
                    :key="user.id"
                    :label="user.nickname || user.username"
                    :value="user.id"
                  />
                </el-select>
                <div class="user-tip">
                  <el-button type="primary" link @click="refreshUserList">刷新用户列表</el-button>
                </div>
              </el-form-item>

              <!-- 预览 -->
              <el-form-item label="通知预览">
                <div class="preview-card" :class="formData.type">
                  <div class="preview-header">
                    <span class="preview-icon">{{ getTypeIcon(formData.type) }}</span>
                    <span class="preview-title">{{ formData.title || '通知标题' }}</span>
                  </div>
                  <div class="preview-content">{{ formData.description || '通知内容预览...' }}</div>
                  <div class="preview-meta">
                    <span class="preview-type">{{ getTypeText(formData.type) }}</span>
                    <span class="preview-scope">
                      {{ formData.scope === 'all' ? '全体用户' : '已选 ' + formData.receiverIds.length + ' 位用户' }}
                    </span>
                  </div>
                </div>
              </el-form-item>

              <!-- 操作按钮 -->
              <el-form-item>
                <div class="form-actions">
                  <el-button @click="handleReset">重置</el-button>
                  <el-button
                    type="primary"
                    :loading="submitting"
                    :disabled="!canSubmit"
                    @click="handleSubmit"
                  >
                    发布通知
                  </el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="发布内容" name="manage">
          <!-- 已发布通知列表（按批次显示） -->
          <div class="manage-container">
            <!-- 查询条件 -->
            <div class="filter-bar">
              <div class="filter-item">
                <label>通知类型</label>
                <el-select v-model="searchFilters.type" placeholder="全部类型" clearable>
                  <el-option
                    v-for="type in notificationTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </div>
              <div class="filter-item keyword-filter">
                <label>关键词</label>
                <el-input
                  v-model="searchFilters.keyword"
                  placeholder="搜索标题或内容"
                  clearable
                  @keyup.enter="handleSearch"
                />
              </div>
              <div class="filter-item date-filter">
                <label>发布日期</label>
                <el-date-picker
                  v-model="searchFilters.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
              </div>
              <div class="filter-actions">
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleResetFilters">重置</el-button>
              </div>
            </div>

            <div class="manage-header">
              <span class="manage-count">共 {{ pagination.total }} 条发布</span>
              <el-button type="primary" link @click="loadPublishedList">刷新列表</el-button>
            </div>
            
            <div v-if="publishedList.length === 0 && !listLoading" class="empty-state">
              <span class="empty-icon">📭</span>
              <p>暂无已发布的通知</p>
              <el-button type="primary" @click="activeTab = 'publish'">去发布</el-button>
            </div>
            
            <div v-else class="notice-list">
              <div
                v-for="item in publishedList"
                :key="item.batchId"
                class="notice-item"
                :class="item.type"
              >
                <div class="notice-main">
                  <div class="notice-header">
                    <span class="notice-type">{{ getTypeIcon(item.type) }} {{ getTypeText(item.type) }}</span>
                    <span class="notice-time">{{ item.createTime }}</span>
                  </div>
                  <h4 class="notice-title">{{ item.title }}</h4>
                  <p class="notice-desc">{{ item.description }}</p>
                  <div class="notice-meta">
                    <span class="notice-receivers">
                      👥 已发送给 {{ item.receiverCount }} 位用户
                    </span>
                    <el-button 
                      type="primary" 
                      link 
                      size="small"
                      @click="viewDetail(item)"
                    >
                      查看接收者详情
                    </el-button>
                  </div>
                </div>
                <div class="notice-actions">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(item)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="danger"
                    size="small"
                    :loading="deletingId === item.batchId"
                    @click="handleDelete(item)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
              
              <!-- 分页组件 -->
              <div v-if="pagination.total > 0" class="pagination-container">
                <el-pagination
                  v-model:current-page="pagination.page"
                  v-model:page-size="pagination.size"
                  :page-sizes="[10, 20, 50, 100]"
                  :total="pagination.total"
                  layout="total, sizes, prev, pager, next, jumper"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </div>
            
            <div v-if="listLoading" class="loading-state">
              <span class="loading-icon">⏳</span>
              <p>加载中...</p>
            </div>
          </div>
          
          <!-- 编辑通知弹窗 -->
          <el-dialog 
            v-model="editVisible" 
            title="编辑通知" 
            width="560px"
            :close-on-click-modal="false"
            class="edit-dialog"
          >
            <el-form
              :model="editForm"
              :rules="editRules"
              ref="editFormRef"
              class="edit-form"
            >
              <el-form-item label="通知类型" prop="type">
                <div class="type-selector">
                  <div
                    v-for="type in notificationTypes"
                    :key="type.value"
                    class="type-option"
                    :class="{ active: editForm.type === type.value }"
                    @click="editForm.type = type.value"
                  >
                    <span class="type-icon">{{ getTypeIcon(type.value) }}</span>
                    <span class="type-name">{{ type.label }}</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="通知标题" prop="title">
                <el-input
                  v-model="editForm.title"
                  placeholder="请输入通知标题"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="通知内容" prop="description">
                <el-input
                  v-model="editForm.description"
                  type="textarea"
                  placeholder="请输入通知内容"
                  :rows="6"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="editVisible = false">取消</el-button>
              <el-button 
                type="primary" 
                :loading="editSubmitting"
                @click="handleSaveEdit"
              >
                保存修改
              </el-button>
            </template>
          </el-dialog>
          
          <!-- 接收者详情弹窗 -->
          <el-dialog 
            v-model="detailVisible" 
            title="接收者详情" 
            width="720px"
            :close-on-click-modal="false"
            class="receiver-detail-dialog"
          >
            <div v-if="detailLoading" class="loading-state">
              <span class="loading-icon">⏳</span>
              <p>加载中...</p>
            </div>
            <div v-else class="detail-content">
              <!-- 通知信息卡片 -->
              <div class="notice-info-card">
                <div class="info-header">
                  <el-tag :type="getTypeTag(currentDetail.type)" effect="dark" round>
                    {{ getTypeText(currentDetail.type) }}
                  </el-tag>
                  <h3 class="detail-title">{{ currentDetail.title }}</h3>
                </div>
                <p class="detail-desc" v-if="currentDetail.description">{{ currentDetail.description }}</p>
                <div class="stats-row">
                  <div class="stat-card total">
                    <div class="stat-icon">👥</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ receiverTotal }}</span>
                      <span class="stat-label">接收者总数</span>
                    </div>
                  </div>
                  <div class="stat-card read">
                    <div class="stat-icon">✅</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ receiverReadCount }}</span>
                      <span class="stat-label">已读</span>
                    </div>
                  </div>
                  <div class="stat-card unread">
                    <div class="stat-icon">📖</div>
                    <div class="stat-info">
                      <span class="stat-value">{{ receiverTotal - receiverReadCount }}</span>
                      <span class="stat-label">未读</span>
                    </div>
                  </div>
                </div>
                <!-- 进度条 -->
                <div class="progress-section" v-if="receiverTotal > 0">
                  <div class="progress-bar">
                    <div 
                      class="progress-read" 
                      :style="{ width: (receiverReadCount / receiverTotal * 100) + '%' }"
                    ></div>
                  </div>
                  <span class="progress-text">
                    已读率 {{ Math.round(receiverReadCount / receiverTotal * 100) }}%
                  </span>
                </div>
              </div>
              
              <!-- 接收者列表 -->
              <div class="receivers-section">
                <div class="section-header">
                  <span class="section-title">接收者列表</span>
                  <span class="section-count" v-if="receiverTotal > 0">共 {{ receiverTotal }} 人</span>
                </div>
                
                <div v-if="receiverList.length === 0" class="empty-state">
                  <el-empty description="暂无接收者" :image-size="80" />
                </div>
                
                <div v-else class="receivers-list">
                  <div 
                    v-for="(receiver, index) in receiverList" 
                    :key="receiver.id"
                    class="receiver-item"
                    :class="{ read: Number(receiver.isRead) === 1 }"
                  >
                    <div class="receiver-avatar" :class="{ read: Number(receiver.isRead) === 1 }">
                      {{ (receiver.receiverName || '?').charAt(0).toUpperCase() }}
                    </div>
                    <div class="receiver-info">
                      <div class="receiver-name-row">
                        <span class="receiver-name">{{ receiver.receiverName || '未知用户' }}</span>
                        <el-tag 
                          :type="Number(receiver.isRead) === 1 ? 'success' : 'warning'"
                          size="small"
                          effect="plain"
                          round
                        >
                          {{ Number(receiver.isRead) === 1 ? '已读' : '未读' }}
                        </el-tag>
                      </div>
                      <div class="receiver-meta">
                        <span class="meta-item" v-if="receiver.receiverEmail">
                          <span class="meta-icon">📧</span>{{ receiver.receiverEmail }}
                        </span>
                        <span class="meta-item" v-if="receiver.receiverPhone">
                          <span class="meta-icon">📱</span>{{ receiver.receiverPhone }}
                        </span>
                        <span class="meta-item">
                          <span class="meta-icon">🕐</span>{{ formatTime(receiver.createTime) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 分页 -->
                <div v-if="receiverTotal > 0" class="pagination-wrapper">
                  <el-pagination
                    v-model:current-page="receiverPage"
                    v-model:page-size="receiverPageSize"
                    :total="receiverTotal"
                    :page-sizes="[10, 20, 50]"
                    layout="total, sizes, prev, pager, next, jumper"
                    background
                    small
                    @size-change="loadReceivers"
                    @current-change="loadReceivers"
                  />
                </div>
              </div>
            </div>
            <template #footer>
              <el-button type="primary" @click="detailVisible = false">关闭</el-button>
            </template>
          </el-dialog>
        </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 动态内容已在 tabs 中 -->
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import messageCenterApi from '@/api/messageCenter'
import { ElMessage, ElMessageBox } from 'element-plus'

// 当前激活的页签
const activeTab = ref('manage')

// 表单引用
const formRef = ref(null)
const submitting = ref(false)

// 通知类型选项
const notificationTypes = [
  { value: 'info', label: '信息通知', icon: 'ℹ️', color: 'info' },
  { value: 'warning', label: '警告通知', icon: '⚠️', color: 'warning' },
  { value: 'success', label: '成功通知', icon: '✅', color: 'success' },
  { value: 'announcement', label: '系统公告', icon: '📢', color: 'announcement' }
]

// 表单数据
const formData = reactive({
  type: 'info',
  title: '',
  description: '',
  scope: 'all',
  receiverIds: []
})

// 表单验证规则
const formRules = {
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入通知内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度在 5 到 500 个字符', trigger: 'blur' }
  ],
  scope: [{ required: true, message: '请选择接收范围', trigger: 'change' }],
  receiverIds: [
    {
      validator: (rule, value, callback) => {
        if (formData.scope !== 'specific') {
          callback()
          return
        }
        if (!value || value.length === 0) {
          callback(new Error('请至少选择一位用户'))
        } else {
          callback()
        }
      },
      trigger: ['change', 'blur']
    }
  ]
}

// 用户列表
const userList = ref([])

// 已发布通知列表
const publishedList = ref([])
const deletingId = ref(null)
const listLoading = ref(false)

// 查询条件
const searchFilters = reactive({
  type: '',
  keyword: '',
  dateRange: null
})
const appliedFilters = reactive({
  type: '',
  keyword: '',
  dateRange: null
})

// 接收者详情弹窗
const detailVisible = ref(false)
const detailLoading = ref(false)
const currentDetail = ref({})
const receiverList = ref([])
const receiverTotal = ref(0)
const receiverReadCount = ref(0)
const receiverPage = ref(1)
const receiverPageSize = ref(10)

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
  totalPages: 0
})

// 是否可以提交
const canSubmit = computed(() => {
  const hasTitle = formData.title.trim().length > 0
  const hasDesc = formData.description.trim().length > 0
  const validScope = formData.scope === 'all' || 
                     (formData.scope === 'specific' && formData.receiverIds.length > 0)
  return hasTitle && hasDesc && validScope
})

// 获取类型图标
const getTypeIcon = (type) => {
  const found = notificationTypes.find(t => t.value === type)
  return found ? found.icon : '📌'
}

// 获取类型文字
const getTypeText = (type) => {
  const found = notificationTypes.find(t => t.value === type)
  return found ? found.label : '未知'
}

// 选择通知类型
const selectType = (type) => {
  formData.type = type
}

// 处理范围变化
const handleScopeChange = () => {
  if (formData.scope === 'all') {
    formData.receiverIds = []
  }
  if (formRef.value) {
    formRef.value.clearValidate('receiverIds')
  }
}

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await messageCenterApi.getAllUsers()
    if (res?.code === 200 && Array.isArray(res.resultValue) && res.resultValue.length > 0) {
      userList.value = res.resultValue.map(item => ({
        id: item.id,
        username: item.username,
        nickname: item.nickname
      }))
    } else {
      setDefaultUsers()
    }
  } catch (e) {
    console.warn('获取用户列表失败:', e)
    setDefaultUsers()
  }
}

// 设置默认用户列表
const setDefaultUsers = () => {
  userList.value = [
    { id: '1', username: 'admin', nickname: '管理员' },
    { id: '2', username: 'user1', nickname: '用户1' },
    { id: '3', username: 'user2', nickname: '用户2' },
    { id: '4', username: 'user3', nickname: '用户3' }
  ]
}

// 刷新用户列表
const refreshUserList = async () => {
  await loadUserList()
  ElMessage.success('用户列表已刷新')
}

// 加载已发布通知列表（分页，按批次去重）
const loadPublishedList = async () => {
  listLoading.value = true
  try {
    const params = {
      page: pagination.page,
      size: pagination.size
    }
    // 添加查询条件
    if (appliedFilters.type) params.type = appliedFilters.type
    if (appliedFilters.keyword) params.keyword = appliedFilters.keyword
    if (appliedFilters.dateRange && appliedFilters.dateRange.length === 2) {
      params.startDate = appliedFilters.dateRange[0]
      params.endDate = appliedFilters.dateRange[1]
    }

    const res = await messageCenterApi.getPublishedBatchesPaged(params)
    if (res?.code === 200 && res.resultValue) {
      publishedList.value = res.resultValue.list || []
      pagination.total = res.resultValue.total || 0
      pagination.totalPages = res.resultValue.totalPages || 0
    } else {
      publishedList.value = []
      pagination.total = 0
    }
  } catch (e) {
    console.warn('获取已发布通知失败:', e)
    publishedList.value = []
    pagination.total = 0
  } finally {
    listLoading.value = false
  }
}

// 查询
const handleSearch = () => {
  appliedFilters.type = searchFilters.type
  appliedFilters.keyword = searchFilters.keyword.trim()
  appliedFilters.dateRange = searchFilters.dateRange ? [...searchFilters.dateRange] : null
  pagination.page = 1
  loadPublishedList()
}

// 重置查询条件
const handleResetFilters = () => {
  searchFilters.type = ''
  searchFilters.keyword = ''
  searchFilters.dateRange = null
  appliedFilters.type = ''
  appliedFilters.keyword = ''
  appliedFilters.dateRange = null
  pagination.page = 1
  loadPublishedList()
}

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  pagination.size = newSize
  pagination.page = 1
  loadPublishedList()
}

// 处理当前页变化
const handleCurrentChange = (newPage) => {
  pagination.page = newPage
  loadPublishedList()
}

// 重置表单
const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formData.type = 'info'
    formData.title = ''
    formData.description = ''
    formData.scope = 'all'
    formData.receiverIds = []
    formRef.value?.clearValidate()
  }).catch(() => {})
}

// 提交发布
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    const scopeText = formData.scope === 'all' ? '全体用户' : formData.receiverIds.length + ' 位用户'
    await ElMessageBox.confirm(
      '确定要发布这条通知吗？（将发送给' + scopeText + '）',
      '发布确认',
      {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info'
      }
    )
    
    submitting.value = true
    
    const data = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      scope: formData.scope
    }
    
    if (formData.scope === 'specific' && formData.receiverIds.length > 0) {
      data.receiverIds = formData.receiverIds.join(',')
    }
    
    const res = await messageCenterApi.publishNotification(data)
    
    if (res?.code === 200) {
      ElMessage.success('通知发布成功！')
      formData.title = ''
      formData.description = ''
      formRef.value?.clearValidate()
      // 切换到发布管理页签并刷新列表
      activeTab.value = 'manage'
      pagination.page = 1
      loadPublishedList()
    } else {
      ElMessage.error(res?.resultValue || '发布失败，请重试')
    }
  } catch (e) {
    if (e !== 'cancel' && e !== 'close') {
      console.error('发布通知失败:', e)
      ElMessage.error('发布失败，请检查网络后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 删除发布的通知（整个批次）
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这条通知吗？该通知已发送给 ${item.receiverCount} 位用户，删除后不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    deletingId.value = item.batchId
    const res = await messageCenterApi.deletePublishedBatch(item.batchId)
    
    if (res?.code === 200) {
      ElMessage.success('删除成功！')
      loadPublishedList()
    } else {
      ElMessage.error(res?.resultValue || '删除失败，请重试')
    }
  } catch (e) {
    if (e !== 'cancel' && e !== 'close') {
      console.error('删除通知失败:', e)
      ElMessage.error('删除失败，请检查网络后重试')
    }
  } finally {
    deletingId.value = null
  }
}

// 查看接收者详情
const viewDetail = async (item) => {
  currentDetail.value = {
    title: item.title,
    description: item.description,
    type: item.type,
    batchId: item.batchId
  }
  receiverPage.value = 1
  receiverPageSize.value = 10
  detailVisible.value = true
  detailLoading.value = true
  receiverList.value = []
  receiverTotal.value = 0
  receiverReadCount.value = 0
  
  await loadReceivers()
}

// 加载接收者列表（分页）
const loadReceivers = async () => {
  detailLoading.value = true
  try {
    const res = await messageCenterApi.getBatchReceiversPaged({
      batchId: currentDetail.value.batchId,
      page: receiverPage.value,
      size: receiverPageSize.value
    })
    if (res?.code === 200 && res.resultValue) {
      receiverList.value = res.resultValue.list || []
      receiverTotal.value = res.resultValue.total || 0
      receiverReadCount.value = res.resultValue.readCount || 0
    } else {
      receiverList.value = []
      receiverTotal.value = 0
      receiverReadCount.value = 0
    }
  } catch (e) {
    console.error('获取接收者详情失败:', e)
    receiverList.value = []
    receiverTotal.value = 0
    receiverReadCount.value = 0
  } finally {
    detailLoading.value = false
  }
}

// 获取类型标签颜色
const getTypeTag = (type) => {
  const map = { info: 'info', warning: 'warning', success: 'success', announcement: 'primary' }
  return map[type] || 'info'
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return '-'
  return time.replace('T', ' ').substring(0, 19)
}

// 监听页签切换
const handleTabChange = (tab) => {
  if (tab === 'manage') {
    loadPublishedList()
  }
}

// 挂载时加载数据
onMounted(() => {
  loadUserList()
  // 默认加载发布管理列表
  loadPublishedList()
})

// ===== 编辑通知相关 =====
const editVisible = ref(false)
const editSubmitting = ref(false)
const editFormRef = ref(null)
const editForm = reactive({
  batchId: '',
  title: '',
  description: '',
  type: 'info'
})
const editRules = {
  type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
  title: [
    { required: true, message: '请输入通知标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入通知内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度在 5 到 500 个字符', trigger: 'blur' }
  ]
}

// 打开编辑对话框
const handleEdit = (item) => {
  editForm.batchId = item.batchId
  editForm.title = item.title
  editForm.description = item.description
  editForm.type = item.type || 'info'
  editVisible.value = true
  nextTick(() => {
    editFormRef.value?.clearValidate()
  })
}

// 保存编辑
const handleSaveEdit = async () => {
  if (!editFormRef.value) return
  try {
    await editFormRef.value.validate()
    editSubmitting.value = true
    const res = await messageCenterApi.updatePublishedBatch({
      batchId: editForm.batchId,
      title: editForm.title,
      description: editForm.description,
      type: editForm.type
    })
    if (res?.code === 200) {
      ElMessage.success('更新成功！')
      editVisible.value = false
      loadPublishedList()
    } else {
      ElMessage.error(res?.resultValue || '更新失败，请重试')
    }
  } catch (e) {
    if (e !== 'cancel' && e !== 'close') {
      console.error('更新通知失败:', e)
      ElMessage.error('更新失败，请检查网络后重试')
    }
  } finally {
    editSubmitting.value = false
  }
}

// 监听页签变化
watch(activeTab, (newVal) => {
  if (newVal === 'manage') {
    loadPublishedList()
  }
})
</script>

<style scoped>
.publish-notification {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--theme-bg-page);
  overflow: hidden;
}

/* 头部区域：标题 + 页签 融合成一个整体卡片 */
.header-section {
  background: var(--theme-bg-card);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin: 20px 28px 0;
  overflow: hidden;
}

.page-header {
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, var(--theme-primary-light, #ecf5ff) 0%, var(--theme-bg-card) 60%);
  position: relative;
}

.page-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0 0 4px 0;
  letter-spacing: 0.5px;
}

.page-desc {
  font-size: 12px;
  color: var(--theme-text-secondary);
  opacity: 0.7;
}

/* 页签包裹区 - 与头部无缝连接 */
.tabs-wrapper {
  padding: 0 8px 8px;
  background: var(--theme-bg-card);
}

.publish-tabs {
  width: 100%;
}

.publish-tabs :deep(.el-tabs__header) {
  margin: 0 !important;
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border-bottom: 2px solid var(--theme-border-light);
}

.publish-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.publish-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  color: var(--theme-text-regular);
  height: 42px;
  line-height: 42px;
  padding: 0 24px;
  border-radius: 0;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.publish-tabs :deep(.el-tabs__item:hover) {
  color: var(--theme-primary);
  background: var(--theme-primary-light, #ecf5ff);
}

.publish-tabs :deep(.el-tabs__item.is-active) {
  color: var(--theme-primary);
  font-weight: 600;
  border-bottom-color: var(--theme-primary);
}

.publish-tabs :deep(.el-tabs__active-bar) {
  display: none;
}

.publish-tabs :deep(.el-tabs__content) {
  padding: 20px 24px;
  background: var(--theme-bg-card);
}

.publish-tabs :deep(.el-tab-pane) {
  padding: 0;
}

/* 内容区域 - 与头部卡片有间距 */
.content-area {
  padding: 20px 28px;
}

/* 发布表单样式 */
.form-container {
  padding: 0;
}

.publish-form {
  max-width: 800px;
  background: var(--theme-bg-card);
  padding: 32px;
  border-radius: 16px;
}

.type-selector {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 2px solid var(--theme-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--theme-bg-page);
}

.type-option:hover {
  border-color: var(--theme-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.type-option.active {
  border-color: var(--theme-primary);
  background: var(--theme-primary-light, #ecf5ff);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
}

.type-icon {
  font-size: 20px;
}

.type-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.user-tip {
  margin-top: 10px;
}

.preview-card {
  width: 100%;
  max-width: 420px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid var(--theme-border-light);
  background: var(--theme-bg-page);
  transition: all 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.preview-card.info {
  border-left: 4px solid var(--theme-info);
  background: linear-gradient(135deg, var(--theme-info-light, #edf2fc) 0%, var(--theme-bg-page) 100%);
}

.preview-card.warning {
  border-left: 4px solid var(--theme-warning);
  background: linear-gradient(135deg, var(--theme-warning-light, #fdf6ec) 0%, var(--theme-bg-page) 100%);
}

.preview-card.success {
  border-left: 4px solid var(--theme-success);
  background: linear-gradient(135deg, var(--theme-success-light, #f0f9eb) 0%, var(--theme-bg-page) 100%);
}

.preview-card.announcement {
  border-left: 4px solid var(--theme-primary);
  background: linear-gradient(135deg, var(--theme-primary-light, #ecf5ff) 0%, var(--theme-bg-page) 100%);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.preview-icon {
  font-size: 22px;
}

.preview-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--theme-text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-content {
  font-size: 14px;
  color: var(--theme-text-regular);
  line-height: 1.7;
  margin-bottom: 14px;
  min-height: 44px;
}

.preview-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--theme-text-placeholder);
}

.preview-type {
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--theme-bg-card);
  font-weight: 500;
}

.preview-scope {
  font-weight: 600;
  color: var(--theme-primary);
}

.form-actions {
  display: flex;
  gap: 14px;
  justify-content: flex-end;
  width: 100%;
  padding-top: 24px;
  margin-top: 16px;
  border-top: 1px solid var(--theme-border-light);
}

/* 发布管理样式 */
.manage-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 查询条件样式 */
.filter-bar {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  background: var(--theme-bg-card);
  padding: 14px 16px;
  border-radius: var(--theme-radius-lg);
  border: 1px solid var(--theme-border-light);
  flex-wrap: wrap;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 160px;
}
.filter-item label {
  font-size: 12px;
  color: var(--theme-text-secondary);
  font-weight: 500;
}
.filter-item .el-select,
.filter-item .el-input {
  width: 100%;
}
.keyword-filter {
  flex: 1;
  min-width: 200px;
}
.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.filter-actions .el-button {
  height: 34px;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: var(--theme-bg-page);
  border-radius: 12px;
}

.manage-count {
  font-size: 14px;
  color: var(--theme-text-secondary);
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: var(--theme-bg-page);
  border-radius: 16px;
}

.empty-icon {
  font-size: 56px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 15px;
  color: var(--theme-text-secondary);
  margin: 0 0 20px;
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 20px 24px;
  background: var(--theme-bg-card);
  border-radius: 12px;
  border: 1px solid var(--theme-border-light);
  border-left: 5px solid var(--theme-info);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.notice-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, var(--theme-primary-light, #ecf5ff) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.notice-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.notice-item:hover::before {
  opacity: 0.05;
}

.notice-item.info {
  border-left-color: var(--theme-info);
}

.notice-item.warning {
  border-left-color: var(--theme-warning);
}

.notice-item.success {
  border-left-color: var(--theme-success);
}

.notice-item.announcement {
  border-left-color: var(--theme-primary);
}

.notice-main {
  flex: 1;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.notice-type {
  font-size: 12px;
  font-weight: 600;
  color: var(--theme-primary);
  padding: 4px 12px;
  background: var(--theme-primary-light, #ecf5ff);
  border-radius: 8px;
  letter-spacing: 0.5px;
}

.notice-time {
  font-size: 12px;
  color: var(--theme-text-placeholder);
  display: flex;
  align-items: center;
  gap: 4px;
}

.notice-time::before {
  content: '🕐';
  font-size: 14px;
}

.notice-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0 0 10px;
  line-height: 1.4;
}

.notice-desc {
  font-size: 14px;
  color: var(--theme-text-regular);
  line-height: 1.7;
  margin: 0 0 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-meta {
  display: flex;
  gap: 14px;
  align-items: center;
}

.notice-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
  background: var(--theme-bg-page);
  color: var(--theme-text-secondary);
}

.notice-status.unread {
  background: var(--theme-warning-light, #fdf6ec);
  color: var(--theme-warning);
  animation: blink 2s ease-in-out infinite;
}

.notice-receivers {
  font-size: 13px;
  font-weight: 500;
  color: var(--theme-primary);
  padding: 4px 12px;
  background: var(--theme-primary-light, #ecf5ff);
  border-radius: 8px;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 8px;
}

.detail-desc {
  font-size: 14px;
  color: var(--theme-text-regular);
  line-height: 1.6;
  margin: 0;
}

.receiver-list {
  max-height: 300px;
  overflow-y: auto;
}

.receiver-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--theme-border-light);
}

.receiver-item:last-child {
  border-bottom: none;
}

.receiver-id {
  font-size: 13px;
  color: var(--theme-text-primary);
  font-weight: 500;
}

.receiver-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--theme-bg-page);
  color: var(--theme-text-secondary);
}

.receiver-status.unread {
  background: var(--theme-warning-light, #fdf6ec);
  color: var(--theme-warning);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.notice-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding: 20px;
  background: var(--theme-bg-page);
  border-radius: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--theme-text-primary);
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  background: var(--theme-bg-page);
  border-radius: 8px;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-radio__label) {
  color: var(--theme-text-regular);
  font-weight: 500;
}

/* 滚动条样式 */
:deep(.el-tabs__content::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-tabs__content::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.el-tabs__content::-webkit-scrollbar-thumb) {
  background: var(--theme-border);
  border-radius: 3px;
}

:deep(.el-tabs__content::-webkit-scrollbar-thumb:hover) {
  background: var(--theme-text-placeholder);
}

/* 接收者详情弹窗样式 */
.receiver-detail-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
  }
  
  :deep(.el-dialog__header) {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--theme-border-light);
    margin-right: 0;
    
    .el-dialog__title {
      font-size: 18px;
      font-weight: 700;
      color: var(--theme-text-primary);
    }
  }
  
  :deep(.el-dialog__body) {
    padding: 24px;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid var(--theme-border-light);
    text-align: right;
  }
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 通知信息卡片 */
.notice-info-card {
  background: linear-gradient(135deg, var(--theme-primary-light, #ecf5ff) 0%, var(--theme-bg-card) 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--theme-border-light);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-desc {
  font-size: 14px;
  color: var(--theme-text-regular);
  line-height: 1.6;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 统计卡片行 */
.stats-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--theme-bg-card);
  border-radius: 10px;
  border: 1px solid var(--theme-border-light);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--theme-bg-page);
}

.stat-card.total .stat-icon {
  background: var(--theme-primary-light, #ecf5ff);
}

.stat-card.read .stat-icon {
  background: var(--theme-success-light, #f0f9eb);
}

.stat-card.unread .stat-icon {
  background: var(--theme-warning-light, #fdf6ec);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--theme-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--theme-text-secondary);
  margin-top: 4px;
}

/* 进度条 */
.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--theme-border-light);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--theme-bg-page);
  border-radius: 4px;
  overflow: hidden;
}

.progress-read {
  height: 100%;
  background: linear-gradient(90deg, var(--theme-success, #67c23a) 0%, var(--theme-primary, #409eff) 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 13px;
  color: var(--theme-text-secondary);
  white-space: nowrap;
}

/* 接收者列表 */
.receivers-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--theme-text-primary);
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: var(--theme-primary);
  border-radius: 2px;
}

.section-count {
  font-size: 13px;
  color: var(--theme-text-placeholder);
}

.receivers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 接收者卡片 */
.receiver-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--theme-bg-card);
  border-radius: 10px;
  border: 1px solid var(--theme-border-light);
  transition: all 0.2s ease;
}

.receiver-item:hover {
  border-color: var(--theme-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.receiver-item.read {
  background: var(--theme-success-light, #f0f9eb);
  border-color: var(--theme-border-light);
}

.receiver-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--theme-primary, #409eff) 0%, var(--theme-info, #909399) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

.receiver-avatar.read {
  background: linear-gradient(135deg, var(--theme-success, #67c23a) 0%, #85ce61 100%);
}

.receiver-info {
  flex: 1;
  min-width: 0;
}

.receiver-name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.receiver-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
}

.receiver-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.meta-item {
  font-size: 12px;
  color: var(--theme-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-icon {
  font-size: 13px;
}

/* 分页 */
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--theme-border-light);
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
}

.loading-icon {
  font-size: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 14px;
  color: var(--theme-text-secondary);
  margin: 0;
}

/* 编辑弹窗样式 */
.edit-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
  }
  :deep(.el-dialog__header) {
    padding: 20px 24px 16px;
    border-bottom: 1px solid var(--theme-border-light);
    margin-right: 0;
  }
  :deep(.el-dialog__body) {
    padding: 24px;
  }
  :deep(.el-dialog__footer) {
    padding: 16px 24px;
    border-top: 1px solid var(--theme-border-light);
  }
}

.edit-form {
  :deep(.el-form-item__label) {
    font-weight: 600;
    color: var(--theme-text-primary);
  }
}
</style>

