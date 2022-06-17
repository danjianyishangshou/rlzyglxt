import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
// 创建axios 实例 配置基地址更加灵活 给子节点发请求使用
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // 设置请求时长限制
  // timeout: 5000 // request timeout
})

// 请求拦截器
http.interceptors.request.use(function(config) {
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})
// 响应拦截器
// 处理请求成功 操作失败的

http.interceptors.response.use(function(response) {
  // 对响应数据做点什么
  // 处理登录响应成功但密码错误的情况
  const { data: res } = response
  const { success, message } = res
  if (!success) {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
  // console.log(res, 1111)
  return res
}, function(error) {
  // 对响应错误做点什么
  console.dir(error, 22222)
  // 处理token过期的情况
  if (error.response.status === 401 && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
    Message.error('登录会话已过期, 请重新登录~')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default http
