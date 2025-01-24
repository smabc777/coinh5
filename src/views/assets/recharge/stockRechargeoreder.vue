<template>
  <HeaderBar :currentName="_t18('pledge_order_record')" :border_bottom="false"></HeaderBar>
  <div class="container">
    <van-tabs border lazy-render title-active-color="var(--ex-primary-color)"
      title-inactive-color="var(--ex-default-font-color)" v-model:active="currentIndex" @click-tab="clickTab">
      <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title"></van-tab>
    </van-tabs>

    <!-- <div class="list-loading" v-if="loading">
      <van-loading size="20px" color="var(--ex-default-font-color)">{{ _t18('no_more_data') }}</van-loading>
    </div> -->
    <van-list :finished="finished" :finished-text="dataList?.length ? _t18(`no_more_data`) : ''"
      :loading-text="_t18(`loading`)" @load="onLoad" :immediate-check="false" v-model:loading="loading">
      <div class="list" v-if="dataList.length > 0">

        <div class="list-item" v-for="(item, index) in dataList" :key="index">
          <div class="list-item-header" v-if="item.status == 2">
            <div class="list-item-header-left">
              <div class="list-item-header-right">
                <div class="list-item-header-right-title"><van-tag color="#EF3037">{{
    item.stockType
  }}</van-tag>{{ item.stockName }}</div>
                <div class="list-item-header-right-text" style="margin-top: 6px;">{{ item.stockCode }}</div>
              </div>
            </div>
            <!-- <div class="list-item-header-right">{{ orderStatus(item.status) }}</div> -->
          </div>
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18('stock29') }}</div>
            <div class="list-item-info-right">{{ _numberWithCommas(item.orderPrice) }} {{ item.stockType == 'US' ?
    'USD' : 'BRL' }}</div>
          </div>
          <!-- <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18('stock12') }}</div>
            <div class="list-item-info-right">{{ item.orderNum }}</div>
          </div> -->
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18('stock90') }}</div>
            <div class="list-item-info-right">{{ _timeFormat(item.createTime) }}</div>
          </div>
        </div>
      </div>
    </van-list>

    <Nodata v-if="loading == false && dataList?.length <= 0"></Nodata>
  </div>
</template>
<script setup>
import { showConfirmDialog, showToast } from 'vant'
import { useToast } from '@/hook/useToast'
import { _t18, _getConfig, _timeFormat } from '@/utils/public'
import { tradingPage } from '@/api/trade/index'
import { useUserStore } from '@/store/user'
import { onMounted } from 'vue'

const userStore = useUserStore()

const userId = computed(() => userStore.userInfo.user?.userId)

const { _toast, _showName } = useToast()

const currentIndex = ref(0)
const headerList = computed(() => {
  return [
    { title: _showName('stock7'), status: 0 },
    { title: _showName('stock9'), status: 1 },
    { title: _showName('stock10'), status: 2 }
  ]
})

// 数据字典0:待审核 1:已通过 2:已驳回 3:已完成
const orderStatus = (status) => {
  switch (status) {
    case 0:
      return _showName('stock7');
    case 1:
      return _showName('stock9');
    case 2:
      return _showName('stock10');
    default:
      return '未知状态';
  }
}



const clickTab = (e) => {
  pageNo.value = 1
  dataList.value = []
  currentIndex.value = e.name
  finished.value = false
  getOrderList()
}
const finished = ref(false)
const pageSize = ref(10)
const pageNo = ref(1)
const dataList = ref([])
const loading = ref(false)
// 获取订单列表
const getOrderList = () => {
  loading.value = true
  tradingPage(userId.value, currentIndex.value).then((res) => {
    console.log(res)

    pageNo.value++
    if (res.data.total <= 0) {
      dataList.value = []
      loading.value = false
      finished.value = true
      return
    }
    dataList.value.push(...res.data.list)
    loading.value = false // 加载状态结束
    if (dataList.value.length >= res.data.total || res.data.list.length == 0) {
      finished.value = true // 结束加载状态
    }
  })


}
onMounted(() => {
  getOrderList()

})
// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getOrderList()
}
</script>
<style lang="scss" scoped>
* {
  font-size: 13px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}

.container {
  .list-loading {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.van-tabs) {
    .van-tabs__nav {
      padding-left: 0;
      padding-right: 0;
    }

    .van-tabs__wrap {
      height: 36px;

      &:after {
        border-bottom: 1px solid var(--ex-border-color14);
        border-top: none;
        opacity: 0.4;
      }
    }

    .van-tab {
      // padding: 0 12px;
      font-size: 14px;
    }

    .van-tabs__line {
      height: 2px;
      background-color: var(--ex-primary-color);
    }
  }

  .list {
    padding: 15px;

    &-item {
      width: 100%;
      border-radius: 10px;
      background-color: var(--ex-backup--background-color);
      margin-bottom: 15px;
      padding: 20px 15px;

      &:last-child {
        margin-bottom: 0;
      }

      &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left {
          display: flex;
          align-items: center;

          img {
            width: 44px;
            height: 44px;
            margin-right: 15px;
          }

          &-right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            &-title {
              font-weight: 500;
            }

            &-text {
              margin-top: 4px;
              color: var(--ex--home-grid-text-color);
            }
          }
        }

        &-right {
          font-weight: 600;
        }
      }

      &-info {
        margin: 20px 0 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-left {
          color: var(--ex--home-grid-text-color);
        }
      }

      :deep(.van-button) {
        width: 100%;
        height: 40px;
        border-radius: 27px;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
    }
  }
}

:deep(.van-tag) {
  margin-right: 12px;
}
</style>
