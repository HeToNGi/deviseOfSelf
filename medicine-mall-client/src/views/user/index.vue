<template>
  <div class="person-center">

    <div class="my-head" v-if="user.username!=null">
      <div class="head-img" style="padding-left: 20px;">
        <label style="font-size: larger;padding-left: 0px;">{{ user.username }}</label>
        <br>
        欢迎使用
        <i class="iconfont iconjifen" style="margin-left: 15px;">积分 {{ user.members_point }}</i>
      </div>
    </div>

    <div class="my-order">
      <div class="my-order-cell">
        <van-cell title="我的订单" value="查看订单" @click="" is-link to="/order/orderList" title-class="my-order-list"
                  size="16px"/>
      </div>
      <div>
        <van-grid :border="false" icon-size="22px" :column-num="5">
          <van-grid-item icon="todo-list-o" text="待取货" url="" :badge="tobePay"
                         :to="{ name: 'orderList', params: { active: 0 }}"/>
          <van-grid-item icon="logistics" text="待收货" url="" :badge="pay"
                         :to="{ name: 'orderList', params: { active: 1 }}"/>
        </van-grid>
      </div>
    </div>

  </div>
</template>

<script>
import Vue from 'vue';
import {Grid, GridItem} from 'vant';
import {Icon} from 'vant';
import {Cell, CellGroup} from 'vant';
import {Image as VanImage} from 'vant';
import {Swipe, SwipeItem} from 'vant';
import {Lazyload} from 'vant';
import {Divider} from 'vant';
import {personCenter} from "../../api/user";

Vue.use(Divider);
Vue.use(Lazyload);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(VanImage);
Vue.use(Cell);
Vue.use(CellGroup);

Vue.use(Icon);
Vue.use(Grid);
Vue.use(GridItem);
export default {
  components: {},
  data() {
    return {
      tobePay: '',
      pay: '',
      user:{}
    };
  },
  created() {
    this.personCenter();
  },

  methods: {
    personCenter() {
      personCenter().then(res => {
        this.user = res.data.user;
        if (res.data.data.tobePay > 0) {
          this.tobePay = res.data.data.tobePay;
        }
        if (res.data.data.pay > 0) {
          this.pay = res.data.data.pay;
        }
      })
    },
  },
  goOrderList() {
    this.$router.push({path: '/order/orderList'})

  },
}

</script>
<style>

.recommend-product {
  padding-top: 20px;
}

.swipe {
  width: 94%;
  margin-left: 3%;
  margin-top: 14px;

}

.van-swipe {
  border-radius: 10px;
}

.my-order {
  width: 94%;
  margin-left: 3%;
  margin-top: 14px;
  border-radius: 10px;
  height: 120px;
  background-color: white;

}

.van-grid-item__content {
  padding-top: 13px !important;
}

.head-img label {
  padding-left: 2%;
}

.head-img img {
  border: 3px solid #fff;
  border-radius: 50%;
  vertical-align: -18px;
  margin-left: 6%;
}

.head-img button {
  border-radius: 4%;
  font-size: 12px !important;
  background-color: #bb9951;
  width: 80px;
  height: 20px;
  border: none;
  float: right;
  margin-right: 20px;
  margin-top: 15px;
}

.my-order-cell {
  padding-top: 8px;
}

.other-icon {
  margin-top: 14px;

}

.my-vip {
  width: 94%;
  margin-left: 3%;
  height: 60px;
  margin-top: -30px;
  background-image: linear-gradient(to right, #281F0D, #5D5139);
  border-radius: 10px;
  color: #f1debd;
}

.my-head {
  background-image: linear-gradient(to right, #dfc48e, #c4a566);
  width: 100%;
  height: 130px;
}

.head-img {
  padding-top: 10%;
  color: white;
  font-size: 18px;

}

.head-img label {
  padding-left: 2%;
}

.head-img img {
  border: 3px solid #fff;
  border-radius: 50%;
  vertical-align: -18px;
  margin-left: 6%;
}

.head-img button {
  border-radius: 4%;
  font-size: 12px !important;
  background-color: #bb9951;
  width: 80px;
  height: 20px;
  border: none;
  float: right;
  margin-right: 20px;
  margin-top: 15px;
}

.vip-description {
  padding-top: 10px;
  margin-left: 10%;
  width: 60%;
}

.vip-text {
  font-size: 16px;
  font-weight: bolder;

}

.vip-text img {
  vertical-align: -2px;
}

.vip-icon {
  float: right;
  margin-top: -35px;
  margin-right: 10px;
}
</style>
