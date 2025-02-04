<template>
  <!--  市场总览  -->
  <div class="Preview">
    <div class="Preview-title">
      <span>{{ _t18('market_overview') }}</span>
      <span @click="linkTo">{{ _t18('exchange_more') }}></span>
    </div>
    <van-tabs v-model:active="active" swipeable :swipe-threshold="2" :line-width="0">
      <van-tab v-for="(item, index) in dataList" :key="index">
        <template #title>
          <div class="van-tab-item">
            <div class="item-atv" :class="{ active: active == index }"></div>
            <div class="item-text ff-num">{{ item.showSymbol }}</div>
            <div class="item-price"> {{ tradeStore.allCoinPriceInfo[item.coin]?.close }}</div>
            <div class="item-price2" :class="[_isRFD(tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
              tradeStore.allCoinPriceInfo[item.coin]?.close), 'rfd-sign itemMain ff-num']"> {{
          tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%
            </div>

            <image-load class="item-img" :file-path="item.logo"></image-load>
            <div class="item-but" @click="linkTo(item, index)">{{ _t18('view_more') }}</div>
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>

</template>

<script setup>
import { useMainStore } from '@/store/index'
import { useTradeStore } from '@/store/trade'
import { useRouter } from 'vue-router'
import { _getConfig, _isRFD, _t18, _toView } from "@/utils/public";

const tradeStore = useTradeStore()
const mainStroe = useMainStore()
const $router = useRouter()

const active = ref(0)
const dataList = computed(() => {
  let tempData = []

  tradeStore.secondContractCoinList.forEach((it, inx) => {

    // BTC/ETH
    if (['cmmetrics'].includes(_getConfig('_APP_ENV')) && (it.coin == 'btc' || it.coin == 'eth' || it.coin == 'bnb')) {
      tempData.push(it)
    }

  })
  // 黄金
  tradeStore.preciousMetalsList.forEach((it, inx) => {
    // 外汇1
    if (it.coin == 'xag' || it.coin == 'xau') {
      tempData.push(it)
    }
  })
  // 外汇
  tradeStore.foreignExchangeList.forEach((it, inx) => {
    // 外汇1
    if (it.coin == 'php' || it.coin == 'huf' || it.coin == 'nzd') {
      tempData.push(it)
    }
  })

  return tempData
})

//跳转
const linkTo = (item, index) => {
  console.log(item, 'nnnnnnnnbbbbb');

  if (item.coin) {
    if (item.type == 1 || item.type == 3) {
      $router.push(`/trade?tradeKey=Ustandard&symbol=${item.coin}`)
    } else {
      $router.push(`/trade?symbol=${item.coin}`)
    }
  } else {
    $router.push(`/trade`)
  }
}

</script>

<style scoped lang="scss">
.Preview {
  padding: 0 16px;
  margin-top: 4px;

  .Preview-title {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;

    span:nth-of-type(1) {
      font-size: 18px;
    }

    span:nth-of-type(2) {
      font-size: 14px;
      color: var(--ex--home-grid-text-color)
    }
  }

  :deep(.van-tabs) {

    .van-tabs__nav--line.van-tabs__nav--shrink,
    .van-tabs__nav--line.van-tabs__nav--complete {
      padding: 0 1px;
    }

    .van-tab {
      flex: 0;
      padding: 0;
      margin-left: 10px;

      &:nth-of-type(1) {
        margin-left: 0;
      }

      .van-tab-item {
        min-width: 140px;
        padding: 15px 10px;
        display: flex;
        flex-direction: column;
        align-items: center;

        background: var(--ex-home-tabs-bg-color);
        border-radius: 10px;
        border: 1px solid var(--ex-border-line);
        backdrop-filter: blur(10px);
        position: relative;
        &:after {
          z-index: -1;
          position: absolute;
          top: 30%;
          left: 35%;
          content: ' ';
          width: 30%;
          height: 40%;
          background: rgba(255, 255, 255, .3);
          filter: blur(35px);
          /*为了模糊更明显，调高模糊度*/
        }

        .item-atv {
          width: 18px;
          height: 2px;
          background: var(--ex-default-progress-bgColor);

          &.active {
            background: #FDC637;
          }
        }

        .item-text {
          margin-top: 16px;
          font-size: 13px;
          color: #9493AC;
        }

        .item-price {
          margin-top: 4px;
          font-size: 18px;
          color: #000;
        }

        .item-price2 {
          margin-top: 4px;
          font-size: 14px;
          color: #FFFFFF;
        }


        .item-img {
          margin-top: 12px;
          width: 50px;
          height: 50px;
          border-radius: 10px;
        }

        .item-but {
          margin-top: 12px;
          text-align: center;
          width: 110px;
          padding: 8px 10px;
          background: var(--ex-trade-buy-bg-color);
          border-radius: 9px;
          font-size: 14px;
          color: #FFFFFF;
        }

      }
    }

  }

}
</style>
