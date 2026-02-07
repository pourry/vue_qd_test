// TypeScript 测试文件
import type { User } from '@/utils/ts/types'

// 测试类型定义
const testUser: User = {
  id: 1,
  username: 'test',
  email: 'test@example.com',
  createTime: new Date().toISOString(),
  updateTime: new Date().toISOString()
}

// 测试函数
function greetUser(user: User): string {
  return `Hello, ${user.username}!`
}

// 测试导出
export { testUser, greetUser }

console.log('TypeScript 配置测试成功！')
console.log(greetUser(testUser))