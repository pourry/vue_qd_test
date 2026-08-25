<template>
  <div class="user-info-page">
    <div class="user-info-container">
      <div class="wrapper">
        <div class="form-content">
          <h1>我的信息</h1>
          
          <!-- 标签页导航 -->
          <div class="tabs-nav">
            <button 
              v-for="tab in tabs" 
              :key="tab.key"
              :class="['tab-btn', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- 标签页内容 -->
          <div class="tab-content">
            <!-- 基本信息标签页 -->
            <div v-if="activeTab === 'basic'" class="tab-panel">
              <!-- 用户头像区域 -->
              <div class="avatar-section">
                <div class="avatar-container">
                  <img :src="userInfo.avatar || defaultAvatar" alt="用户头像" class="avatar-img" />
                  <div class="avatar-overlay" @click="changeAvatar">
                    <span class="upload-text">更换头像</span>
                  </div>
                </div>
                <input ref="avatarInput" type="file" accept="image/*" @change="handleAvatarChange" style="display: none" />
              </div>

              <div class="form-section">
                <div class="input-box">
                  <input 
                    v-model="userInfo.nickname" 
                    type="text" 
                    required 
                    :disabled="!editMode.basic"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': userInfo.nickname }">昵称</label>
                  <span v-if="errors.nickname" class="error-msg">{{ errors.nickname }}</span>
                </div>

                <div class="input-box">
                  <input 
                    v-model="userInfo.email" 
                    type="email" 
                    required 
                    :disabled="!editMode.basic"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': userInfo.email }">邮箱</label>
                  <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                </div>

                <div class="input-box">
                  <input 
                    v-model="userInfo.phone" 
                    type="tel" 
                    :disabled="!editMode.basic"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': userInfo.phone }">手机号</label>
                  <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
                </div>

                <div class="input-box">
                  <input 
                    v-model="userInfo.birthday" 
                    type="date" 
                    :disabled="!editMode.basic"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': userInfo.birthday }">生日</label>
                </div>

                <div class="input-box">
                  <select 
                    v-model="userInfo.gender" 
                    :disabled="!editMode.basic"
                    class="select-input"
                  >
                    <option value="">请选择性别</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                  <label class="select-label" :class="{ 'label-up': userInfo.gender }">性别</label>
                </div>

                <div class="button-group">
                  <button 
                    v-if="!editMode.basic" 
                    @click="toggleEdit('basic')" 
                    class="btn edit-btn"
                  >
                    编辑基本信息
                  </button>
                  <template v-else>
                    <button @click="saveBasicInfo" class="btn save-btn">保存</button>
                    <button @click="cancelEdit('basic')" class="btn cancel-btn">取消</button>
                  </template>
                </div>
              </div>
            </div>

            <!-- 密码修改标签页 -->
            <div v-if="activeTab === 'password'" class="tab-panel">
              <div class="form-section">
                <div class="input-box">
                  <input 
                    v-model="passwordForm.currentPassword"
                    :type="showPassword.current ? 'text' : 'password'"
                    required
                    :disabled="!editMode.password"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': passwordForm.currentPassword }">当前密码</label>
                  <span 
                    class="password-toggle" 
                    @click="togglePassword('current')"
                    v-if="editMode.password"
                  >
                    {{ showPassword.current ? '隐藏' : '显示' }}
                  </span>
                  <span v-if="errors.currentPassword" class="error-msg">{{ errors.currentPassword }}</span>
                </div>

                <div class="input-box">
                  <input 
                    v-model="passwordForm.newPassword"
                    :type="showPassword.new ? 'text' : 'password'"
                    required
                    :disabled="!editMode.password"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': passwordForm.newPassword }">新密码</label>
                  <span 
                    class="password-toggle" 
                    @click="togglePassword('new')"
                    v-if="editMode.password"
                  >
                    {{ showPassword.new ? '隐藏' : '显示' }}
                  </span>
                  <span v-if="errors.newPassword" class="error-msg">{{ errors.newPassword }}</span>
                </div>

                <div class="input-box">
                  <input 
                    v-model="passwordForm.confirmPassword"
                    :type="showPassword.confirm ? 'text' : 'password'"
                    required
                    :disabled="!editMode.password"
                    placeholder=" "
                  />
                  <label :class="{ 'label-up': passwordForm.confirmPassword }">确认新密码</label>
                  <span 
                    class="password-toggle" 
                    @click="togglePassword('confirm')"
                    v-if="editMode.password"
                  >
                    {{ showPassword.confirm ? '隐藏' : '显示' }}
                  </span>
                  <span v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</span>
                </div>

                <div class="button-group">
                  <button 
                    v-if="!editMode.password" 
                    @click="toggleEdit('password')" 
                    class="btn edit-btn"
                  >
                    修改密码
                  </button>
                  <template v-else>
                    <button @click="changePassword" class="btn save-btn">确认修改</button>
                    <button @click="cancelEdit('password')" class="btn cancel-btn">取消</button>
                  </template>
                </div>
              </div>
            </div>

            <!-- 账户设置标签页 -->
            <div v-if="activeTab === 'settings'" class="tab-panel">
              <div class="form-section">
                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      v-model="userInfo.emailNotification" 
                      type="checkbox"
                      class="setting-checkbox"
                    />
                    <span class="checkmark"></span>
                    接收邮件通知
                  </label>
                </div>

                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      v-model="userInfo.profilePublic" 
                      type="checkbox"
                      class="setting-checkbox"
                    />
                    <span class="checkmark"></span>
                    公开个人资料
                  </label>
                </div>

                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      v-model="userInfo.autoSave" 
                      type="checkbox"
                      class="setting-checkbox"
                    />
                    <span class="checkmark"></span>
                    自动保存收藏
                  </label>
                </div>

                <div class="setting-item">
                  <label class="setting-label">
                    <input 
                      v-model="userInfo.darkMode" 
                      type="checkbox"
                      class="setting-checkbox"
                    />
                    <span class="checkmark"></span>
                    深色模式
                  </label>
                </div>

                <div class="button-group">
                  <button @click="saveSettings" class="btn save-btn">保存设置</button>
                </div>
              </div>
            </div>

            <!-- 账户安全标签页 -->
            <div v-if="activeTab === 'security'" class="tab-panel">
              <div class="form-section">
                <div class="security-info">
                  <h4>账户安全信息</h4>
                  <div class="info-item">
                    <span class="label">用户名：</span>
                    <span class="value">{{ userInfo.username }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">注册时间：</span>
                    <span class="value">{{ formatDate(userInfo.createTime) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">最后更新：</span>
                    <span class="value">{{ formatDate(userInfo.updateTime) }}</span>
                  </div>
                </div>

                <div class="danger-section">
                  <h4>危险操作</h4>
                  <p class="warning-text">以下操作不可逆，请谨慎操作</p>
                  <div class="button-group">
                    <button @click="showDeleteConfirm = true" class="btn danger-btn">
                      删除账户
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <h3>确认删除账户</h3>
        <p>此操作不可逆，将永久删除您的账户和所有数据。</p>
        <div class="input-box">
          <input 
            v-model="deleteConfirmPassword"
            type="password"
            placeholder="请输入密码确认"
            required
          />
        </div>
        <div class="modal-buttons">
          <button @click="deleteAccount" class="btn danger-btn">确认删除</button>
          <button @click="showDeleteConfirm = false" class="btn cancel-btn">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import userInfoApi from '@/api/userInfo'

// 标签页配置
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'password', label: '密码修改' },
  { key: 'settings', label: '账户设置' },
  { key: 'security', label: '账户安全' }
]

const activeTab = ref('basic')
const loading = ref(false)
const uploading = ref(false)

// 响应式数据（字段名映射后端 SysUser）
const userInfo = reactive({
  id: '',
  username: '',
  nickname: '',       // 后端 nickName
  email: '',
  phone: '',
  birthday: '',
  gender: '',
  avatar: '',
  emailNotification: true,
  profilePublic: false,
  autoSave: true,
  darkMode: false,
  createTime: '',
  updateTime: ''
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const editMode = reactive({
  basic: false,
  password: false
})

const showPassword = reactive({
  current: false,
  new: false,
  confirm: false
})

const errors = reactive({
  nickname: '',
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showDeleteConfirm = ref(false)
const deleteConfirmPassword = ref('')
const avatarInput = ref<HTMLInputElement>()
const defaultAvatar = '/src/assets/logo.png'

// 原始数据备份
let originalUserInfo: any = {}

// 方法
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

/** 加载当前用户信息 */
const loadUserInfo = async () => {
  loading.value = true
  try {
    const res: any = await userInfoApi.query()
    if (res.code === 200) {
      const data = res.resultValue
      if (data) {
        // 字段映射：后端 nickName → 前端 nickname
        userInfo.id = data.id || ''
        userInfo.username = data.username || ''
        userInfo.nickname = data.nickName || ''
        userInfo.email = data.email || ''
        userInfo.phone = data.phone || ''
        userInfo.birthday = data.birthday || ''
        userInfo.gender = data.gender || ''
        userInfo.avatar = data.avatar || ''
        userInfo.createTime = data.createTime || ''
        userInfo.updateTime = data.updateTime || ''
      }
    } else {
      ElMessage.error(res.resultValue || '获取用户信息失败')
    }
  } catch (err: any) {
    ElMessage.error('获取用户信息失败，请检查网络')
  } finally {
    loading.value = false
  }
}

const toggleEdit = (type: 'basic' | 'password') => {
  editMode[type] = true
  clearErrors()

  if (type === 'basic') {
    originalUserInfo = { ...userInfo }
  } else if (type === 'password') {
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  }
}

const cancelEdit = (type: 'basic' | 'password') => {
  editMode[type] = false
  clearErrors()

  if (type === 'basic') {
    Object.assign(userInfo, originalUserInfo)
  } else if (type === 'password') {
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  }
}

const validateBasicInfo = (): boolean => {
  clearErrors()
  let isValid = true

  if (!userInfo.nickname?.trim()) {
    errors.nickname = '昵称不能为空'
    isValid = false
  }

  if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
    errors.email = '邮箱格式不正确'
    isValid = false
  }

  if (userInfo.phone && !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
    errors.phone = '手机号格式不正确'
    isValid = false
  }

  return isValid
}

const validatePassword = (): boolean => {
  clearErrors()
  let isValid = true

  if (!passwordForm.currentPassword) {
    errors.currentPassword = '请输入当前密码'
    isValid = false
  }

  if (!passwordForm.newPassword) {
    errors.newPassword = '请输入新密码'
    isValid = false
  } else if (passwordForm.newPassword.length < 6) {
    errors.newPassword = '密码长度至少6位'
    isValid = false
  }

  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = '请确认新密码'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = '两次密码输入不一致'
    isValid = false
  }

  return isValid
}

const clearErrors = () => {
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

/** 保存基本信息 */
const saveBasicInfo = async () => {
  if (!validateBasicInfo()) return

  loading.value = true
  try {
    // 前端 nickname → 后端 nickName
    const params = {
      nickName: userInfo.nickname,
      email: userInfo.email,
      phone: userInfo.phone,
      birthday: userInfo.birthday,
      gender: userInfo.gender
    }
    const res: any = await userInfoApi.updateInfo(params)
    if (res.code === 200) {
      ElMessage.success('基本信息保存成功')
      editMode.basic = false
      originalUserInfo = { ...userInfo }
      // 刷新最新信息
      await loadUserInfo()
    } else {
      ElMessage.error(res.resultValue || '保存失败')
    }
  } catch (err: any) {
    ElMessage.error('保存失败，请检查网络')
  } finally {
    loading.value = false
  }
}

/** 修改密码 */
const changePassword = async () => {
  if (!validatePassword()) return

  loading.value = true
  try {
    const params = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    }
    const res: any = await userInfoApi.changePassword(params)
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      editMode.password = false
      Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      ElMessage.error(res.resultValue || '密码修改失败')
    }
  } catch (err: any) {
    ElMessage.error('密码修改失败，请检查网络')
  } finally {
    loading.value = false
  }
}

const saveSettings = () => {
  ElMessage.success('设置保存成功')
}

const togglePassword = (type: 'current' | 'new' | 'confirm') => {
  showPassword[type] = !showPassword[type]
}

const changeAvatar = () => {
  avatarInput.value?.click()
}

/** 上传头像 */
const handleAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('头像文件大小不能超过5MB')
    return
  }

  const formData = new FormData()
  formData.append('file', file)

  uploading.value = true
  try {
    const res: any = await userInfoApi.uploadAvatar(formData)
    if (res.code === 200) {
      // 后端返回头像URL在 resultValue 中
      const avatarUrl = res.resultValue
      userInfo.avatar = avatarUrl
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(res.resultValue || '头像上传失败')
    }
  } catch (err: any) {
    ElMessage.error('头像上传失败，请检查网络')
  } finally {
    uploading.value = false
    // 重置input，避免同一文件无法触发change
    if (avatarInput.value) {
      avatarInput.value.value = ''
    }
  }
}

