<template>
  <div class="acg-list-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="back-btn" @click="goBack">
          <el-icon :size="18"><ArrowLeft /></el-icon>
          <span>返回</span>
        </div>
      </div>
      <div class="header-center">
        <el-icon :size="22" class="category-icon" :class="'icon-' + category">
          <component :is="categoryIcon" />
        </el-icon>
        <h1 class="page-title">{{ categoryTitle }}</h1>
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
        v-model="searchHasend"
        placeholder="完结状态"
        clearable
        style="width:130px"
      >
        <el-option
          v-for="item in hasendOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="searchName"
        placeholder="搜索名称、别名或内容"
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
      <p>暂无符合条件的{{ categoryTitle }}数据</p>
    </div>

    <!-- 卡片视图 -->
    <div class="list-content" v-else-if="viewMode === 'grid'">
      <div class="card-grid">
        <div
          v-for="item in filteredList"
          :key="item.id"
          class="acg-card"
          @click="openItem(item)"
        >
          <div class="card-img-wrapper">
            <el-image
              class="card-img"
              :src="getItemImage(item)"
              fit="cover"
              :preview-src-list="[getItemImage(item)]"
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
              <el-tag size="small" :type="categoryTagType" effect="dark" class="type-badge">
                {{ categoryTitle }}
              </el-tag>
              <el-tag
                size="small"
                :type="getHasendTagType(item.hasend)"
                effect="light"
                class="hasend-badge"
              >
                {{ getHasendLabel(item.hasend) }}
              </el-tag>
              <span class="img-count" v-if="item.pictures && item.pictures.length > 1">
                <el-icon :size="12"><Picture /></el-icon>
                {{ item.pictures.length }}
              </span>
            </div>
            <div class="share-badge" v-if="item.address">
              <el-icon :size="12"><Link /></el-icon>
              已链接
            </div>
          </div>
          <div class="card-info">
            <h3 class="card-name" :title="item.name">{{ item.name }}</h3>
            <div class="card-detail-rows">
              <div class="detail-row" v-if="item.alias">
                <el-icon :size="12"><Document /></el-icon>
                <span>{{ item.alias }}</span>
              </div>
              <div class="detail-row" v-if="item.address" @click.stop>
                <el-icon :size="12"><Link /></el-icon>
                <a :href="item.address" target="_blank" :title="item.address">
                  {{ truncateText(item.address, 30) }}
                </a>
              </div>
              <div class="detail-row" v-if="item.notes">
                <el-icon :size="12"><EditPen /></el-icon>
                <span :title="item.notes">{{ truncateText(item.notes, 25) }}</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="img-count-text">
                <el-icon :size="12"><Picture /></el-icon>
                {{ getImageCount(item) }} 张图片
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
              :src="getItemImage(item)"
              fit="cover"
              :preview-src-list="[getItemImage(item)]"
              :preview-teleported="false"
            >
              <template #error>
                <div class="img-error">
                  <el-icon :size="24"><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span class="list-type-badge">{{ categoryTitle }}</span>
          </div>
          <div class="list-info">
            <div class="list-info-top">
              <h3 class="list-name" :title="item.name">{{ item.name }}</h3>
              <el-tag
                size="small"
                :type="getHasendTagType(item.hasend)"
                effect="light"
              >
                {{ getHasendLabel(item.hasend) }}
              </el-tag>
            </div>
            <div class="list-detail-rows">
              <div class="detail-row" v-if="item.alias">
                <el-icon :size="12"><Document /></el-icon>
                <span>别名: {{ item.alias }}</span>
              </div>
              <div class="detail-row" v-if="item.address" @click.stop>
                <el-icon :size="12"><Link /></el-icon>
                <a :href="item.address" target="_blank" :title="item.address">
                  地址: {{ truncateText(item.address, 40) }}
                </a>
              </div>
              <div class="detail-row" v-if="item.notes">
                <el-icon :size="12"><EditPen /></el-icon>
                <span :title="item.notes">备注: {{ truncateText(item.notes, 40) }}</span>
              </div>
            </div>
            <div class="list-info-bottom">
              <div class="list-meta">
                <span class="meta-item">
                  <el-icon :size="14"><Picture /></el-icon>
                  {{ getImageCount(item) }} 张图片
                </span>
                <span class="meta-item" v-if="item.address">
                  <el-icon :size="14"><Link /></el-icon>
                  <a :href="item.address" target="_blank" @click.stop>查看链接</a>
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
      :title="currentItem.name"
      width="420px"
      align-center
      class="detail-dialog"
    >
      <div class="detail-content" v-if="currentItem.id">
        <div class="detail-preview">
          <el-image
            v-if="getItemImage(currentItem)"
            :src="getItemImage(currentItem)"
            fit="cover"
            style="width:100%;max-height:200px;border-radius:8px"
            :preview-src-list="[getItemImage(currentItem)]"
          />
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">名称</span>
            <span class="detail-value">{{ currentItem.name || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">别名</span>
            <span class="detail-value">{{ currentItem.alias || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">地址</span>
            <a
              v-if="currentItem.address"
              :href="currentItem.address"
              target="_blank"
              class="detail-link"
            >{{ currentItem.address }}</a>
            <span v-else class="detail-value">-</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">完结状态</span>
            <el-tag
              size="small"
              :type="getHasendTagType(currentItem.hasend)"
              effect="light"
            >
              {{ getHasendLabel(currentItem.hasend) }}
            </el-tag>
          </div>
          <div class="detail-item detail-item-full">
            <span class="detail-label">备注</span>
            <span class="detail-value detail-notes">{{ currentItem.notes || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">图片数</span>
            <span class="detail-value">{{ getImageCount(currentItem) }} 张</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">创建时间</span>
            <span class="detail-value">{{ currentItem.createTime || '-' }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button
          v-if="currentItem.address"
          type="primary"
          @click="openItem(currentItem)"
        >访问链接</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import acgapi from '@/api/acg'
import { ElMessage } from 'element-plus'

import {
  VideoCamera, Reading, Notebook, Goods,
  ArrowLeft, Loading, Picture, View, DocumentDelete,
  Grid, List, Link, Document, Search, Refresh, EditPen
} from '@element-plus/icons-vue'

const CATEGORY_MAP = {
  animation: { title: '动画', icon: VideoCamera },
  comic: { title: '漫画', icon: Reading },
  novel: { title: '小说', icon: Notebook },
  game: { title: '游戏', icon: Goods }
}

const CATEGORY_TAG_TYPE = {
  animation: 'danger',
  comic: 'primary',
  novel: 'success',
  game: 'warning'
}

const HASEND_OPTIONS = [
  { value: 'end', label: '已完结' },
  { value: 'serial', label: '连载中' },
  { value: 'notstart', label: '未开始' }
]

export default {
  name: 'AcgList',
  components: {
    VideoCamera, Reading, Notebook, Goods,
    ArrowLeft, Loading, Picture, View, DocumentDelete,
    Grid, List, Link, Document, Search, Refresh, EditPen
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const category = ref(route.params.category || 'animation')
    const list = ref([])
    const loading = ref(true)
    const viewMode = ref('grid')
    const searchName = ref('')
    const searchHasend = ref(null)
    const appliedName = ref('')
    const appliedHasend = ref(null)

    const detailVisible = ref(false)
    const currentItem = ref({})

    const hasendOptions = computed(() => HASEND_OPTIONS)

    const filteredList = computed(() => {
      let result = list.value
      if (appliedHasend.value) {
        result = result.filter(item => item.hasend === appliedHasend.value)
      }
      if (appliedName.value && appliedName.value.trim()) {
        const keyword = appliedName.value.trim().toLowerCase()
        result = result.filter(item =>
          (item.name && item.name.toLowerCase().includes(keyword)) ||
          (item.alias && item.alias.toLowerCase().includes(keyword)) ||
          (item.notes && item.notes.toLowerCase().includes(keyword)) ||
          (item.hasendLabel && item.hasendLabel.toLowerCase().includes(keyword))
        )
      }
      return result
    })

    const categoryTitle = computed(() => {
      return CATEGORY_MAP[category.value]?.title || 'ACG'
    })

    const categoryIcon = computed(() => {
      return markRaw(CATEGORY_MAP[category.value]?.icon || VideoCamera)
    })

    const categoryTagType = computed(() => {
      return CATEGORY_TAG_TYPE[category.value] || 'info'
    })

    const getHasendLabel = (hasend) => {
      const opt = HASEND_OPTIONS.find(o => o.value === hasend)
      return opt ? opt.label : '未知'
    }

    const getHasendTagType = (hasend) => {
      const map = { end: 'success', serial: 'warning', notstart: 'info' }
      return map[hasend] || 'info'
    }

    const getItemImage = (item) => {
      if (item.pictures && item.pictures.length > 0) {
        return item.pictures[0].pictureUrl
      }
      return ''
    }

    const getImageCount = (item) => {
      if (item.pictures && item.pictures.length > 0) {
        return item.pictures.length
      }
      return 0
    }

    const truncateText = (text, maxLen) => {
      if (!text) return ''
      return text.length > maxLen ? text.substring(0, maxLen) + '...' : text
    }

    const openItem = (item) => {
      if (item.address) {
        window.open(item.address, '_blank')
      } else {
        ElMessage.warning('该项目没有关联链接')
      }
    }

    const showDetail = (item) => {
      currentItem.value = item
      detailVisible.value = true
    }

    const applyFilter = () => {
      appliedName.value = searchName.value
      appliedHasend.value = searchHasend.value
    }

    const resetFilter = () => {
      searchName.value = ''
      searchHasend.value = null
      appliedName.value = ''
      appliedHasend.value = null
    }

    const goBack = () => {
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/home')
      }
    }

    const loadData = () => {
      loading.value = true
      acgapi.getListByCategory(category.value).then(res => {
        if (res.successful && res.resultValue) {
          list.value = res.resultValue.list || []
        } else {
          list.value = []
          ElMessage.warning(res.resultValue || '加载失败')
        }
      }).catch(() => {
        list.value = []
        ElMessage.error('加载失败，请稍后重试')
      }).finally(() => {
        loading.value = false
      })
    }

    onMounted(() => {
      loadData()
    })

    return {
      category,
      list,
      loading,
      viewMode,
      searchName,
      searchHasend,
      hasendOptions,
      filteredList,
      detailVisible,
      currentItem,
      categoryTitle,
      categoryIcon,
      categoryTagType,
      getHasendLabel,
      getHasendTagType,
      getItemImage,
      getImageCount,
      truncateText,
      openItem,
      showDetail,
      applyFilter,
      resetFilter,
      goBack
    }
  }
}
</script>

<style scoped>
.acg-list-page {
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

.category-icon {
  color: var(--theme-primary);
}

.category-icon.icon-animation { color: #e74c3c; }
.category-icon.icon-comic { color: #3498db; }
.category-icon.icon-novel { color: #2ecc71; }
.category-icon.icon-game { color: #9b59b6; }

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

.acg-card {
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

.acg-card:hover {
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

.acg-card:hover .card-img {
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

.acg-card:hover .card-overlay {
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

.type-badge {
  font-size: 11px;
  border: none;
}

.hasend-badge {
  font-size: 11px;
}

.img-count {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  border-radius: 10px;
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

.card-name {
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

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 2px;
  border-top: 1px dashed var(--theme-border);
}

.img-count-text {
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
  width: 160px;
  height: 120px;
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

.list-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.list-detail-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 4px 0;
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

.detail-notes {
  white-space: pre-wrap;
  max-height: 80px;
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
  .acg-list-page {
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
