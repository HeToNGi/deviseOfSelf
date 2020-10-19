<template>
  <div>
    <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        @search="onSearch"
        input-align="center"
        @cancel="onCancel"
    />
    <div v-if="searchText === ''">
      <homeSwiper :data="swiperList"/>

      <van-notice-bar
          color="#1989fa"
          background="#ecf9ff"
          mode="closeable"
          left-icon="volume-o"
          text="欢迎使用在线药品销售平台"
      />
      <goodsList title="推荐商品" type="goods"/>
    </div>
    <searchList
        ref="searchList"
        v-else
        title="搜索结果"
        type="goods"
    />
  </div>
</template>

<script>
import homeSwiper from "../components/swiper";
import goodsList from "../components/goods/list";
import searchList from "../components/goods/searchlist";
import Vue from "vue";
import {Toast} from "vant";
import {NoticeBar} from "vant";

Vue.use(Toast);
Vue.use(NoticeBar);
export default {
  name: "Home",
  components: {
    homeSwiper,
    goodsList,
    searchList,
  },
  data() {
    return {
      searchText: "",
      swiperList: [
        {
          id: 1,
          name: "999感冒灵",
          url:
              "http://127.0.0.1:3000/images/upload_e1442b46319c11670d97ea88f0e3460e.jpg",
          type: 1,
          enable: 1,
        },
        {
          id: 2,
          name: "",
          url:
              "http://127.0.0.1:3000/images/upload_404b138861dbc67fd4950f8a2dcfc586.jpg",
          type: 1,
          enable: 1,
        },
      ],
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {},
  methods: {
    onSearch(val) {
      this.$refs.searchList.getGoodsList(val);
    },
    onCancel() {
    },
  },
};
</script>
<style lang="less" scoped>
.banner-img {
  //margin: 10px;
  //height: 96px;
  border-radius: 10px;
  background: #f5f5f5 !important;
  /*overflow: hidden;*/

  img {
    width: 100%;
    height: 100%;
  }
}

.seckill-img {
  margin-top: 10px;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
