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
        <span class="count-badge" v-if="!loading">{{ list.length }} 项</span>
      </div>
      <div class="header-right"></div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrapper" v-if="loading">
      <el-icon :size="40" class="loading-icon"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div class="empty-wrapper" v-else-if="list.length === 0">
      <el-icon :size="60" class="empty-icon"><DocumentDelete /></el-icon>
      <p>暂无{{ categoryTitle }}数据</p>
    </div>

    <!-- 列表内容 -->
    <div class="list-content" v-else>
      <div class="card-grid">
        <div 
          v-for="item in list" 
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
          </div>
          <div class="card-info">
            <h3 class="card-name" :title="item.name">{{ item.name }}</h3>
            <div class="card-meta">
              <span class="card-id">ID: {{ item.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import acgapi from '@/api/acg'
import { ElMessage } from 'element-plus'

import { 
  VideoCamera, Reading, Notebook, Goods,
  ArrowLeft, Loading, Picture, View, DocumentDelete
} from '@element-plus/icons-vue'

const CATEGORY_MAP = {
  animation: { title: '动画', icon: VideoCamera },
  comic: { title: '漫画', icon: Reading },
  novel: { title: '小说', icon: Notebook },
  game: { title: '游戏', icon: Goods }
}

export default {
  name: 'AcgList',
  components: {
    VideoCamera, Reading, Notebook, Goods,
    ArrowLeft, Loading, Picture, View, DocumentDelete
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const category = ref(route.params.category || 'animation')
    const list = ref([])
    const loading = ref(true)

    const categoryTitle = computed(() => {
      return CATEGORY_MAP[category.value]?.title || 'ACG'
    })

    const categoryIcon = computed(() => {
      return markRaw(CATEGORY_MAP[category.value]?.icon || VideoCamera)
    })

    const getItemImage = (item) => {
      if (item.pictures && item.pictures.length > 0) {
        return item.pictures[0].pictureUrl
      }
      return ''
    }

    const openItem = (item) => {
      if (item.address) {
        window.open(item.address, '_blank')
      } else {
        ElMessage.warning('该项目没有关联链接')
      }
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
      categoryTitle,
      categoryIcon,
      getItemImage,
      openItem,
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
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  margin-bottom: 20px;
  box-shadow: var(--theme-shadow-card);
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

.list-content {
  flex: 1;
  overflow-y: auto;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding-bottom: 20px;
}

.acg-card {
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: var(--theme-shadow-card);
}

.acg-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--theme-shadow-md);
  border-color: var(--theme-primary);
}

.card-img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--theme-primary-light);
}

.card-img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.acg-card:hover .card-img {
  transform: scale(1.05);
}

.img-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--theme-primary-light);
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
  transition: opacity 0.25s ease;
}

.acg-card:hover .card-overlay {
  opacity: 1;
}

.card-info {
  padding: 12px 14px;
}

.card-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--theme-text-placeholder);
}

.card-id {
  font-family: monospace;
}

@media (max-width: 600px) {
  .acg-list-page {
    padding: 12px;
  }
  
  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .back-btn span {
    display: none;
  }
}
</style>