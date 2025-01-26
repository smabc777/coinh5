<template>
  <div class="account-content">
    <!-- 账户余额 -->
    <StockAmount @onClickTab=onClickTab @getaccountStatisticslist="getaccountStatisticslist" :accountlist="accountlist"
      :tabActive="tabActive" :lengthsk="stockList.length" :amount="showNum ? amountSum : _hide(amountSum)"
      :amountProfit="showNum ? amountProfitSum : _hide(amountProfitSum)"
      :amountNowProfitSum="showNum ? amountNowProfitSum : _hide(amountNowProfitSum)" @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin" :type="type" :keyStr="keyStr" :showicon="showNum ? 'yanjin-k' : 'yanjin-g'">
    </StockAmount>
    <!-- 平台 -->
    <!-- <Detail :assetDetails="assetDetails" :showNum="showNum"></Detail> -->

    <div class="my-stock">
      <!-- <div class="title">
        <div class="left fw-bold">{{ _t18('股票持仓') }}</div>

      </div> -->

      <van-tabs shrink line-width="0" :ellipsis="false" swipeable animated v-model:active="tabActive"
        @click-tab="onClickTab">
        <van-tab v-for="(item, index) in tabList" :key="index" :name="item.id">
          <template #title>
            <div class="tab-item" :class="{ atv: item.id == tabActive }">
              {{ item.name }}
            </div>
          </template>
        </van-tab>
      </van-tabs>
      <van-list :finished="finished"
        :finished-text="tabActive == 0 && stockList?.length ? _t18(`no_more_data`) : '' || tabActive == 1 && stockListhis?.length ? _t18(`no_more_data`) : ''"
        :loading-text="_t18(`loading`)" @load="onLoad()" :immediate-check="false" v-model:loading="loading">
        <div class="list" v-if="stockList.length > 0 && tabActive == 0">
          <InProgress :id="tabActive" @closingPosition="closingPositionFn" v-for="(item, index) in stockList"
            :key="index" :stockList="item">
          </InProgress>
        </div>
        <div class="list" v-if="stockListhis.length > 0 && tabActive == 1">
          <InProgresshis :id="tabActive" @closingPosition="closingPositionFn" v-for="(item, index) in stockListhis"
            :key="index" :stockList="item">
          </InProgresshis>
        </div>
      </van-list>
      <!-- <div class="list" v-else>
        <historicalPositions @closingPosition="closingPositionFn" v-for="(item, index) in 9" :key="index"
          :stockList="item">
        </historicalPositions>
      </div> -->

      <Nodata v-if="stockList.length == 0 && loading == false && tabActive == 0">
      </Nodata>
      <Nodata v-if="stockListhis.length == 0 && loading == false && tabActive == 1">
      </Nodata>
    </div>





  </div>
</template>

<script setup>
import { priceFormat } from '@/utils/decimal.js'
import { _hide } from '@/utils/public.js'
import StockAmount from './StockAmonut.vue'
import Detail from './AmountDetail.vue'
import InProgress from './InProgress.vue'
import InProgresshis from './InProgresshis.vue'

import { userPositionPage, stockSell } from '@/api/subscription/index'
import { _t18, _getConfig, _timeFormat } from '@/utils/public'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { getaccountStatistics } from "@/api/trade"

import { useToast } from '@/hook/useToast'
const { _toast, _showName } = useToast()

const route = useRoute()
const props = defineProps({
  assetDetails: {
    type: Object
  },
  amountSum: {
    type: String
  },
  showNum: {
    type: Boolean
  },
  type: {
    type: String
  },
  keyStr: {
    type: String
  }
})

// 计算持仓市值
const amountProfitSum = computed(() => {
  let sum = undefined
  // for (let i = 0; i < props.assetDetails.length; i++) {
  //   sum += Number(props.assetDetails[i].chicang)
  // }
  if (props.assetDetails[0]?.chicang) {
    sum = props.assetDetails[0]?.chicang
  }

  return sum
})

// 计算目前利润
const amountNowProfitSum = computed(() => {
  let sum = 0
  for (let i = 0; i < props.assetDetails.length; i++) {
    sum += Number(props.assetDetails[i].lirun)
  }
  return priceFormat(sum)
})

