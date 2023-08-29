// Author: Jan-Christopher Möhn
import Vue from 'vue'
import VueRouter from 'vue-router'
import TheHome from '@/views/TheHome.vue'
import TheCars from '@/views/TheCars.vue'
import TheQuizs from '@/views/TheQuizs.vue'
import TheEditorProcess from '@/views/TheEditorProcess.vue'
import TheTest from '@/components/development/TheTest.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: TheHome
  },
  {
    path: '/cars',
    component: TheCars
  },
  {
    path: '/quizs',
    component: TheQuizs
  },
  {
    path: '/editor',
    component: TheEditorProcess,
  },
  {
    path: '/test',
    component: TheTest
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
