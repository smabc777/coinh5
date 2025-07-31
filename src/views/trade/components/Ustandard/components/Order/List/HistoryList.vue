<template>
  <div class="content">
    <van-loading v-if="loading"></van-loading>
    <van-list v-if="dataNewList?.length > 0" :finished="finished"
      :finished-text="dataNewList?.length ? _t18(`no_more_data`) : ''" :loading-text="_t18(`loading`)" @load="onLoad"
      :immediate-check="false" v-model:loading="loading">
      <van-cell v-for="(data, index) in dataNewList" :key="index">
        <div class="hisToryList">
          <div class="header">
            <div class="headerLeft">
              <!-- !data.type ? '做多' : '开空'  -->
              <div class="name" :class="!data.type ? 'bgcBlue' : 'bgcRed'">
                {{ !data.type ? _t18(`going_long`) : _t18(`open_short`) }}
              </div>
              <div class="fw-bold">
                {{ data.showCoin ? data.showCoin : data.symbol.toUpperCase() + '/USDT' }}
              </div>
              <div class="ff-num headerLeftIcon">{{ data.leverage }}x</div>
            </div>
            <!-- {{ data.status ? '完全成交' : '等待成交' }} -->
            <div class="headerRightNobgc fw-bold">
              {{ data.status ? _t18(`completely_sold`) : _t18(`waitingfora_deal`) }}
            </div>
          </div>
          <div class="list">
            <!-- 委托总量 -->
            <div class="item">
              <div>{{ _t18(`total_entrustment`) }}</div>
              <div class="fw-num numItem">
                {{ data.openNum }}
                {{ data.showCoin ? matchText(data.showCoin, '/USDT') : data.symbol.toUpperCase() }}
              </div>
            </div>
            <!--委托价值 -->
            <div class="item">
              <div>{{ _t18(`delegate_value`) }}</div>
              <div class="fw-num numItem">{{ data.entrustmentValue }} USDC</div>
            </div>
            <!-- 委托价格 -->
            <div class="item">
              <div>{{ _t18(`order_price`, ['aams']) }}</div>
              <div class="fw-num numItem">{{ data.openPrice }} USDC</div>
            </div>
            <!-- 平仓价格 -->
            <div class="item">
              <div>{{ _t18(`closing_price`) }}</div>
              <div class="fw-num numItem">{{ data.dealPrice }} USDC</div>
            </div>
            <!-- 手续费   -->
            <!--            <div class="item" v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">-->
            <!--              <div>{{ _t18(`withdraw_commission`) }}</div>-->
            <!--              <div class="fw-num numItem">{{ data.sellFee }} USDT</div>-->
            <!--            </div>-->
            <!-- 收益率   -->
            <div class="item">
              <div>{{ _t18(`yield_rate`) }}</div>
              <div :class="[_isRFDE(yieldHisValue(data)), 'fw-num numItem ']">
                {{ yieldHisValue(data) }}%
              </div>
            </div>
            <!-- 收益 -->
            <div class="item">
              <div>{{ _t18(`income`) }}</div>
              <div :class="[_isRFDE(data.earn), 'fw-num numItem ']">
                {{ _toFixed(data.earn, 4) }} USDC
              </div>
            </div>
            <div v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">

              <!--保证金 1 -->
              <div class="item">
                <div>{{ _t18(`cash_deposit`) }}</div>
                <div class="fw-num numItem">
                  {{ data.amount }} USDC
                </div>
              </div>
              <!--开仓手续费 -->
              <div class="item">
                <div>{{ _t18(`Opening-fees`) }}</div>
                <div class="fw-num numItem">
                  {{ data.openFee || 0 }} USDC
                </div>
              </div>
              <!--平仓手续费 -->
              <div class="item">
                <div>{{ _t18(`Closing-fees`) }}</div>
                <div class="fw-num numItem">
                  {{ data.sellFee || 0 }} USDC
                </div>
              </div>
              <!--杠杆倍数 -->
              <div class="item">
                <div>{{ _t18(`Leverage-ratio`) }}</div>
                <div class="fw-num numItem">
                  {{ data.leverage }}
                </div>
              </div>

            </div>
            <!-- 建仓时间 -->
            <div class="item">
              <div>{{ _t18(`openingTime`) }}</div>
              <div class="fw-num numItem">
                {{ _timeFormat(data.params?.createTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>
            <!-- 平仓时间 -->
            <div class="item">
              <div>{{ _t18(`closingTime`) }}</div>
              <div class="fw-num numItem">
                {{ _timeFormat(data.params?.dealTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>

            <!-- 分享按钮 -->
            <div class="item" v-if="HISTORY_SNIPASTE.includes(_getConfig('_APP_ENV'))">
              <div></div>
              <div class="fw-num numItem">
                <div class="btn" @click="setSharePopupShow.setSharePopupShow(3, data, yieldHisValue(data))">
                  {{ _t18('trade_share') }}
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
import { contractHistoryList, orderList } from '@/api/trade'
import { formatCurrentcurrency, matchText } from '@/utils/filters'
import { _getConfig, _isRFDE, _t18, _timeFormat } from '@/utils/public'
import { inject, ref, watch } from 'vue'
import { HISTORY_SNIPASTE } from '@/config'
import { _div, _mul, _sub, _toFixed } from '@/utils/decimal'
import { useTradeStore } from "@/store/trade";

const tradeStore = useTradeStore()
// 数据列表
const coinInfo = inject('coinInfo')
// 切换眼睛（隐藏其他交易数据）
const showEye = inject('currentEye')
// 分享事件
const setSharePopupShow = inject('setSharePopupShow')

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

// status =1 历史委托
//获取列表
const getOrderList = async () => {
  let data = {
    status: 1,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractHistoryList(data)
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

//处理订单数据 -> 过滤当前币种订单
const filterEyes = () => {
  if (!showEye.value) {
    dataNewList.value = formatCurrentcurrency(dataList.value, coinInfo.value.coin)
  } else {
    dataNewList.value = dataList.value
  }
}
/**
 * 历史收益率  earn / adjustAmount * 100
 */
const yieldHisValue = (item) => {
  var price = null
  if (!item.type) {
    // 开多收益率 =（平仓价格-开仓价格）/ 开仓价格 * 杠杆
    price =
      _mul(
        _mul(
          _div(
            _sub(item.dealPrice, item.openPrice),
            item.openPrice
          ),
          item.leverage
        ),
        100
      )
  } else {
    // 开空收益率 =（开仓价格 - 平仓价格）/ 开仓价格 * 杠杆
    price =
      _mul(
        _mul(
          _div(
            _sub(item.openPrice, item.dealPrice),
            item.openPrice
          ),
          item.leverage
        ),
        100
      )
  }


  return _toFixed(price, 4)
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

  .colorBlue {
    color: var(--ex-font-color9) !important;
  }

  .hisToryList {
    padding: 20px 15px 0;
    border-bottom: 1px solid var(--ex-border-color);

    // border-bottom: 1px solid var(--ex-border-color);
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

        .name2 {
          background: var(--ex-rfd-fall);
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
        padding: 0 5px;
        background: var(--ex-default-background-color);
        border-radius: 4px;
        opacity: 1;
        border: 1px solid var(--ex-border-color4);
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

          .btn {
            line-height: normal;
            font-size: 12px;
            padding: 6px 10px;
            border: 1px solid var(--ex-primary-color);
            border-radius: 5px;
          }
        }

        .numItemRed {
          color: var(--ex-font-color15);
        }
      }
    }
  }

  .bgcBlue {
    background-color: var(--ex-rfd-rise) !important;
  }

  .bgcRed {
    background-color: var(--ex-rfd-fall) !important;
  }
}
</style>
