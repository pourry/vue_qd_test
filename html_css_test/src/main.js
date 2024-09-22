import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import store from './utils/store'

import router from './utils/router'
// import preload from './utils/preLoading/preload'
import {loadingSm2} from './utils/preLoading/preload'

const app = createApp(App);
app.use(ElementPlus).use(store).use(router).use(loadingSm2).mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }