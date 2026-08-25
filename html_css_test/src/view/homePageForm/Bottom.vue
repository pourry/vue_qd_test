<template>
    <div class="footer">
      <div class="footer-content">
        <!-- 简介板块 -->
        <div class="footer-section" v-if="introSection">
          <h3 class="footer-title">{{ introSection.title }}</h3>
          <p class="footer-desc">{{ introSection.content }}</p>
        </div>

        <!-- 快速链接板块 -->
        <div class="footer-section" v-if="linkList.length > 0">
          <h4 class="footer-subtitle">快速链接</h4>
          <div class="footer-links">
            <a v-for="link in linkList" :key="link.id" :href="link.url || '#'" class="footer-link"
               @click.prevent="handleLinkClick(link)">
              {{ link.name }}
            </a>
          </div>
        </div>

        <!-- 联系方式板块 -->
        <div class="footer-section" v-if="contactSection">
          <h4 class="footer-subtitle">{{ contactSection.title }}</h4>
          <p class="footer-info" v-for="(line, index) in contactLines" :key="index">{{ line }}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <!-- 备案信息 -->
        <p v-if="recordSection">{{ recordSection.content }}</p>
        <p>版权所有 © {{ currentYear }} 次元收藏夹</p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import footerApi from '@/api/footer'

// 数据
const introSection = ref<any>(null)
const contactSection = ref<any>(null)
const recordSection = ref<any>(null)
const linkList = ref<any[]>([])

const currentYear = new Date().getFullYear()

// 联系方式按行分割显示
const contactLines = computed(() => {
    if (!contactSection.value?.content) return []
    return contactSection.value.content.split('\n').filter((line: string) => line.trim())
})

// 加载底部配置
const loadFooterConfig = async () => {
    try {
        const res = await footerApi.getConfig()
        if (res.successful && res.resultValue) {
            const data = res.resultValue
            const sections = data.sections || []
            const links = data.links || []

            // 分类板块
            introSection.value = sections.find((s: any) => s.type === 'intro' && s.enabled) || null
            contactSection.value = sections.find((s: any) => s.type === 'contact' && s.enabled) || null
            recordSection.value = sections.find((s: any) => s.type === 'record' && s.enabled) || null

            // 快速链接
            linkList.value = links.filter((l: any) => l.enabled)
        }
    } catch (e) {
        console.error('加载底部配置失败:', e)
    }
}

// 点击链接跳转
const handleLinkClick = (link: any) => {
    if (link.url && link.url !== '#') {
        window.location.href = link.url
    }
}

onMounted(() => {
    loadFooterConfig()
})
</script>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(180deg, var(--theme-bg-bottom) 0%, rgba(0, 0, 0, 0.85) 100%);
  color: var(--theme-text-light);
  padding: 16px 20px;
  box-sizing: border-box;
  position: relative;
}
.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, 
    var(--theme-primary) 0%, 
    var(--theme-primary-light) 50%, 
    var(--theme-primary) 100%);
  opacity: 0.6;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.footer-section {
  flex: 1;
  max-width: 300px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--theme-text-light);
  letter-spacing: 0.5px;
}

.footer-subtitle {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: rgba(255, 255, 255, 0.85);
  position: relative;
  padding-left: 12px;
}
.footer-subtitle::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 12px;
  background: var(--theme-primary);
  border-radius: 2px;
}

.footer-desc {
  font-size: 12px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.footer-link {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.2s ease;
  padding: 2px 4px;
  border-radius: var(--theme-radius-sm);
  cursor: pointer;
}

.footer-link:hover {
  color: var(--theme-primary-light);
  background-color: rgba(255, 255, 255, 0.08);
}

.footer-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
  margin: 2px 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--theme-spacing-md);
  }
  .footer-section {
    max-width: 100%;
  }
  .footer-bottom {
    flex-direction: column;
    gap: var(--theme-spacing-xs);
    text-align: center;
  }
}
</style>
