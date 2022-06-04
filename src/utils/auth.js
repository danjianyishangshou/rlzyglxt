// 0成本上手cookie
// 获取cookie Cookie.get('name')
// set  remove

import Cookies from 'js-cookie'

// cookie名字xnmrzglxt-token
const TokenKey = 'xnmrzglxt-token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
