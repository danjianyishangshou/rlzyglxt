import http from '@/utils/request'

/**
 *
 * @returns 获取所有权限
 */
export function reqGetPermissionList() {
  return http({
    method: 'get',
    url: '/sys/permission'
  })
}
/**
 * 新增权限
 * @param {*} data
 * @returns
 */
export function reqAddPermission(data) {
  return http({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

/**
 * 更新权限
 * @param {*} data
 * @returns
 */
export function reqUpdatePermission(data) {
  return http({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}

/**
 * 删除权限
 * @param {*} id
 * @returns
 */
export function reqDelPermission(id) {
  return http({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}
/**
 * 根据id获取权限详情
 * @param {*} id
 * @returns
 */
export function reqGetPermissionDetail(id) {
  return http({
    method: 'get',
    url: `/sys/permission/${id}`
  })
}

/**
 * 给角色分配权限
 * @param {*} id
 * @param {*} permIds
 * @returns
 */
export function reqAssignPerm(id, permIds) {
  return http({
    url: '/sys/role/assignPrem',
    method: 'put',
    data: {
      id,
      permIds
    }
  })
}
