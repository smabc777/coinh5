<template>

  <div class="Ustandard" :class="{'Trade-pt':$route.name != 'Trade'}">

    <div class="Ustandard-top">

      <!--币种选择导航-->
      <TradeHeader></TradeHeader>

      <div class="Ustandard-content">
        <!--左侧图表-->
        <Chart :rows="8"></Chart>
        <!--交易-->
        <Trade></Trade>
      </div>

    </div>

    <div class="Ustandard-order">
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
import {useRoute,useRouter} from "vue-router";
import {_getConfig} from "@/utils/public";

const userStore = useUserStore()
const tradeStore = useTradeStore()
const $route = useRoute()
const $router = useRouter()
//u本位可用余额
const availableBalance = computed(() => {
  var cur = userStore.asset.filter((item) => {
    //jphskt平台只使用平台资产
    if (['jphskt','smartfund'].includes(_getConfig('_APP_ENV'))) {
      return (item.type === 1 && item.symbol == 'usdt')
    } else {
      return item.type === 3
    }
  })

  return cur[0]?.availableAmount || ''
})

provide('availableBalance', availableBalance)

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
    Info = tradeStore.contractCoinList.filter((item, index) => {
      return item.coin === $route.query.symbol
    })[0]
  }

  if (Info == null || !Info) {
    Info = tradeStore.contractCoinList[0]
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
.Ustandard {
  padding: 0px 0px 150px;
  height: 100vh;
  overflow-x: auto;

  &.Trade-pt {
    padding-bottom: 96px;
  }

  .Ustandard-top {
    background: var(--ex-backup--background-color);
    border-radius: 10px;

    :deep(.Ustandard-content) {
      display: flex;
      padding: 20px 14px;
    }

  }

  .Ustandard-order {
    margin-top: 12px;
    background: var(--ex-backup--background-color);
    border-radius: 10px;
  }
}

</style>
