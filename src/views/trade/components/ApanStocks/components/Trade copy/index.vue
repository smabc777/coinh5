<template>
  <div class="content_right">
    <!-- 买入/卖出切换 -->
    <div class="rightFirst" :class="tabsVal == 0?'l-atv':'r-atv'">
      <div class="l fw-bold" :class="{atv:tabsVal == 0}" @click="checkedTradeType(tradeTypeList[0])">
        <span> {{ _t18(`purchase`) }}</span>
      </div>
      <div class="r fw-bold" :class="{atv:tabsVal == 1}" @click="checkedTradeType(tradeTypeList[1])">
        <span>  {{ _t18(`bb_sell1`) }}</span>
      </div>
    </div>

    <!--买入-->
    <BuyBb ref="buybbRef" v-show="tabsVal == 0"></BuyBb>
    <!--卖出-->
    <SellBb ref="sellbbRef" v-show="tabsVal == 1"></SellBb>
  </div>
</template>

<script setup>
import {inject, ref, onUnmounted, nextTick} from 'vue'
import {useFreeze} from '@/hook/useFreeze'

const {_isFreeze} = useFreeze()
import {useToast} from '@/hook/useToast'
import {socketDict} from '@/config/dict'
import PubSub from 'pubsub-js'
import {useMainStore} from '@/store/index'
import {useUserStore} from '@/store/user'
import SellBb from "./components/SellBb.vue";
import BuyBb from "./components/BuyBb.vue";
import {_t18} from "@/utils/public";

const {_toast, _showName} = useToast()
const mainStore = useMainStore()
const userStore = useUserStore()
const {asset} = storeToRefs(userStore)


//订单刷新
const OrderRefresh = inject('OrderRefresh')

//当前股票信息
const stockInfo = inject('stockInfo')

// 买入 卖出
const tradeTypeList = [
  {label: _showName(`purchase`), value: '0'},
  {label: _showName(`bb_sell1`), value: '1'}
]

// 切换买入/卖出
// 买入0，卖出1
const tabsVal = ref(0)
const checkedTradeType = (item) => {

  if (item.value !== tabsVal.value) {
    tabsVal.value = item.value
  }
  tabsVal.value == 1 && sellbbRef.value.getStockAsset()
  // rxce卖出只有市价
  if (['rxce'].includes(__config._APP_ENV)) {
    if (item.value == '1') {
      // checkedDelegateType(delegateTypeList[0])
    }
  }
}

// 买入/卖出组件ref
const buybbRef = ref(null)
const sellbbRef = ref(null)

//设置交易价格
// 触发子组件方法修改限价价格
const setTradePrice = async (val) => {
  await nextTick()
  tabsVal.value == 0 && buybbRef.value.setTradePrice(val);
  tabsVal.value == 1 && sellbbRef.value.setTradePrice(val);
}


/**
 * 订单结算，更新订单和用户信息
 */
const settlementKey = ref('')

const coinOverNotification = () => {
  /**
   * 结算改变通知
   */
  settlementKey.value = PubSub.subscribe(socketDict.SETTLEMENT, async (key, data) => {
    const {type} = JSON.parse(data.date.message)
    if (type == 1) {
      OrderRefresh()
    }
  })
}
coinOverNotification()


onUnmounted(() => {
  settlementKey && PubSub.unsubscribe(settlementKey)
})
</script>

<style scoped lang="scss">
.content_right {
  //padding-right:  14px;
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .rightFirst {
    height: 37px;
    display: flex;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    justify-content: space-between;
    align-items: center;

    &.l-atv {
      background: linear-gradient(
              to right,
              var(--ex-trade-buy-bg-color) 20%,
              var(--ex-backup--background-color) 20% 60%,
              var(--ex--backup-background-color-2) 60% 100%
      );
    }

    &.r-atv {
      background: linear-gradient(
              to left,
              var(--ex-trade-Sell-bg-color) 20%,
              var(--ex-backup--background-color) 20% 60%,
              var(--ex--backup-background-color-2) 60% 100%
      );
    }

    .l, .r {
      height: 37px;
      width: calc(50% - 2px);
      border-radius: 6px;
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 1);
      font-size: 15px;
      transform: skew(-20deg);
      background: var(--ex--backup-background-color-2);

      span {
        transform: skew(20deg);
      }

      &:nth-of-type(1) {
        &.atv {
          background: var(--ex-trade-buy-bg-color);
        }
      }

      &:nth-of-type(2) {
        &.atv {
          background: var(--ex-trade-Sell-bg-color);
        }
      }
    }


  }


}

</style>
