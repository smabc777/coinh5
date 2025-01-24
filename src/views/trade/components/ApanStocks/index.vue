<template>
  <div class="BBTradingst" :class="{ 'Trade-pt': $route.name == 'Trade' }">
    <div class="BBTrading-top">
      <!--币种选择导航-->
      <TradeHeader></TradeHeader>

      <div class="BBTrading-content">
        <!--左侧图表-->
        <!-- <Chart :rows="6"></Chart> -->
        <!--交易-->
        <!-- <Trade></Trade> -->
        <Candlestick></Candlestick>
      </div>
    </div>

    <div class="BBTrading-order">
      <!--订单列表-->
      <Order ref="OrderRef"></Order>
    </div>
    <!--交易-->
    <div class="trade">
      <Trade></Trade>

    </div>

  </div>
</template>

<script setup>
import Candlestick from "../../stockDetail.vue"
import TradeHeader from './components/Header/index.vue'
import Chart from './components/Chart/index.vue'
import Trade from './components/Trade/index.vue'
import Order from './components/Order/index.vue'
import { provide } from 'vue'
import { useRoute } from 'vue-router'
import { getStocklistApi ,getRateApi} from '@/api/stock'
import { getSettingConfigApi } from '@/api/common'
import router from '@/router'


import { useStockStore } from '@/store/stock'

const stockStore = useStockStore()
const $route = useRoute()
const pageSize = ref(10)
const pageNum = ref(1)
const stockType = ref('')
const market = ref('')
// console.log($route)
//订单刷新
//订单ref
const OrderRef = ref(null)
const OrderRefresh = () => {
  OrderRef.value.handelRefresh()
}
provide('OrderRefresh', OrderRefresh)

var isStockInfo = ref(false)
// 当前股票信息
const stockInfo = ref({})
provide('stockInfo', stockInfo)

// 获取股票信息
const setStockInfo = async () => {
  isStockInfo.value = true
  // stockStore.setStockInfo({})
  console.log(12121111);

  // return
  // 判断stockStore.stockInfo是否为空对象
  if (Object.keys(stockStore.stockInfo).length !== 0) {
    stockInfo.value = stockStore.stockInfo
  } else {
    // stockList接口中获取第一条数据
    getTabs()
  }
}

// 获取二级分类
const getTabs = async () => {
  const res = await getSettingConfigApi()

  const tabsList = res?.data.STOCK_ENABLE
  stockType.value = tabsList[0]?.type
  await getStockList()
}

// 获取数据
const getStockList = async () => {

  let params = `${stockStore.stockInfo.symbol ? 'symbol=' + stockStore.stockInfo.symbol + '&' : ''}stockType=${stockStore.stockInfo.stockType || stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)


  if (res?.data.rows.length > 0) {

    stockStore.setStockInfo(res.data?.rows[0])

    router.replace({
      query: {
        ...$route.query,
        symbol: res.data.rows[0]?.symbol
      }
    })
  }

}
const time = ref(null)
const getstockinfo = async () => {
  let str = router.currentRoute.value.fullPath

  if (str.indexOf("/trade?tradeKey=ApanStocks") == -1) return
  let params = `symbol=${stockStore.stockInfo.symbol}&stockType=${stockStore.stockInfo.stockType || stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)


  if (res?.code == 200) {
    stockStore.setStockInfo(res.data?.rows[0])

    // 动态计算下一次执行的延迟
    const delay = 8000 // 延迟时间

    // 在函数内部调用setTimeout来实现递归调用
    setTimeout(getstockinfo, delay)
  }
}
// 获取汇率
const getRateInfo = async() => {
  const {data} = await getRateApi(stockStore.stockInfo.coin)
  stockStore.setStockRate(data)
}


watch(
  () => router.currentRoute.value.fullPath,
  (no, ol) => {
    if (no.indexOf("/trade?tradeKey=ApanStocks") != -1 && stockStore.stockInfo.symbol) {
      OrderRefresh()
    }
  }
)

watch(
  () => $route.query.symbol,
  () => {
    setStockInfo()
  }
)

onActivated(() => {
  if (isStockInfo.value) {
    setStockInfo()
  }
})

onMounted(async() => {
  console.log(stockStore.stockInfo.symbol,',,,,,,,,,,');
  
  if(!stockStore.stockInfo.coin){
    await setStockInfo()

  }

  await getRateInfo()

  if (stockStore.stockInfo.symbol) {
    getstockinfo()

  }


})
</script>

<style scoped lang="scss">
.BBTradingst {
  padding: 10px 0px 150px;
  height: 100vh;
  overflow-x: auto;
  position: relative;

  &.Trade-pt {
    padding-bottom: 96px;
  }

  .BBTrading-top {
    background: var(--ex-backup--background-color);
    border-radius: 10px;

    :deep(.BBTrading-content) {
      padding: 10px 0px;

    }
  }

  .BBTrading-order {
    margin-top: 12px;
    background: var(--ex-backup--background-color);
    border-radius: 10px;
  }
}

.trade {
  position: fixed;
  bottom: 0;
  z-index: 1000;

}
</style>
