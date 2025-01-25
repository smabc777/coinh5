<template>
  <div>
    <div class="top">
      <div class="first">
        <!-- 打开弹窗 -->
        <div class="firLeft" @click="QuoteSidebarRef.setQuoteSidebarData(1,true)">
          <svg-load name="cebian17x14" class="firLeftImg"></svg-load>
          <div class="fw-bold">{{ coinInfo.showSymbol }}</div>
        </div>
        <!-- U本位规则-->
        <div class="first">
          <svg-load name="shuaxin" class="senLeftImg" @click="kLineRefresh"></svg-load>
          <svg-load v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))" name="guize" class="senLeftImg"
            @click="_toView('/tradingRules?type=1')"></svg-load>
        </div>
      </div>


    </div>
    <div class="second">
      <!-- 当前币种价格 -->
      <div class="secondLeft">
        <div :class="[_isRFD(coinPriceInfo.open, coinPriceInfo.close, 'buy', 'rise'), ' fw-num']">
          {{ coinPriceInfo.close || '0.00' }}
        </div>
        <div :class="[
          _isRFD(coinPriceInfo.openPrice, coinPriceInfo.close, 'buy', 'rise'),
          ' rfd-sign secondLeftB fw-num'
        ]">
          {{ coinPriceInfo?.priceChangePercent }}%
        </div>
      </div>
      <div class="secondRight">
        <!-- 高 -->
        <div class="secondItem">
          <div class="itemL">{{ _t18(`k_hight`, ['ebc']) }}</div>
          <div class="itemR fw-num" v-if="coinPriceInfo?.high24">
            {{ priceFormat(coinPriceInfo.high24) }}
          </div>
          <div class="itemR fw-num" v-else>
            {{ priceFormat(tradeStore.klineTicker?.highPrice || 0) }}
          </div>
        </div>
        <!-- 低 -->
        <div class="secondItem">
          <div class="itemL">{{ _t18(`k_low`, ['ebc']) }}</div>
          <div class="itemR fw-num" v-if="coinPriceInfo?.low24">
            {{ priceFormat(coinPriceInfo.low24) }}
          </div>
          <div class="itemR fw-num" v-else>
            {{ priceFormat(tradeStore.klineTicker?.lowPrice || 0) }}
          </div>
        </div>
        <!-- 量 -->
        <div class="secondItem">
          <div class="itemL">{{ _t18(`k_quantity`) }}</div>
          <div class="itemR fw-num" v-if="coinPriceInfo?.volume24">
            {{ countFormat(coinPriceInfo?.volume24) }}
          </div>
          <div class="itemR fw-num" v-else>
            {{ countFormat(tradeStore.klineTicker?.volume || 0) }}
          </div>
        </div>
      </div>
    </div>

    <!--侧边栏 当前行情-->
    <QuoteSidebar ref="QuoteSidebarRef"></QuoteSidebar>
  </div>
</template>
<script setup>

import QuoteSidebar from '@/views/trade/components/Common/QuoteSidebar/index.vue'
import { useMainStore } from '@/store/index.js'
import { _t18, _toView } from "@/utils/public";
import { countFormat, priceFormat } from "@/utils/decimal";
import { useTradeStore } from "@/store/trade";
import { useRouter, useRoute } from 'vue-router'
import { dispatchCustomEvent } from "@/utils";
const mainStore = useMainStore()
const tradeStore = useTradeStore()
const router = useRouter()
const route = useRoute()

//当前币种数据
const coinInfo = inject('coinInfo')

//黄金白银取值
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
})
const kLineRefresh = () => {
  let type = ''
  if (coinInfo.value.type == 2) {
    type = 'spot'
  } else if (coinInfo.value.type == 3) {
    type = 'contract'
  }
  console.log(coinInfo.value.type)
  //设置币种参数和旧参数
  router.replace({
    value: { ...coinInfo.value, symbol: coinInfo.coin }
  })

  dispatchCustomEvent('event_secondContract', {
    type: type,
    symbol: coinInfo.value.symbol,
    coin: coinInfo.value.coin,
    coinInfo: coinInfo.value
  })

}

//行情侧边栏
const QuoteSidebarRef = ref(null)

</script>
<style lang="scss" scoped>
.top {
  padding: 8px 14px;
  z-index: 9;
  background: var(--ex--backup-background-color-2);
  border-radius: 8px;

  .first {
    display: flex;
    justify-content: space-between;

    .firLeft {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: var(--ex-default-font-color);

      div {
        line-height: normal;
        display: flex;
        align-items: center;
      }

      .firLeftImg {
        width: 17px;
        height: 14px;
        margin-right: 10px;
      }

      .firNum {
        font-size: 14px;
        margin-left: 10px;
      }
    }

    .senLeftImg {
      margin-left: 10px;
      display: block;
      width: 24px;
      height: 24px;
    }
  }



  .third {
    margin-top: 20px;

    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .thirdLeft {
        display: flex;
        font-size: 14px;
        color: var(--ex-default-font-color);

        .item {
          margin-right: 30px;
        }
      }

      .thirdRight {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--ex-font-color9);

        .thirdRightImg {
          width: 10px;
          height: 6px;
          margin-left: 5px;
        }
      }
    }
  }
}

.second {
  display: flex;
  justify-content: space-between;
  //align-items: center;
  padding: 0 14px;
  margin-top: 20px;

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
      padding: 6px 0;
      font-size: 14px;
      justify-content: space-between;

      & {
        padding-top: 0;
      }

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
</style>
