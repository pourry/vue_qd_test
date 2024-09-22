import { createRouter,createWebHistory } from 'vue-router'

import Login from '@/view/middlePages/Login.vue'
import UserSelf from '@/view/middlePages/UserSelf.vue'
import Favorites from '@/view/middlePages/favorites/Favorites.vue'
import Home from '@/view/middlePages/Home.vue'
import HomePage from '@/view/HomePage.vue'
import SignUp from '@/view/middlePages/SignUp.vue'


import OneDimensions from '@/view/middlePages/favorites/dimensions/OneDimensions.vue'
import TwoDimensions from '@/view/middlePages/favorites/dimensions/TwoDimensions.vue'
import ThreeDimensions from '@/view/middlePages/favorites/dimensions/ThreeDimensions.vue'
import FourDimensions from '@/view/middlePages/favorites/dimensions/FourDimensions.vue'

import Animation from '@/view/middlePages/favorites/dimensions/twoDimensions/Animation.vue'
import Comic from '@/view/middlePages/favorites/dimensions/twoDimensions/Comic.vue'
import Novel from '@/view/middlePages/favorites/dimensions/twoDimensions/Novel.vue'
import Game from '@/view/middlePages/favorites/dimensions/twoDimensions/Game.vue'

import TVplay from '@/view/middlePages/favorites/dimensions/threeDimensions/TVplay.vue'

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
         children : [
            {
               //一次元
               path: '/oneDimensions',
               name: 'OneDimensions',
               component: OneDimensions,
            },
            {
               //二次元
               path: '/twoDimensions',
               name: 'TwoDimensions',
               component: TwoDimensions,
               children : [
                  {
                     //动画
                     path: '/animation',
                     name: 'Animation',
                     component: Animation,
                  },
                  {
                     //漫画
                     path: '/comic',
                     name: 'Comic',
                     component: Comic,
                  },
                  {
                     //小说
                     path: '/novel',
                     name: 'Novel',
                     component: Novel,
                  },
                  {
                     //游戏
                     path: '/game',
                     name: 'Game',
                     component: Game,
                  },
               ]
            },
            {
               //三次元
               path: '/threeDimensions',
               name: 'ThreeDimensions',
               component: ThreeDimensions,
               children: [
                  {
                     //电视剧
                     path: '/tVplay',
                     name: 'TVplay',
                     component: TVplay,
                  },
               ]
            },
            {
               //四次元
               path: '/fourDimensions',
               name: 'FourDimensions',
               component: FourDimensions,
            },
         ]
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