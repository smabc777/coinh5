import '@/assets/main.scss'
import 'vant/es/toast/style'
import 'vant/lib/index.css'
import 'lib-flexible'
import 'animate.css'

import BreathingColors from 'vue-breathing-colors'
import { createApp } from 'vue'
import _ from 'lodash'
import pinia from '@/store/pinia'

import App from './App.vue'
import router from './router/index'
import { setupI18n } from './plugin/i18n/index'
import * as publicFun from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { useMainStore } from '@/store/index'
import { _initCoinWebSocket } from '@/plugin/socket/index.js'
import { initSwitchWalletEvent } from './plugin/chain'
import { Lazyload, setToastDefaultOptions, showDialog } from 'vant'
import { initTheme, switchPlanform, stopDefaultEvent, visibilitychange } from './utils/index'
import { useUserStore } from '@/store/user/index.js'

/**
 * 初始化主题
 * **/
initTheme()

/**
 * 切换平台 pc、h5
 */
switchPlanform(true)
window.addEventListener(
    'resize',
    _.debounce(function () {
        switchPlanform()
    }, 150)
)

/**
 * vant组件
 * 设置默认参数
 * **/
setToastDefaultOptions({ duration: 1500 })
setToastDefaultOptions('loading', { forbidClick: true })

/**
 * 初始化socket
 */
_initCoinWebSocket()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(BreathingColors)
// 手动注册设置`lazyComponent`选项
app.use(Lazyload, {
    lazyComponent: true,
});

// 获取币种列表
const tradeStore = useTradeStore()
const mainStore = useMainStore()
const userStore = useUserStore()


// 获取平台地址 获取平台配置 币种列表 语言列表
Promise.all([
    // 获取汇率
    // tradeStore.getRateinfo(),
    // 获取客服
    userStore.getCustomerServicelists(),
    // 获取平台配置
    mainStore.getPlatFormConfig(),
    // 系统配置
    mainStore.getSettingConfig(),
    // 币种列表
    tradeStore.getCoinList(),




    // 获取首页notice配置
    // mainStore.getSettingNotice(),
    // 语言列表
    // mainStore.getLanguageList()
]).then(async () => {
    const currentLanguage = mainStore.languageList.filter((item) => item.isDefault === 'Y')
    // 判断语言列表中是否存在缓存语言 若不存在 使用默认语言
    let defaultLanguage = mainStore.language || ''
    if (!defaultLanguage && currentLanguage.length) {
        defaultLanguage = currentLanguage[0].dictValue
    }
    
    const i18n = await setupI18n(defaultLanguage)
    app.use(i18n)
    app.mount('#app')
})

// 页面公共函数注册
for (const key in publicFun) {
    if (Object.hasOwnProperty.call(publicFun, key)) {
        const elem = publicFun[key]
        app.config.globalProperties[key] = elem
    }
}

// 钱包监听
initSwitchWalletEvent()

// 阻止默认事件
stopDefaultEvent()

// 可见度变化
visibilitychange()
