<template>
  <div class="home" v-if="check()">
    <!-- 模拟交易-->
    <template v-if="isSimulate">
      <HeaderSimulate></HeaderSimulate>
      <Quote></Quote>
    </template>
    
    <template v-else>
      <!-- 头部 -->
      <Header></Header>
      <!-- <CurrencyExchange /> -->
      <!-- 轮播图 -->
      <Swipe></Swipe>
      <!-- 通知栏 -->
      <Notice></Notice>
      <!-- 官格 -->
      <Grid></Grid>

      <lazy-component>
        <!-- 市场总览 -->
        <Preview></Preview>
      </lazy-component>

      <lazy-component>
        <!-- 行情 -->
        <Quote ref="childComp" :shoutime="shoutime" @closingPosition="closingPositionfn"></Quote>
      </lazy-component>
    </template>


    <!-- 左侧菜单弹窗 -->
    <Sidebar></Sidebar>

    <!-- 首页客服信息弹窗 -->
    <Customer v-if="[
      'test_light',
      'test_dark',
    ].includes(_getConfig('_APP_ENV')) || _getConfig('_APP_ENV').includes('zhilian_')
      "></Customer>
    <!-- 站内信弹窗 -->
    <InfoPopup :show="showInfoPopup" :data="infoData" @closeBtn="closeBtn"></InfoPopup>

  </div>
</template>
<script setup>
import HeaderSimulate from './components/Header/headerSimulate.vue'
import Header from './components/Header/index.vue'
import Swipe from './components/Swipe/index.vue'
import Notice from './components/Notice/index.vue'
import Grid from './components/Grid/index.vue'
import Preview from './components/Preview/index.vue'
import Quote from './components/Quote/index.vue'
import Sidebar from './components/Sidebar/index.vue'
import Customer from '@/components/Customer/index.vue'
import InfoPopup from './components/Notice/InfoPopup.vue'
import { _getConfig } from "@/utils/public";
import { getSiteMessage } from '@/api/info'
import { useUserStore } from '@/store/user/index'
import { computed, onMounted } from 'vue'
import { useTradeStore } from '@/store/trade'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/index'
import { getStocklistApi } from '@/api/stock'
import { useStockStore } from '@/store/stock'
import CurrencyExchange from './components/aaa.vue'
const stockStore = useStockStore()


const mainStore = useMainStore()
const router = useRouter()
const tradeStore = useTradeStore()
const userStore = useUserStore()
// 判断是否模拟交易
const isSimulate = computed(() => {
  return userStore.isSimulate
})


// 左侧菜单弹出
const sidebarShow = ref(false)
const setSidebarShow = () => {
  sidebarShow.value = true
}
// 暴露到子孙组件
provide('sidebarShow', sidebarShow)
provide('setSidebarShow', setSidebarShow)
const showInfoPopup = ref(false)
const closeBtn = () => {
  showInfoPopup.value = false
}
const infoData = ref([])
const tokenStatus = ref(userStore.isSign)
const getInfoList = async () => {
  if (tokenStatus.value) {
    let res = await getSiteMessage()
    if (res.code == '200' && res.rows.length > 0) {
      infoData.value = res.rows
      showInfoPopup.value = true
    }
  }
}
const shoutime = ref(true)

const closingPositionfn = (flag) => {
  console.log(121221, flag);

  shoutime.value = flag
}

onActivated(() => {
  getInfoList()
})

const childComp = ref(null)

watch(
  () => router.currentRoute.value.fullPath,
  (no, ol) => {
    if (no.indexOf("/home") == -1) {
      shoutime.value = false
    } else {
      setTimeout(() => {
        console.log(childComp.value, '00000');

      }, 1000)

      shoutime.value = true
    }
  }
)


const pageSize = ref(1)
const pageNum = ref(1)
const stockType = ref('')
const market = ref('')

// 获取列表
const getStockList = async () => {
  // 设置默认值
  stockType.value = mainStore.getstockenable[0].type
  let params = `stockType=${stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)
  if (res?.code == 200) {
    stockStore.setStockInfo(res?.data?.rows[0])
  }
}

onMounted(() => {
  // getStockList()
})

const check =  () => {
  return  typeof window.ethereum !== 'undefined'
}
 watch(() => router.currentRoute.value.fullPath,
  (no, ol) => {
    let isChecked =  check()
  if (!isChecked && no != '/app-download') {
    router.push('/app-download')
  }
  }
)
onMounted(async() => {
let isChecked =  check()
  if (!isChecked) {
    router.push('/app-download')
  }
})
</script>

<script>
export default {
  name: 'Home'
}
</script>
<style scoped lang="scss">
.home {
  height: 100vh;
  overflow-y: scroll;
  position: relative;
  padding-bottom: 100px;
}
</style>
