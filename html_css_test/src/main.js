import { createApp } from 'vue'
import App from './App.vue'

import ElementUI from 'element-plus'
import store from './utils/store'

import router from './view/router'
// import preload from './utils/preLoading/preload'
import {loadingSm2} from './utils/preLoading/preload'


createApp(App).use(ElementUI).use(store).use(router).use(loadingSm2).mount('#app')
