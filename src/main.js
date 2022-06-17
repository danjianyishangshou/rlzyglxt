import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

// 希望全局注册很多组件，但是不希望在main.js中出现大量的导入和注册的代码
// 通过分析组件库，因为组件库也有很多组件要用，全部导入=>全局注册了所有的组件=>我们只看到了Vue.use
// 我们也想通过Vue.use()能够实现很多组件的注册
// 因为我们想用Vue.use()用的时候只能传一个插件对象（必须install)

// import PageTools from './components/PageTools'
// Vue.component('PageTools', PageTools)
// 注册成插件
import components from '@/components'
Vue.use(components)
// 发请求的子项
// import http from '@/utils/request'
import '@/icons' // icon
import '@/permission' // permission control
// 单个导入全局指令
// import { imgError } from '@/directive'
// Vue.directive('imgError', imgError)
// 有一种语法：一次性导入所有的按需导出
import * as directives from '@/directive'
// 遍历注册所有的指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 注册全局的过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
// for (const key in directives) {
//   Vue.directive(key, directives[key])
// }

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// Vue.prototype.$http = http
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
