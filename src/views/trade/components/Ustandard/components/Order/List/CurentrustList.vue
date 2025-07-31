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
        <div class="hisToryList">
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
            <div class="headerRight" @click="currentDelegation(item)">
              {{ _t18(`bb_Cancellation`) }}
            </div>
          </div>
          <div class="list">
            <!-- 委托时间 _t18(`k_time`) -->
            <div class="item">
              <div>{{ _t18(`openingTime`) }}</div>
              <div class="fw-num numItem">
                {{ _timeFormat(item.params?.delegateTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>
            <!-- 委托总量 -->
            <div class="item">
              <div>{{ _t18(`total_entrustment`) }}</div>
              <div class="fw-num numItem">
                {{ item.delegateTotal }}
                {{ item.showCoin ? matchText(item.showCoin, '/USDT') : item.symbol.toUpperCase() }}
              </div>
            </div>
            <!-- 委托价格 -->
            <div class="item">
              <div>{{ _t18(`order_price`) }}</div>
              <div class="fw-num numItem">{{ item.delegatePrice }} USDC</div>
            </div>
            <!-- 已成交量 -->
            <div class="item">
              <div>{{ _t18(`volume`) }}</div>
              <div class="fw-num numItem">
                {{ item.dealNum ? item.dealNum : '0' }}
                {{ item.showCoin ? matchText(item.showCoin, '/USDT') : item.symbol.toUpperCase() }}
              </div>
            </div>
            <!-- 成交均价 -->
            <div class="item">
              <div>{{ _t18(`bb_Average_transaction_price`) }}</div>
              <div class="fw-num numItem">
                {{ item.dealPrice ? item.dealPrice : '---' }}
              </div>
            </div>
            <div >
              <!--保证金 1 -->
              <div class="item">
                <div>{{ _t18(`cash_deposit`) }}</div>
                <div class="fw-num numItem">
                  <!-- {{ _timeFormat(item.params?.closeTime, 'DD/MM/YYYY HH:mm:ss', true) }} -->
                  {{ item.amount }} USDC
                </div>
              </div>
              <!--杠杆倍数 -->
              <div class="item">
                <div>{{ _t18(`Leverage-ratio`) }}</div>
                <div class="fw-num numItem">
                  {{ item.leverage }}
                </div>
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

import {priceFormat} from '@/utils/decimal.js'
import {canCelOrder, orderList} from '@/api/trade'
import {formatCurrentcurrency, matchText} from '@/utils/filters'
import {_getConfig, _t18, _timeFormat} from '@/utils/public'
import {useTradeStore} from '@/store/trade'
import {computed, inject} from 'vue'
import {showToast} from 'vant'
import {_div, _mul, _toFixed} from "@/utils/decimal";

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
  let data = {
    status: 0,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await orderList(data)
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

const currentDelegation = async (item) => {
  const res = await canCelOrder(item.id)
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

  .hightUp {
    color: var(--ex-font-color2) !important;
  }

  .hightDown {
    color: var(--ex-font-color10) !important;
  }

  .colorBlue {
    color: var(--ex-font-color9) !important;
  }

  .hisToryList {
    padding: 20px 15px 0;
    border-bottom: 1px solid var(--ex-border-color);
    .header {
      padding-bottom: 20px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .headerLeft {
        display: flex;
        align-items: center;

        .name {
          padding: 0 5px;
          font-size: 12px;
          background: var(--ex-div-bgColor1);
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

        .name2 {
          background: var(--ex-rfd-fall);
        }
      }

      .headerRight {
        padding: 0 5px;
        background: var(--ex-default-background-color);
        border-radius: 4px;
        opacity: 1;
        border: 1px solid var(--ex-font-color9);
        font-size: 12px;
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
        padding-bottom: 15px;

        .numItem {
          color: var(--ex-default-font-color);
        }

        .numItemRed {
          color: var(--ex-font-color15);
        }
      }
    }
  }
}
</style>