const deleteAccount = () => {
  if (!deleteConfirmPassword.value) {
    ElMessage.error('请输入密码确认')
    return
  }

  ElMessage.success('账户删除成功')
  showDeleteConfirm.value = false
}

// 初始化：加载用户信息
onMounted(async () => {
  originalUserInfo = { ...userInfo }
  await loadUserInfo()
})
</script>

<style scoped>
.user-info-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: var(--theme-spacing-md);
  box-sizing: border-box;
  background: var(--theme-bg-middle);
}

.user-info-container {
  width: 100%;
  height: 100%;
}

.wrapper {
  width: 100%;
  height: 100%;
  background: var(--theme-bg-card);
  border: 1px solid var(--theme-border);
  border-radius: var(--theme-radius-2xl);
  box-shadow: var(--theme-shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.wrapper:hover {
  box-shadow: var(--theme-shadow-lg);
  border-color: var(--theme-primary);
}

.form-content {
  width: 100%;
  height: 100%;
  padding: var(--theme-spacing-md);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-content h1 {
  font-size: 1.5em;
  color: var(--theme-text-primary);
  text-align: left;
  margin-bottom: var(--theme-spacing-md);
  flex-shrink: 0;
  font-weight: 600;
}

/* 标签页导航 */
.tabs-nav {
  display: flex;
  gap: 4px;
  margin-bottom: var(--theme-spacing-md);
  flex-shrink: 0;
  border-bottom: 1px solid var(--theme-border);
  padding-bottom: 0;
}

.tab-btn {
  padding: 10px 18px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--theme-text-regular);
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--theme-radius-sm) var(--theme-radius-sm) 0 0;
}

.tab-btn:hover {
  background: var(--theme-bg-hover);
  color: var(--theme-text-primary);
}

.tab-btn.active {
  background: var(--theme-primary-bg);
  color: var(--theme-primary);
  border-bottom-color: var(--theme-primary);
  font-weight: 600;
}

/* 标签页内容 */
.tab-content {
  flex: 1;
  overflow-y: auto;
  background: var(--theme-bg-middle);
  border-radius: var(--theme-radius-lg);
  border: 1px solid var(--theme-border-light);
}

.tab-panel {
  padding: var(--theme-spacing-md);
  height: auto;
  min-height: 100%;
  box-sizing: border-box;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: var(--theme-spacing-lg);
  padding: var(--theme-spacing-md);
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-lg);
  border: 1px solid var(--theme-border-light);
  box-shadow: var(--theme-shadow-xs);
}

