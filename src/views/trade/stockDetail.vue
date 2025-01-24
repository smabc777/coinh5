<!-- 交易-实时成交 -->
<template>
  <div class="tradeDetail">
    <!-- <van-sticky>
      <header>
        <van-icon @click="_back()" name="arrow-left" size="20" color="var(--ex-default-font-color)" />
        <div class="right">
          <div class="central">
            <svg-load name="cebian17x14" class="firLeftImg" @click="QuoteSidebarRef.setQuoteSidebarData()"></svg-load>
            <div class="fw-bold">{{ stockInfo.symbol }}</div>
          </div>
        </div>
      </header>
    </van-sticky> -->
    <div class="top">
      <div class="second">
        <div class="secondLeft">
          <div :class="[_isStockRFD(stockInfo.maRate), , ' fw-num']">
            {{ _toFixed(stockInfo.amount || 0, 2) }}

          </div>
          <div :class="[
            _isStockRFD(stockInfo.maRate),
            ' rfd-sign secondLeftB fw-num'
          ]">
            {{_toFixed(stockInfo?.maRate,2)  }}%
          </div>
        </div>
        <div class="secondRight">
          <div class="secondItem">
            <!-- 高 -->
            <div class="itemL">{{ _t18(`k_hight`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(klineTicker.highPrice || 0) }}</div>
          </div>
          <div class="secondItem">
            <!-- 低 -->
            <div class="itemL">{{ _t18(`k_low`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(klineTicker.lowPrice || 0) }}</div>
          </div>
          <div class="secondItem">
            <!-- 量 -->
            <div class="itemL">{{ _t18(`k_quantity`) }}</div>
            <div class="itemR fw-num">{{ countFormat(klineTicker.volume || 0) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- K线 -->
    <div class="content">
      <Candlestick :flag="flag" type="detail"></Candlestick>
    </div>
    <div class="line"></div>
    <!-- 成交/深度图 -->

    <!-- 成交列表 -->
    <!-- <OrderList v-if="stockInfo.coin" :rows="20"></OrderList> -->
  </div>

  <!-- 左侧行情菜单 -->
  <!-- <QuoteSidebar ref="QuoteSidebarRef" :type="$route.query.type"></QuoteSidebar> -->
</template>

<script setup>
import Candlestick from './components/ApanStocks/components/Candlestick/index.vue'
import OrderList from './components/TradeDetail/OrderStockList.vue'
import QuoteSidebar from '@/views/trade/components/ApanStocks/components/QuoteSidebar/index.vue'
import { computed } from 'vue'
import { _back, _isRFD, _isStockRFD } from "@/utils/public";
import { countFormat, priceFormat, _toFixed } from '@/utils/decimal'

import { useMainStore } from '@/store/index'
import { useStockStore } from '@/store/stock'

import { useRoute } from 'vue-router'

const $route = useRoute()
const mainStore = useMainStore()
const stockStore = useStockStore()

//行情侧边栏
const QuoteSidebarRef = ref(null)

// 成交/深度图
const currentEntruset = ref(false) // 成交/深度图状态

// 成交/深度图切换
const switchingEntrust = () => {
  currentEntruset.value = !currentEntruset.value
}
const flag = ref(null)
// 当前股票详情
const stockInfo = computed(() => {
  flag.value = true
  return stockStore.stockInfo
})
// provide('stockInfo', stockInfo)

const klineTicker = computed(() => {
  return stockStore.klineTicker
})
provide('klineTicker', klineTicker)


//币种详情
// const coinPriceInfo = computed(() => {
//   return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
// })
// provide('coinPriceInfo', coinPriceInfo)


onMounted(() => {
  mainStore.setTradeFlag(mainStore.tradeFlag + mainStore.isOption)
})
onUnmounted(() => {
  // tradeStore.setCurrentCoinList(coinInfo.value.coin, 'remove')
})
</script>

<style lang="scss" scoped>
.tradeDetail {


  header {
    width: 100%;
    display: flex;
    height: 60px;
    padding: 0 15px;
    align-items: center;
    background-color: var(--ex-default-background-color);
    z-index: 99;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex-border-color);
    position: relative;

    .leftImg {
      width: 16px;
      height: 12px;
    }

    .right {
      .senLeftImg {
        width: 24px;
        height: 24px;
        margin-left: 10px;
        display: none;
      }

      .central {
        font-size: 16px;
        color: var(--ex-default-font-color);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;

        .firLeftImg {
          width: 17px;
          height: 14px;
          margin-right: 10px;
        }
      }
    }
  }

  .top {

    .second {
      display: flex;
      justify-content: space-between;
      padding: 10px 15px;

      .secondLeft {
        font-size: 26px;
        font-weight: bold;
        color: var(--ex-font-color10);

        >* {
          transition: 0.3s;
        }

        .secondLeftB {
          font-size: 14px;
          margin-top: 5px;
        }
      }

      .secondRight {
        .secondItem {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-bottom: 10px;

          .itemL {
            color: var(--ex-passive-font-color);
            margin-right: 10px;
          }

          .itemR {
            color: var(--ex-default-font-color);
          }
        }
      }
    }
  }

  .line {
    height: 5px;
    background: var(--ex-div-bgColor10);
  }

  .content {
    padding: 0px 14px;
  }

  .entrust {
    height: 50px;
    display: flex;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex-border-color);

    .entrustL {
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;

      .entrustItem {
        margin-right: 30px;
      }

      .hightItem {
        font-weight: bold;
        // color: var(--ex-font-color9);
      }
    }
  }
}
</style>
