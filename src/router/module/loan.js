import Loan from '@/views/loan/index.vue'
import LoanRecord from '@/views/loan/loan-record.vue'
import LoanRule from '@/views/loan/loan-rule.vue'
export default [
    // 助力贷
    {
        path: '/loan',
        name: 'Loan',
        component: Loan
    },
    // 助力贷记录
    {
        path: '/loan-record',
        name: 'LoanRecord',
        component: LoanRecord
    }, 
    // 助力贷规则
    {
        path: '/loan-rule',
        name: 'LoanRule',
        component: LoanRule
    }
]
