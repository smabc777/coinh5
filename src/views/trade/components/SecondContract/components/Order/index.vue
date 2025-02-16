<template>
  <div class="order-consten">

    <div class="entrust">

      <div class="entrustL">
        <!-- tab切换：当前委托/历史委托，...... -->
        <van-tabs swipe-threshold="1" v-model:active="curActive" shrink color="#33363E" title-active-color="#33363E"
          :line-width="0" title-inactive-color="#81818A" @change="tabChange">
          <van-tab v-for="(item, index) in tabList" :key="index"
            :title="item.num > 0 ? item.label + '(' + item.num + ')' : item.label">
          </van-tab>
        </van-tabs>

      </div>

      <!-- 隐藏其他币种，刷新 -->
      <div class="entrustR">
        <svg-load :name="currentEye ? 'yanjin-k' : 'yanjin-g'" class="entrustRImg" @click="switchingEye"></svg-load>
        <svg-load name="shuaxin" class="entrustRUpdateImg" @click="handelRefresh"></svg-load>
      </div>

    </div>

    <!-- 模拟交易-->
    <simulateTrade :type="1"></simulateTrade>

    <template v-if="!IS_HAS_SIMULATE.includes(_getConfig('_APP_ENV')) || isAssets()">
      <CurentrustList ref="CurentrustListRef" v-if="curActive == 0"></CurentrustList>
      <HistoryList ref="HistoryListRef" v-if="curActive == 1"></HistoryList>
    </template>
    <!-- 分享-->
    <SharePopup ref="SharePopupRef"></SharePopup>
  </div>

</template>

<script setup>
import simulateTrade from '@/views/trade/components/Common/simulateTrade/index.vue'
import HistoryList from './List/HistoryList.vue'
import CurentrustList from './List/CurentrustList.vue'
import SharePopup from '@/views/trade/components/Common/SharePopup/index.vue'
import { useToast } from '@/hook/useToast'
import { ref, provide, inject } from 'vue'
import { countOrderTotals, secondContractOrderselectOrderList } from '@/api/trade'

import { useUserStore } from '@/store/user'
import { IS_HAS_SIMULATE } from "@/config";

const { _showName } = useToast()
const userStore = useUserStore()
const coinInfo = inject('coinInfo')
const CurentrustListRef = ref(null)
const HistoryListRef = ref(null)
const isActivated = ref(false) //是否第一次加载

// 判断是否有平台资产
function isAssets() {
  const { asset } = storeToRefs(userStore)
  const total = asset.value.filter(e => e.type === 1).reduce((sum, e) => sum + e.exchageAmount, 0)
  return total > 0
}

//分享显示事件
const SharePopupRef = ref(null)
provide('setSharePopupShow', SharePopupRef)

//tabs列表
const getOrderTotleList = ref({})
const tabList = computed(() => [
  // //当前委托
  { label: _showName('exchange_curentrust', ['moonex']), value: 0, num: getOrderTotleList.value?.openOrder || 0 },
  // //历史记录
  { label: _showName('exchange_hisentrust', ['moonex']), value: 1, num: getOrderTotleList.value?.orderHistory || 0 },
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
  const res = await countOrderTotals('S_TOTAL')

  if (res.code == 200) {
    console.log('订单数量1212', res.data)
    getOrderTotleList.value = res.data
    // //当前委托
    // tabList.value[0].num = res.data?.openOrder || 0
    // //历史记录
    // tabList.value[1].num = res.data?.orderHistory || 0

  }


}
//向子孙组件提供方法
provide('getOrderListNumber', getOrderListNumber)

// 切换眼睛（隐藏其他交易数据）
const currentEye = ref(true)
const switchingEye = async () => {
  currentEye.value = !currentEye.value
  //待dom更新后
  await nextTick()
  curActive.value == 0 && CurentrustListRef.value?.filterEyes()
  curActive.value == 1 && HistoryListRef.value?.filterEyes()
}
provide('currentEye', currentEye)


//刷新订单
const handelRefresh = async () => {
  //待dom更新后
  await nextTick()
  isActivated.value = true
  curActive.value == 0 && CurentrustListRef.value?.refresh()
  curActive.value == 1 && HistoryListRef.value?.refresh()
  getOrderListNumber()
  userStore.getUserInfo()
}
// handelRefresh()

//每次进入缓存页面获取数据
onActivated(() => {
  // if (isActivated.value){
  handelRefresh()
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

        .van-tabs__nav,
        .van-tab--shrink {
          padding: 0;
          padding-right: 10px;
          background: transparent;
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
