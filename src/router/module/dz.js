// 大宗新股日内交易相关路由
export default [
  {
    path: '/dzList',
    name: 'dzList',
    component: () => import('@/views/dz/list.vue'),
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import('@/views/dz/order.vue'),
  }
  ,
  {
    path: '/newSharesCenter',
    name: 'newSharesCenter',
    component: () => import('@/views/newSharesCenter/new-shares-center.vue'),
  },

]