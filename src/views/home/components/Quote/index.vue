<template>
  <!--  行情  -->
  <div class="Quote">
    <van-tabs class="tabs" v-model:active="active" line-width="0" :ellipsis="false" swipeable animated>
      <van-tab v-for="(item, index) in headerList" :key="index">
        <template #title>
          <div class="tab-item" v-if="item.show" :class="{ atv: index == active }"
            @click="topScrollIntoView(item, index)">
            {{ item.name }}
          </div>
        </template>

        <template #default v-if="showSecondTabs">
          <!-- 二级分类 -->
          <div class="second-tabs" v-if="headerSecondList.length > 1">
            <div class="second-tabs-list">
              <div class="second-tabs-list-item" v-for="(item1, index1) in headerSecondList" :key="index1"
                :class="[currentSecondIndex === index1 ? 'active' : '']" @click="clicSecondkTab(index1)">
                {{ item1.type }}
              </div>
            </div>

            <van-popover class="popover" v-if="index === activeTabIndex" v-model:show="showPopover"
              placement="bottom-end" :show-arrow="false" :key="index">
              <div class="popover-content">
                <div class="popover-content-menu" v-for="(item2, index2) in headerSecondList[currentSecondIndex].market"
                  :key="index2" @click="handleMarket(item2)">
                  {{ item2 }}
                </div>
              </div>
              <template #reference>
                <div class="all-btn">
                  <span>ALL</span>
                  <van-icon name="play" color="#7833f6" />
                </div>
              </template>
            </van-popover>
          </div>

          <div class="Quote-list">
            <!-- 股票列表 -->
            <van-loading v-if="loading && dataList?.length <= 0"></van-loading>
           
              <div class="Quote-list-item" v-for="(item2, index) in dataList" :key="index"
                @click="linkTo(item2, item, index)">
                <div class="Quote-list-left">
                  <!-- 币图标 -->
                  <!-- <image-load :filePath="item.logo" class="Quote-list-img" /> -->
                  <!-- 币名称 -->
                  <span class="ff-num"> {{ item2.symbol }}</span>
                </div>
                <div class="Quote-list-right">
                  <div class="fw-bold Quote-list-right-text">
                    {{ _toFixed(item2.amount || 0, 2) }}
                  </div>
                  <div class="rightBox" :class="[_isStockRFD(item2.maRate), 'rfd-sign rfd-bg rightRight fw-num']">
                    <span>{{_toFixed(item2.maRate,2) }}%</span>
                  </div>
                </div>
              </div>
          </div>
        </template>

        <template v-if="!showSecondTabs">
          <div class="Quote-list">
            <div class="Quote-list-item" v-for="(item2, index2) in currentCoinList[index].currentCoinList" :key="index2"
              @click="linkTo(item2, item, index)">
              <div class="Quote-list-left">
                <!-- 币图标 -->
                <image-load v-if="item2.logo" :filePath="item2.logo" class="Quote-list-img" />
                <!-- 币名称 -->
                <span class="ff-num"> {{ item2.showSymbol }}</span>
              </div>

              <div class="Quote-list-right">
                <div class="fw-bold Quote-list-right-text">
                  {{ priceFormat(tradeStore.allCoinPriceInfo[item2.coin]?.close) }}
                </div>
                <div class="rightBox" :class="[
      _isRFD(
        tradeStore.allCoinPriceInfo[item2.coin]?.openPrice,
        tradeStore.allCoinPriceInfo[item2.coin]?.close
      ),
      'rfd-sign rfd-bg rightRight fw-num'
    ]">
                  <span>{{ tradeStore.allCoinPriceInfo[item2.coin]?.priceChangePercent }}%</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { _getConfig, _isRFD, _t18, _isStockRFD } from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { priceFormat, _toFixed } from '@/utils/decimal'
import { useToast } from '@/hook/useToast'

import { getStocklistApi } from '@/api/stock'
import { getSettingConfigApi } from '@/api/common'
import { computed,toRaw } from 'vue'
import { template } from 'lodash'

import { useStockStore } from '@/store/stock'

import { useMainStore } from '@/store/index'



const mainStore = useMainStore()
const props = defineProps({
  shoutime: {
    type: Boolean,
    default: false
  }
})
const stockStore = useStockStore()

const tradeStore = useTradeStore()
const router = useRouter()
const { _showName } = useToast()

