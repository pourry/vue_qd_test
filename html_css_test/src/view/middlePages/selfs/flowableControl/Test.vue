<template>
 <p>hello</p>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'; 
   name:"Test"
   function isString(value: any): value is string {
    return typeof value === 'string';
}
// 定义枚举类型，用于表示用户的角色
enum Role {
  Admin,
  User,
  Guest,
}

// 使用 interface 定义用户的结构
interface User {
  id: number;               // number 类型，用于唯一标识用户
  username: string;         // string 类型，表示用户名
  isActive: boolean;        // boolean 类型，表示用户是否激活
  role: Role;               // enum 类型，用于表示用户角色
  hobbies: string[];        // array 类型，存储用户的兴趣爱好
  contactInfo: [string, number]; // tuple 类型，包含电话号码的元组，格式为：[区域码, 电话号码]
}

// 创建用户对象，符合 User 接口的结构
const user: User = {
  id: 1,
  username: "Alice",
  isActive: true,
  role: Role.User,
  hobbies: ["Reading", "Gaming"],
  contactInfo: ["+1", 123456789],
};
// 定义一个 union 类型的函数参数，接受用户 ID（number）或用户名（string）
function findUser(query: number | string): User | undefined {
  // 使用 typeof 来判断 query 的类型
  if (typeof query === "number") {
    // 如果是数字，则根据 ID 查找用户
    return query === user.id ? user : undefined;
  } else if (typeof query === "string") {
    // 如果是字符串，则根据用户名查找用户
    return query === user.username ? user : undefined;
  }
  return undefined;
}
    onMounted(()=>{
interface namelist { 
   [index:number]:string 
} 
 
// 类型一致，正确
// var list2:namelist = ["Google","Runoob","Taobao"]
// 错误元素 1 不是 string 类型
var list2:namelist = ["John","Bran"]
console.log(list2)
   })
</script>
<style>
</style>