<template>
  <!--买入-->
  <BuyBb ref="buybbRef"></BuyBb>
  <!--卖出-->
  <SellBb ref="sellbbRef"></SellBb>
</template>

<script setup>
import { inject, ref, onUnmounted, nextTick, onMounted } from 'vue'
import { useFreeze } from '@/hook/useFreeze'

const { _isFreeze } = useFreeze()
import { useToast } from '@/hook/useToast'
import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'
import { useMainStore } from '@/store/index'
import { useUserStore } from '@/store/user'
import SellBb from "./components/SellBb.vue";
import BuyBb from "./components/BuyBb.vue";
import { _t18 } from "@/utils/public";

const { _toast, _showName } = useToast()
const mainStore = useMainStore()
const userStore = useUserStore()
const { asset } = storeToRefs(userStore)


//订单刷新
const OrderRefresh = inject('OrderRefresh')

//当前股票信息
const stockInfo = inject('stockInfo')



// 切换买入/卖出
// 买入0，卖出1
const tabsVal = ref(0)


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
    const { type } = JSON.parse(data.date.message)
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


  .rightFirst {
    height: 37px;
    display: flex;
    border-radius: 6px;
    justify-content: space-between;
    align-items: center;


    &.l-atv {
      background: linear-gradient(to right,
          var(--ex-trade-buy-bg-color) 20%,
          var(--ex-backup--background-color) 20% 60%,
          var(--ex--backup-background-color-2) 60% 100%);
    }

    &.r-atv {
      background: linear-gradient(to left,
          var(--ex-trade-Sell-bg-color) 20%,
          var(--ex-backup--background-color) 20% 60%,
          var(--ex--backup-background-color-2) 60% 100%);
    }

    .l,
    .r {
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

.SecondContract-bottoms {

  width: 414px;
  height: 146px;
  margin: auto;


}
</style>
