<template>
  <van-popup v-model:show="QuoteSidebarShow" teleport="#app" safe-area-inset-top safe-area-inset-bottom position="left"
    lock-scroll lazy-render close-on-popstate :style="{ width: '80%', height: '100vh' }" @close="close">
    <div class="QuoteSidebar">
      <!-- 搜索 -->
      <div class="searchInput">
        <van-field autocomplete="off" v-model="searchName" center :placeholder="_t18(`search_currency`)">
          <template #button>
            <van-icon size="20" color="var(--ex-default-font-color)" name="search" />
          </template>
        </van-field>
      </div>
      <!-- 二级分类 -->
      <div class="second-tabs" title-inactive-color="#7833f6" title-active-color="#7833f6" v-if="sidebarType == 3">
        <!-- <div class="second-tabs-list">
          <div class="second-tabs-list-item" v-for="(item, index) in headerSecondList" :key="item.type"
            :class="[currentSecondIndex === index ? 'active' : '']" @click="clicSecondkTab(item, index)">
            {{ item.name }}
          </div>
        </div> -->
        <van-tabs  @click-tab="clicSecondkTab" v-model:active="currentSecondIndex" shrink>
          <van-tab v-for="item in headerSecondList" :key="item.type" :name="item.type" :title="_t18(item.name)"></van-tab>
        </van-tabs>
      </div>
      <!--筛选-->
      <div class="QuoteFilter">
        <QuoteFilter></QuoteFilter>
      </div>
      <div class="Quote-list">
        <div class="Quote-list-item" v-for="(item, index) in filterKeyCoin(currentList, searchName)" :key="index"
          @click="linkTo(item)">

          <div class="Quote-list-left">
            <!-- 币图标 -->
            <!--            <image-load :filePath="item.logo" class="Quote-list-img"/>-->
            <!-- 币名称 -->
            <span class="ff-num"> {{ type == 4 ? item.symbol : item.showSymbol }}</span>
          </div>
          <div class="Quote-list-right">
            <div class="fw-bold Quote-list-right-text">
              {{ priceFormat(tradeStore.allCoinPriceInfo[item.coin]?.close)
              }}

            </div>
            <div class="rightBox" :class="[
              _isRFD(
                tradeStore.allCoinPriceInfo[item.coin]?.openPrice,
                tradeStore.allCoinPriceInfo[item.coin]?.close
              ),
              'rfd-sign rfd-bg rightRight fw-num'
              , type == 4 ? 'tw' : '']">
              <span> {{ type == 4 ? item.maRate : tradeStore.allCoinPriceInfo[item.coin]?.priceChangePercent
                }}%</span>
            </div>
            <!--            <van-icon name="star" size="20"-->
            <!--                      :color="item.isCollect === 1?'var(&#45;&#45;ex-active-font-color)':'var(&#45;&#45;ex-passive-font-color)'"/>-->
          </div>

        </div>
      </div>

    </div>

  </van-popup>
</template>

<script setup>
import QuoteFilter from "@/components/QuoteFilter/index.vue";

import { _isRFD, _t18 } from "@/utils/public";
import { useTradeStore } from "@/store/trade";
import { useRouter, useRoute } from "vue-router";
import { priceFormat, _toFixed } from "@/utils/decimal";
import { filterKeyCoin } from "@/utils/filters";
import { dispatchCustomEvent } from "@/utils";

const props = defineProps({
  type: {
    type: Number,
    default: null
  },

})
const tradeStore = useTradeStore()
const $router = useRouter()
const $route = useRoute()
// 现货数据
const currentList = ref([])
// 备用
const currentListbei = ref([])

// 显示弹窗
const QuoteSidebarShow = ref(false)
const close = () => {
  QuoteSidebarShow.value = false
}
// 搜索 key
const searchName = ref('')

const sidebarType = ref(null)

