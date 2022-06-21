import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const getters = {}
const actions = {
  filterRoutes(context, menus) {
    const otherRoutes = asyncRoutes.filter(item => menus.includes(item.children[0].name))
    context.commit('getRouter', otherRoutes)
    return otherRoutes
  }
}
const mutations = {
  getRouter(state, otherRoutes) {
    state.routes = [...constantRoutes, ...otherRoutes]
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
