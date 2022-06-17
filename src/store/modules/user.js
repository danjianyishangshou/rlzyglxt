import { reqLogin, reqGetProFile, reqGetBaseInfo } from '@/api/user'
// 只用来存放用户相关的数据
// token等
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken() || '',
  userInfo: {}
}
const actions = {
  logout(context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
  },
  // 注意没有请求成功的时候不要让其进入页面
  async login(context, obj) {
    // return new Promise((resolve, reject) => {
    //   reqLogin(obj).then(res => {
    //     context.commit('setToken', res.data)
    //     resolve(res)
    //   }).catch((err) => {
    //     reject(err)
    //   })
    // })

    const res = await reqLogin(obj)
    context.commit('setToken', res.data)
    return res
  },
  // 注意没有请求成功的时候不要让其进入页面
  async getUserInfo(context) {
    const { data } = await reqGetProFile()
    // res是含头像的数据
    const { data: res } = await reqGetBaseInfo(data.userId)
    // 获取包含用户头像的资料
    // console.log(res, '包含用户头像的资料')
    // 创建一个完整的用户信息的数组 包括头像 和基本信息
    const resultObj = {
      ...data,
      ...res
    }
    context.commit('setUserInfo', resultObj)
    // 在async函数中return结果相当于之前在promise里resolve(结果)
    return resultObj
  }
}
const mutations = {
  // 修改token的mutation
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  },
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = ''
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