const currentSecondIndex = ref(0)
const headerSecondList =computed(() => {
return [
  {
    name: 'all',
    type: 0
  },
  {
    name: 'coinbase_h_l_hot',
    type: 2
  },
  {
    name: 'coinbase_h_l_out',
    type: 1
  },
  {
    name: 'coinbase_h_l_gold',
    type: 3
  }
]
})
// 切换二级分类
const clicSecondkTab = (e) => {
  let array = []
  currentList.value = [...currentListbei.value]
  currentSecondIndex.value = e.name
  
  if (e.name != 0) {
    currentList.value.forEach((it, inx) => {
      
      if (e.name ==it?.type) {
        array.push(it)
      }
    })
    currentList.value = [...array]
  }
}

// 设置当前行情数据
// 那个交易模块显示 秒合约 1  币币 2  U本位 3
const setQuoteSidebarData = (n, type) => {
  sidebarType.value = n
  //秒合约
  if (n == 1) {
    currentList.value = [...tradeStore.secondContractCoinList,
    ...tradeStore.foreignExchangeList,
    ...tradeStore.preciousMetalsList]


  }
  //币币
  if (n == 2) {
    currentList.value = tradeStore.spotCoinList
  }
  //U本位
  if (n == 3) {
    currentList.value = tradeStore.contractCoinList
    currentListbei.value = tradeStore.contractCoinList
  }
  //日本股票
  // if (n == 4) {
  //   currentList.value = tradeStore.stockList
  // }
  QuoteSidebarShow.value = true

}
defineExpose({ setQuoteSidebarData })


//筛选返回数据
const setCurrentList = (val) => {
  currentList.value = val
}

provide('currentList', currentList)
provide('setCurrentList', setCurrentList)

// 选择币种
const linkTo = async (item) => {

  let type = ''
  if ($route.query.type == 2) {
    type = 'spot'
  } else if ($route.query.type == 3) {
    type = 'contract'
  }



  //设置币种参数和旧参数
  $router.replace({
    query: { ...$route.query, symbol: item.coin }
  })
  let a = ''
  if (sidebarType.value == 1) {
    a = 'event_secondContract'
  } else{
    a = 'event_tradeSymbolChange'
  }
  dispatchCustomEvent(a, {
    type: type,
    symbol: item.symbol,
    coin: item.coin,
    coinInfo: item
  })



  // 关闭
  close()
}


</script>

<style scoped lang="scss">
:deep(.van-popup) {
  left: 0;
  top: 0;
  bottom: 0;
}

.QuoteSidebar {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  position: relative;
  height: 100%;
  //overflow: auto;

  :deep(.searchInput) {
    height: 50px;
    padding: 0 16px;

    .van-cell {
      height: 50px;
      border-radius: 8px;
      background: var(--ex-default-background-color);
      border:1px solid var(--ex--backup-background-color-2);
    }
  }

  .QuoteFilter {
    padding: 10px 16px;
  }

  .Quote-list {

    padding: 0 16px;

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
        }

        .rightBox {
          font-size: 14px;
          border-radius: 5px;
          padding: 7.2px 8px;
          min-width: 68px;
          //min-height: 30px;
          line-height: normal;
          text-align: center;
          margin-left: 30px;

        }

        .tw {
          min-width: 108px;
        }
      }
    }
  }
}

.second-tabs {
  // display: flex;
  // align-content: center;
  // justify-content: space-between;
  border-bottom: 1px solid #272c3c;
  margin-top: 20px;

  :deep(.van-tab) {
    font-size: 14px;
  }

  :deep(.van-tab--active) {
    color: #7833f6;
    font-size: 15px;
  }

  :deep(.van-tabs__line) {
    background-color: #7833f6;
    bottom: 0px;

  }

  &-list {
    width: 70%;
    display: flex;

    &-item {
      display: flex;
      flex-direction: column;
      color: #7a7a7a;
      font-size: 13px;
      font-weight: 500;
      line-height: 22px;
      margin-right: 30px;

      &:last-child {
        margin-right: 0;
      }

      &::after {
        content: '';
        width: 100%;
        height: 3px;
        border-radius: 10px;
        margin-top: 8px;
      }
    }

    .active {
      font-size: 15px;
      color: #7833f6;

      &::after {
        background-color: #7833f6;
      }
    }
  }


}
</style>
