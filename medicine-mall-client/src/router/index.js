import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 解决重复点击导航路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/login'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '登录'
    }
  },
  {
    path: '/verified',
    name: 'verified',
    component: () => import('../views/login/verified'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '实名认证'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home'),
    meta: {
      layout: true,
      head: true,
      headReturn: false,
      title: '首页'
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/cart/index'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '购物车'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user/index'),
    meta: {
      layout: true,
      head: true,
      headReturn: true,
      title: '我的'
    }
  },
  {
    path: '/goods/detail',
    name: 'detail',
    component: () => import('../views/goods/detail.vue'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '商品详情'
    }
  },
  {
    path: '/order/createOrder',
    name: 'createOrder',
    component: () => import('../views/order/createOrder'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '创建订单'
    }
  },
  {
    path: '/order/orderList',
    name: 'orderList',
    component: () => import('../views/order/orderList'),
    meta: {
      layout: false,
      head: true,
      headReturn: true,
      title: '订单列表'
    }
  },
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
