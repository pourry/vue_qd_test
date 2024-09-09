import { createRouter,createWebHistory } from 'vue-router'

import Login from '../middlePages/Login.vue'
import UserSelf from '../middlePages/UserSelf.vue'
import Favorites from '../middlePages/Favorites.vue'
import HomePage from '../HomePage.vue'

const routes = [

 {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage,
    children : [
      {
         //登录页面
         path: '/favorites',
         name: 'Favorites',
         component: Favorites,
      },
      {
         //登录页面
         path: '/userSelf',
         name: 'UserSelf',
         component: UserSelf
      },
      {
         //登录页面
         path: '/login',
         name: 'Login',
         component: Login
      },
    ]
 },

{
   path:'/',
   redirect: '/homePage'
}
]

const router = createRouter({
   history:createWebHistory(),
   routes
})

export default router;