// 持仓状态切换
const tabActive = ref(0);

const onClickTab = (title, account) => {

  if (title == 3) {
    tabActive.value = params.value.state
    params.value.state = params.value.state
  } else {
    tabActive.value = title == 0 || title == 1 ? title : title.name
    params.value.state = title == 0 || title == 1 ? title : title.name
  }
  params.value.stockType = account || params.value.stockType
  if (tabActive.value == 0) {
    stockList.value = []

  } else {
    stockListhis.value = []

  }
  params.value.pageNo = 1
  finished.value = false


  getStockListInfo()



};
const tabList = computed(() => {
  return [
    {
      name: _showName('stock34'),
      id: 0
    },
    {
      name: _showName('stock35'),
      id: 1
    }
  ]
})

// 点击小眼睛
const emit = defineEmits(['handleYanjin', 'handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}
// 分页加载
const loading = ref(false)
const finished = ref(false)
const enableAmt = ref(0)
// 获取持仓列表
let stockList = ref([])
let stockListhis = ref([])

const shoutime = ref(true) // 控制递归定时器是否继续的标志

const params = ref({
  pageNo: 1,
  pageSize: 10,
  currencyType: 'USDT',
  state: 0,
  stockType: ''
})
// 上拉加载分页
const onLoad = () => {
  getStockListInfo()
}
const getStockListInfo = async (type) => {

  params.value.stockType = params.value.stockType || 'US'
  loading.value = true



  if (tabActive.value == 0) {
    const res = await userPositionPage(params.value)

    if (res.data.total <= 0) {
      stockList.value = []
      loading.value = false
      finished.value = true
      return
    }
    stockList.value.push(...res.data.list)
    params.value.pageNo++

    loading.value = false // 加载状态结束
    if (stockList.value.length >= res.data.total || res.data.list.length == 0) {
      finished.value = true // 结束加载状态
    }
    loading.value = false // 加载状态结束
  } else {
    const res = await userPositionPage(params.value)

    if (res.data.total <= 0) {
      stockListhis.value = []
      loading.value = false
      finished.value = true
      return
    }
    stockListhis.value.push(...res.data.list)
    params.value.pageNo++

    loading.value = false // 加载状态结束
    if (stockListhis.value.length >= res.data.total || res.data.list.length == 0) {
      finished.value = true // 结束加载状态
    }
    loading.value = false // 加载状态结束
  }

}

// 去平仓
async function closingPositionFn(item) {
  let params = {
    positionSn: item.positionSn
  }
  const data = await stockSell(params, { loading: true })

  if (data.code == 200) {
    _toast('successfully_closed')
    stockList.value = []
    onClickTab(1)
    // changeTabs()
    getaccountStatisticslist(item.stockType)
  } else {
    _toast(data.msg)
  }
}


const accountlist = ref({})
const getaccountStatisticslist = async (account) => {
  let obj = {
    stockType: account || 'US'
  }
  const res = await getaccountStatistics(obj)
  if (res?.code == 200) {
    accountlist.value = res?.data[0]
  }
}
defineExpose({
  onClickTab,
  getaccountStatisticslist
});


onMounted(() => {
  // getaccountStatisticslist()
})
</script>

<style lang="scss" scoped>
.account-content {
  min-height: calc(100vh - 70px);
  overflow: auto;
  display: flex;
  flex-direction: column;

  .account-list {
    flex-grow: 1;
    padding-bottom: 70px;
    background: var(--ex-financial-card-bg-color);
  }
}

.list {
  padding: 15px 4px;
}

.my-stock {
  margin: 20px 0;

  background: var(--ex-backup--background-color);

  :deep(.van-tabs) {
    overflow: hidden;
    padding: 15px 0 16px;
    background: var(--ex-default-background-color);
  }

  :deep(.van-tabs__nav) {
    width: 80% !important;
    margin: auto;
  }


  .title {
    display: flex;
    justify-content: center;


    .left {
      color: var(--ex-font-color6);
      font-size: 18px;
      font-weight: 400;
    }
  }
}
</style>
