import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from "@/router/main.js";
import {UserStore} from "@/Store/index.js";

const Pinia=createPinia();
createApp(App).use(Pinia).use(router).mount('#app')
