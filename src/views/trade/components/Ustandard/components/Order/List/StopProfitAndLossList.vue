<template>
  <div class="content">
    <van-loading v-if="loading"></van-loading>
    <van-list
      v-if="dataNewList?.length > 0"
      :finished="finished"
      :finished-text="dataNewList?.length ? _t18(`no_more_data`) : ''"
      :loading-text="_t18(`loading`)"
      @load="onLoad"
      :immediate-check="false"
      v-model:loading="loading"
    >
      <van-cell v-for="(item, index) in dataNewList" :key="index">
        <div class="hisToryList" v-show="!['rxce'].includes(_getConfig('_APP_ENV'))">
          <div class="header">
            <div class="headerLeft">
              <!-- !item.type ? '做多' : '开空'  -->
              <div class="name" :class="!item.type ? 'bgcBlue' : 'bgcRed'">
                {{ !item.type ? _t18(`going_long`) : _t18(`open_short`) }}
              </div>
              <div class="fw-bold">
                {{ item.showCoin ? item.showCoin : item.symbol.toUpperCase() + '/USDT' }}
              </div>
              <div class="ff-num headerLeftIcon">{{ item.leverage }}x</div>
            </div>
            <!-- 撤单 -->
            <div class="headerRight" @click="stoplossBullshit(item)">
              {{ _t18(`bb_Cancellation`) }}
            </div>
          </div>
          <div class="list">
            <!-- 委托类型 -->
            <div class="item">
              <div>
                {{ _t18('trade_delegate_type') }}
              </div>
              <div class="fw-num numItem">
                <!-- 止盈止损  0 止盈    1止损-->
                {{ item.lossType ? _t18(`stop_loss`) : _t18(`stop_profit`) }}
              </div>
            </div>
            <!-- 委托总量 -->
            <div class="item">
              <div>{{ _t18(`total_entrustment`) }}</div>
              <!-- lossType 0 止盈 1止损 -->
              <div class="fw-num numItem">
                {{ item.lossType ? item.loseNumber : item.earnNumber }}
                {{ item.showCoin ? item.showCoin : item.symbol.toUpperCase() }}
              </div>
            </div>
            <!-- 委托价格 -->
            <div class="item">
              <div>{{ _t18(`order_price`) }}</div>
              <!-- delegateType 委托类型（0 限价 1 市价） -->
              <!-- item.delegateType ? '市价委托' : item.loseDelegatePrice + ' USDT' -->
              <div class="fw-num numItem" :class="item.delegateType ? 'colorBlue' : ''">
                {{ item.delegateType ? _t18(`bb_market_order`) : item.loseDelegatePrice + ' USDT' }}
              </div>
            </div>
            <!-- 触发价格 -->
            <div class="item">
              <div>{{ _t18(`trigger_price`) }}</div>
              <!-- lossType 0 止盈 1止损 -->
              <div class="fw-num numItem">
                {{ item.lossType ? item.losePrice : item.earnPrice }}
                USDT
              </div>
            </div>
            <!-- 建仓时间 -->
            <div class="item" >
              <div>{{ _t18(`openingTime`) }}</div>
              <div class="fw-num numItem">
                {{ _timeFormat(item.params?.createTime || item.createTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
    <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>
  </div>
</template>
<script setup>
import {
  cancelLoss,
  cancelOrderCurrencyApi,
  contractLossList,
  getOrderListCurrencyApi
} from '@/api/trade'
import { formatCurrentcurrency } from '@/utils/filters'
import { _getConfig, _t18, _timeFormat } from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { inject } from 'vue'
import { showToast } from 'vant'

const tradeStore = useTradeStore()

// 数据列表
const coinInfo = inject('coinInfo')
// 切换眼睛（隐藏其他交易数据）
const showEye = inject('currentEye')
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const dataList = ref([])
const dataNewList = ref([])

// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getOrderList()
}
//刷新订单
const refreshOrder = () => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  finished.value = false
  onLoad()
}

// status =  0 当前委托
//获取列表
const getOrderList = async () => {
  const data = {
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractLossList(data)
  loading.value = false
  // finished.value = true

  if (res?.total == undefined || res?.total <= dataList.value.length) {
    return (finished.value = true)
  }

  if (res.code == 200) {
    dataList.value = [...dataList.value, ...res.rows]
    pageNum.value++
  }

  filterEyes()
}

// 撤单
const stoplossBullshit = async (item) => {
  const res = await cancelLoss(item.id)
  if (res.code == 200) {
    showToast(res.msg)
    onFinish(item)
  } else {
    showToast(res.msg)
  }
}

//处理订单数据 -> 过滤当前币种订单
const filterEyes = () => {
  if (!showEye.value) {
    dataNewList.value = formatCurrentcurrency(dataList.value, coinInfo.value.coin)
  } else {
    dataNewList.value = dataList.value
  }
}
//删除当前订单
const getOrderListNumber = inject('getOrderListNumber')
const onFinish = (item) => {
  // 删除当前订单
  dataNewList.value.forEach((items, index) => {
    if (item.id == items.id) {
      dataNewList.value.splice(index, 1)
    }
  })
  getOrderListNumber()
}

defineExpose({
  refreshOrder,
  filterEyes
})
</script>
<style scoped lang="scss">
:deep(.van-cell){
  background: transparent;
}
.content {
  text-align: center;
  min-height: 240px;

  :deep(.van-cell) {
    padding: 0;
  }

  .share-button {
    color: var(--ex-active-font-color);
    border: 1px solid var(--ex-active-font-color);
    border-radius: 4px;
    padding: 5px 10px;
  }

  .btn {
    font-size: 12px;
    padding: 2px 10px;
    border: 1px solid var(--ex-primary-color);
    border-radius: 5px;
  }

  .colorBlue {
    color: var(--ex-font-color2) !important;
  }

  .colorRed {
    color: var(--ex-font-color15) !important;
  }

  .bgcBlue {
    background-color: var(--ex-rfd-rise) !important;
  }

  .bgcRed {
    background-color: var(--ex-rfd-fall) !important;
  }

  .colorBlue {
    color: var(--ex-font-color9) !important;
  }

  .hisToryList {
    padding: 20px 15px 0;
    border-bottom: 1px solid var(--ex-border-color);

    .header {
      padding-bottom: 10px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .headerLeft {
        display: flex;
        align-items: center;

        .name {
          padding: 2px 5px;
          font-size: 12px;
          border-radius: 4px;
          margin-right: 10px;
          color: var(--ex-font-color);
        }

        .headerLeftIcon {
          margin-left: 10px;
          font-size: 12px;
          padding: 0 5px;
          border: 1px solid var(--ex-primary-color);
          border-radius: 5px;
        }
      }

      .headerRight {
        padding: 0 6px;
        background: var(--ex-default-background-color);
        border-radius: 4px;
        opacity: 1;
        border: 1px solid var(--ex-font-color2);
        font-size: 12px;
        color: var(--ex-font-color2);
      }

      .headerRightNobgc {
        font-size: 14px;
        color: var(--ex-font-color9);
      }
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--ex-passive-font-color);
        // padding-bottom: 20px;
        padding: 8px 0;

        .numItem {
          color: var(--ex-default-font-color);
        }
      }
    }

    .bottomList {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;

      .itemBotton {
        flex: 1;
        margin-right: 5px;
        padding: 8px 0;
        background: var(--ex-div-bgColor17);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ex-default-font-color);
        font-size: 12px;
        text-align: center;
      }

      .itemBotton:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