// console.log(tradeStore.allCoinPriceInfo, 'dddddddddddddddd')

// 股票分页列表相关
const activeTabIndex = ref(0)

const showPopover = ref(false)
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(20)
const pageNum = ref(1)
const dataList = ref([])
const stockType = ref('')
const market = ref('')

// 上拉加载分页
// const onLoad = () => {
//   loading.value = true
//   getStockList()
// }
onMounted(async () => {
  await getSecondTabs()
  await getStockList()
})
// 刷新列表
const refresh = async() => {
  dataList.value = []
  pageNum.value = 1
  finished.value = false
  await getStockList()
}

// 获取列表
const getStockList = async () => {
  loading.value = true

  let params = `stockType=${stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)

  loading.value = false
  // finished.value = true

  if (res?.data?.total == undefined || res?.data?.total <= dataList?.value.length) {
    return (finished.value = true)
  }

  if (res?.code == 200) {
    stockStore.setStockInfo(res?.data?.rows[0])
    dataList.value = [...res?.data?.rows]
    pageNum.value++
  }
}

const loadStockList = async () => {
  let params = `stockType=${stockType.value}&market=${market.value}&pageSize=${dataList.value.length || 10}&pageNum=${1}`
  const res = await getStocklistApi(params)
  dataList.value = res.data?.rows
  if (!props.shoutime) {
    return // 停止递归调用
  }
  // 动态计算下一次执行的延迟
  const delay = 5000 // 延迟时间
  // 在函数内部调用setTimeout来实现递归调用
  setTimeout(loadStockList, delay)
}




// tabs数据
const active = ref(0)
const headerList = computed(() => {
  let arr = [
    {
      name: _showName(`coinbase_h_l_hot`), //热门币种
      show: true, //是否显示
      coinType: [2, 5], //当前分类
      sort: 1,
      currentCoinList: [],
      isShowSecondTab: false
    },
    {
      // name: _showName(`Popular-stocks`), //热门股票
      name: _showName(`stock104`), //热门股票

      
      show: true, //是否显示
      coinType: [6], //当前分类
      sort: 2,
      currentCoinList: [],
      isShowSecondTab: true
    },
    {
      name: _showName(`coinbase_h_l_out`), //外汇币种
      show: ['vitc'].includes(__config._APP_ENV) ? false : true,
      coinType: [1],
      sort: 3,
      currentCoinList: [],
      isShowSecondTab: false
    },
    {
      name: _showName(`coinbase_h_l_gold`), //国际黄金
      show: ['vitc'].includes(__config._APP_ENV) ? false : true,
      coinType: [3],
      sort: ['jphskt'].includes(__config._APP_ENV) ? 1 : 3,
      currentCoinList: [],
      isShowSecondTab: false
    }
  ].sort((a, b) => a.sort - b.sort)

  return arr.filter((item) => item.show)
})

const currentSecondIndex = ref(0)
const headerSecondList = ref([])

const showSecondTabs = ref(false)

// 点击市场
const handleMarket = (item) => {
  market.value = item
  showPopover.value = false
  refresh()
}

// 切换二级分类
const clicSecondkTab = (e) => {
  currentSecondIndex.value = e
  stockType.value = headerSecondList.value[e].type
  // market.value = headerSecondList.value[e].market[0]
  market.value = ''
  refresh()
}
const emit = defineEmits(['closingPosition'])

const topScrollIntoView = async (row, index, active) => {
  if (active) return active.value = active
  activeTabIndex.value = index
  showSecondTabs.value = row.isShowSecondTab
  if (showSecondTabs.value) {
    // 获取分类
    await getSecondTabs()
  }
  if (row.sort != 2) {
    emit('closingPosition', false)
    currentSecondIndex.value = 0
    market.value = ''
  } else {
    emit('closingPosition', true)
    console.log(props.shoutime, 'mmm');

    await loadStockList()
  }



  // 返回顶部
  // document.getElementsByClassName('Quote')[0].scrollIntoView()
}

// 获取二级分类
const getSecondTabs = () => {
  const tabsList = mainStore.getstockenable
  // 设置默认值
  stockType.value = mainStore.getstockenable[0].type
  headerSecondList.value = []
  tabsList.forEach((item) => {
    headerSecondList.value.push({
      type: item.type,
      market: item.market.split(',')
    })
  })
  // market.value = headerSecondList.value[0].market[0]
  refresh()
}

// 行情列表数据
const currentCoinList = computed(() => {
  /**
   * 热门
   * it.coinType == 2 || it.coinType == 5
   * 外汇
   * it.coinType == 1
   * 黄金
   * it.coinType == 3
   * */
  const list = [...headerList.value]

  //秒合约列表
  tradeStore.secondContractCoinList.forEach((it, inx) => {
    list.forEach((item) => {
      if (item.coinType?.includes(it.coinType)) {
        item.currentCoinList.push(it)
      }
    })
  })

  // 股票列表
  list[1].currentCoinList = tradeStore.stockList

  //外汇
  list[2].currentCoinList = toRaw(tradeStore.foreignExchangeList)
  // 贵金属
  list[3].currentCoinList = toRaw(tradeStore.preciousMetalsList)

  return list
})

//跳转
const linkTo = (item, item2, index) => {
  if (item2.coinType[0] == 6) {
    stockStore.setStockInfo(item)
    // router.push(`/stockDetail?symbol=${item.symbol}&type=9`)
    router.push(`/trade?tradeKey=ApanStocks`)
    return
  }
  if (item2.coinType[0] == 1 || item2.coinType[0] == 3) {
    router.push(`/trade?tradeKey=Ustandard&symbol=${item.coin}`)
    return
  }
  // 热门币种点击优先跳转到U本位合约

    router.push(`/trade?tradeKey=SecondContract&symbol=${item.coin}`)
    return

  // router.push(`/trade?tradeKey=BBTrading&symbol=${item.coin}`)
}
</script>

<style scoped lang="scss">
.Quote {
  padding: 0 16px;
  margin-top: 24px;

  .second-tabs {
    display: flex;
    align-content: center;
    justify-content: space-between;
    border-bottom: 1px solid #272c3c;
    margin-top: 20px;

    &-list {
      width: 70%;
      display: flex;

      &-item {
        display: flex;
        flex-direction: column;
        color: #7a7a7a;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        margin-right: 30px;

        &:last-child {
          margin-right: 0;
        }

        &::after {
          content: '';
          width: 100%;
          height: 3px;
          border-radius: 10px;
          margin-top: 8px;
        }
      }

      .active {
        font-size: 16px;
        color: #7833f6;

        &::after {
          background-color: #7833f6;
        }
      }
    }

    .all-btn {
      font-size: 16px;
      line-height: 22px;
      color: #7833f6;

      .van-icon {
        transform: rotate(90deg);
      }
    }
  }

  :deep(.van-tabs) {
    // overflow: hidden;

    .van-tabs__nav {
      border-radius: 10px;
      padding: 0;
      background: var(--ex-home-tabs-bg-color);
    }

    .tab-item {
      padding: 10px 0;
      width: 100%;
      font-size: 14px;
      color: var(--ex-home-tabs-text-color);

      &.atv {
        font-size: 15px;
        color: var(--ex-home-tabs-text-atv-color);
      }
    }

    .van-tab--active {
      background: var(--ex-home-tabs-bg-atv-color);
      color: var(--ex-home-tabs-text-atv-color);
      border-radius: 10px;
    }

    .Quote-list {
      padding-top: 6px;

      .Quote-list-item {
        display: flex;
        justify-content: space-between;
        padding: 16px 14px;
        background: var(--ex-home-tabs-bg-color);
        margin: 10px 0;

        border-radius: 10px;

        .Quote-list-left {
          display: flex;
          align-items: center;

          .Quote-list-img {
            width: 34px;
            height: 34px;
            margin-right: 8px;
            //border-radius: 10px;
          }

          span {
            font-size: 15px;
          }
        }

        .Quote-list-right {
          line-height: normal;
          display: flex;
          align-items: center;

          .Quote-list-right-text {
            font-size: 14px;
            margin-right: 30px;
          }

          .rightBox {
            font-size: 14px;
            line-height: normal;
            border-radius: 5px;
            padding: 7.2px 10px;
            min-width: 68px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>

<style>
.van-loading {
  text-align: center;
  margin-top: 10px;
}

.popover-content {
  background-color: #252a4d;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.popover-content-menu {
  padding: 12px 24px;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  border-bottom: 1px solid #4d527f;
}

.popover-content-menu:last-of-type {
  border-bottom: none;
}

.w {
  min-width: 98px !important;

}
</style>
