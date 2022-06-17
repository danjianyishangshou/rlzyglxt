// 提供一个vue插件对象，必须提供一个install方法
// 封装插件的目的：全局注册很多组件
import PageTools from './PageTools'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
}
