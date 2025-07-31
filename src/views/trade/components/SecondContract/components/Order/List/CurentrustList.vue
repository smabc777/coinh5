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
        <div class="historyItem">
          <!-- tag看涨/看跌 -->
          <div class="header">
            <div class="name" :class="Number(item.betContent) ? '' : 'hightOther'">
              {{
                Number(item.betContent)
                    ? _t18(`option_buy_up`,['moonex'])
                    : _t18(`option_buy_short`,['moonex'])
              }}
            </div>
            <div class="fw-num">
              {{ _timeFormat(item.params?.createTime, 'DD/MM/YYYY HH:mm', true) }}
            </div>
          </div>
          <div class="list">
            <div class="item">
              <div>
                {{
                  item.showCoin
                      ? item.showCoin
                      : item.coinSymbol.toUpperCase() + '/' + item.baseSymbol.toUpperCase()
                }}
              </div>
              <div class="fw-num numItem">{{ item.openPrice }}</div>
            </div>
            <!-- 数量 -->
            <div class="item">
              <div>{{ _t18(`metastaking_bb_count`,['moonex']) }}</div>
              <div class="fw-num numItem">{{ item.betAmount }}</div>
            </div>
            <!-- 当前价 -->
            <div class="item">
              <div>{{ _t18(`option_now_price`,['moonex']) }}</div>
              <div class="fw-num numItem">
                {{ tradeStore.allCoinPriceInfo[item.coinSymbol].close }}
              
                {{  item.baseSymbol == 'usdt' ? 'USDC' : item.baseSymbol.toUpperCase() }}
              </div>
            </div>

            <!-- 时间 -->
            <div class="item">
              <div>{{ _t18(`k_time`,['moonex']) }}</div>
              <div class="fw-num numItem">{{ item.type }}s</div>
            </div>

            <!-- 盈亏 -->
            <div class="item">
              <div>{{ _t18(`option_profit_loss_1`,['moonex']) }}</div>
              <div
                  class="fw-num numItem"
                  :class="
                  formatExpectedProfitColor(
                   Number(item.betContent),
                    item.openPrice,
                    tradeStore.allCoinPriceInfo[item.coinSymbol].close
                  )
                "
              >
                {{
                  formatExpectedProfit(
                      Number(item.betContent),
                      item.openPrice,
                      tradeStore.allCoinPriceInfo[item.coinSymbol].close,
                      item.betAmount,
                      item.rate,
                      true
                  )
                }}

                {{  item.baseSymbol == 'usdt' ? 'USDC' : item.baseSymbol.toUpperCase() }}
              </div>
            </div>

            <!-- 倒计时 -->
            <div class="item">
              <div>{{ _t18(`option_countdown`) }}</div>
              <div class="fw-num numItem">
                <!--                {{ formatTime(countdown) }}-->
                <van-count-down :time="toCountdown(item)" @finish="onFinish(item)"/>
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


import {secondContractOrderselectOrderList} from "@/api/trade";
import {formatCurrentcurrency, formatExpectedProfit, formatExpectedProfitColor, formatTime} from "@/utils/filters";
import {_t18, _timeFormat} from "@/utils/public";
import {useTradeStore} from "@/store/trade";
import {inject} from "vue";

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
const refresh = () => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  finished.value = false
  onLoad()
}

// status = 0 当前委托
//获取列表
const getOrderList = async () => {

  const res = await secondContractOrderselectOrderList({status: 0})
  loading.value = false
  finished.value = true

  // if (res?.total == undefined || res?.total <= dataList.value.length) {
  //   return finished.value = true
  // }

  if (res.code == 200) {
    dataList.value = [...dataList.value, ...res.data]
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

//倒计时结束
const getOrderListNumber = inject('getOrderListNumber')
const onFinish = (item) => {
  // 删除当前订单
  dataNewList.value.forEach((items, index) => {
    if (item.id == items.id) {
      dataNewList.value.splice(index, 1)
    }
  })
  // 更新tab角标数量
  getOrderListNumber()
}

// 当前订单倒计时
const toCountdown = (item) => {
  let time = item.time > 0 ? item.time : 0
  if (time <= 0) {
    onFinish(item)
  }
  return (time * 1000 || 0)
}

defineExpose({
  refresh,
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

  .historyItem {
    padding: 20px 15px 0;
    border-bottom: 1px solid var(--ex-border-color);

    .colorBlue {
      color: var(--ex-font-color2) !important;
    }

    .header {
      padding-bottom: 20px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      align-items: center;

      .name {
        padding: 5px;
        font-size: 12px;
        background: var(--ex-div-bgColor1);
        border-radius: 4px;
        margin-right: 10px;
        color: var(--ex-font-color);
      }

      .hightOther {
        background: var(--ex-div-bgColor16);
      }
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--ex-passive-font-color);
        padding-bottom: 20px;

        .numItem {
          color: var(--ex-default-font-color);

          :deep(.van-count-down) {
            color: var(--ex-default-font-color);
          }
        }
      }
    }
  }
}

</style>
