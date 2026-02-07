// TypeScript 类型定义文件

// 用户相关类型
export interface User {
  id: number
  username: string
  nickname?: string
  email: string
  phone?: string
  avatar?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  emailNotification?: boolean
  profilePublic?: boolean
  createTime: string
  updateTime: string
}

// 用户信息更新表单
export interface UserUpdateForm {
  nickname?: string
  email?: string
  phone?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  avatar?: string
}

// 密码修改表单
export interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword?: string
}

// 用户设置
export interface UserSettings {
  emailNotification: boolean
  profilePublic: boolean
}

// 登录相关类型
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  user: User
  expires: number
}

// 注册表单
export interface SignUpForm {
  username: string
  nickname: string
  password: string
  confirmPassword: string
  email: string
}

// 收藏相关类型
export interface CollectionItem {
  id: number
  title: string
  url: string
  description?: string
  type: 'animation' | 'comic' | 'game' | 'novel' | 'url'
  tags?: string[]
  createTime: string
  updateTime: string
}

export interface CollectionType {
  id: number
  name: string
  description?: string
  icon?: string
  sort: number
}

// API 请求配置类型
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers?: Record<string, string>
}

// 路由相关类型
export interface RouteItem {
  path: string
  name: string
  component: any
  meta?: {
    title?: string
    requireAuth?: boolean
    icon?: string
  }
  children?: RouteItem[]
}

// 表单验证规则类型
export interface ValidationRule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  pattern?: RegExp
  validator?: (rule: any, value: any, callback: any) => void
}

// 文件上传类型
export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  type: string
}

// 错误信息类型
export interface FormErrors {
  [key: string]: string
}