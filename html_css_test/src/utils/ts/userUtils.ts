// 用户信息管理工具函数

import type { User, UserUpdateForm, PasswordChangeForm, FormErrors } from './types'

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否有效
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 强度等级和描述
 */
export function validatePasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong'
  message: string
  score: number
} {
  let score = 0
  let message = ''

  if (password.length < 6) {
    return { level: 'weak', message: '密码长度至少6位', score: 0 }
  }

  // 长度检查
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // 复杂度检查
  if (/[a-z]/.test(password)) score += 1 // 小写字母
  if (/[A-Z]/.test(password)) score += 1 // 大写字母
  if (/\d/.test(password)) score += 1 // 数字
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1 // 特殊字符

  if (score <= 2) {
    return { level: 'weak', message: '密码强度较弱，建议包含大小写字母、数字和特殊字符', score }
  } else if (score <= 4) {
    return { level: 'medium', message: '密码强度中等', score }
  } else {
    return { level: 'strong', message: '密码强度很强', score }
  }
}

/**
 * 验证用户基本信息
 * @param userInfo 用户信息
 * @returns 验证结果和错误信息
 */
export function validateUserInfo(userInfo: UserUpdateForm): {
  isValid: boolean
  errors: FormErrors
} {
  const errors: FormErrors = {}

  // 昵称验证
  if (!userInfo.nickname?.trim()) {
    errors.nickname = '昵称不能为空'
  } else if (userInfo.nickname.trim().length < 2) {
    errors.nickname = '昵称至少2个字符'
  } else if (userInfo.nickname.trim().length > 20) {
    errors.nickname = '昵称不能超过20个字符'
  }

  // 邮箱验证
  if (!userInfo.email?.trim()) {
    errors.email = '邮箱不能为空'
  } else if (!validateEmail(userInfo.email)) {
    errors.email = '邮箱格式不正确'
  }

  // 手机号验证（可选）
  if (userInfo.phone && !validatePhone(userInfo.phone)) {
    errors.phone = '手机号格式不正确'
  }

  // 生日验证（可选）
  if (userInfo.birthday) {
    const birthDate = new Date(userInfo.birthday)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    
    if (birthDate > today) {
      errors.birthday = '生日不能是未来日期'
    } else if (age > 150) {
      errors.birthday = '请输入有效的生日'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 验证密码修改表单
 * @param passwordForm 密码表单
 * @returns 验证结果和错误信息
 */
export function validatePasswordForm(passwordForm: PasswordChangeForm): {
  isValid: boolean
  errors: FormErrors
} {
  const errors: FormErrors = {}

  // 当前密码验证
  if (!passwordForm.currentPassword) {
    errors.currentPassword = '请输入当前密码'
  }

  // 新密码验证
  if (!passwordForm.newPassword) {
    errors.newPassword = '请输入新密码'
  } else {
    const strength = validatePasswordStrength(passwordForm.newPassword)
    if (strength.level === 'weak') {
      errors.newPassword = strength.message
    }
  }

  // 确认密码验证
  if (!passwordForm.confirmPassword) {
    errors.confirmPassword = '请确认新密码'
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    errors.confirmPassword = '两次密码输入不一致'
  }

  // 检查新密码是否与当前密码相同
  if (passwordForm.currentPassword && passwordForm.newPassword && 
      passwordForm.currentPassword === passwordForm.newPassword) {
    errors.newPassword = '新密码不能与当前密码相同'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 格式化用户显示名称
 * @param user 用户信息
 * @returns 显示名称
 */
export function formatUserDisplayName(user: User): string {
  return user.nickname || user.username || '未知用户'
}

/**
 * 获取用户头像URL
 * @param user 用户信息
 * @param defaultAvatar 默认头像URL
 * @returns 头像URL
 */
export function getUserAvatarUrl(user: User, defaultAvatar: string = '/src/assets/logo.png'): string {
  return user.avatar || defaultAvatar
}

/**
 * 格式化性别显示
 * @param gender 性别值
 * @returns 性别显示文本
 */
export function formatGenderDisplay(gender?: string): string {
  switch (gender) {
    case 'male':
      return '男'
    case 'female':
      return '女'
    case 'other':
      return '其他'
    default:
      return '未设置'
  }
}

/**
 * 检查文件是否为有效的图片格式
 * @param file 文件对象
 * @returns 是否为有效图片
 */
export function isValidImageFile(file: File): {
  isValid: boolean
  message: string
} {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  const maxSize = 2 * 1024 * 1024 // 2MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      message: '请选择有效的图片格式（JPG、PNG、GIF、WebP）'
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      message: '图片大小不能超过2MB'
    }
  }

  return {
    isValid: true,
    message: ''
  }
}

/**
 * 生成随机头像颜色
 * @param username 用户名
 * @returns 颜色值
 */
export function generateAvatarColor(username: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  
  let hash = 0
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * 脱敏显示手机号
 * @param phone 手机号
 * @returns 脱敏后的手机号
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 脱敏显示邮箱
 * @param email 邮箱
 * @returns 脱敏后的邮箱
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email
  const [username, domain] = email.split('@')
  if (username.length <= 2) return email
  return `${username.substring(0, 2)}***@${domain}`
}