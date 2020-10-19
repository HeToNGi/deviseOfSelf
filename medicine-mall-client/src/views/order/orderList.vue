<template>
  <div>
    <div>

      <van-tabs v-model="active">
        <van-tab title="待取货">
          <orderSimpleList :key="12" :status="1" class="orderSimpleList"/>
        </van-tab>

        <van-tab title="待收货">
          <orderSimpleList :key="2" :status="2" class="orderSimpleList"/>
        </van-tab>

      </van-tabs>

    </div>
  </div>
</template>
<script>

import {Tab, Tabs} from 'vant';
import Vue from 'vue';
import {Cell, CellGroup} from 'vant';
import {Divider} from 'vant';
import orderSimpleList from './orderSimpleList'

const VueTouch = require('vue-touch');
Vue.use(VueTouch, {name: 'v-touch'})

Vue.use(Divider);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Tab);
Vue.use(Tabs);
export default {
  components: {
    orderSimpleList,
  },
  data() {
    return {
      status: 0,
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageSize: 4,
      error: false,
      pageNumber: 1,
      active: 0,


    };
  },
  created() {
    this.active = this.$route.params.active
  },
  methods: {

  }
}
</script>
<style>
.orderSimpleList {
  height: 185px;
  min-height: 185px
}

</style>
