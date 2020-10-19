<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
      >
        <div class="order-table" v-for="(order,index) in orderList" :key="index">
          <div class="order-id-time">
            <div class="order-id">
              <a>订单-{{index+1}} 订单编号:{{ order.order_no.substring(0, 10) }}</a>
            </div>
            <div class="order-time">
              <a> {{ order.create_date }}</a>
            </div>
          </div>
          <div class="order-product-simple" v-for="item in order.items">
            <div class="order-product-simple-img">
              <img :src="item.medicine_pic_url" height="80" width="80" alt="">
              <a>{{ item.medicine_name }}</a>
            </div>
            <div class="order-product-number">
              <a style="color: red;font-weight: bolder" class="order-product-price">&yen;
                {{ item.medicine_price }}</a>
              <br/>
              <br/>
              <a>X {{ item.medicine_num }}</a>
            </div>
          </div>
          <div class="my-item" v-if="order.pay_type === '1'">
            <p>
              <span>支付方式：医保卡</span>
            </p>
            <p>
              <span>取货码：{{order.order_no}}</span>
            </p>
            <p>
              <span>是否取货：{{ order.has_pickup === '0' ? '否' : '是' }}</span>
            </p>
            <p>
              <span>取货地址：{{ order.medicine_shop_name + "-" + order.medicine_shop_addr }}</span>
            </p>
          </div>
          <div class="my-item" v-if="order.pay_type === '2'">
            <p>
              <span>支付方式：网上支付</span>
            </p>
            <p>
              <span>收货地址：{{ order.order_address }}</span>
            </p>
          </div>
          <div :class="'order-product-count'">
            共<a style="color: red;font-weight: bolder">{{ order.items.length }}</a>件商品
            ,
            应付总额:
            <a style="color: red;font-weight: bolder">&yen;
              {{ order.order_price }}</a>
          </div>
          <div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>

</template>
<script>
import Vue from 'vue';
import {Button} from 'vant';
import {CountDown} from 'vant';
import {findOrderList} from "../../api/order";
import {Toast} from "vant";

Vue.use(Toast);
Vue.use(CountDown);

Vue.use(Button);
export default {
  name: "orderSimpleList",
  props: ['status'],
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      pageSize: 5,
      pageNumber: 1,
      error: false,
      active: 0,
      total: 0,
      orderList: [],
    }
  },
  mounted() {

    this.onLoad();
  },
  watch: {
    active(newValue, oldValue) {
      this.pageNumber = 1;
    }
  },
  methods: {

    onLoad() {
      this.loading = true;
      let data = {
        status: this.status,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      };
      let that = this;
      findOrderList(data).then(res => {
        if (res.code === 200) {
          Toast.success(res.message)
          const list = res.data.list || [];

          if (list == null) {
            that.finished = true;
            return;
          }
          if (that.pageSize * (that.pageNumber-1) > that.total && that.total !== 0) {
            //that.orderList = list;
            that.finished = true;
            return;
          } else {
            if (that.pageNumber > 1) {
              that.orderList = [...this.orderList, ...list];
            } else {
              that.orderList = list;
            }
            that.pageNumber++;
          }
          that.total = res.data.total;
        } else {
          that.error = true;
          Toast.fail(res.message)
        }
        that.loading = false;
      });
    },

    getListParams() {
      this.active = this.$route.params.active
    },
    beforeChange(index) {
    },
    onRefresh() {
      // 清空列表数据
      this.orderList = [];
      this.pageNumber = 1;
      this.finished = false;
      this.onLoad();
      this.refreshing = false;
    },
  },
}
</script>
<style>

.order-table {
  background-color: white;
  /*height: 185px;*/
  margin-top: 20px;
  width: 100%;
  font-family: PingFangSC-Light, helvetica, 'Heiti SC', serif;
  min-height: 185px;
  border-bottom: 1px gray dashed;
}

.order-product-simple {
  height: 105px;
  background-color: #F5F5F5;
}

.order-product-number {
  width: 25%;
  float: left;
  height: 50%;
  text-align: right;
  margin-top: 30px;

}

.order-product-price {
  padding-top: 20px;
}

.order-product-simple-img {
  width: 70%;
  padding-top: 14px;
  padding-left: 3%;
  float: left;

}

.order-product-number a {
  font-size: 14px;

}


.order-product-simple-img img {
  vertical-align: -50px;
}

.order-product-simple a {
  font-family: PingFangSC-Light, helvetica, 'Heiti SC', serif;
  margin-left: 10px;
  padding-top: -20px;
}

.order-need-to-pay {
  font-family: PingFangSC-Light, helvetica, 'Heiti SC', serif;
  line-height: 44px;
  font-size: 14px;
  width: 95%;
}

.order-product-count {
  font-family: PingFangSC-Light, helvetica, 'Heiti SC', serif;
  line-height: 44px;
  font-size: 14px;
  text-align: right;
  width: 95%;
}

.order-id-time {
  font-size: 14px;
  height: 36px;
  line-height: 36px;
}

.order-id {
  width: 54%;
  float: left;
  margin-left: 3%;
}

.pay-button {
  width: 70px;
  height: 30px;
  margin-left: 20px;
  float: right;
  margin-top: 6px;
  color: white;
}

.order-time {
  width: 40%;
  float: left;;
}
.my-item{
  padding-left: 10px;
  padding-right: 10px;
}
.my-item>p{
  margin-top: 3px;
  margin-bottom: 3px;
}
</style>
