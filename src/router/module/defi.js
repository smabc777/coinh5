// defi 路由模块
import DefiIndex from '@/views/defi/index.vue'
import DefiDetail from '@/views/defi/defiDetail.vue'

export default [
  {
    path: '/defi',
    name: 'Defi',
    meta: {
      key: 'DEFI'
    },
    component: DefiIndex
  },
  {
    path: '/defiDetail',
    name: 'defiDetail',
    component: DefiDetail
  }
]
