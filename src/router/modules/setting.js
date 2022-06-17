// 公司设置模块
import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/setting'),
      meta: { title: '公司设置', icon: 'lock' }
    }
  ]
}