.avatar-container {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid var(--theme-primary);
  margin-right: var(--theme-spacing-md);
  transition: border-color 0.3s;
}

.avatar-container:hover {
  border-color: var(--theme-primary-dark);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: var(--theme-text-light);
  font-size: 12px;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.upload-text {
  font-size: 12px;
  font-weight: 500;
}

/* 表单区域 */
.form-section {
  width: 100%;
  max-width: none;
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-lg);
  padding: var(--theme-spacing-md);
  border: 1px solid var(--theme-border-light);
  box-sizing: border-box;
  box-shadow: var(--theme-shadow-xs);
}

.input-box {
  position: relative;
  width: 100%;
  margin: 18px 0;
  border-bottom: 2px solid var(--theme-border);
  background: var(--theme-bg-middle);
  border-radius: var(--theme-radius-md) var(--theme-radius-md) 0 0;
  padding: 5px 0;
  transition: border-color 0.25s;
}

.input-box input,
.input-box .select-input {
  width: 100%;
  height: 45px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 14px;
  color: var(--theme-text-primary);
  padding: 0 80px 0 12px;
  box-sizing: border-box;
  font-weight: 400;
}

.input-box input:disabled,
.input-box .select-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--theme-text-secondary);
  background: var(--theme-border-light);
}

.input-box input:focus,
.input-box .select-input:focus {
  border-bottom-color: var(--theme-primary);
  background: var(--theme-bg-card);
}

