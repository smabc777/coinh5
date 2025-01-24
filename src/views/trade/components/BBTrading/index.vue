<template>

  <div class="BBTrading" :class="{'Trade-pt':$route.name != 'Trade'}">

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
import {provide} from "vue";
import {useUserStore} from "@/store/user";
import {useTradeStore} from "@/store/trade";
import {useRoute} from "vue-router";

const userStore = useUserStore()
const tradeStore = useTradeStore()
const $route = useRoute()
console.log($route)
//订单刷新
//订单ref
const OrderRef = ref(null)
const OrderRefresh = () => {
  OrderRef.value.handelRefresh()
}
provide('OrderRefresh', OrderRefresh)



var isCoinInfo = ref(false)
//币种信息 --  当前币种信息
const coinInfo = ref({})
provide('coinInfo', coinInfo)

const setCoinInfo = () => {
  isCoinInfo.value = true
  let Info = null
  if ($route.query.symbol) {
    Info = tradeStore.spotCoinList.filter((item, index) => {
      return item.coin === $route.query.symbol
    })[0]
  }

  if (Info == null || !Info) {
    Info = tradeStore.spotCoinList[0]
  }

  coinInfo.value = Info
}

watch(() => $route.query.symbol, () => {
  setCoinInfo()
})


onActivated(() => {
  if (isCoinInfo.value) {
    setCoinInfo()
  }
})

onMounted(() => {
  setCoinInfo()
})

</script>

<style scoped lang="scss">
.BBTrading {
  padding: 10px 0px 150px;
  height: 100vh;
  overflow-x: auto;

  &.Trade-pt{
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
