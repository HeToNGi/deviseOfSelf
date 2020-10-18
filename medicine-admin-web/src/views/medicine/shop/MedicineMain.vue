<template>
  <div>
    <!--药品管理-->
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-header>
        <div class="logo"/>
        <a-menu
            theme="dark"
            mode="horizontal"
            :default-selected-keys="['1']"
            :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1"
                       @click="goRouter('MedicineShopAnalysis')"
                       :disabled="$route.path === '/MedicineShopAnalysis'"
                       :style="{color: $route.path === '/MedicineShopAnalysis'? 'white!important': ''}">
            统计分析
          </a-menu-item>
          <a-menu-item key="2"
                       @click="goRouter('MedicineShopGoodsType')"
                       :disabled="$route.path === '/MedicineShopGoodsType'"
                       :style="{color: $route.path === '/MedicineShopGoodsType'? 'white!important': ''}">
            药品分类管理
          </a-menu-item>
          <a-menu-item key="3"
                       @click="goRouter('MedicineShopGoods')"
                       :disabled="$route.path === '/MedicineShopGoods'"
                       :style="{color: $route.path === '/MedicineShopGoods'? 'white!important': ''}">
            药品管理
          </a-menu-item>
          <a-menu-item key="4"
                       @click="goRouter('MedicineShopOrder')"
                       :disabled="$route.path === '/MedicineShopOrder'"
                       :style="{color: $route.path === '/MedicineShopOrder'? 'white!important': ''}">
            本店订单
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px;margin-top: 10px">
        <div :style="{ background: '#fff', padding: '0px', minHeight: '280px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        药店管理端
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
export default {
  name: "MedicineMain",
  mounted(){

  },
  methods: {
    goRouter(path) {
      this.$router.push("/" + path)
    }
  }
}
</script>

<style scoped>

</style>