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

// 标签页配置
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'password', label: '密码修改' },
  { key: 'settings', label: '账户设置' },
  { key: 'security', label: '账户安全' }
]

const activeTab = ref('basic')

// 响应式数据
const userInfo = reactive({
  id: 1,
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@example.com',
  phone: '13800138000',
  birthday: '1990-01-01',
  gender: 'male',
  avatar: '',
  emailNotification: true,
  profilePublic: false,
  autoSave: true,
  darkMode: false,
  createTime: '2023-01-01T00:00:00.000Z',
  updateTime: new Date().toISOString()
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
  return new Date(dateString).toLocaleString('zh-CN')
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

  if (!userInfo.email?.trim()) {
    errors.email = '邮箱不能为空'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
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

const saveBasicInfo = () => {
  if (!validateBasicInfo()) return
  
  ElMessage.success('基本信息保存成功')
  editMode.basic = false
  originalUserInfo = { ...userInfo }
  userInfo.updateTime = new Date().toISOString()
}

const changePassword = () => {
  if (!validatePassword()) return
  
  ElMessage.success('密码修改成功')
  editMode.password = false
  Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
  userInfo.updateTime = new Date().toISOString()
}

const saveSettings = () => {
  ElMessage.success('设置保存成功')
  userInfo.updateTime = new Date().toISOString()
}

const togglePassword = (type: 'current' | 'new' | 'confirm') => {
  showPassword[type] = !showPassword[type]
}

const changeAvatar = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('头像文件大小不能超过2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avatar = e.target?.result as string
      ElMessage.success('头像上传成功')
      userInfo.updateTime = new Date().toISOString()
    }
    reader.readAsDataURL(file)
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

// 初始化
onMounted(() => {
  originalUserInfo = { ...userInfo }
})
</script>

<style scoped>
.user-info-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 15px;
  box-sizing: border-box;
  background: #f5f5f5;
}

.user-info-container {
  width: 100%;
  height: 100%;
}

.wrapper {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.wrapper:hover {
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
  border-color: #d0d0d0;
}

.form-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-content h1 {
  font-size: 1.8em;
  color: #333333;
  text-align: left;
  margin-bottom: 15px;
  flex-shrink: 0;
  font-weight: 600;
}

/* 标签页导航 */
.tabs-nav {
  display: flex;
  gap: 3px;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.tab-btn {
  padding: 10px 16px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px 8px 0 0;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9em;
  border-bottom: none;
  font-weight: 500;
}

.tab-btn:hover {
  background: #e9ecef;
  color: #495057;
  transform: translateY(-1px);
}

.tab-btn.active {
  background: #007bff;
  color: #ffffff;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

/* 标签页内容 */
.tab-content {
  flex: 1;
  overflow-y: auto;
  background: #fafafa;
  border-radius: 0 12px 12px 12px;
  border: 1px solid #dee2e6;
}

.tab-panel {
  padding: 20px;
  height: auto;
  min-height: 100%;
  box-sizing: border-box;
}

/* 头像区域 */
.avatar-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 25px;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar-container {
  position: relative;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #007bff;
  margin-right: 20px;
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: #ffffff;
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
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.input-box {
  position: relative;
  width: 100%;
  margin: 18px 0;
  border-bottom: 2px solid #dee2e6;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  padding: 5px 0;
}

.input-box input,
.input-box .select-input {
  width: 100%;
  height: 45px;
  background: transparent;
  outline: none;
  border: none;
  font-size: 1em;
  color: #333333;
  padding: 0 80px 0 12px;
  box-sizing: border-box;
  font-weight: 400;
}

.input-box input:disabled,
.input-box .select-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #6c757d;
  background: #e9ecef;
}

.input-box input:focus,
.input-box .select-input:focus {
  border-bottom-color: #007bff;
  background: #ffffff;
}

.input-box label,
.input-box .select-label {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 1em;
  color: #6c757d;
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
  font-size: 0.8em;
  color: #007bff;
  background: #ffffff;
  padding: 2px 6px;
  border-radius: 4px;
  transform: translateY(0);
}

.input-box .select-input {
  appearance: none;
  background: transparent;
}

.input-box .select-input option {
  background: #ffffff;
  color: #333333;
  padding: 8px;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
  font-size: 0.85em;
  cursor: pointer;
  user-select: none;
  background: rgba(0, 123, 255, 0.1);
  padding: 6px 12px;
  border-radius: 15px;
  transition: all 0.3s;
  font-weight: 500;
}

.password-toggle:hover {
  background: rgba(0, 123, 255, 0.2);
  color: #0056b3;
  transform: translateY(-50%) scale(1.05);
}

.error-msg {
  position: absolute;
  top: 50px;
  left: 12px;
  color: #dc3545;
  font-size: 0.8em;
  font-weight: 500;
  background: rgba(220, 53, 69, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 按钮样式 */
.button-group {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 100px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.edit-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #218838, #1e7e34);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.save-btn {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #0056b3, #004085);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.cancel-btn {
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #5a6268, #343a40);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

.danger-btn {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

.danger-btn:hover {
  background: linear-gradient(135deg, #c82333, #bd2130);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

/* 设置项样式 */
.setting-item {
  margin: 15px 0;
  padding: 12px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.setting-item:hover {
  background: #f8f9fa;
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.setting-label {
  display: flex;
  align-items: center;
  color: #333333;
  font-size: 1em;
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
  border: 2px solid #007bff;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s;
  background: #ffffff;
}

.setting-checkbox:checked + .checkmark {
  background: linear-gradient(135deg, #28a745, #20c997);
  border-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.setting-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

/* 安全信息样式 */
.security-info {
  margin-bottom: 25px;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.security-info h4 {
  color: #333333;
  margin-bottom: 15px;
  font-size: 1.1em;
  font-weight: 600;
  border-bottom: 2px solid #007bff;
  padding-bottom: 8px;
}

.info-item {
  display: flex;
  margin-bottom: 12px;
  color: #333333;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  width: 120px;
  opacity: 0.8;
  font-weight: 500;
  color: #007bff;
}

.info-item .value {
  flex: 1;
  font-weight: 400;
}

/* 危险操作区域 */
.danger-section {
  border: 2px solid #dc3545;
  background: rgba(220, 53, 69, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}

.danger-section h4 {
  color: #dc3545;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 1.1em;
}

.warning-text {
  color: #6c757d;
  font-size: 0.9em;
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #ffffff;
  border: 2px solid #007bff;
  border-radius: 15px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: #333333;
  text-align: center;
  margin-bottom: 15px;
  font-weight: 600;
}

.modal-content p {
  color: #6c757d;
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
    font-size: 0.8em;
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
    font-size: 0.8em;
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
  background: #f1f1f1;
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #007bff;
  border-radius: 3px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: #0056b3;
}
</style>