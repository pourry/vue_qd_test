import { createRouter,createWebHistory,RouteRecordRaw } from 'vue-router'
import store from '@/utils/store'

import Login from '@/view/middlePages/Login.vue'
import UserSelf from '@/view/middlePages/selfs/UserSelf.vue'
import Favorites from '@/view/middlePages/favorites/Favorites.vue'
import Home from '@/view/middlePages/Home.vue'
import HomePage from '@/view/HomePage.vue'
import SignUp from '@/view/middlePages/SignUp.vue'


import OneDimensions from '@/view/middlePages/favorites/dimensions/OneDimensions.vue'
import TwoDimensions from '@/view/middlePages/favorites/dimensions/TwoDimensions.vue'
import OtherDimensions from '@/view/middlePages/favorites/dimensions/OtherDimensions.vue'

import URLcollect from '@/view/middlePages/favorites/dimensions/oneDimensions/URLcollect.vue'

import Animation from '@/view/middlePages/favorites/dimensions/twoDimensions/Animation.vue'
import Comic from '@/view/middlePages/favorites/dimensions/twoDimensions/Comic.vue'
import Novel from '@/view/middlePages/favorites/dimensions/twoDimensions/Novel.vue'
import Game from '@/view/middlePages/favorites/dimensions/twoDimensions/Game.vue'

import MyMsg from '@/view/middlePages/selfs/flowableControl/MyMsg.vue'
import CarouselControl from '@/view/middlePages/selfs/CarouselControl.vue'
import FooterControl from '@/view/middlePages/selfs/FooterControl.vue'
import BasicConfig from '@/view/middlePages/selfs/BasicConfig.vue'
import AcgList from '@/view/middlePages/AcgList.vue'
import OtherList from '@/view/middlePages/OtherList.vue'
import MessageCenter from '@/view/messageCenter/MessageCenter.vue'
import TotalFeedback from '@/view/messageCenter/TotalFeedback.vue'
import PublishNotification from '@/view/messageCenter/PublishNotification.vue'
import RolePermissionManagement from '@/view/rolePermission/RolePermissionManagement.vue'

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
               //综合收藏（书籍/电影/音乐/名言/灵感等）
               path: '/otherDimensions',
               name: 'OtherDimensions',
               component: OtherDimensions,
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
            {
               //角色权限管理
               path: '/userSelf/rolePermission',
               name: 'RolePermissionManagement',
               component: RolePermissionManagement,
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
         //综合收藏公开列表页（查看更多）
         path: '/otherList',
         name: 'OtherList',
         component: OtherList,
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

// ===== 路由守卫：动态权限控制 =====
// 定义公共页面（所有人可访问，包括未登录用户）
const PUBLIC_PATHS = ['/login', '/signUp', '/home'];

router.beforeEach((to, from, next) => {
   const haslogin = store.getters.getToken && store.getters.getToken.value;
   const roleInfo = store.getters.getRoleInfo;
   const allowedPaths: string[] = store.getters.getAllowedPaths || [];
   const isAdmin = store.getters.isAdmin;

   // 1. 公共页面直接放行
   if (PUBLIC_PATHS.some(p => to.path === p || to.path.startsWith(p))) {
      return next();
   }

   // 2. ACG 分类页面、综合收藏页面，允许访问（不做权限限制）
   if (to.path.startsWith('/acgList') || to.path.startsWith('/otherList') || to.path === '/otherDimensions') {
      return next();
   }

   // 3. 管理员放行所有
   if (isAdmin) {
      return next();
   }

   // 4. 未登录用户：跳转到登录页
   if (!haslogin) {
      if (to.path.startsWith('/userSelf') || to.path.startsWith('/messageCenter')) {
         return next('/login');
      }
      // 其他页面（如收藏夹）未登录也允许访问基础内容
      return next();
   }

   // 5. 已登录但无权限数据（可能还没加载完），先放行让用户看到内容
   if (allowedPaths.length === 0) {
      // 如果有 token 但没权限数据，尝试加载一下
      store.dispatch('loadRolePermissions').catch(() => {});
      return next();
   }

   // 6. 普通用户：检查权限
   // 精确匹配或子路径匹配
   const hasPathPermission = (targetPath: string): boolean => {
      if (allowedPaths.includes(targetPath)) return true;
      for (const p of allowedPaths) {
         if (targetPath.startsWith(p + '/')) return true;
      }
      // 父级路径也检查（如 /userSelf/carousel 需要先检查 /userSelf）
      if (targetPath.startsWith('/userSelf/')) {
         if (allowedPaths.includes('/userSelf')) return true;
      }
      if (targetPath.startsWith('/favorites/')) {
         if (allowedPaths.includes('/favorites')) return true;
      }
      return false;
   };

   if (hasPathPermission(to.path)) {
      return next();
   }

   // 7. 无权限：跳转到首页
   console.warn(`[路由守卫] 用户无权访问: ${to.path}，已跳转到 /home`);
   next('/home');
})

export default router;

