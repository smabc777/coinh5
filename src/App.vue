<template>
  <div>
    <!--    <Graph></Graph>-->
    <!--    <GraphMin></GraphMin>-->
    <router-view v-slot="{ Component, route }">
      <!--页面缓存需要组件name-->
      <keep-alive :include="[...tabbarPathNameList]">
        <component :is="Component" :key="route.path"></component>
      </keep-alive>
    </router-view>
  </div>

  <!-- 底部导航-->
  <Tabbar v-if="tabbarPathNameList.includes(currentRoute.name)"></Tabbar>

  <!-- 幸运活动 -->
  <ActivityPopup ref="ActivityPopupRef"></ActivityPopup>

  <!-- 客服弹窗 -->
  <ServicePopup ref="ServicePopupRef"></ServicePopup>

  <!-- 冻结弹窗 -->
  <FreezePopup ref="FreezePopupRef"></FreezePopup>
</template>

<script setup>
import {
  DIFF_ISFREEZE,
  DIFF_ISFREEZE_SECONDANDBB
} from '@/config/index'
import { useMainStore } from '@/store/index'
import { socketDict } from '@/config/dict'
import { _getConfig, _toView } from '@/utils/public'
import ServicePopup from '@/components/CustomerService/ServicePopup.vue'
import FreezePopup from '@/components/FreezePopup/index.vue'
import ActivityPopup from '@/components/ActivityPopup/index.vue'
import Graph from '@/components/Echarts/Graph.vue'
import GraphMin from '@/components/Echarts/GraphMin.vue'
import { useToast } from './hook/useToast'
import { useRouter, useRoute } from 'vue-router'
import { useFreeze } from './hook/useFreeze'
import { initWebSocket } from '@/plugin/socket'
import { showDialog } from 'vant'
import PubSub from 'pubsub-js'
import { useUserStore } from '@/store/user/index.js'

const userStore = useUserStore()

const router = useRouter()
const route = useRoute()
const { _toast } = useToast()
const { _isFreeze } = useFreeze()
const mainStroe = useMainStore()
//当前语言
const language = computed(() => mainStroe.language)
/**
 * 申购订阅Key
 */
const ownCoinKey = ref('')

/**
 * 客服弹窗
 */
const ServicePopupRef = ref(null)

/**
 * 冻结弹窗
 * user.status 1 冻结 0正常
 */
let FreezePopupRef = ref(null)
const event_freezePopup = async () => {
  //打开冻结弹窗
  FreezePopupRef.value.setSreezePopupShow()
}

/**
 * defi 空投弹窗
 */
const ActivityPopupRef = ref(null)
const getShowDefiActivityNotice = async () => {
  //显示空投弹窗
  ActivityPopupRef.value.setDefiActivityNotice()
}

/**
 * 申购通知
 */
const ownCoinKeyNotification = () => {
  ownCoinKey.value = PubSub.subscribe(socketDict.OWNCOIN, (key, data) => {
    showDialog({
      title: data.amountLimit, // 额度
      message: data.msg
    }).then(() => {
      // 点击确认进入认购页
    })
  })
}
ownCoinKeyNotification()

/**
 * 用户状态改变Key
 */
const userStatusKey = ref('')
/**
 * 用户状态改变通知
 */
const userStatusNotification = () => {
  userStatusKey.value = PubSub.subscribe(socketDict.USER_STATUS, (key, data) => {
    userStore.token && userStore.getUserInfo()
  })
}
userStatusNotification()

// 底部导航
const currentRoute = computed(() => useRoute())
const tabbarPathNameList = computed(() =>
  mainStroe.getTabbarList
    .filter((elt) => {
      return elt.isOpen === true
    })
    .map((elem) => {
      return elem.key.charAt(0).toUpperCase() + elem.key.slice(1)
    })
)

/**
 * 多语言 监听回调事件
 */
const event_toastChange = (e) => {
  let name = e.detail.name
  let platform = e.detail.platform || []
  name && _toast(name, platform)
}

/**
 * 用户信息改变监听回调事件
 */
const event_userInfoChange = async (e) => {
  // defi 活动通知
  getShowDefiActivityNotice()

  // 检测是否冻结
  let freezeList = mainStroe.getModuleFreezeSettingList.filter((item) => {
    return item.open == true
  })

  // user.status 1 冻结 0正常
  if (Array.isArray(freezeList) && freezeList.length) {
    if (['trustdefi'].includes(_getConfig('_APP_ENV'))) {
      // let isFreezeList  = _isFreeze(freezeList,route.meta.key)
      let isFreezeList = freezeList.map(item => item.key).includes(route.meta.key)
      if (e.detail.user.status == 1 && isFreezeList) {
        event_freezePopup()
      }
    } else {
      if (e.detail.user.status == 1) {
        event_freezePopup()
      }
    }
  } else if (
    !DIFF_ISFREEZE.includes(__config._APP_ENV) &&
    !DIFF_ISFREEZE_SECONDANDBB.includes(__config._APP_ENV)
  ) {
    e.detail.user.status == 1 && event_freezePopup()
  }

  // 消息通知订阅
  initWebSocket(e.detail?.user.userId)
}

