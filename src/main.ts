/**
 * @fileoverview Chatmon 애플리케이션의 메인 진입점입니다.
 * @author owen.kim
 */

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
