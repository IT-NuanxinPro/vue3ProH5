import './assets/style/main.scss'
import '@/hooks/useToast.scss'

import { createApp } from 'vue'

import App from './App.vue'
import store from './stores/index.js'
import router from './router'
import VConsole from 'vconsole'
import navHeader from '@/components/Header/index.vue'
// import Pagination from '@/components/Pagination/index.vue'

import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import { Icon } from 'vant'
import 'vant/es/icon/style'

const app = createApp(App)
if (import.meta.env.MODE !== 'production') {
  new VConsole()
}

app.component('navHeader', navHeader)
// app.component('pagination', Pagination)

app.use(store).use(router).use(Icon).mount('#app')
