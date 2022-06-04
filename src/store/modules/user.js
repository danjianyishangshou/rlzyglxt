import { reqLogin } from '@/api/user'
// 只用来存放用户相关的数据
// token等
import { getToken, setToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
}
const mutations = {
  // 修改token的mutation
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  }
}
const actives = {

  async login(context, obj) {
    // reqLogin(obj).then(res => {
    //   context.commit('setToken', res.data.data)
    // })
    try {
      const res = await reqLogin(obj)
      context.commit('setToken', res.data.data)
    } catch (error) {
      console.log(error)
    }
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actives,
  getters
}
