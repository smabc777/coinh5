import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getAcount } from '@/plugin/chain'
import { signUp } from '@/api/user'
import { useUserStore } from '@/store/user/index'
import { useMainStore } from '@/store/index'
import { noLoginRouterList } from './whiteList'
import { showToast } from 'vant'
import { DISABLED_NO_WALLET } from '@/config'
import { dispatchCustomEvent } from '@/utils'
import { useToast } from '@/hook/useToast'
import { _t18 } from "@/utils/public";

/**
 * 路由实例
 */
const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    linkActiveClass: null, // 取消预加载
    linkExactActiveClass: null, // 取消预加载
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 }
    }
})

router.beforeEach(async (to, from, next) => {
    // 开启 Progress
    const userStore = useUserStore()
    const mainStore = useMainStore()
    if (to.path == '/no-wallet') {
        next()
    } else if (userStore.isSign) {
        // 已登录
        userStore.getUserInfo()
        // mainStore.getSettingConfig()
        if (to.path.indexOf('/i&') > -1) {
            next({ path: '/', replace: true })
        } else {
            next()
        }
    } else {
        // 钱包是否登录
        const acountRes = await getAcount()
        // 非钱包
        if (acountRes == 'no-wallet') {

            if (to.path.indexOf('/i&') > -1) {
                let activeCode = to.path.replace('/i&', '')
                next({ path: '/register', query: { invite_code: activeCode }, replace: true })
            } else if (DISABLED_NO_WALLET.includes(__config._APP_ENV)) {
                next('/no-wallet')
            } else {
                if (!noLoginRouterList.includes(to.path)) {
                    next('/login')
                } else {
                    next()
                }
            }
        } else {

            // 通过web3钱包登录 / 必登录
            webLogoin(userStore, acountRes, to, from, next)

        }
    }
})

// 是否通过web3钱包登录
const webLogoin = async (userStore, acountRes, to, from, next) => {

    //是否有邀请码
    let activeCode = null
    if (to.path.indexOf('/i&') > -1) {
        activeCode = to.path.replace('/i&', '')
    }

    let params = {
        activeCode: activeCode,
        signType: 0,
        address: acountRes.data.address,
        walletType: acountRes.data.type
    }

    if (activeCode == null) delete params.activeCode

    const ret = await signUp(params, { loading: true })
    console.log(1111111111111,ret);

    if (ret.code == 200 && ret.data.satoken) {
        
        // 登录成功
        dispatchCustomEvent('event_toastChange', { name: 'login_success' })
        let token = ret.data.satoken
        userStore.setIsSign(true)
        userStore.setToken(token)
        userStore.getUserInfo()
        location.reload('/')
        return (next('/'))
    } else {
        showToast(ret.msg)
    }
    next()

}


router.afterEach((to) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
})

export default router
