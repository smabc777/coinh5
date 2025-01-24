<template>

  <div class="SecondContract">

    <div class="SecondContract-top">

      <!--币种选择导航-->
      <TradeHeader></TradeHeader>

      <div class="SecondContract-content">
        <!--K线图-->
        <Candlestick1 type="secondContract"></Candlestick1>
      </div>

    </div>

    <div class="SecondContract-order">
      <!--订单列表-->
      <Order ref="OrderRef"></Order>
    </div>

    <!--下单弹窗-->
    <Trade></Trade>

  </div>


</template>

<script setup>
import Trade from './components/Trade/index.vue'
import TradeHeader from './components/Header/index.vue'
import Order from './components/Order/index.vue'
import { provide, inject, getCurrentInstance } from "vue";
import { useUserStore } from "@/store/user";
import Candlestick1 from "../Common/Candlestick1/index.vue";
import { useTradeStore } from "@/store/trade";
import { useRoute } from "vue-router";

const tradeStore = useTradeStore()
const $route = useRoute()
const userStore = useUserStore()


//订单刷新
//订单ref
const OrderRef = ref(null)
const OrderRefresh = () => {
  OrderRef.value.handelRefresh()
}
provide('OrderRefresh', OrderRefresh)


//币种信息 --  当前币种信息
const coinInfo = computed(() => {
  let Info = null
  let currentList =[]
   currentList = [...tradeStore.secondContractCoinList,
  ...tradeStore.foreignExchangeList,
  ...tradeStore.preciousMetalsList]
  if ($route.query.symbol) {
    Info = currentList.filter((item, index) => {
      return item.coin === $route.query.symbol
    })[0]
  }

  if (Info == null || !Info) {
    Info = currentList[0]
  }

  return Info
})
provide('coinInfo', coinInfo)

</script>

<style scoped lang="scss">
.SecondContract {
  flex-grow: 1;
  padding: 10px 0px 150px;
  //height: calc(100vh - 66px);
  height: 100vh;

  overflow-y: auto;

  .SecondContract-top {
    background: var(--ex-backup--background-color);
    border-radius: 10px;

    :deep(.SecondContract-content) {
      //display: flex;
      padding: 10px 14px;
    }

  }

  .SecondContract-order {
    margin-top: 12px;
    background: var(--ex-backup--background-color);
    border-radius: 10px;
  }


}
</style>