.input-box label,
.input-box .select-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--theme-text-regular);
  pointer-events: none;
  transition: 0.3s ease-in-out;
  font-weight: 500;
  background: transparent;
}

.input-box input:focus ~ label,
.input-box input:not(:placeholder-shown) ~ label,
.input-box .select-input:focus ~ .select-label,
.input-box label.label-up,
.input-box .select-label.label-up {
  top: -8px;
  font-size: 12px;
  color: var(--theme-primary);
  background: var(--theme-bg-card);
  padding: 2px 6px;
  border-radius: var(--theme-radius-sm);
  transform: translateY(0);
}

.input-box .select-input {
  appearance: none;
  background: transparent;
}

.input-box .select-input option {
  background: var(--theme-bg-card);
  color: var(--theme-text-primary);
  padding: 8px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--theme-primary);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  background: var(--theme-primary-bg);
  padding: 6px 12px;
  border-radius: 15px;
  transition: all 0.25s;
  font-weight: 500;
}

.password-toggle:hover {
  background: var(--theme-primary-bg-hover);
  color: var(--theme-primary-dark);
  transform: translateY(-50%) scale(1.05);
}

.error-msg {
  position: absolute;
  top: 50px;
  left: 12px;
  color: var(--theme-danger);
  font-size: 12px;
  font-weight: 500;
  background: var(--theme-danger-light);
  padding: 2px 6px;
  border-radius: var(--theme-radius-sm);
}

