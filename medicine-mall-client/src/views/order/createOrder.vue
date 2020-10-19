<template>
  <div class="order-main">
    <div style="margin-top: 2px;padding-top: 5px;">
      <van-collapse v-model="activeNames">
        <van-collapse-item v-for="(order, index) in orderList" :title="order.shopName+'-'+order.address" :name="index">
          <div>
            <swiper class="swiper">
              <div class="item-left" v-for="banner in order.banners">
                <swiper-slide>
                  <img :src="banner" width="68px" height="68px"/>
                </swiper-slide>
              </div>
              <div class="item-right">
                <span>共{{ order.totalNum }}件</span>
              </div>
            </swiper>

            <swiper class="swiper">
              <div class="item-left" style="width: 20%">
                <span>商品金额</span>
              </div>
              <div class="item-right">
                <span>￥{{ order.totalAmount }}</span>
              </div>
            </swiper>

          </div>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div>
      <div class="my-title">支付方式</div>
      <van-radio-group v-model="payType">
        <van-cell-group>
          <van-cell title="医保卡支付" clickable @click="payType = '1'">
            <template #right-icon>
              <van-radio name="1"/>
            </template>
          </van-cell>
          <van-cell title="网上支付" clickable @click="payType = '2'">
            <template #right-icon>
              <van-radio name="2"/>
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div v-if="payType === '2'">
      <div class="my-title">收货地址</div>
      <div>
        <van-field
            v-model="orderAddress"
            placeholder="请输入地址"
        />
      </div>
    </div>
    <van-submit-bar button-text="支付" :loading="loading"
                    @submit="createOrder()">
      <div class="bottom-price">
        <span> 应付：</span>
        <span style="font-size: 16px;font-weight: bolder">￥{{ payAmount }}</span>
      </div>
    </van-submit-bar>
  </div>
</template>

<script>
import Vue from "vue";
import {NoticeBar} from "vant";
import {Swiper, SwiperSlide} from "vue-awesome-swiper";
import {CouponCell, CouponList} from "vant";
import {Form} from "vant";
import {Overlay} from "vant";
import {orderSure, orderPay} from "../../api/order";
import {Popup} from "vant";
import {Toast} from "vant";
import {Tag} from "vant";
import {Divider} from "vant";
import {Collapse, CollapseItem} from 'vant';

Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Divider);
Vue.use(Tag);
Vue.use(Toast);
Vue.use(Overlay);
Vue.use(Form);
Vue.use(CouponCell);
Vue.use(CouponList);
Vue.use(NoticeBar);
Vue.use(Popup);

export default {
  name: "swiper-example-responsive-breakpoints",
  title: "Responsive breakpoints",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      orderList: [],
      activeNames: [],
      payAmount: 0,
      loading: false,
      payType: '1',
      orderAddress: '',
    };
  },

  mounted() {
    let routerParams = this.$route.query;
    this.orderSure(routerParams, false);
    this.getOrderParams();
  },

  methods: {
    createOrder() {
      let data = {
        payAmount: this.payAmount,
        payType: this.payType,
        orderAddress: this.orderAddress
      };

      if (this.payType === '2' && this.orderAddress === '') {
        Toast.fail("网上支付请输入收货地址");
        return;
      }

      orderPay(data).then((res) => {
        if (res.code === 200) {
          Toast.success(res.message);
          // 成功跳转到订单列表
          this.$router.push('/user')
        } else {
          Toast.fail(res.message);
        }
      });
    },

    orderSure(routerParams, choseCoupon) {
      orderSure(routerParams).then((res) => {
        this.orderList = res.data;
        this.payAmount = res.payAmount;
        res.data.forEach((value, index) => {
          this.activeNames.push(index);
        })
      });
    },
    paySuccess() {
      this.$router.push({path: "/order/orderList"});
    },
    getOrderParams() {
      // 取到路由带过来的参数
      let routerParams = this.$route.query;
      // 将数据放在当前组件的数据内
      this.addressId = routerParams.id;
    },
    toProduct() {
      this.$route.push({
        path: "/order/orderProduct",
      });
    },
    findCoupon() {
      this.showList = true;
    },
  },
  watch: {
    $route: "getOrderParams",
  },
};
</script>

<style>
hr {
  border-top: 1px dashed #82bbf5;
}

.van-collapse-item__content {
  padding-top: 0px;
  padding-bottom: 0px;
}

.van-collapse-item {
  margin-top: 5px;
  margin-bottom: 5px;
}

.item-right {
  width: 100%;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  font-size: large;
}

.my-title {
  font-size: large;
  color: #999999;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.bottom-price {
  margin-right: 10px;
}
</style>
