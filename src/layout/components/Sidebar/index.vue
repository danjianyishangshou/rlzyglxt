<template>
  <div :class="{'has-logo':showLogo}">
    <!-- logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- 侧边栏下面的菜单 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 每一项侧边栏 是从路由器中遍历出来的每一项路由规则 -->
        <!-- 然后将每一项route 传出去进行v-if遍历 进行显示与隐藏的判断-->
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'routes'// 分配权限后的静态加动态路由
    ]),

    // routes() {
    // 没有分配权限的路由
    //   // 表示路由器中的routes属性这里指的是配置的每一项路由   这个属性在路由器中配置的 即需要options配置对象进行获取
    //   // console.log(this.$router.options.routes, 896765)
    //   return this.$router.options.routes
    // },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
