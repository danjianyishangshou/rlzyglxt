import http from '@/utils/request'
/**
 * 获取员工的综合列表数据 (分页)
 * ***/
export function reqGetEmployeeList(page, size) {
  return http({
    methods: 'get',
    url: '/sys/user',
    params: {
      page,
      size
    }
  })
}
/**
 * 删除员工 ()
 */
export function reqDelEmployee(id) {
  return http({
    method: 'delete',
    url: `/sys/user/${id}`
  })
}

/** **
 *  新增员工的接口
 * **/
export function reqAddEmployee(data) {
  return http({
    method: 'post',
    url: '/sys/user',
    data
  })
}
