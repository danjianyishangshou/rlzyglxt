// 0成本上手cookie
// 获取cookie Cookie.get('name')
// set  remove

import Cookies from 'js-cookie'

// cookie名字xnmrzglxt-token
const TokenKey = 'xnmrzglxt-token'
/**
 *获取token
 */
export function getToken() {
  return Cookies.get(TokenKey)
}
/**
 *设置token
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
/**
 *清除token
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}
