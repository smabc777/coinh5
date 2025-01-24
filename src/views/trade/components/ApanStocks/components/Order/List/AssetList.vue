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
      <van-cell v-for="(data, index) in dataNewList" :key="index">
        <div class="hisToryList">
          <p>{{ data.index }}</p>
          <div class="header">
            <div class="headerLeft">
              <div class="name name2">
                <img :src="data.logo" alt="">
              </div>
              <div class="fw-bold">
                {{ data.symbol?.toUpperCase() }}
              </div>
            </div>
          </div>
          <div class="list">
            <!-- 时间 -->
            <div class="item">
              <div>{{ _t18(`k_time`) }}</div>
              <div class="fw-num numItem" v-if="data.tranTime">
                {{ _timeFormat(data.params?.tranTime, 'HH:mm MM/DD', true) }}
              </div>
            </div>
            <!-- 数量 -->
            <div class="item">
              <div>数量</div>
              <div class="fw-num numItem">{{ data.dealNum || 0 }}</div>
            </div>
            <!-- 可用数量 -->
            <div class="item">
              <div>可用数量</div>
              <div class="fw-num numItem">{{ data.enableNum || 0 }}</div>
            </div>
            <!-- 冻结金额 -->
            <div class="item">
              <div>冻结金额</div>
              <div class="fw-num numItem">{{ data.freezeAmt || 0 }}</div>
            </div>
            <!-- 买入均价 -->
            <div class="item">
              <div>买入均价</div>
              <div class="fw-num numItem">{{ data.avgAmt || 0 }}</div>
            </div>
            <!-- 股票市场 -->
            <div class="item">
              <div>股票市场</div>
              <div class="fw-num numItem">{{ data.market || 0 }}</div>
            </div>
            <!-- 收益(收益率) -->
            <div class="item">
              <div>收益(收益率)</div>
              <div class="fw-num numItem"><span>{{ data.profitAndLoss }}</span>（<span>{{ data.profitAndLossRate }}</span>）</div>
            </div>

          </div>
        </div>
      </van-cell>
    </van-list>
    <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>
  </div>
</template>
<script setup>
import { getStockAssetlistApi } from '@/api/stock'
import { formatCurrentcurrency, profitAndloss, profitAndlossColor } from '@/utils/filters'
import { HISTORY_SNIPASTE } from '@/config'
import { _t18, _timeFormat } from '@/utils/public'
import { inject, ref, watch } from 'vue'

// 数据列表
const stockInfo = inject('stockInfo')
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

// status =1 历史委托
//获取列表
const getOrderList = async () => {
  let params = `symbol=${stockInfo.value.symbol}&market=JPXA&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStockAssetlistApi(params)
  loading.value = false

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
    dataNewList.value = formatCurrentcurrency(dataList.value, stockInfo.value.coin)
  } else {
    dataNewList.value = dataList.value
  }
}

// 分享
// const shareRevenue = inject('shareRevenue')
// const sharedImg = (model) => {
//   shareRevenue(model)
// }

defineExpose({
  refresh,
  filterEyes
})
</script>
<style scoped lang="scss">
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
          img {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
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
        span {
          color: var(--ex-financial-adorn-bg-color);
        }
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
