import Help from '@/views/help/index.vue'
import HelpDetail from '@/views/help/helpDetail.vue'
import TermService from '@/views/help/term-service.vue'
import Introduction from '@/views/help/introduction.vue'
import VipRule from '@/views/help/vip-rule.vue'
import ProductPlan from '@/views/help/productPlan.vue'
import WelfareEvents from '@/views/help/welfareEvents.vue'
export default [
    // 帮助列表
    {
        path: '/help',
        name: 'Help',
        component: Help
    },
    // 帮助详情
    {
        path: '/helpDetail/:id',
        name: 'HelpDetail',
        component: HelpDetail
    },
    // 服务条款
    {
        path: '/term-service',
        name: 'TermService',
        component: TermService
    },
    // 交易所简介
    {
        path: '/introduction',
        name: 'Introduction',
        component: Introduction
    },
    // vip等级规则
    {
        path: '/vip-rule',
        name: 'VipRule',
        component: VipRule
    },
    // 产品规划
    {
        path: '/productPlan',
        name: 'ProductPlan',
        component: ProductPlan
    },
    // 福利活动
    {
        path: '/welfareEvents',
        name: 'WelfareEvents',
        component: () => WelfareEvents
    }
]
