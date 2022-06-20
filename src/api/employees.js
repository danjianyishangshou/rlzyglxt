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

/** **
 *  批量新增员工的接口
 * **/
export function reqAddEmployeeBatch(arr) {
  return http({
    method: 'post',
    url: '/sys/user/batch',
    data: arr
  })
}

/** *
 * 保存员工的基本信息 需要传data
 * **/
export function reqSaveUserDetailById(data) {
  return http({
    method: 'put',
    url: `/sys/user/${data.id}`,
    data
  })
}

/** *
 *  读取用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqGetPersonalDetail(id) {
  return http({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqUpdatePersonal(data) {
  return http({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/** **
 * 获取用户的岗位信息  (岗位信息)
 * ****/
export function reqGetJobDetail(id) {
  return http({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * ****/
export function reqUpdateJob(data) {
  return http({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}
