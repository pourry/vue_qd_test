import { createApp } from 'vue'
import App from './App.vue'
import store from './utils/store'
// import preload from './utils/preLoading/preload'
import {loadingSm2} from './utils/preLoading/preload'


createApp(App).use(store).use(loadingSm2).mount('#app')
