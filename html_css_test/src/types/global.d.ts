// 全局类型声明文件

// 声明 jQuery
declare const $: any
declare const jQuery: any

// 声明环境变量
declare const process: {
  env: {
    NODE_ENV: string
    VUE_APP_BASE_API?: string
    [key: string]: any
  }
}

// 声明 window 对象扩展
declare interface Window {
  [key: string]: any
}

// 通用 API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 通用分页类型
export interface PageInfo {
  current: number
  size: number
  total: number
}

export interface PageResult<T = any> {
  records: T[]
  current: number
  size: number
  total: number
  pages: number
}