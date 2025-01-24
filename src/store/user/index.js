// 用户模块
import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/user'
import { storageDict } from '@/config/dict'
import { dispatchCustomEvent } from '@/utils'
import { useAccountStore } from '../account'
import { closeToast } from 'vant'
import { useMainStore } from '../index'
import { getCustomerService } from "@/api/common"

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      /**
       * token
       */
      token: '',
      /**
       * 是否登录
       */
      isSign: ref(false),
      /**
       * 用户信息
       */
      userInfo: reactive({}),
      /**
       * 用户信息详情
       * **/
      detail: reactive({}),
      /**
       * 资产列表
       */
      asset: reactive([]),
      /**
       * 是否模拟交易
       */
      isSimulate: ref(false),
      /**
       * 资金列表
       */
      currentAccountData: reactive([]),
      // 获取客服
      service: reactive({})

    }
  },
  actions: {


    /**
     * 设置 token
     * @param {*} token
     */
    setToken(token) {
      this.token = token || ''
      localStorage.setItem(storageDict.TOKEN, this.token)
    },
    /**
     * 设置 登录状态
     * @param {*} isSign
     */
    setIsSign(isSign) {
      this.isSign = isSign
    },
    /**
     * 退出登录
     */
    signOut() {
      try {
        let testPlatform = localStorage.getItem(storageDict.TEST_PLATFORM)

        //token
        localStorage.removeItem(storageDict.TOKEN)
        //用户信息
        localStorage.removeItem(storageDict.USER_INFO)
        localStorage.removeItem('user')
        localStorage.removeItem('main')
        this.isSign = false

        //保留语言缓存
        // localStorage.clear()
        sessionStorage.clear()
        if (testPlatform) {
          localStorage.setItem(storageDict.TEST_PLATFORM, testPlatform)
        }
        this.$reset()
        const accountStore = useAccountStore()
        accountStore && accountStore.$reset()
      } catch (error) { }
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      const res = await getUserInfo()
      if (res?.code == 200) {
        Object.assign(this.userInfo, res.data || {})
        Object.assign(this.asset, this.userInfo.asset || [])
        Object.assign(this.detail, this.userInfo.detail || {})
        dispatchCustomEvent('event_userInfoChange', this.userInfo)
        // dispatchCustomEvent('event_userInfoChange2', this.userInfo)
        localStorage.setItem(storageDict.USER_INFO, JSON.stringify(this.userInfo))
        closeToast()
        const mainStore = useMainStore()
        // mainStore.getUserRechageNew()//单独获取充值地址
        mainStore.getUserRechargeAddressAll() //所有充值地址


        // 装载自定义客服
        let userId = this.userInfo.user.userId || ''
        if (userId) {
          window.__ACChat?.setUser({ id: userId, name: `UID_${userId}` })
        }
        this.getCustomerServicelists()
        return this.userInfo
      } else {
        closeToast()
      }
    },
    // 获取代理客服链接
    async getCustomerServicelists() {
      const userStore = useUserStore()
      const res = await getCustomerService(userStore.userInfo.user?.adminParentIds)
      if (res?.code == 200) {
        this.service = res?.data[0]
      }
    },
    /**
     * 设置 isSimulate
     * @param {*} isSimulate
     */
    setSimulate(isSimulate) {
      this.isSimulate = isSimulate
    },
  },
  // 开启数据持久化
  persist: true

  // // 持久化存储插件其他配置
  // persist: {
  //   // 修改存储中使用的键名称，默认为当前 Store的 id
  //   key: '',
  //   // 修改为 sessionStorage，默认为 localStorage
  //   storage: sessionStorage,
  //   // 部分持久化状态的点符号路径数组，[]意味着没有状态被持久化(默认为undefined，持久化整个状态)
  //   paths: []
  // }
})
