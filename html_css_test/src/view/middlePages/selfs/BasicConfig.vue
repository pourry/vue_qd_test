<template>
  <div class="basic-config-page">
    <div class="page-header">
      <h2>基本配置</h2>
      <p class="page-desc">管理系统基本功能开关</p>
    </div>

    <div class="config-list">
      <div class="config-item" v-loading="loading">
        <div class="config-info">
          <div class="config-title">
            <span class="config-icon">🔒</span>
            <span>登录验证码</span>
          </div>
          <div class="config-desc">
            <p>开启后，登录时需要输入验证码以防止暴力破解</p>
            <p class="config-tip">提示：开启后登录页面将自动显示验证码输入框</p>
          </div>
        </div>
        <div class="config-action">
          <label class="switch-label">
            <input type="checkbox" v-model="captchaEnabled" @change="onToggle" />
            <span class="switch-slider"></span>
            <span class="switch-text">{{ captchaEnabled ? '已启用' : '已关闭' }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ref,onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {saveCaptchaEnabled} from '@/api/login'
import userInfoApi from '@/api/userInfo'

export default {
  name: 'BasicConfig',
  setup(){
    const loading = ref(false)
    const captchaEnabled = ref(false)

    const onToggle = function(){
      const val = captchaEnabled.value
      // 立即写入 localStorage
      localStorage.setItem('captchaEnabled', val ? 'true' : 'false')
      if (val) {
        const infoStr = localStorage.getItem('userInfo');
        const u = infoStr ? JSON.parse(infoStr).username : ''
        if (u) {
          localStorage.setItem('captchaUsername', u)
        }
      } else {
        localStorage.removeItem('captchaUsername')
      }
      // 保存到后端
      saveCaptchaEnabled({captchaEnabled: val}).then(res => {
        if (res.successful) {
          ElMessage.success(val ? '已启用登录验证码' : '已关闭登录验证码')
        } else {
          ElMessage.warning('服务端保存失败，但本地已更新')
        }
      }).catch(() => {
        ElMessage.warning('服务端保存失败，但本地已更新')
      })
    }

    const loadConfig = function(){
      loading.value = true
      userInfoApi.query().then(res => {
        if (res.successful && res.resultValue) {
          const backendVal = res.resultValue.captchaEnabled === true || res.resultValue.captchaEnabled === 1
          captchaEnabled.value = backendVal
          localStorage.setItem('captchaEnabled', backendVal ? 'true' : 'false')
        }
      }).catch(() => {
      }).finally(() => {
        loading.value = false
      })
    }

    onMounted(() => {
      loadConfig()
    })

    return {loading, captchaEnabled, onToggle}
  }
}
</script>

<style scoped>
.basic-config-page {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

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

.config-list {
  flex: 1;
  overflow-y: auto;
}

.config-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-md);
  margin-bottom: 12px;
}

.config-info {
  flex: 1;
  min-width: 0;
  padding-right: 20px;
}

.config-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--theme-text-primary);
  margin-bottom: 8px;
}

.config-icon {
  font-size: 18px;
}

.config-desc {
  font-size: 13px;
  color: var(--theme-text-secondary);
  line-height: 1.6;
}

.config-desc p {
  margin: 0;
}

.config-tip {
  color: var(--theme-text-placeholder) !important;
  font-size: 12px !important;
  margin-top: 4px !important;
}

.config-action {
  flex-shrink: 0;
}

/* Custom switch */
.switch-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.switch-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-slider {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background: var(--theme-border);
  border-radius: 11px;
  transition: background 0.3s;
}

.switch-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch-label input:checked + .switch-slider {
  background: var(--theme-primary);
}

.switch-label input:checked + .switch-slider::after {
  transform: translateX(22px);
}

.switch-text {
  font-size: 13px;
  color: var(--theme-text-secondary);
}
</style>