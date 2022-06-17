
import router from '@/router'
import store from '@/store'

import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// permission.js文件的说明：
//! 权限 这个文件是用来进行登录拦截控制
// 后台管理系统 如果用户没登录，登录可以看，404也可以看，其他的页面不给看
// 页面访问权限来说，取决于用户登录没登录，

// 思路：
// 判断用户是否登录，=>token
const WHITE_LIST = ['/login', '/404']

// 白名单 当前身份可以去的地方比如 登陆页 404

// 1.有token,想去哪就去哪
/* 如果去login 引导去主页
  如果不是访问登陆页不做拦截*/

// 2.没有token,强行访问首页，拦截去登陆页
// 此时你访问的是白名单的路径，直接去
// 如果去白名单以为的直接拦截到登陆页

// 配置前置守卫
router.beforeEach(async(to, from, next) => {
  // 如果什么都不写的就是都不放行
  // 一定要设置放行 next()
  // to 是个对象 放着去哪里的所有对象
  // from 是个对象 放着来自哪里的的所有对象
  // 页面只要到了前置守卫这，就快进去了，此时可以开启进度条
  NProgress.start()
  const token = store.getters.token

  if (token) {
    if (to.path === '/login') {
      next('/')
      // 默认拦截的时候不会进入后置守卫
      NProgress.done()
    } else {
      if (!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfo')
        // console.log(res, '这是配置页面加载优化是的res请求')
        next()
      }
      next()
    }
  } else {
    // 如果去白名单的页面 可以去
    if (WHITE_LIST.includes(to.path)) {
      // next放行之前，需要先获取用户资料，只有获取到了用户资料，才能放行
      next()
    } else {
      // 如果获取到了用户资料，就放行
      // 如果不是白名单 则强制去登陆页
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  setTimeout(() => {
    NProgress.done()
  }, 2000)
})
