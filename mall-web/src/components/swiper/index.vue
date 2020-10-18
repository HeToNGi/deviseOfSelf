<template>
  <div class="swiper-class">
    <van-swipe :autoplay="3000" :style="'height:' + height + 'px'">
      <van-swipe-item v-for="(image, index) in whellList" :key="index">
        <a v-if="image.type == '1'" @click="onclickImg(index)">
          <img style="width: 100%" :src="image.url" height="100%" />
        </a>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      whellList: [],
      height: 0,
    };
  },
  props: {
    data: Array,
  },
  methods: {
    getSwiperList() {
      this.whellList = this.data;
      let that = this;
      let image = this.data[0];
      let img = new Image();
      img.src = image.url;
      let width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      img.onload = function () {
        that.height = Math.ceil((img.height / img.width ) * width / 2);
      };
    },
    onclickImg(index) {
      Toast(index);
    },
  },
  created() {
    this.getSwiperList();
  },
};
</script>
<style>
.swiper-class {
  background: #f5f5f5 !important;
}
</style>
