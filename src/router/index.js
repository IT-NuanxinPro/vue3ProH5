import { createRouter, createWebHashHistory } from 'vue-router'

const DEFAULT_META = {
  keepAlive: false,
  depth: -1
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'amap',
      component: () => import('@/views/amap/index.vue'),
      meta: DEFAULT_META
    },
    {
      path: '/tianjinMap',
      name: 'tianjinMap',
      component: () => import('@/views/tianjinMap/index.vue'),
      meta: DEFAULT_META
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.path === '/' && savedPosition) {
      return {
        ...savedPosition
        // behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

export default router
