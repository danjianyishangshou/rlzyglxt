<template>
  <section class="app-main">
    <!-- transition是vue内置的标签 用于组件切换时有过度效果 -->
    <transition name="fade-transform" mode="out-in">
      <!-- 封装的二级路由出口 -->
      <!-- :key="key"  对比虚拟DOM-->
      <!-- 将来会有可能多个页面使用到了同一个组件,使用key防止重叠 -->
      <!-- :key="key"就能保证路径一旦变化了，组件一定是销毁重建，就不会出现复用，就不会出现缓存不更新的bug -->
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
