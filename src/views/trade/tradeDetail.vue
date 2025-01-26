<!-- 交易-实时成交 -->
<template>
  <div class="tradeDetail">
    <van-sticky>
      <header>
        <van-icon @click="_back()" name="arrow-left" size="20" color="var(--ex-default-font-color)" />
        <div class="right">
          <div class="central">
            <svg-load name="cebian17x14" class="firLeftImg" @click="showSidebar"></svg-load>
            <div class="fw-bold">{{ $route.query.type == 4 ? coinInfo.symbol : coinInfo.showSymbol }}</div>
          </div>
        </div>
      </header>
    </van-sticky>
    <div class="top">
      <div class="second">
        <div class="secondLeft">
          <div :class="[_isRFD(coinPriceInfo.open, coinPriceInfo.close, 'buy', 'rise'), ' fw-num']">
            {{ coinPriceInfo.close }}
          </div>
          <div :class="[
          _isRFD(coinPriceInfo.openPrice, coinPriceInfo.close, 'buy', 'rise'),
          ' rfd-sign secondLeftB fw-num'
        ]">
            {{ coinPriceInfo?.priceChangePercent }}%
          </div>
        </div>
        <div class="secondRight">
          <div class="secondItem">
            <!-- 高 -->
            <div class="itemL">{{ _t18(`k_hight`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(coinPriceInfo.high24) }}</div>
          </div>
          <div class="secondItem">
            <!-- 低 -->
            <div class="itemL">{{ _t18(`k_low`, ['ebc']) }}</div>
            <div class="itemR fw-num">{{ priceFormat(coinPriceInfo.low24) }}</div>
          </div>
          <div class="secondItem">
            <!-- 量 -->
            <div class="itemL">{{ _t18(`k_quantity`) }}</div>
            <div class="itemR fw-num">{{ countFormat(coinPriceInfo.volume24) }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- K线 -->
    <div class="content">
      <Candlestick v-if="coinInfo.coin" type="detail"></Candlestick>
    </div>
    <!-- <div class="line"></div> -->
    <!-- 成交/深度图 -->
    <div class="entrust">
      <div class="entrustL">
        <!-- 实时成交 -->
        <div class="entrustItem hightItem">{{ _t18(`real_time_transaction`) }}</div>
        <!-- <div
        :class="currentEntruset ? 'entrustItem hightItem' : 'entrustItem'"
        @click="switchingEntrust"
      >
        深度图
      </div> -->
      </div>
    </div>
    <!-- 成交列表 -->
    <OrderList v-if="coinInfo.coin" :rows="20"></OrderList>
  </div>

  <!-- 左侧行情菜单 -->
  <QuoteSidebar ref="QuoteSidebarRef" :type="$route.query.type"></QuoteSidebar>
</template>

<script setup>
import Candlestick from './components/Common/Candlestick/index.vue'
import OrderList from './components/TradeDetail/OrderList.vue'
import QuoteSidebar from './components/Common/QuoteSidebar/index.vue'
import { countFormat, priceFormat } from '@/utils/decimal'
import { computed } from 'vue'
import { _back, _isRFD } from "@/utils/public";

import { useMainStore } from '@/store/index'
import { useTradeStore } from '@/store/trade'
import { useRoute } from 'vue-router'

const $route = useRoute()
const mainStore = useMainStore()
const tradeStore = useTradeStore()

//行情侧边栏
const QuoteSidebarRef = ref(null)
const showSidebar = () => {
  //$route.query.type  1 秒合约 2 币币  3 u本位 4 日本股票
  QuoteSidebarRef.value.setQuoteSidebarData($route.query.type)
}

// 成交/深度图
const currentEntruset = ref(false) // 成交/深度图状态

// 成交/深度图切换
const switchingEntrust = () => {
  currentEntruset.value = !currentEntruset.value
}

//当前币种详情
//$route.query.type  1 秒合约 2 币币  3 u本位
const coinInfo = computed(() => {
  let temp = {}
  // u本位
  if (Number($route.query.type) == 3) {
    if ($route.query.symbol) {
      temp =
        tradeStore.contractCoinList.filter((obj) => {
          return obj.coin === $route.query.symbol
        })[0] || tradeStore.contractCoinList[0]
    } else {
      temp = tradeStore.contractCoinList[0]
    }
  } else if (Number($route.query.type) == 2) {
    // 2 币币
    if ($route.query.symbol) {
      temp =
        tradeStore.spotCoinList.filter((obj) => {
          return obj.coin === $route.query.symbol
        })[0] || tradeStore.spotCoinList[0]
    } else {
      temp = tradeStore.spotCoinList[0]
    }
  } else if (Number($route.query.type) == 9) {
    // 日本股票
    if ($route.query.symbol) {
      temp =
        tradeStore.stockList.filter((obj) => {
          return obj.coin === $route.query.symbol
        })[0] || tradeStore.stockList[0]
    } else {
      temp = tradeStore.stockList[0]
    }
  }

  return temp
})

provide('coinInfo', coinInfo)


//币种详情
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
})
provide('coinPriceInfo', coinPriceInfo)


onMounted(() => {
  mainStore.setTradeFlag(mainStore.tradeFlag + mainStore.isOption)
})
onUnmounted(() => {
  // tradeStore.setCurrentCoinList(coinInfo.value.coin, 'remove')
})
</script>

<style lang="scss" scoped>
.tradeDetail {
  height: 100vh;
  overflow: scroll;
  background:var(--ex-backup--background-color);

  header {
    width: 100%;
    display: flex;
    height: 60px;
    padding: 0 15px;
    align-items: center;
    background-color: var(--ex-default-background-color);
    z-index: 99;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex--backup-background-color-2);
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
    // background-color: var(--ex-default-background-color);
    
    .second {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 15px;

      .secondLeft {
        font-size: 36px;
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
          padding: 6px 0;
          font-size: 14px;

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
    padding: 10px 14px;
  }

  .entrust {
    height: 50px;
    display: flex;
    padding: 0 15px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex--backup-background-color-2);

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
