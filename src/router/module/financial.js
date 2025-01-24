import Financial from '@/views/financial/index.vue'
import FinancialDetails from '@/views/financial/financialDetails.vue'
import MyInvestment from '@/views/financial/myInvestment.vue'
import AddIncome from '@/views/financial/addIncome.vue'
import MembersOnly from '@/views/financial/membersOnly.vue'
import GeneralMerchandise from '@/views/financial/generalMerchandise.vue'

export default [
    // 理财
    {
        path: '/financial',
        name: 'Financial',
        meta: {
            key:'FINANCIAL'
        },
        component: Financial
    },
    {
        path: '/financialDetails/:id',
        name: 'FinancialDetails',
        component: FinancialDetails
    },
    // 我的投资
    {
        path: '/myInvestment',
        name: 'MyInvestment',
        component: MyInvestment
    },
    // 增值收益
    {
        path: '/addIncome',
        name: 'AddIncome',
        component: AddIncome
    },
    // 会员专区
    {
        path: '/membersOnly',
        name: 'MembersOnly',
        component: MembersOnly
    },
    // 普通产品
    {
        path: '/generalMerchandise',
        name: 'GeneralMerchandise',
        component: GeneralMerchandise
    }
]
