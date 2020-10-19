<template>
  <div id="app">
    <a-spin size="large" tip="加载中" :spinning="this.$store.state.spinning">
      <router-view/>
    </a-spin>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
  height: 100%;
}

</style>
