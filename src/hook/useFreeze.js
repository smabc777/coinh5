import { useUserStore } from '@/store/user/index'
import { dispatchCustomEvent } from '@/utils'
import { useMainStore } from '@/store/index'

export const useFreeze = () => {
  const userStore = useUserStore()
  const mainStore = useMainStore()

  let freezeList = mainStore.getModuleFreezeSettingList.filter((item) => {
    return item.open == true
  })
  const _isFreeze = (platform = [], freezeKey = '') => {
    if (userStore.userInfo.user.status) {
      if (Array.isArray(freezeList) && freezeList.length && freezeKey) {
        if (freezeList.map(item => item.key).includes(freezeKey)) {
          dispatchCustomEvent('event_freezePopup')
        } else {
          return true
        }
      } else {
        if (platform.includes(__config._APP_ENV)) {
          dispatchCustomEvent('event_freezePopup')
        } else {
          return false
        }
      }

    } else {
      return true
    }
    return false
  }
  return {
    _isFreeze
  }
}

