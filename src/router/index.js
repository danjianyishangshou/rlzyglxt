// 这个文件最好只放置路由规则
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import Layout from '@/layout'

import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permission'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/setting'
import socialRouter from './modules/social'

// 动态路由表=>动态路由（需要权限才可以访问的）我们这里准备一个数组存放
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter,
  socialRouter
]

// 配置路由规则 使用一个方法便于调用
export const constantRoutes = [
// 之前的组件的导入方式，是直接加载的！
// 将来用户一进入你的系统，代码执行，所有的组件全部加载进来，你才会看到页面，首屏加载速度慢；
// 优化用户体验，缩小首屏加载时间，希望用户看了哪个组件，只加载那个组件=>路由懒加载
  {
    path: '/login',
    // 路由懒加载
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页的一级路有且他有二级路由
  // 首页模块
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      // meta 给路由规则添加额外信息
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
// 创建了一个路由实例 即路由器
const createRouter = () => new Router({
  // mode: 'history', // require service support
  // 滚动行为配置 将来切换路由组件时 相当于出现了从上到下的切换效果
  scrollBehavior: () => ({ y: 0 }),
  // 将路由的路径配置的数组放在了路由器的配置文件中 方便后期直接拿到这个数组进行操作
  routes: [...constantRoutes, ...asyncRoutes]
})

// 路由实例 设置路由前置守卫
// 将配置好的路由器赋值给变量
const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  // 创建了一个新的路由器
  const newRouter = createRouter()
  // 清空原路由器 使用新的替换
  router.matcher = newRouter.matcher // reset router
}
export default router
