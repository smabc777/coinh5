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

            <!-- 时间 -->
            <div class="item">
              <div>{{ _t18(`k_time`,['moonex']) }}</div>
              <div class="fw-num numItem">{{ item.type }}s</div>
            </div>

            <!-- 收盘时间 -->
            <div class="item">
              <div>{{ _t18(`exchange.finashTime`,['moonex']) }}</div>
              <div class="fw-num numItem">
                <!-- {{ _timeFormat(item.params?.closeTime, 'DD/MM/YYYY HH:mm:ss', true) }} -->
                {{ _timeFormat(item.closeTime, 'DD/MM/YYYY HH:mm:ss', true) }}
              </div>
            </div>


            <!-- 收盘价 -->
            <div class="item">
              <div>{{ _t18(`exchange.close`,['moonex']) }}</div>
              <div class="fw-num numItem">
                {{ item.closePrice }}
                {{ item.baseSymbol ? item.baseSymbol.toUpperCase() : '' }}
              </div>
            </div>

            <!-- 盈亏 -->
            <div class="item">
              <div>{{ _t18(`option_profit_loss_1`,['moonex']) }}</div>
              <div
                  class="fw-num numItem"
                  :class="profitAndlossColor(item.betAmount, item.rewardAmount)"
              >
                {{ profitAndloss(item.betAmount, item.rewardAmount) }}
                {{ item.baseSymbol ? item.baseSymbol.toUpperCase() : '' }}
              </div>
            </div>

            <!-- 分享 -->
            <div class="item" v-if="HISTORY_SNIPASTE.includes(_getConfig('_APP_ENV'))">
              <div></div>
              <div class="fw-num numItem">
                <p class="share-button" @click="setSharePopupShow.setSharePopupShow(1,item)">{{
                    _t18(`trade_share`)
                  }}</p>
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
import {
  formatCurrentcurrency,
  profitAndloss,
  profitAndlossColor
} from "@/utils/filters";
import {HISTORY_SNIPASTE} from "@/config";
import {_getConfig, _t18, _timeFormat} from "@/utils/public";
import {computed, inject, ref, watch} from "vue"
import {_div, _mul, _toFixed} from "@/utils/decimal";
import {useTradeStore} from "@/store/trade";


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

// status = 1 历史委托
//获取列表
const getOrderList = async () => {
  const res = await secondContractOrderselectOrderList({status: 1})
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
  console.log(dataNewList.value)
}

const tradeStore = useTradeStore()



// 打开分享
const setSharePopupShow = inject('setSharePopupShow')

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
        }
      }
    }

    .share-button {
      line-height: normal;
      color: var(--ex-default-font-color);
      border: 1px solid var(--ex-active-font-color);
      border-radius: 4px;
      padding: 6px 10px;
    }
  }

  .hightUp {
    color: var(--ex-font-color2) !important;
  }

  .hightDown {
    color: var(--ex-font-color10) !important;
  }

}


</style>
