<template>
  <div class="navbar">
    <!-- 汉堡包组件 收起展开 -->
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- 面包屑组件 路径导航 -->
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 公司名 -->
    <div class="app-breadcrumb">
      后台管理系统
      <span class="breadBtn">体验版</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img v-imgError="defaultImg" :src="staffPhoto" class="user-avatar">
          <span class="name">{{ name }}</span>
          <i class="el-icon-caret-bottom" style="color: #fff" />
        </div>

        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- router-link本质就是一个a标签！习惯：站内跳转路由router-link;跳转外站用a -->
          <router-link to="/">
            <el-dropdown-item> 首页</el-dropdown-item>
          </router-link>
          <!-- <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
           </a> -->
          <el-dropdown-item divided @click.native="logoutFn">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import defaultImg from '@/assets/images/default.png'
export default {
  components: {
    // Breadcrumb,
    Hamburger
  },
  data() {
    return {
      // defaultImg: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2944476239,2235255584&fm=26&gp=0.jpg'
      // 将来如果想使用本地图片作为默认图，请记住是不能直接写死字符串，webpack不会解析
      // defaultImg: '@/assets/common/bigUserHeader.png' 错误
      // 应该使用以下方法
      defaultImg: require('@/assets/common/bigUserHeader.png')
      // 或者使用提前导入的图片
      // defaultImg: defaultImg
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name', 'staffPhoto'])

    // mapState('user', ['userInfo'])
  },
  created() {
    this.$store.dispatch('user/getUserInfo')
  },
  methods: {
    ...mapActions('user', ['logout']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 清除仓库与本地token 并切返回登陆页
    logoutFn() {
      /**
       * 清除仓库与本地token
       */
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 18px;
  line-height: 50px;
  margin-left: 10px;
  color: #fff;
  cursor: text;
  .breadBtn {
    background: #4f917b;
    font-size: 14px;
    padding: 0 10px;
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border-radius: 10px;
    margin-left: 15px;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: rgb(54, 56, 66);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;

    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
    .hamburger {
      color: #fff !important;
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(57, 198, 158, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: middle;
        }
        .name {
          cursor: pointer;
          color: #fff;
          vertical-align: middle;
          margin-left: 5px;
        }
        .user-dropdown {
          color: #fff;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
