// 提供一个vue插件对象，必须提供一个install方法
// 封装插件的目的：全局注册很多组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './imageUpload'
export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }
}
