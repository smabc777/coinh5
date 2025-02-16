<template>
  <!--交易-全部-->
  <div id="trade" ref="tradeContentRef" class="van-safe-area-bottom van-safe-area-top">
    <!--返回-->
    <div class="back_to" @click.stop="_back()">
      <van-icon name="arrow-left" size="20" />
    </div>

    <van-tabs class="tradeTabs" v-model:active="active" lazy-render line-width="0" :ellipsis="false" swipeable animated
      @change="change">
      <van-tab v-for="(item, index) in headerList" :key="index" :name="item.componentName">
        <template #title>
          <div class="tab-item" :class="{ atv: item.componentName == active }">
            {{ item.title }}
          </div>
        </template>

        <template #default>

          <div style="overflow: auto">
            <!-- 交易模块 -->
            <keep-alive>
              <component :is="item.componentName"></component>
            </keep-alive>
          </div>
        </template>
      </van-tab>
    </van-tabs>

    <!-- 提交按钮-->
    <div class="SecondContract-bottom" v-if="active === 'SecondContract'">
      <van-sticky position="bottom">
        <div class="upsAndDowns">
          <!-- 看涨 看跌 -->
          <div class="ups item" @click="setPublicPopupShow(1)">
            {{ _t18(`option_buy_up`, ['moonex']) }}
          </div>
          <div class="downs item" @click="setPublicPopupShow(0)">
            {{ _t18(`option_buy_short`, ['moonex']) }}
          </div>
        </div>
      </van-sticky>
    </div>
    <!-- 提交按钮-->
    <div class="SecondContract-bottom" v-if="active === 'ApanStocks'">
      <van-sticky position="bottom">
        <div class="upsAndDowns">
          <!-- 看涨 看跌 -->
          <div class="ups item" @click="setOverlayPulicShow(0)">
            {{ _t18('stock80') }}
          </div>
          <div class="downs item" @click="setOverlayPulicShow(1)">
            {{ _t18('stock81') }}
          </div>
        </div>
      </van-sticky>
    </div>
  </div>
</template>

<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'

import { useMainStore } from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import { _back, _t18 } from '@/utils/public'
import { useTradeStore } from '@/store/trade'

const { _isFreeze } = useFreeze()
const mainStore = useMainStore()
const tradeStore = useTradeStore()
const router = useRouter()
const route = useRoute()

//  tabs 数据
//  tradeKey 参数 刷新定位保持当前切换
const active = ref('')
localStorage.setItem('tradeKey', active.value)

const headerList = computed(() => {
  return mainStore.getTradeHeaderList.filter((item) => item.componentName != 'Optional')
})

// 设置地址参数
const change = (name) => {
  router.replace({ query: { tradeKey: name } })
  localStorage.setItem('tradeKey', name)
}

// 页面缓存重新获取地址参数
onActivated(() => {
  nextTick(() => {
    active.value = route.query.tradeKey || 'SecondContract'
    localStorage.setItem('tradeKey', active.value)
  })
})

onMounted(() => {
  nextTick(() => {
    active.value = route.query.tradeKey || 'SecondContract'
    router.replace({ query: { tradeKey: active.value, ...route.query } })
    localStorage.setItem('tradeKey', active.value)
  })
})

// 秒合约下单弹窗
const setPublicPopupShow = (key) => {
  if (!_isFreeze(DIFF_ISFREEZE, 'FINANCIAL')) return
  tradeStore.SecondTradeData.show = true
  tradeStore.SecondTradeData.key = key
}
const setOverlayPulicShow = (key) => {
  // if (!_isFreeze(DIFF_ISFREEZE, 'FINANCIAL')) return
  if (key == 0) {
    tradeStore.StockTradeData.show1 = true
  } else {
    tradeStore.StockTradeData.show2 = true
  }
}

</script>

<script>
//组件
import ApanStocks from '@/views/trade/components/ApanStocks/index.vue'
import BBTrading from '@/views/trade/components/BBTrading/index.vue'
import Ustandard from '@/views/trade/components/Ustandard/index.vue'
import SecondContract from '@/views/trade/components/SecondContract/index.vue'

export default {
  name: 'Trade',
  components: {
    SecondContract,
    BBTrading,
    Ustandard,
    ApanStocks
  }
}
</script>

<style scoped lang="scss">
#trade {
  height: 100vh;
  //max-width: var(--ex-max-width);
  position: relative;

  :deep(.van-tabs) {
    flex-grow: 1;
    overflow: hidden;

    &.tradeTabs {
      .van-tabs__wrap {
        padding: 0 10px;
        margin-top: 20px;
        margin-bottom: 6px;
        margin-left: 44px;
      }

      .van-tabs__nav {
        border-radius: 8px;
        padding: 0;
        // background: var(--ex-home-tabs-bg-color);
      }

      .tab-item {
        padding: 10px 0;
        width: 100%;
        font-size: 14px;
        color: var(--ex-home-tabs-text-color);

        &.atv {
          font-size: 15px;
          color: var(--ex-home-tabs-text-atv-color);
        }
      }

      .van-tab--active {
        background: var(--ex-home-tabs-bg-atv-color);
        color: var(--ex-home-tabs-text-atv-color);
        border-radius: 8px;
      }
    }
  }

  .back_to {
    position: absolute;
    z-index: 2;
    top: 20px;
    left: 10px;
    padding: 10px;
    border-radius: 8px;
    line-height: normal;
    background: var(--ex--backup-background-color-2);
  }

  .upsAndDowns {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 20px 26px;
    background: var(--ex-default-background-color);

    .item {
      min-width: 153px;
      padding: 12px 10px;
      font-size: 15px;
      border-radius: 8px;
      text-align: center;
      color: #fff;
    }

    .ups {
      background: var(--ex-trade-buy-bg-color);
    }

    .downs {
      background: var(--ex-trade-Sell-bg-color);
    }
  }
}
</style>
