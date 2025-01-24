// defi 路由模块
import DeficIndex from '@/views/defic/index.vue'
import DeficDetail from '@/views/defic/deficDetail.vue'

export default [
  {
    path: '/defic',
    name: 'Defic',
    meta: {
      key: 'DEFIC'
    },
    component: DeficIndex
  },
  {
    path: '/deficDetail',
    name: 'deficDetail',
    component: DeficDetail
  }
]
