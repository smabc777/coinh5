import Subscription from '@/views/subscription/index.vue'
import SubscriptionInfo from '@/views/subscription/info.vue'
import SubscriptionApply from '@/views/subscription/apply.vue'
import SubscriptionOrder from '@/views/subscription/order.vue'
export default [
    // 申购
    {
        path: '/subscription',
        name: 'Subscription',
        component: Subscription
    },
    //详情
    {
        path: '/subscription/info',
        name: 'Subscription-info',
        component: SubscriptionInfo
    },
    //申请
    {
        path: '/subscription/apply',
        name: 'Subscription-apply',
        component: SubscriptionApply
    }, 
    // 记录
    {
        path: '/subscription/order',
        name: 'Subscription-order',
        component: SubscriptionOrder
    }
]
