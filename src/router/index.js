import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/components/home.vue'
import store from '@/components/store.vue'
import instore from '@/components/instore.vue'
import outstore from '@/components/outstore.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: home },
        { path: '/store', component: store },
        { path: '/instore', component: instore },
        { path: '/outstore', component: outstore }
    ]
})

export default router