/* 按钮样式 */
.button-group {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: var(--theme-spacing-md);
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--theme-radius-full);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s ease;
  min-width: 100px;
}

.edit-btn {
  background: var(--theme-success);
  color: var(--theme-text-light);
  box-shadow: 0 4px 12px var(--theme-primary-bg);
}

.edit-btn:hover {
  background: var(--theme-success);
  filter: brightness(0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px var(--theme-primary-bg);
}

.save-btn {
  background: var(--theme-primary);
  color: var(--theme-text-light);
  box-shadow: 0 4px 12px var(--theme-primary-bg);
}

.save-btn:hover {
  background: var(--theme-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px var(--theme-primary-bg);
}

.cancel-btn {
  background: var(--theme-bg-middle);
  color: var(--theme-text-regular);
  border: 1px solid var(--theme-border);
}

.cancel-btn:hover {
  background: var(--theme-border-light);
  color: var(--theme-text-primary);
}

.danger-btn {
  background: var(--theme-danger);
  color: var(--theme-text-light);
  box-shadow: 0 4px 12px var(--theme-primary-bg);
}

.danger-btn:hover {
  background: var(--theme-danger);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px var(--theme-primary-bg);
}

/* 设置项样式 */
.setting-item {
  margin: 15px 0;
  padding: 12px;
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-md);
  border: 1px solid var(--theme-border-light);
  transition: all 0.25s ease;
  box-shadow: var(--theme-shadow-xs);
}

.setting-item:hover {
  background: var(--theme-primary-bg);
  border-color: var(--theme-primary);
  box-shadow: var(--theme-shadow-sm);
}

.setting-label {
  display: flex;
  align-items: center;
  color: var(--theme-text-primary);
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  font-weight: 500;
}

.setting-checkbox {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--theme-primary);
  border-radius: var(--theme-radius-sm);
  margin-right: 12px;
  position: relative;
  transition: all 0.25s;
  background: var(--theme-bg-card);
}

