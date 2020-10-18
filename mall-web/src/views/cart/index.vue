<template>
  <div class="cart-container">
    <ul class="cart-list">
      <van-checkbox-group
        v-model="result"
        ref="checkboxGroup"
      >
        <li class="item" v-for="(item, index) in list" :key="index">
          <van-swipe-cell class="van-swipe-cell">
            <van-card
              :price="item.price"
              :title="item.productName"
              :thumb="item.image"
              :origin-price="item.originPrice"
              :sku="item.sku"
              :desc="item.title"
            >
              <div slot="num">
                <van-stepper
                  :value="item.quantity"
                  disable-input
                  @plus="plusAdd(item.sku, item.quantity, index, item.price)"
                  @minus="minus(item.sku, item.quantity, index, item.price)"
                  max="99"
                  min="1"
                  async-change
                />
              </div>
              <template slot="footer">
                <div>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                    @click="onClose(item.sku)"
                  />
                </div>
              </template>
            </van-card>
          </van-swipe-cell>
        </li>
      </van-checkbox-group>
    </ul>
    <div>
      <van-submit-bar
        :price="total"
        :button-text="btn_text"
        :loading="loading"
        @submit="onSubmit"
        to="/order/createOrder"
      >
      </van-submit-bar>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast } from "vant";
import { Tag } from "vant";

Vue.use(Tag);
Vue.use(Toast);
import {
  addCart,
  addCartNum,
  deleteCart,
  findCart,
  selectCart,
} from "../../api/cart";

export default {
  inject: ["reload"],
  data() {
    return {
      check: false,
      loading: false,
      result: [],
      btn_text: "提交订单",
      stepper: 1,
      cartEntries: [],
      total: 0,
      list: [],
    };
  },
  components: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      findCart().then((res) => {
        let array = [];
        this.list = res.data.cartEntries;
        for (let i in this.list) {
          if (this.list[i].checked) {
            array.push(this.list[i].sku);
          }
        }
        this.result = array;
        this.total = res.data.total * 100;
        this.check = res.data.selectAll;
        if (res.data.totalNum != 0) {
          this.btn_text = "提交订单" + "(" + res.data.totalNum + ")";
        } else {
          this.btn_text = "提交订单";
        }
      });
    },
    onSubmit() {
      if (this.list.length === 0) {
        Toast.fail("请选择商品");
      } else {
        this.loading = true;
        this.$router.push({ path: "/order/createOrder" });
      }
    },
    
    onClose(sku) {
      deleteCart(sku).then((res) => {
        Toast.success(res.message);
        this.init();
      });
    },

    plusAdd(sku, quantity, index, price) {
      addCartNum(sku, 1).then((res) => {
        if (res.code == 200) {
          Toast.success(res.message);
        } else {
          Toast.fail("添加失败");
        }
        this.init();
      });
    },
    minus(sku, quantity, index, price) {
      addCartNum(sku, -1).then((res) => {
        if (res.code == 200) {
          Toast.success("减少成功");
        } else {
          Toast.fail("减少失败");
        }
        this.init();
      });
    },
  },
};
</script>
<style lang="less">
.cart-container {
  background-color: #f5f5f5;
  padding-bottom: 50px;
}

.cart-list {
  margin: 0 12px;

  border-radius: 10px;

  .item {
    margin: 10px 0;
    background-color: #fff;
    height: 105px;
  }
}

.van-card {
  .van-checkbox {
    position: absolute;
    left: -115px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.van-loading__spinner {
  width: 20px !important;
  height: 20px !important;
}

.goods-card {
  margin: 0;
  background-color: #fff;
}

.van-swipe-cell__right {
  height: 105px;
}

.van-swipe-cell__right > div {
  height: 100%;
}

.delete-button,
.warning-button {
  height: 100%;
}

/*.van-submit-bar {*/
/*    margin-bottom: 48px !important;*/
/*}*/

.van-card__tag {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  overflow: hidden;
}

.van-card {
  padding-left: 30px;
}

.van-card__thumb {
  width: 80px !important;
  height: 80px !important;
}

.van-card__price {
  color: #e55050;
  font-weight: bold;
}

/*.coupon-text{*/
/*    font-size: 6px;*/
/*    width: 60px;*/
/*    margin-bottom: -1px;*/
/*    margin-right: 50px;*/
/*}*/
</style>
