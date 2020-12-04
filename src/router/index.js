import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../layouts/BasicLayout'),
    children: [{
      path: '/home',
      name: 'Home',
      component: () => import('../views/Home'),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import(/* webpackChunkName: "About" */ '../views/About.vue'),
      meta: {
        title: '关于我们'
      }
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 动态修改页面标题
router.beforeEach((to, from, next) => {
  if (typeof to.meta.title != 'undefined' && to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
