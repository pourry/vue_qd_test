<template>
  <div class="other-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="back-btn" @click="goBack">
          <el-icon :size="18"><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
      </div>
      <div class="header-center">
        <el-icon :size="22" class="page-accent-icon"><Files /></el-icon>
        <h1 class="page-title">综合收藏</h1>
        <span class="count-badge" v-if="!loading">{{ filteredList.length }} 项</span>
      </div>
      <div class="header-right">
        <!-- 视图切换按钮 -->
        <div class="view-toggle">
          <el-tooltip content="卡片视图" placement="bottom">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              <el-icon :size="16"><Grid /></el-icon>
            </button>
          </el-tooltip>
          <el-tooltip content="列表视图" placement="bottom">
            <button
              class="toggle-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
            >
              <el-icon :size="16"><List /></el-icon>
            </button>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- 搜索筛选栏 -->
    <div class="filter-bar">
      <el-select
        v-model="searchType"
        placeholder="类型"
        clearable
        style="width:130px"
      >
        <el-option
          v-for="opt in typeOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-select
        v-model="searchStatus"
        placeholder="状态"
        clearable
        style="width:130px"
      >
        <el-option
          v-for="opt in STATUS_OPTIONS"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-input
        v-model="searchKeyword"
        placeholder="搜索标题、备注或标签"
        clearable
        @keyup.enter="applyFilter"
        style="flex:1"
      />
      <el-button type="primary" :icon="Search" @click="applyFilter">查询</el-button>
      <el-button :icon="Refresh" @click="resetFilter">重置</el-button>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrapper" v-if="loading">
      <el-icon :size="40" class="loading-icon"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div class="empty-wrapper" v-else-if="filteredList.length === 0">
      <el-icon :size="60" class="empty-icon"><DocumentDelete /></el-icon>
      <p>暂无符合条件的综合收藏数据</p>
    </div>

    <!-- 卡片视图 -->
    <div class="list-content" v-else-if="viewMode === 'grid'">
      <div class="card-grid">
        <div
          v-for="item in filteredList"
          :key="item.id"
          class="other-card"
          @click="openItem(item)"
        >
          <div class="card-img-wrapper">
            <el-image
              class="card-img"
              :src="item.pictureUrl"
              fit="cover"
              :preview-src-list="item.pictureUrl ? [item.pictureUrl] : []"
              :preview-teleported="false"
            >
              <template #error>
                <div class="img-error">
                  <el-icon :size="28"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div class="card-overlay">
              <el-icon :size="20"><View /></el-icon>
            </div>
            <div class="card-badges">
              <el-tag
                v-if="getTypeInfo(item.typeValue)"
                size="small"
                effect="dark"
                class="type-badge"
                :style="{ background: getTypeInfo(item.typeValue).color }"
              >
                {{ getTypeInfo(item.typeValue).label }}
              </el-tag>
              <el-tag
                size="small"
                :type="getStatusTagType(item.status)"
                effect="light"
                class="status-badge"
              >
                {{ getStatusLabel(item.status) }}
              </el-tag>
            </div>
            <div class="share-badge" v-if="item.linkUrl">
              <el-icon :size="12"><Link /></el-icon>
              已链接
            </div>
          </div>
          <div class="card-info">
            <h3 class="card-title" :title="item.title">{{ item.title }}</h3>
            <div class="card-detail-rows">
              <div class="detail-row" v-if="item.linkUrl" @click.stop>
                <el-icon :size="12"><Link /></el-icon>
                <a :href="item.linkUrl" target="_blank" :title="item.linkUrl">
                  {{ truncateText(item.linkUrl, 30) }}
                </a>
              </div>
              <div class="detail-row" v-if="item.note">
                <el-icon :size="12"><EditPen /></el-icon>
                <span :title="item.note">{{ truncateText(item.note, 25) }}</span>
              </div>
              <div class="detail-row" v-if="item.progress != null && item.status === 'doing'">
                <el-icon :size="12"><DataLine /></el-icon>
                <span>进度: {{ item.progress }}%</span>
              </div>
            </div>
            <div class="card-tags" v-if="item.tags && item.tags.length">
              <el-tag
                v-for="(tag, idx) in item.tags.slice(0, 3)"
                :key="idx"
                size="small"
                effect="plain"
                class="tag-item"
              >{{ tag }}</el-tag>
            </div>
            <div class="card-footer">
              <span class="meta-text" v-if="item.shareTime">
                <el-icon :size="12"><Clock /></el-icon>
                {{ item.shareTime }}
              </span>
              <el-button
                type="primary"
                size="small"
                text
                @click.stop="showDetail(item)"
              >详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表视图 -->
    <div class="list-content" v-else>
      <div class="list-view">
        <div
          v-for="item in filteredList"
          :key="item.id"
          class="list-item"
          @click="openItem(item)"
        >
          <div class="list-img-wrapper">
            <el-image
              class="list-img"
              :src="item.pictureUrl"
              fit="cover"
              :preview-src-list="item.pictureUrl ? [item.pictureUrl] : []"
              :preview-teleported="false"
            >
              <template #error>
                <div class="img-error">
                  <el-icon :size="24"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span class="list-type-badge" v-if="getTypeInfo(item.typeValue)">
              {{ getTypeInfo(item.typeValue).label }}
            </span>
          </div>
          <div class="list-info">
            <div class="list-info-top">
              <h3 class="list-title" :title="item.title">{{ item.title }}</h3>
              <el-tag
                size="small"
                :type="getStatusTagType(item.status)"
                effect="light"
              >
                {{ getStatusLabel(item.status) }}
              </el-tag>
            </div>
            <div class="list-tags" v-if="item.tags && item.tags.length">
              <el-tag
                v-for="(tag, idx) in item.tags.slice(0, 5)"
                :key="idx"
                size="small"
                effect="plain"
                class="tag-item"
              >{{ tag }}</el-tag>
            </div>
            <div class="list-detail-rows">
              <div class="detail-row" v-if="item.note">
                <el-icon :size="12"><EditPen /></el-icon>
                <span :title="item.note">备注: {{ truncateText(item.note, 60) }}</span>
              </div>
              <div class="detail-row" v-if="item.linkUrl" @click.stop>
                <el-icon :size="12"><Link /></el-icon>
                <a :href="item.linkUrl" target="_blank" :title="item.linkUrl">
                  链接: {{ truncateText(item.linkUrl, 50) }}
                </a>
              </div>
            </div>
            <div class="list-progress" v-if="item.status === 'doing' && item.progress != null">
              <el-progress :percentage="item.progress" :stroke-width="8" />
            </div>
            <div class="list-info-bottom">
              <div class="list-meta">
                <span class="meta-item" v-if="item.shareTime">
                  <el-icon :size="14"><Clock /></el-icon>
                  {{ item.shareTime }}
                </span>
                <span class="meta-item" v-if="item.createTime">
                  <el-icon :size="14"><Calendar /></el-icon>
                  {{ item.createTime }}
                </span>
                <span class="meta-item" v-if="item.linkUrl">
                  <el-icon :size="14"><Link /></el-icon>
                  <a :href="item.linkUrl" target="_blank" @click.stop>查看链接</a>
                </span>
              </div>
              <div class="list-actions">
                <el-button type="primary" size="small" round @click.stop="showDetail(item)">
                  <el-icon :size="14"><View /></el-icon>
                  详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="currentItem.title"
      width="480px"
      align-center
      class="detail-dialog"
    >
      <div class="detail-content" v-if="currentItem.id">
        <div class="detail-preview">
          <el-image
            v-if="currentItem.pictureUrl"
            :src="currentItem.pictureUrl"
            fit="cover"
            style="width:100%;max-height:220px;border-radius:8px"
            :preview-src-list="[currentItem.pictureUrl]"
          />
          <div v-else class="detail-preview-empty">
            <el-icon :size="40"><Picture /></el-icon>
            <span>暂无图片</span>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">标题</span>
            <span class="detail-value">{{ currentItem.title || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">类型</span>
            <el-tag
              v-if="getTypeInfo(currentItem.typeValue)"
              size="small"
              effect="dark"
              :style="{ background: getTypeInfo(currentItem.typeValue).color }"
            >{{ getTypeInfo(currentItem.typeValue).label }}</el-tag>
            <span v-else class="detail-value">{{ currentItem.typeValue || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态</span>
            <el-tag
              size="small"
              :type="getStatusTagType(currentItem.status)"
              effect="light"
            >{{ getStatusLabel(currentItem.status) }}</el-tag>
          </div>
          <div class="detail-item">
            <span class="detail-label">进度</span>
            <span class="detail-value">
              {{ currentItem.progress != null ? currentItem.progress + '%' : '-' }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">分享时间</span>
            <span class="detail-value">{{ currentItem.shareTime || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间</span>
            <span class="detail-value">{{ currentItem.createTime || '-' }}</span>
          </div>
          <div class="detail-item detail-item-full" v-if="currentItem.linkUrl">
            <span class="detail-label">链接</span>
            <a
              :href="currentItem.linkUrl"
              target="_blank"
              class="detail-link"
            >{{ currentItem.linkUrl }}</a>
          </div>
          <div class="detail-item detail-item-full" v-if="currentItem.tags && currentItem.tags.length">
            <span class="detail-label">标签</span>
            <div class="detail-tags">
              <el-tag
                v-for="(tag, idx) in currentItem.tags"
                :key="idx"
                size="small"
                effect="plain"
                class="tag-item"
              >{{ tag }}</el-tag>
            </div>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">备注</span>
            <span class="detail-value detail-notes">{{ currentItem.note || '-' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentItem.linkUrl"
          type="primary"
          @click="openItem(currentItem)"
        >访问链接</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ocapi from '@/api/otherCollection'

import {
  ArrowLeft, Grid, List, Search, Refresh, Loading,
  Picture, View, DocumentDelete, Link, Document, EditPen,
  Files, DataLine, Clock, Calendar, MagicStick, CollectionTag, Film, Headset, Reading
} from '@element-plus/icons-vue'

const router = useRouter()

// 类型映射
const TYPE_MAP = {
  book: { label: '书籍', color: '#6366f1', icon: 'Reading' },
  movie: { label: '电影', color: '#ef4444', icon: 'Film' },
  music: { label: '音乐', color: '#22c55e', icon: 'Headset' },
  quote: { label: '名言', color: '#f59e0b', icon: 'Document' },
  inspiration: { label: '灵感', color: '#ec4899', icon: 'MagicStick' },
  other: { label: '其他', color: '#64748b', icon: 'CollectionTag' },
}

const STATUS_OPTIONS = [
  { value: 'wish', label: '想做' },
  { value: 'doing', label: '进行中' },
  { value: 'done', label: '完成' },
  { value: 'dropped', label: '放弃' },
]

const typeOptions = computed(() => {
  return Object.entries(TYPE_MAP).map(([value, info]) => ({ value, label: info.label }))
})

// reactive state
const loading = ref(true)
const list = ref([])
const viewMode = ref('grid')
const searchKeyword = ref('')
const searchStatus = ref('')
const searchType = ref('')
const appliedKeyword = ref('')
const appliedStatus = ref('')
const appliedType = ref('')
const detailVisible = ref(false)
const currentItem = ref({})

// computed: 过滤后的列表
const filteredList = computed(() => {
  let arr = list.value
  if (appliedType.value) {
    arr = arr.filter(i => i.typeValue === appliedType.value)
  }
  if (appliedStatus.value) {
    arr = arr.filter(i => i.status === appliedStatus.value)
  }
  if (appliedKeyword.value) {
    const kw = appliedKeyword.value.toLowerCase()
    arr = arr.filter(i =>
      (i.title || '').toLowerCase().includes(kw) ||
      (i.note || '').toLowerCase().includes(kw) ||
      (i.tags || []).some(t => (t || '').toLowerCase().includes(kw))
    )
  }
  return arr
})

// onMounted: 加载数据
onMounted(async () => {
  loading.value = true
  try {
    // 先尝试用数字参数
    const res = await ocapi.publicShow(100)
    if (res && res.successful && res.resultValue) {
      list.value = res.resultValue
    } else if (res && res.data) {
      list.value = res.data
    } else {
      list.value = Array.isArray(res) ? res : []
    }
  } catch (e) {
    list.value = []
    ElMessage.warning('加载综合收藏失败')
  } finally {
    loading.value = false
  }
})

// 辅助方法
const getTypeInfo = (typeValue) => TYPE_MAP[typeValue] || { label: typeValue || '未知', color: '#64748b' }
const getStatusLabel = (s) => STATUS_OPTIONS.find(o => o.value === s)?.label || s || '未知'
const getStatusTagType = (s) => ({ wish: 'info', doing: 'primary', done: 'success', dropped: 'danger' }[s] || 'info')
const truncateText = (text, len) => text && text.length > len ? text.slice(0, len) + '...' : (text || '')

const showDetail = (item) => {
  currentItem.value = item
  detailVisible.value = true
}

const openItem = (item) => {
  if (item.linkUrl) {
    window.open(item.linkUrl, '_blank')
  } else {
    showDetail(item)
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/home')
  }
}

const applyFilter = () => {
  appliedKeyword.value = searchKeyword.value
  appliedStatus.value = searchStatus.value
  appliedType.value = searchType.value
}

const resetFilter = () => {
  searchKeyword.value = ''
  searchStatus.value = ''
  searchType.value = ''
  appliedKeyword.value = ''
  appliedStatus.value = ''
  appliedType.value = ''
}
</script>

<style scoped>
.other-list-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--theme-spacing-md, 20px);
  box-sizing: border-box;
  gap: 16px;
}

/* ========== 页面头部 ========== */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  box-shadow: var(--theme-shadow-card);
  flex-shrink: 0;
}

.header-left,
.header-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-accent-icon {
  color: var(--theme-primary);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--theme-radius-md);
  cursor: pointer;
  color: var(--theme-text-regular);
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid var(--theme-border);
  background: var(--theme-bg-card);
}

.back-btn:hover {
  color: var(--theme-primary);
  border-color: var(--theme-primary);
  background: var(--theme-primary-bg);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
}

.count-badge {
  padding: 2px 10px;
  background: var(--theme-primary-bg);
  color: var(--theme-primary);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* ========== 搜索筛选栏 ========== */
.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 16px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  flex-shrink: 0;
}

/* ========== 视图切换按钮 ========== */
.view-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--theme-bg-page);
  border-radius: var(--theme-radius-md);
  border: 1px solid var(--theme-border);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--theme-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: var(--theme-primary);
  background: var(--theme-primary-bg);
}

.toggle-btn.active {
  background: var(--theme-primary);
  color: #fff;
}

/* ========== 加载/空状态 ========== */
.loading-wrapper,
.empty-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--theme-text-placeholder);
}

.loading-icon {
  animation: rotate 1s linear infinite;
  color: var(--theme-primary);
}

.empty-icon {
  color: var(--theme-border);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ========== 列表容器 ========== */
.list-content {
  flex: 1;
  overflow-y: auto;
}

/* ========== 卡片视图 ========== */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding-bottom: 20px;
}

.other-card {
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.other-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--theme-primary);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-bg-page));
  flex-shrink: 0;
}

