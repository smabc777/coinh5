import Register from '@/views/register/index.vue'
export default [
// 注册相关页
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    // 注册
    {
        path: '/i&:invite_code',
        redirect: (to) => {
            return { name: 'Register', query: { invite_code: to.params.invite_code } }
        }
    },
]
