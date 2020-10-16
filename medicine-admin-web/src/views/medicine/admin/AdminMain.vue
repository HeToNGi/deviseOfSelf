<template>
  <div>
    <!--  药店管理端首页 药店申请 和 资质审查-->
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-header class="my-header">
        <div class="header-logo">
          <span>管理药店服务端</span>
        </div>
        <div class="header-menu">
          <a-menu
              theme="light"
              mode="horizontal"
              :default-selected-keys="['1']"
              :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1" @click="goMedicineShopApproveReview" :disabled="$route.path === '/MedicineShopApproveReview'">
              接受药店申请
            </a-menu-item>
            <a-menu-item key="2" @click="goMedicineShopCertReview" :disabled="$route.path === '/MedicineShopCertReview'">
              药店资质审查
            </a-menu-item>
          </a-menu>
        </div>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px;margin-top: 10px" >
        <div :style="{ background: '#fff', padding: '10px', minHeight: '280px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        管理药店服务端
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>

export default {
  name: "AdminMain",
  data() {
    return {}
  },

  methods: {
    goMedicineShopApproveReview() {
      this.$router.push('/MedicineShopApproveReview')
    },
    goMedicineShopCertReview() {
      this.$router.push('/MedicineShopCertReview')
    }
  }
}
</script>

<style scoped>
.ant-layout-header {
  background-color: #FFF !important;
}

.my-header {
  width: 100%;
}

.header-logo, .header-menu {
  display: inline-block;
  align-content: flex-start;
}

.header-logo {
  width: 10%;
  text-align: center;
}

.header-logo > span {
  font-size: larger;
}

.header-menu {
  width: 90%;
}
.ant-menu-item-selected{
  color: #1890ff !important;
  border-bottom: 2px solid #1890ff !important;
}
</style>
