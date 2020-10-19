<template>
  <div>
    <div class="my-container">
      <div class="my-cell">
        <p class="title">总销售额</p>
        <p class="content">￥{{ amount }}</p>
        <p>商店总销售额</p>
      </div>
      <div class="my-cell">
        <p class="title">总订单量</p>
        <p class="content">{{ orderNums }}</p>
        <p>商店总订单量</p>
      </div>
      <div class="my-cell">
        <p class="title">用户数</p>
        <p class="content">{{ usersNum }}</p>
        <p>商店总下单用户数量</p>
      </div>
    </div>
    <div class="my-container">
      <div class="my-cell-half">
        <ve-histogram :data="chartData"></ve-histogram>
      </div>
      <!--      <div class="my-cell-half">-->
      <!--        <p class="title">总订单量</p>-->
      <!--        <p class="content">2036.36</p>-->
      <!--        <p>日均订单量36.02</p>-->
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import request from "@/util/request";

export default {
  name: "MedicineShopAnalysis",
  components: {},
  data() {
    return {
      amount: 0,
      usersNum: 0,
      orderNums: 0,
      chartData: {
        columns: ['日期', '销售额'],
        rows: []
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      request.post('/medicine/shop/analysis').then(res => {
        console.log(res)
        if (res.code === 200) {
          this.amount = res.data.amount;
          this.orderNums = res.data.orderNums;
          this.usersNum = res.data.usersNum;
          this.chartData.rows = res.data.chartData;
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      })
    }
  }
}
</script>

<style scoped>

.my-container {
  display: flex;
  justify-content: space-between;
}

.my-cell {
  width: 30%;
  height: 180px;
  background-color: #f8f6f6;
  margin: 10px;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
}

.my-cell > .title {
  font-size: larger;
}

.my-cell > .content {
  font-size: xx-large;
  padding-left: 0px;
}

.my-cell-half {
  width: 100%;
  height: auto;
  margin: 10px;
  padding: 10px;
  background-color: #f8f6f6;
  border-radius: 5px;
}

.my-cell-half:hover, .my-cell:hover {
  transition: 0.5s;
  box-shadow: 0px 0px 10px 5px #bfbfbf;
}

</style>