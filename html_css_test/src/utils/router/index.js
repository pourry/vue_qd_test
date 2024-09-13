import { createRouter,createWebHistory } from 'vue-router'

import Login from '@/view/middlePages/Login.vue'
import UserSelf from '@/view/middlePages/UserSelf.vue'
import Favorites from '@/view/middlePages/Favorites.vue'
import Home from '@/view/middlePages/Home.vue'
import HomePage from '@/view/HomePage.vue'
import SignUp from '@/view/middlePages/SignUp.vue'

const routes = [

 {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage,
    children : [
      {
         //次元收藏夹首页
         path: '/home',
         name: 'Home',
         component: Home,
      },
      {
         //收藏夹
         path: '/favorites',
         name: 'Favorites',
         component: Favorites,
      },
      {
         //我的
         path: '/userSelf',
         name: 'UserSelf',
         component: UserSelf
      },
      {
         //登录页面
         path: '/login',
         name: 'Login',
         component: Login,
      },
      {
         //登录页面
         path: '/signUp',
         name: 'SignUp',
         component: SignUp,
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