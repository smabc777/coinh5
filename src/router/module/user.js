import ForgotPassword from '@/views/user/forgot-password.vue'
import FundPassword from '@/views/user/fund-password.vue'
import ChangePassword from '@/views/user/change-password.vue'
import EmailAuthentication from '@/views/user/email-authentication.vue'
import Plug from '@/views/user/plug.vue'
import AppDownload from '@/views/user/app-download.vue'
export default [
    // 忘记密码
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword
    },
    // 设置资金密码
    {
        path: '/fund-password',
        name: 'FundPassword',
        component: FundPassword
    },
    // 设置密码
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: ChangePassword
    },
    // 邮箱认证
    {
        path: '/email-authentication',
        name: 'EmailAuthentication',
        component: EmailAuthentication
    }, 
    // 推广
    {
        path: '/plug',
        name: 'Plug',
        component: Plug
    }, 
    // 下载
    {
        path: '/app-download',
        name: 'AppDownload',
        component: AppDownload
    }
]
