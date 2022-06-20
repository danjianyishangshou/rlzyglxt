// 员工模块
import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail/:id',
      name: 'detail',
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: { title: '员工信息页' }
    },
    {
      path: 'print/:id',
      name: 'print',
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: { title: '打印' }
    }
  ]
}