.setting-checkbox:checked + .checkmark {
  background: var(--theme-success);
  border-color: var(--theme-success);
}

.setting-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--theme-text-light);
  font-size: 14px;
  font-weight: bold;
}

/* 安全信息样式 */
.security-info {
  margin-bottom: var(--theme-spacing-lg);
  padding: var(--theme-spacing-md);
  background: var(--theme-bg-card);
  border-radius: var(--theme-radius-lg);
  border: 1px solid var(--theme-border-light);
  box-shadow: var(--theme-shadow-xs);
}

.security-info h4 {
  color: var(--theme-text-primary);
  margin-bottom: var(--theme-spacing-md);
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid var(--theme-primary);
  padding-bottom: 8px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  color: var(--theme-text-primary);
  padding: 8px 0;
  border-bottom: 1px solid var(--theme-border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  width: 120px;
  opacity: 0.8;
  font-weight: 500;
  color: var(--theme-primary);
}

.info-item .value {
  flex: 1;
  font-weight: 400;
}

/* 危险操作区域 */
.danger-section {
  border: 2px solid var(--theme-danger);
  background: var(--theme-danger-light);
  border-radius: var(--theme-radius-lg);
  padding: var(--theme-spacing-md);
  margin-top: var(--theme-spacing-md);
}

.danger-section h4 {
  color: var(--theme-danger);
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 16px;
}

.warning-text {
  color: var(--theme-text-regular);
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 400;
  line-height: 1.4;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--theme-bg-mask);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--theme-bg-card);
  border: 2px solid var(--theme-primary);
  border-radius: var(--theme-radius-xl);
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--theme-shadow-xl);
}

.modal-content h3 {
  color: var(--theme-text-primary);
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
}

.modal-content p {
  color: var(--theme-text-regular);
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.4;
}

.modal-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-page {
    padding: 10px;
  }
  
  .form-content {
    padding: 15px;
  }
  
  .tabs-nav {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    font-size: 13px;
    padding: 8px 12px;
  }
  
  .tab-panel {
    padding: 15px;
  }
  
  .form-section {
    max-width: none;
  }
  
  .button-group {
    justify-content: center;
  }
  
  .btn {
    min-width: 80px;
    font-size: 13px;
  }
  
  .modal-buttons {
    flex-direction: column;
  }
  
  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .info-item {
    flex-direction: column;
  }
  
  .info-item .label {
    width: auto;
    margin-bottom: 4px;
  }
}

/* 滚动条样式 */
.tab-content::-webkit-scrollbar {
  width: 6px;
}

.tab-content::-webkit-scrollbar-track {
  background: var(--theme-bg-middle);
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: var(--theme-border);
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-placeholder);
}
</style>