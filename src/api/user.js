import http from '@/utils/request'

export const reqLogin = (obj) => {
  return http({
    method: 'post',
    url: '/sys/login',
    data: obj
  })
}

/**
 * 获取用户基本信息(需要token)
 */
export function reqGetProFile() {
  return http({
    method: 'POST',
    url: '/sys/profile'
    // 需要token 可以配置到请求拦截器里
  })
}

/**
 * 用户基本信息 用于获取头像等(需要id)
 */
export function reqGetBaseInfo(id) {
  return http({
    method: 'get',
    url: `/sys/user/${id}`
  })
}
/**
 *  获取负责人接口
 */
export const reqGetEmployeeSimple = () => http({
  method: 'get',
  url: '/sys/user/simple' })

