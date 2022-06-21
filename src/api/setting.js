// 设置方面的接口
import http from '@/utils/request'
/**
 * 获取角色列表信息
 * @param {*} page 页码
 * @param {*} pagesize  每一页多少条
 * @returns
 */
export const reqGetRoleList = (page, pagesize = 5) => http.get('/sys/role', { params: { page, pagesize }})
/**
 * 根据id删除列表
 * @param {*} id
 * @returns
 */
export const reqDelRoleList = id => http.delete(`/sys/role/${id}`)
/**
 * 新增角色
 * @param {*} form
 * @returns
 */
export const reqAddRole = data => {
  return http({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
/**
 * 根据id获取信息
 * @param {*} id
 * @returns
 */
export const reqGetRoleDetail = id => http.get(`/sys/role/${id}`)
/**
 * 根据id 更新数据
 * @param {*} id
 * @returns
 */
export const reqUpDataRole = data => http.put(`/sys/role/${data.id}`, data)
/**
 * 根据用户ID和权限id 分配角色
 * @param {*} id 用户id
 * @param {*} roleIds 角色ID数组
 * @returns
 */
export const reqAssignRoles = (id, roleIds) => http({
  method: 'put',
  url: '/sys/user/assignRoles',
  data: {
    id,
    roleIds
  }
})

// 给角色分配权限
export function reqAssignPerm(data) {
  return http({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

