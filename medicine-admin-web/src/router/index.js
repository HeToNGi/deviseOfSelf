import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/user/Login.vue";
import request from "@/util/request";
import store from '@/store/index'
import {notification} from "ant-design-vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    /*注册*/
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/Register')
  },
  {
    /*药店申请*/
    path: '/medicine/approve',
    name: 'MedicineShopApprove',
    component: () => import('@/views/medicine/shop/MedicineShopApprove')
  },
  {
    /*药店账号登录后主页 药品管理 等*/
    path: '/medicine/shop/main',
    name: 'MedicineMain',
    component: () => import('@/views/medicine/shop/MedicineMain'),
    // children: [
    //   {
    //     path: '/MedicineShopApproveReview',
    //     name: 'MedicineShopApproveReview',
    //     component: () => import('@/views/medicine/admin/MedicineShopApproveReview')
    //   },
    // ]
  },

  {
    /*药店申请审核管理端首页*/
    path: '/medicine/admin/main',
    name: 'AdminMain',
    component: () => import('@/views/medicine/admin/AdminMain'),
    children: [
      {
        path: '/MedicineShopApproveReview',
        name: 'MedicineShopApproveReview',
        component: () => import('@/views/medicine/admin/MedicineShopApproveReview')
      },
      {
        path: '/MedicineShopCertReview',
        name: 'MedicineShopCertReview',
        component: () => import('@/views/medicine/admin/MedicineShopCertReview')
      },
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

async function checkLogin() {
  let response = await request.post('/users/isLogin');
  if (response.code === 500) {
    notification.error({
      message: '登录',
      description: response.message
    })
    return false;
  } else {
    store.commit('saveUser', response.data)
    return true;
  }
}

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/register') {
    next();
  } else {
    checkLogin().then(login => {
      if (login) {
        next();
      } else {
        next("/");
      }
    });
  }
});

export default router
