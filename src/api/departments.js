// 封装与组织架构有关系的接口

import http from '@/utils/request'
/**
 * 获取企业内部部门列表
 */
export const reqGetDepartments = () => {
  return http({
    methods: 'get',
    url: '/company/department'
  })
}
/**
 * 根据ID删除部门
 *  obj {name code manager introduce pid}
 */
export const reqDelDepartments = (id) => {
  // console.log(id, 6726298)
  return http({
    methods: 'delete',
    url: `/company/department/${id}`
  })
}

/**
 * 新增部门

 */
export const reqAddDepartment = (obj) => http({
  method: 'post',
  url: '/company/department',
  data: obj
})

/** *
 * 获取部门详情
 * ***/
export function reqGetDepartDetail(id) {
  return http({
    url: `/company/department/${id}`
  })
}

/**
 * 编辑部门
 ***/
export function reqUpdateDepartments(data) {
  return http({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
