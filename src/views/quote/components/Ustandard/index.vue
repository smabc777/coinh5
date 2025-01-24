<template>
  <div class="Ustandard">

    <!-- 筛选 -->
    <QuoteFilter></QuoteFilter>

    <div class="Quote-list">
      <div class="Quote-list-item" v-for="(item,index) in filterKeyCoin(currentList, searchName)" :key="index"
           @click="linkTo(item)">

        <div class="Quote-list-left">
          <!-- 币图标 -->
          <image-load :filePath="item.logo" class="Quote-list-img"/>
          <!-- 币名称 -->
          <span class="ff-num"> {{ item.showSymbol }}</span>
        </div>

        <div class="Quote-list-right">
          <div class="fw-bold Quote-list-right-text">
            {{ priceFormat(tradeStore.allCoinPriceInfo[item.coin]?.close) }}
          </div>
          <div class="rightBox"
               :class="[
                        _isRFD(
                          tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
                          tradeStore.allCoinPriceInfo[item.coin]?.close
                        ),
                        'rfd-sign rfd-bg rightRight fw-num'
                      ]">
            <span>{{ tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent }}%</span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>

import {_isRFD, _t18} from "@/utils/public";
import {priceFormat} from "@/utils/decimal";
import QuoteFilter from "@/components/QuoteFilter/index.vue";

import {useTradeStore} from "@/store/trade";
import {filterKeyCoin} from "@/utils/filters";

const tradeStore = useTradeStore()
const router = useRouter()

//搜索key
const searchName = inject('searchName')


//币币行情数据
const currentList = ref(tradeStore.contractCoinList || [])
const setCurrentList = (val)=>{
  currentList.value = val
}
provide('currentList',currentList)
provide('setCurrentList',setCurrentList)

//跳转交易
const linkTo=(item)=>{
  router.push(`/trade?symbol=${item.coin}&tradeKey=Ustandard`)
}
</script>

<style scoped lang="scss">
.Ustandard {
  margin-top: 16px;
  padding-right: .5px;
  .Quote-list {
    padding-top: 4px;

    .Quote-list-item {
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      border-radius: 10px;

      .Quote-list-left {
        display: flex;
        align-items: center;

        .Quote-list-img {
          width: 34px;
          height: 34px;
          margin-right: 8px;
          margin-left: 1px;
          //border-radius: 10px;
        }

        span {
          font-size: 15px;
        }

      }

      .Quote-list-right {
        display: flex;
        align-items: center;

        .Quote-list-right-text {
          font-size: 14px;
          margin-right: 30px;
        }

        .rightBox {
          font-size: 14px;
          border-radius: 5px;
          padding: 7.2px 10px;
          min-width: 68px;
          //min-height: 30px;
          line-height: normal;
          text-align: center;
        }
      }
    }
  }

}


</style>
