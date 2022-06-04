import http from '@/utils/request'

export function reqLogin(obj) {
  return http({
    method: 'post',
    url: '/sys/login',
    data: obj
  })
}