.card-img {
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.other-card:hover .card-img {
  transform: scale(1.08);
}

.img-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-bg-page));
  color: var(--theme-text-placeholder);
}

.card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.other-card:hover .card-overlay {
  opacity: 1;
}

.card-badges {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-badge,
.status-badge {
  font-size: 11px;
  border: none;
}

.share-badge {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  background: var(--theme-primary);
  color: #fff;
  font-size: 11px;
  clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
}

.card-info {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.card-detail-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--theme-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-row a {
  color: var(--theme-primary);
  text-decoration: none;
}

.detail-row a:hover {
  text-decoration: underline;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.tag-item {
  font-size: 11px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2px;
  border-top: 1px dashed var(--theme-border);
}

.meta-text {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--theme-text-placeholder);
}

/* ========== 列表视图 ========== */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
}

.list-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.list-item:hover {
  border-color: var(--theme-primary);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.list-img-wrapper {
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--theme-primary-light), var(--theme-bg-page));
}

.list-img {
  width: 100%;
  height: 100%;
}

.list-type-badge {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 8px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.list-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.list-info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.list-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.list-detail-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 4px 0;
}

.list-progress {
  margin: 6px 0;
}

.list-info-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.list-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--theme-text-secondary);
  min-width: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: var(--theme-bg-page);
  border-radius: 4px;
  white-space: nowrap;
}

