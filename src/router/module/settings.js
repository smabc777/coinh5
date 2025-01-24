import LanguageSelection from '@/views/settings/language-selection.vue'
import CertificationPrimary from '@/views/settings/certification/certification-primary.vue'
import CertificationAdvanced from '@/views/settings/certification/certification-advanced.vue'
import BindCard from '@/views/settings/bankcard/index.vue'
import AddBank from '@/views/settings/bankcard/add.vue'
import EditBank from '@/views/settings/bankcard/edit.vue'
import AddAddress from '@/views/settings/add-address.vue'
export default [
    // 多语言设置
    {
        path: '/language-selection',
        name: 'LanguageSelection',
        component: LanguageSelection
    },
    // 初级认证
    {
        path: '/certification-primary',
        name: 'CertificationPrimary',
        component: CertificationPrimary
    },
    // 实名认证
    {
        path: '/certification-advanced',
        name: 'CertificationAdvanced',
        component: CertificationAdvanced
    },
    // 绑定银行卡
    {
        path: '/bind-card',
        name: 'BindCard',
        component: BindCard
    },
    // 添加银行卡
    {
        path: '/add-bank',
        name: 'AddBank',
        component: AddBank
    },
    // 修改银行卡
    {
        path: '/edit-bank',
        name: 'EditBank',
        component: EditBank
    },
    // 绑定钱包地址
    {
        path: '/addAddress',
        name: 'AddAddress',
        component: AddAddress
    }
]
