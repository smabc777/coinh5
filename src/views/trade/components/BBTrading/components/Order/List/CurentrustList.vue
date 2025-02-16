<template>
  <div class="content">
    <van-loading v-if="loading"></van-loading>
    <van-list
        v-if="dataNewList?.length > 0"
        :finished="finished"
        :finished-text="dataNewList?.length ? _t18(`no_more_data`):''"
        :loading-text="_t18(`loading`)"
        @load="onLoad"
        :immediate-check="false"
        v-model:loading="loading"
    >
      <van-cell v-for="(data, index) in dataNewList" :key="index">

        <div class="hisToryList">
          <p>{{ data.index }}</p>
          <div class="header">
            <div class="headerLeft">
              <!-- 买 -->
              <div class="name" v-if="data.type == 0">{{ _t18(`buy`) }}</div>
              <!-- 卖 -->
              <div class="name name2" v-if="data.type == 1">{{ _t18(`sell`) }}</div>
              <div class="fw-bold">
                {{
                  data.showCoin
                      ? data.showCoin
                      : data.symbol?.toUpperCase() + '/' + data.coin?.toUpperCase()
                }}
              </div>
            </div>
            <!-- 撤单 -->
            <div class="headerRight" @click="cancelOrder(data)">
              {{ _t18(`bb_Cancellation`) }}
            </div>
          </div>
          <div class="list">
            <!-- 时间 -->
            <div class="item">
              <div>{{ _t18(`k_time`) }}</div>
              <div class="fw-num numItem" v-if="data.delegateTime">
                {{ _timeFormat(data.params?.delegateTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>
            <!-- 委托价 -->
            <div class="item">
              <div>{{ _t18(`bb_commission_price`) }}</div>
              <div class="fw-num numItem">{{ data.delegatePrice || 0 }}</div>
            </div>
            <!-- 委托量 -->
            <div class="item" v-if="!['rxce'].includes(_getConfig('_APP_ENV'))">
              <div>{{ _t18(`bb_commission_amount`) }}</div>
              <div class="fw-num numItem">{{ data.delegateTotal || 0 }}</div>
            </div>
            <!-- 数量 -->
            <div class="item">
              <div>{{ _t18(`metastaking_bb_count`) }}</div>
              <div class="fw-num numItem">{{ data.dealNum || 0 }}</div>
            </div>
            <!-- 成交价 ,rxce:最新价 -->
            <div class="item" v-if="['rxce'].includes(_getConfig('_APP_ENV')) && data.type === 0">
              <div>{{ _t18(`home_newPrice`) }}</div>
              <div class="fw-num numItem">{{ newPrice || 0 }}</div>
            </div>
            <div class="item" v-else>
              <div>{{ _t18(`home_turnover`) }}</div>
              <div class="fw-num numItem">{{ data.dealPrice || 0 }}</div>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
    <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>
  </div>
</template>
<script setup>

import {cancelOrderCurrencyApi, getOrderListCurrencyApi} from "@/api/trade";
import {formatCurrentcurrency} from "@/utils/filters";
import {_t18, _timeFormat} from "@/utils/public";
import {useTradeStore} from "@/store/trade";
import {inject} from "vue";
import {showToast} from "vant";

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

// status =  0 当前委托
//获取列表
const getOrderList = async () => {
  let params = `isAsc=desc&orderByColumn=updateTime&status=0&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getOrderListCurrencyApi(params)
  loading.value = false
  // finished.value = true

  if (res?.total == undefined || res?.total <= dataList.value.length) {
    return finished.value = true
  }

  if (res.code == 200) {
    dataList.value = [...dataList.value, ...res.rows]
    pageNum.value++
  }

  filterEyes()
}

// 撤单
const cancelOrder = async (item) => {
  const res = await cancelOrderCurrencyApi(item.id)
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
  // 更新tab角标数量
  getOrderListNumber()
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
