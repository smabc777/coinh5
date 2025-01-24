<template>
  <div class="BBTrading" :class="{ 'Trade-pt': $route.name != 'Trade' }">
    <div class="BBTrading-top">
      <!--币种选择导航-->
      <TradeHeader></TradeHeader>

      <div class="BBTrading-content">
        <!--左侧图表-->
        <Chart :rows="6"></Chart>
        <!--交易-->
        <Trade></Trade>
      </div>
    </div>

    <div class="BBTrading-order">
      <!--订单列表-->
      <Order ref="OrderRef"></Order>
    </div>
  </div>
</template>

<script setup>
import TradeHeader from './components/Header/index.vue'
import Chart from './components/Chart/index.vue'
import Trade from './components/Trade/index.vue'
import Order from './components/Order/index.vue'
import { provide } from 'vue'
import { useUserStore } from '@/store/user'
import { useStockStore } from '@/store/stock'
import { useRoute } from 'vue-router'
import { getStocklistApi } from '@/api/stock'
import { getSettingConfigApi } from '@/api/common'
import router from '@/router'

const pageSize = ref(10)
const pageNum = ref(1)
const stockType = ref('')
const market = ref('')

const userStore = useUserStore()
const stockStore = useStockStore()
const $route = useRoute()
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
  stockType.value = tabsList[0].type
  await getStockList()
}

// 获取数据
const getStockList = async () => {

  let params = `stockType=${stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)
  if (res.data.rows.length > 0) {
    console.log(78787878, '0000000');

    stockStore.setStockInfo(res.data.rows[0])
    router.replace({
      query: {
        ...$route.query,
        symbol: res.data.rows[0].symbol
      }
    })
  }
}

watch(
  () => $route.query.symbol,
  () => {
    if ($route.query.item) {
      stockStore.setStockInfo(JSON.parse($route.query.item))
    }
    setStockInfo()
  }
)

onActivated(() => {
  if (isStockInfo.value) {
    setStockInfo()
  }
})

onMounted(() => {
  if ($route.query.item) {
    stockStore.setStockInfo(JSON.parse($route.query.item))
  }
  setStockInfo()

})
</script>

<style scoped lang="scss">
.BBTrading {
  padding: 10px 0px 150px;
  height: 100vh;
  overflow-x: auto;

  &.Trade-pt {
    padding-bottom: 96px;
  }

  .BBTrading-top {
    background: var(--ex-backup--background-color);
    border-radius: 10px;

    :deep(.BBTrading-content) {
      display: flex;
      padding: 20px 14px;
    }
  }

  .BBTrading-order {
    margin-top: 12px;
    background: var(--ex-backup--background-color);
    border-radius: 10px;
  }
}
</style>
