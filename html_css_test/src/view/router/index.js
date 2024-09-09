import { createRouter,createWebHistory } from 'vue-router'

import Login from '../middle/Login.vue'
import HomePage from '../HomePage.vue'

const routes = [

 {
    path: '/homePage',
    name: 'HomePage',
    component: HomePage
 },
 {
   path: '/login',
   components: {
      middleView : () => import('@/view/middle/Login.vue')
   }
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