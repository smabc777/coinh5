import Pledge from '@/views/pledge/index.vue'
import PledgeDetail from '@/views/pledge/pledgeDetail.vue'
import PledgeOrder from '@/views/pledge/pledgeOrder.vue'
export default [
    // 质押挖矿
    {
        path: '/pledge',
        name: 'Pledge',
        component: Pledge
    },
    // 质押挖矿详情
    {
        path: '/pledge/pledgeDetail',
        name: 'PledgeDetail',
        component: PledgeDetail
    },
    // 质押挖矿记录
    {
        path: '/pledge/pledgeOrder',
        name: 'PledgeOrder',
        component: PledgeOrder
    }
]