/**
 * 客服点击监听
 * 1.https://direct.lc.chat/15406071/
 * 2.https://chat.livechats.chat/?channelId=dAj5I2&language=en
 * 3.https://secure.livechatinc.com/licence/15406071/v2/open_chat.cgi
 */
const event_serviceChange = () => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    location.href = userStore.service.url + `&language=${language.value}&metadata={"name":"${userStore.userInfo?.user?.userId}"}`
    return
  }


  //没有客服返回false
  if (!mainStroe.getCustomerServiceList.length) return false
  if (mainStroe.getCustomerServiceList.length == 1) {
    //客服为1直接跳转
    if (mainStroe.getCustomerServiceList[0]?.callback) {
      mainStroe.getCustomerServiceList[0].callback()
    } else {
      //客服跳转
      let href = mainStroe.getCustomerServiceList[0]?.url
      if (mainStroe.getCustomerServiceList[0]?.getUrl) {
        href = mainStroe.getCustomerServiceList[0].getUrl()
        // router.push(`/service?url=${encodeURIComponent(href)}`)
      }
      location.href = href
    }
  } else {
    //显示客服弹窗
    ServicePopupRef.value.SetServicePopup()
  }
}

onMounted(async () => {

  userStore.token && userStore.getUserInfo()



  document.addEventListener('event_toastChange', event_toastChange)
  document.addEventListener('event_serviceChange', event_serviceChange)
  document.addEventListener('event_userInfoChange', event_userInfoChange)
  document.addEventListener('event_freezePopup', event_freezePopup)

})
onUnmounted(() => {
  document.removeEventListener('event_toastChange', event_toastChange)
  document.removeEventListener('event_serviceChange', event_serviceChange)
  document.removeEventListener('event_userInfoChange', event_userInfoChange)
  document.removeEventListener('event_freezePopup', event_freezePopup)

  ownCoinKey && PubSub.unsubscribe(ownCoinKey)
  userStatusKey && PubSub.unsubscribe(userStatusKey)
})

//页面切换动画
//进入
// const enter = (el, done) => {
//   console.log('进入', el)
//   gsap.from(el, {
//     opacity: 0,// 透明度
//     duration: .3, // 持续时间
//     x: 300,
//     onComplete: done,
//   })
// }
// //离开
// const leave = (el, done) => {
//   console.log('离开', el)
//   // 到哪里去
//   gsap.to(el, {
//     opacity: 0,
//     duration: .3,
//     x: -300,
//     onComplete: done,
//   })
// }
</script>

<style lang="scss">
/** 股票绿涨 */
.stock_rise {
  color: var(--ex-rfd-rise) !important;

  &.rfd-sign::before {
    content: '+';
    padding-right: 2px;
    display: inline-block;
  }

  &.rfd-bg {
    background-color: var(--ex-rfd-rise-bg) !important;
    /* color: var(--ex-white) !important; */
  }
}

/** 股票红跌 */
.stock_fall {
  color: var(--ex-rfd-fall) !important;

  &.rfd-sign::before {
    content: '';
    padding-right: 2px;
    display: inline-block;
  }

  &.rfd-bg {
    background-color: var(--ex-rfd-fall-bg) !important;
    /* color: var(--ex-white) !important; */
  }
}

/** 股票平 */
.stock_draw {
  color: var(--ex-rfd-draw) !important;

  &.rfd-bg {
    background-color: var(--ex-rfd-draw-bg) !important;
  }
}

/* 绿涨 */
.rise {
  color: var(--ex-rfd-rise) !important;

  &.rfd-sign::before {
    content: '+';
    padding-right: 2px;
    display: inline-block;
  }

  &.rfd-bg {
    background-color: var(--ex-rfd-rise-bg) !important;
    /* color: var(--ex-white) !important; */
  }
}

/* 红跌 */
.fall {
  color: var(--ex-rfd-fall) !important;

  &.rfd-sign::before {
    content: '-';
    padding-right: 2px;
    display: inline-block;
  }

  &.rfd-bg {
    background-color: var(--ex-rfd-fall-bg) !important;
    /* color: var(--ex-white) !important; */
  }
}

.draw {
  color: var(--ex-rfd-draw) !important;

  &.rfd-bg {
    background-color: var(--ex-rfd-draw-bg) !important;
  }
}
</style>
