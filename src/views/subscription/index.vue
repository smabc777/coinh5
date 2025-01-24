<template>
  <div>
    <!-- 申购 / 配销-->
    <Header :currentName="_t18(`IEO_subscription`)" :cuttentRight="cuttentRight">
      <template #content>
        <div class="heider-content">
          <van-tabs class="tabs" v-model:active="active" line-width="0" :ellipsis="true" swipeable animated
            @click-tab="topScrollIntoView">
            <van-tab :name="1">
              <template #title>
                <div class="tab-item " :class="{ atv: 1 == active }">
                  {{ _t18(`subscription`) }}
                  <!--                  {{ _t18(`IEO_subscription`) }}-->
                </div>
              </template>
            </van-tab>
            <van-tab :name="2">
              <template #title>
                <div class="tab-item " :class="{ atv: 2 == active }">
                  {{ _t18('Placement') }}
                </div>
              </template>
            </van-tab>
          </van-tabs>
        </div>
      </template>
    </Header>

    <!--     申购/配售-->
    <div class="content">
      <van-tabs v-model:active="curIndex" @click-tab="clickTab" animated :line-height="2">
        <van-tab v-for="(item, index) in tabList" :key="index" :name="item.name" :class="{ atv: index == curIndex }"
          :title="item.title">
          <van-pull-refresh v-model="loading" @refresh="onRefresh">
            <div class="tabContent" v-if="dataList.length">
              <CardInfo :data="item" v-for="item in dataList" :key="item.id"></CardInfo>
            </div>
            <Nodata v-else></Nodata>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>

    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
import Header from './components/Header.vue'
import CardInfo from './components/CardInfo.vue'

// 配售
import { ownCoinList } from '@/api/subscription/index'
import Mining from "@/views/defic/components/mining.vue";

// IEO
// import {ownCoinApplyList} from '@/api/subscription/subscribe.js'


//订单列表入口
const cuttentRight = {
  iconRight: [
    { iconName: 'sub-record', clickTo: '/subscription/order', name: '' }
    //      name: _t18(`pledge_order_record`)
  ]
}
//订单类型列表
const tabList = [
  { id: 1, title: _t18('Preparation') },
  { id: 2, title: _t18('pledge_in_progress') },
  { id: 3, title: _t18('In_over') }
]

// 切换申购/配售   tab
const active = ref(1)  //IEO 1/配售 2
const topScrollIntoView = () => {
  onRefresh()
}
// 下拉刷新
const loading = ref(false)


// 刷新
const onRefresh = () => {
  loading.value = true
  init()
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 订单切换
const status = ref(1)
const init = async () => {
  let res = null
  // IEO 0
  // 配售 1
  dataList.value = []
  res = await ownCoinList(status.value, active.value - 1)
  if (res.code == '200') {
    dataList.value = res.data
  }
}

// 订单类型切换
const curIndex = ref('0')
const dataList = ref([])
const clickTab = (e) => {
  console.log('--e', e)
  dataList.value = []
  curIndex.value = e.name
  status.value = e.name + 1
}

watch(
  status,
  (val) => {
    init()
  },
  {
    immediate: true
  }
)
onMounted(() => {
  // init()
})
</script>

<style lang="scss" scoped>
:deep(.heider-content) {

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

  .van-tabs {
    width: 100%;
    overflow: hidden;

    .van-tabs__nav {
      border-radius: 10px;
      padding: 0;
      background: var(--ex-home-tabs-bg-color);
    }

    .van-tab {
      padding: 6px 10px;
    }

    .tab-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      font-size: 14px;
      color: var(--ex-home-tabs-text-color);
      text-align: center;

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

  }
}

.content {
  padding-top: 8px;
  padding-bottom: 15px;


  :deep(.van-tabs) {
    padding-bottom: 0;

    .van-tab {
      //height: 50px;
    }

    .van-tabs__line {
      bottom: 0px;
    }

    .van-tabs__nav {
      height: 34px;
      padding-bottom: 0;
      position: relative;

      &:after {
        position: absolute;
        width: 90%;
        left: 5%;
        bottom: 1px;
        content: ' ';
        border-bottom: 1px #fff solid;
        opacity: 0.0939;
      }
    }
  }

  //  overflow: hidden;
  //  //padding: 0 0 16px;
  //  background: var(--ex-default-background-color);
  //
  //  .van-tabs__wrap {
  //    padding: 0 16px;
  //  }
  //
  //  .van-tabs__nav {
  //    padding: 0 16px;
  //    display: flex;
  //    justify-content: space-between;
  //    border-radius: 10px;
  //    padding: 0;
  //    background: var(--ex-home-tabs-bg-color);
  //  }
  //
  //  .tab-item {
  //    padding: 9px 20px;
  //    width: 100%;
  //    font-size: 14px;
  //    color: var(--ex-home-tabs-text-color);
  //
  //    &.atv {
  //      font-size: 15px;
  //      color: var(--ex-home-tabs-text-atv-color);
  //    }
  //  }
  //
  //  .van-tab--active {
  //    background: var(--ex-home-tabs-bg-atv-color);
  //    color: var(--ex-home-tabs-text-atv-color) !important;
  //    border-radius: 10px;
  //  }
  //}
}

.tabContent,
.van-pull-refresh {
  height: calc(100vh - 70px - 30px);
  overflow: auto;
}
</style>
