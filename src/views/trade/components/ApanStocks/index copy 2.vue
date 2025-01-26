<template>

  <div class="QuoteSidebar">
    <!-- 搜索 -->
    <div class="searchInput">
      <van-field autocomplete="off" v-model="searchName" center :placeholder="_t18(`search_currency`)">
        <template #button>
          <van-icon size="20" color="var(--ex-default-font-color)" name="search" @click="onRefresh" />
        </template>
      </van-field>
    </div>

    <!--筛选-->
    <!-- <div class="QuoteFilter">
        <QuoteFilter></QuoteFilter>
      </div> -->

    <!-- 二级分类 -->
    <div class="second-tabs">
      <div class="second-tabs-list">
        <div class="second-tabs-list-item" v-for="(item, index) in headerSecondList" :key="index"
          :class="[currentSecondIndex === index ? 'active' : '']" @click="clicSecondkTab(index)">
          {{ item.type }}
        </div>
      </div>

      <van-popover class="popover" v-model:show="showPopover" placement="bottom-end" :show-arrow="false">
        <div class="popover-content">
          <div class="popover-content-menu" v-for="(item, index) in headerSecondList[currentSecondIndex].market"
            :key="index" @click="handleMarket(item)">
            {{ item }}
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


  </div>
  <van-loading v-if="loading && dataList?.length <= 0"></van-loading>

  <div class="Quote-list" v-if="dataList?.length > 0" :finished="finished">
    <van-list :finished-text="dataList?.length ? _t18(`no_more_data`) : ''" :loading-text="_t18(`loading`)"
      @load="onLoad" v-model:loading="loading">

      <div class="Quote-list-item" v-for="(item, index) in dataList" :key="index" @click="linkTo(item)">
        <div class="Quote-list-left">
          <!-- 股票图标 -->
          <!--            <image-load :filePath="item.logo" class="Quote-list-img"/>-->
          <!-- 股票名称 -->
          <span class="ff-num"> {{ item.symbol }}</span>
        </div>
        <div class="Quote-list-right">
          <div class="fw-bold Quote-list-right-text">
            {{ item.amount }}
          </div>
          <div class="rightBox" :class="[_isStockRFD(item.maRate), 'rfd-sign rfd-bg rightRight fw-num tw']">
            <span>{{ item.maRate }}%</span>
          </div>
          <!--            <van-icon name="star" size="20"-->
          <!--                      :color="item.isCollect === 1?'var(&#45;&#45;ex-active-font-color)':'var(&#45;&#45;ex-passive-font-color)'"/>-->
        </div>
      </div>
    </van-list>
  </div>
</template>

<script setup>
// import QuoteFilter from "@/components/QuoteFilter/index.vue";

import { _isRFD, _t18, _isStockRFD } from '@/utils/public'
import { useRouter, useRoute } from 'vue-router'
import { priceFormat, _toFixed } from '@/utils/decimal'
import { filterKeyCoin } from '@/utils/filters'
import { dispatchCustomEvent } from '@/utils'
import { useStockStore } from '@/store/stock'
import { getStocklistApi } from '@/api/stock'
import { getSettingConfigApi } from '@/api/common'
import { onMounted } from 'vue'
import { useMainStore } from '@/store/index'

const mainStore = useMainStore()
const stockStore = useStockStore()
const $router = useRouter()
const $route = useRoute()


// 显示弹窗
const QuoteSidebarShow = ref(false)
const close = () => {
  QuoteSidebarShow.value = false
}
// 搜索 key
const searchName = ref('')

// 股票分页列表相关
const showPopover = ref(false)
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const dataList = ref([])
const stockType = ref('')
const market = ref('')
const headerSecondList = ref([])
const currentSecondIndex = ref(0)
const refreshing = ref(false)

// 下拉加载
const onRefresh = () => {
  // 清空列表数据
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  refresh();
};

// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getStockList()
}

// 刷新列表
const refresh = () => {
  dataList.value = []
  pageNum.value = 1
  finished.value = false
  onLoad()
}

// 获取列表
const getStockList = async () => {
  let params = `symbol=${searchName.value}&stockType=${stockType.value}&market=${market.value}&pageSize=${pageSize.value}&pageNum=${pageNum.value}`
  const res = await getStocklistApi(params)

  loading.value = false
  refreshing.value = false
  // finished.value = true

  if (res.data?.total == undefined || res.data?.total <= dataList.value.length) {
    return (finished.value = true)
  }

  if (res.code == 200) {
    dataList.value = [...dataList.value, ...res.data.rows]
    pageNum.value++
  }
}

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

// 打开侧边栏并查询数据
const setQuoteSidebarData = (n) => {
  QuoteSidebarShow.value = true
}

defineExpose({ setQuoteSidebarData })

//筛选返回数据
const setCurrentList = (val) => {
  dataList.value = val
}
provide('currentList', dataList)
provide('setCurrentList', setCurrentList)

// 选择币种
const linkTo = async (item) => {
  // if ($route.query.item) {
  //   delete $route.query.item
  // }
  stockStore.setStockInfo(item)
  // $router.replace({
  //   query: { ...$route.query, symbol: item.symbol }
  // })
  $router.push(`/stockDetail?symbol=${item.symbol}&type=9`)
}
onMounted(() => {
  getSecondTabs()

  getStockList()
})
</script>

<style scoped lang="scss">
:deep(.van-popup) {
  left: 0;
  top: 0;
  bottom: 0;
}

.QuoteSidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;

  :deep(.searchInput) {
    height: 50px;
    padding: 0 16px;
    margin: 10px 0;

    .van-cell {
      height: 50px;
      border-radius: 8px;
      border: 2px solid var(--ex--backup-background-color-2);
      
    }
  }

  .QuoteFilter {
    padding: 10px 16px;
  }

  .second-tabs {
    display: flex;
    align-content: center;
    justify-content: space-between;
    border-bottom: 1px solid #272c3c;
    padding: 10px 16px 0 16px;

    // margin-bottom: 16px;
    &-list {
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


}

.Quote-list {
  padding: 0 16px;
  overflow: auto;
  height: 72vh;

  .Quote-list-item {
    display: flex;
    justify-content: space-between;
    padding: 14px 0;
    border-radius: 10px;

    .Quote-list-left {
      display: flex;
      align-items: center;

      .Quote-list-img {
        width: 34px;
        height: 34px;
        margin-right: 8px;
      }

      span {
        font-size: 15px;
      }
    }

    .Quote-list-right {
      display: flex;
      align-items: center;

      .Quote-list-right-text {
        font-size: 14px;
      }

      .rightBox {
        font-size: 14px;
        border-radius: 5px;
        padding: 7.2px 8px;
        min-width: 68px;
        //min-height: 30px;
        line-height: normal;
        text-align: center;
        margin-left: 30px;
      }

      .tw {
        min-width: 108px;
      }
    }
  }
}
</style>