.meta-item a {
  color: var(--theme-primary);
  text-decoration: none;
}

.meta-item a:hover {
  text-decoration: underline;
}

.list-actions {
  flex-shrink: 0;
}

/* ========== 详情弹窗 ========== */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-preview {
  border-radius: 8px;
  overflow: hidden;
}

.detail-preview-empty {
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--theme-text-placeholder);
  background: var(--theme-primary-light);
  border-radius: 8px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--theme-border);
}

.detail-item-full {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 12px;
  color: var(--theme-text-placeholder);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 13px;
  color: var(--theme-text-primary);
}

.detail-link {
  font-size: 13px;
  color: var(--theme-primary);
  text-decoration: none;
  word-break: break-all;
}

.detail-link:hover {
  text-decoration: underline;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.detail-notes {
  white-space: pre-wrap;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px 8px;
  background: var(--theme-bg-page);
  border-radius: 6px;
  color: var(--theme-text-regular);
}

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .filter-bar {
    flex-wrap: wrap;
  }

  .filter-bar .el-select,
  .filter-bar .el-input {
    flex: 1;
    min-width: 100px;
  }

  .list-item {
    flex-direction: column;
    gap: 12px;
  }

  .list-img-wrapper {
    width: 100%;
    height: 140px;
  }

  .list-info-bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 16px;
  }

  .back-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .other-list-page {
    padding: 12px;
  }

  .header-right {
    display: none;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
