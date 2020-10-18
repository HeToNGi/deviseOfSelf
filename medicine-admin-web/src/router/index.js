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
    children: [
      {
        path: '/MedicineShopAnalysis',
        name: 'MedicineShopAnalysis',
        component: () => import('@/views/medicine/shop/MedicineShopAnalysis')
      },{
        path: '/MedicineShopGoodsType',
        name: 'MedicineShopGoodsType',
        component: () => import('@/views/medicine/shop/MedicineShopGoodsType')
      },{
        path: '/MedicineShopGoods',
        name: 'MedicineShopGoods',
        component: () => import('@/views/medicine/shop/MedicineShopGoods')
      },{
        path: '/MedicineShopOrder',
        name: 'MedicineShopOrder',
        component: () => import('@/views/medicine/shop/MedicineShopOrder')
      },
    ],
    // 默认打开子路由
    redirect:'/MedicineShopAnalysis'
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
