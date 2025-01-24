<template>
  <div class="order-consten">

    <div class="entrust">

      <div class="entrustL">
        <!-- tab切换：当前委托/历史委托，...... -->
        <van-tabs
            swipe-threshold="1"
            v-model:active="curActive"
            shrink
            color="#33363E"
            title-active-color="#33363E"
            :line-width="0"
            title-inactive-color="#81818A"
            @change="tabChange"
        >
          <van-tab
              v-for="(item, index) in tabList"
              :key="index"
              :title="item.num > 0 ? item.label + '(' + item.num + ')' : item.label"
          >
          </van-tab>
        </van-tabs>

      </div>

      <!-- 隐藏其他币种，刷新 -->
      <div class="entrustR">
        <svg-load
            :name="currentEye ?'yanjin-k' :'yanjin-g'"
            class="entrustRImg"
            @click="switchingEye"
        ></svg-load>
        <svg-load name="shuaxin" class="entrustRUpdateImg" @click="handelRefresh"></svg-load>
      </div>

    </div>
    <!-- 模拟交易-->
    <simulateTrade :type="3"></simulateTrade>

    <template v-if="!IS_HAS_SIMULATE.includes(_getConfig('_APP_ENV'))||isAssets()">
      <!--当前持仓-->
      <PositionsList ref="PositionsListRef" v-if="curActive == 0"></PositionsList>
      <!--当前委托-->
      <CurentrustList ref="CurentrustListRef" v-if="curActive == 1"></CurentrustList>
      <!--止盈止损-->
      <StopProfitAndLossList ref="StopProfitAndLossListRef" v-if="curActive == 2"></StopProfitAndLossList>
      <!--历史记录-->
      <HistoryList ref="HistoryListRef" v-if="curActive == 3"></HistoryList>
    </template>
    <!-- 分享收益 -->
    <SharePopup ref="SharePopupRef"></SharePopup>
  </div>

</template>

<script setup>
import simulateTrade from '@/views/trade/components/Common/simulateTrade/index.vue'
import CurentrustList from './List/CurentrustList.vue'
import PositionsList from './List/PositionsList.vue'
import StopProfitAndLossList from './List/StopProfitAndLossList.vue'
import HistoryList from './List/HistoryList.vue'
import SharePopup from '@/views/trade/components/Common/SharePopup/index.vue'
import {ref, provide, inject, nextTick} from 'vue'
import {
  canCelOrder,
  contractHistoryList,
  contractLossList, countOrderTotals,
  orderList,
} from '@/api/trade'

import {useToast} from '@/hook/useToast'
import {useUserStore} from '@/store/user/index'
import {IS_HAS_SIMULATE} from "@/config";


const userStore = useUserStore()
const {_showName} = useToast()

// 判断是否有平台资产
function isAssets() {
  const { asset } = storeToRefs(userStore)
  const total = asset.value.filter(e => e.type === 3).reduce((sum, e) => sum + e.exchageAmount, 0)
  return total > 0
}

const userInfo = userStore.userInfo //用户信息
const coinInfo = inject('coinInfo') //当前币种信息
const PositionsListRef = ref(null)  // 当前持仓
const CurentrustListRef = ref(null) // 当前委托
const StopProfitAndLossListRef = ref(null)  // 止盈止损
const HistoryListRef = ref(null)  // 历史记录
const isActivated = ref(false) //是否第一次加载

//分享显示事件
const SharePopupRef = ref(null)
provide('setSharePopupShow', SharePopupRef)

//tabs列表
const getOrderTotleList = ref({})
const tabList = computed(()=>[
  // 当前持仓
  {
    label: _showName(`current_position`),
    component: 'PositionsList',
    value: 0,
    num: getOrderTotleList.value?.holding || 0
  },
  // 当前委托
  {
    label: _showName(`exchange_curentrust`),
    component: 'CurentrustList',
    value: 1,
    num: getOrderTotleList.value?.openOrder || 0
  },
  // 止盈止损
  {
    label: _showName(`profit_loss`,['bydfe','smartfund']),
    component: 'StopProfitAndLossList',
    value: 2,
    num: getOrderTotleList.value?.profitAndLoss || 0
  },
  // 历史记录
  {
    label: _showName(`exchange_hisentrust`),
    component: 'HistoryList',
    value: 3,
    num: getOrderTotleList.value?.orderHistory || 0
  }
])


// //切换tabs => 切换列表
const curActive = ref(0)
const tabChange = (val = 0) => {
  curActive.value = val
  handelRefresh()
}

// 获取/更新订单数量
const getOrderListNumber = async () => {

  //当前委托/历史委托/订单数量  更多......
  const res = await countOrderTotals('U_TOTAL')

  if (res.code == 200) {
    getOrderTotleList.value = res.data
  }

  userStore.getUserInfo()
}
//向子孙组件方法
provide('getOrderListNumber', getOrderListNumber)

// 切换眼睛（隐藏其他币种交易数据）
const currentEye = ref(true)
const switchingEye = async () => {
  currentEye.value = !currentEye.value
  //待dom更新后
  await nextTick()
  curActive.value == 0 && PositionsListRef.value?.filterEyes()
  curActive.value == 1 && CurentrustListRef.value?.filterEyes()
  curActive.value == 2 && StopProfitAndLossListRef.value?.filterEyes()
  curActive.value == 3 && HistoryListRef.value?.filterEyes()
}
provide('currentEye', currentEye)

//刷新订单

const handelRefresh = async () => {
  //待dom更新后
  await nextTick()
  isActivated.value = true
  curActive.value == 0 && PositionsListRef.value?.refreshOrder()
  curActive.value == 1 && CurentrustListRef.value?.refreshOrder()
  curActive.value == 2 && StopProfitAndLossListRef.value?.refreshOrder()
  curActive.value == 3 && HistoryListRef.value?.refreshOrder()
  getOrderListNumber()

}
handelRefresh()

//每次进入缓存页面获取数据
onActivated(()=>{
  // if (isActivated.value){
  //   handelRefresh()
  // }
})

defineExpose({
  handelRefresh
})
</script>


<style scoped lang="scss">

.order-consten {

  .entrust {
    height: 50px;
    position: relative;
    display: flex;
    padding: 0 14px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--ex-border-line);


    .entrustL {
      flex: 1;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;


      :deep(.van-tabs) {
        padding-right: 10px;

        .van-tab--active {
          color: var(--ex-default-font-color) !important;
          background: none !important;
          font-weight: normal;
        }

        .van-tabs__wrap {
          padding: 0 !important;
          margin: 0 !important;
        }

        .van-tab__text {
          font-size: 14px;
        }

        .van-tabs__nav, .van-tab--shrink {
          padding: 0;
          padding-right: 10px;
          background: none;
        }

      }


      .entrustItem {
        //margin-right: 16px;
      }
    }

    .entrustR {
      width: 50px;
      display: flex;
      align-items: center;

      .entrustRImg {
        width: 16px;
        height: 12px;
      }

      .entrustRUpdateImg {
        margin-left: 10px;
        width: 18px;
        height: 18px;
      }
    }
  }

  :deep(.van-cell) {
    padding: 0;
    //background-color: var(--ex-default-background-color);
  }

}


</style>
