import router from './router'
import store from './store'
import {Notify} from 'vant'
import request from './utils/request'


async function checkLogin() {
  let response = await request.post('/users/isLogin');
  if (response.code === 500) {
    Notify({type: 'danger', message: response.message});
    return false;
  } else {
    store.commit('saveUser', response.data)
    return true;
  }
}

router.beforeEach((to, from, next) => {
  // next();
  if (to.path === '/' || to.path === '/verified' || to.path === '/login') {
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