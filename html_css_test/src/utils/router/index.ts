import { createRouter,createWebHistory,RouteRecordRaw } from 'vue-router'

import Login from '@/view/middlePages/Login.vue'
import UserSelf from '@/view/middlePages/selfs/UserSelf.vue'
import Favorites from '@/view/middlePages/favorites/Favorites.vue'
import Home from '@/view/middlePages/Home.vue'
import HomePage from '@/view/HomePage.vue'
import SignUp from '@/view/middlePages/SignUp.vue'


import OneDimensions from '@/view/middlePages/favorites/dimensions/OneDimensions.vue'
import TwoDimensions from '@/view/middlePages/favorites/dimensions/TwoDimensions.vue'
import ThreeDimensions from '@/view/middlePages/favorites/dimensions/ThreeDimensions.vue'
import FourDimensions from '@/view/middlePages/favorites/dimensions/FourDimensions.vue'

import URLcollect from '@/view/middlePages/favorites/dimensions/oneDimensions/URLcollect.vue'

import Animation from '@/view/middlePages/favorites/dimensions/twoDimensions/Animation.vue'
import Comic from '@/view/middlePages/favorites/dimensions/twoDimensions/Comic.vue'
import Novel from '@/view/middlePages/favorites/dimensions/twoDimensions/Novel.vue'
import Game from '@/view/middlePages/favorites/dimensions/twoDimensions/Game.vue'

import TVplay from '@/view/middlePages/favorites/dimensions/threeDimensions/TVplay.vue'

import ApplyFor from '@/view/middlePages/selfs/flowableControl/ApplyFor.vue'
import MyMsg from '@/view/middlePages/selfs/flowableControl/MyMsg.vue'
import Test from '@/view/middlePages/selfs/flowableControl/Test.vue'
import CarouselControl from '@/view/middlePages/selfs/CarouselControl.vue'
import FooterControl from '@/view/middlePages/selfs/FooterControl.vue'
import BasicConfig from '@/view/middlePages/selfs/BasicConfig.vue'
import AcgList from '@/view/middlePages/AcgList.vue'
import MessageCenter from '@/view/messageCenter/MessageCenter.vue'
import TotalFeedback from '@/view/messageCenter/TotalFeedback.vue'
import PublishNotification from '@/view/messageCenter/PublishNotification.vue'

const routes : Array<RouteRecordRaw> = [

 {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage,
    redirect: '/home',
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
         redirect: '/twoDimensions',
         children : [
            // {
            //    //一次元
            //    path: '/oneDimensions',
            //    name: 'OneDimensions',
            //    component: OneDimensions,
            //    children: [
            //       {
            //          //网站收藏
            //          path: '/uRLcollect',
            //          name: 'URLcollect',
            //          component: URLcollect,
            //       },
            //    ]
            // },
            {
               //网站收藏
               path: '/oneDimensions/uRLcollect',
               name: 'URLcollect',
               component: URLcollect,
            },
            {
               //二次元
               path: '/twoDimensions',
               name: 'TwoDimensions',
               component: TwoDimensions,
               redirect: '/twoDimensions/animation',
               children : [
                  {
                     //动画
                     path: '/twoDimensions/animation',
                     name: 'Animation',
                     component: Animation,
                  },
                  {
                     //漫画
                     path: '/twoDimensions/comic',
                     name: 'Comic',
                     component: Comic,
                  },
                  {
                     //小说
                     path: '/twoDimensions/novel',
                     name: 'Novel',
                     component: Novel,
                  },
                  {
                     //游戏
                     path: '/twoDimensions/game',
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
               redirect: '/tVplay',
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
         component: UserSelf,
         redirect: '/userSelf/myMsg',
         children : [
            {
               //我的信息
               path: '/userSelf/myMsg',
               name: 'MyMsg',
               component: MyMsg,
            },
            {
               //我的申请
               path: '/userSelf/applyFor',
               name: 'ApplyFor',
               component: ApplyFor,
            },
            {
               //代码测试场
               path: '/userSelf/test',
               name: 'Test',
               component: Test,
            },
            {
               //走马灯控制
               path: '/userSelf/carousel',
               name: 'CarouselControl',
               component: CarouselControl,
            },
            {
               //底部内容控制
               path: '/userSelf/footer',
               name: 'FooterControl',
               component: FooterControl,
            },
            {
               //基本配置
               path: '/userSelf/basicConfig',
               name: 'BasicConfig',
               component: BasicConfig,
            },
            {
               //总反馈管理
               path: '/userSelf/totalFeedback',
               name: 'TotalFeedback',
               component: TotalFeedback,
            },
            {
               //发布通知
               path: '/userSelf/publishNotification',
               name: 'PublishNotification',
               component: PublishNotification,
            },
         ]
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
      {
         //ACG分类列表页（查看更多）
         path: '/acgList/:category',
         name: 'AcgList',
         component: AcgList,
      },
      {
         //消息中心
         path: '/messageCenter',
         name: 'MessageCenter',
         component: MessageCenter,
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

