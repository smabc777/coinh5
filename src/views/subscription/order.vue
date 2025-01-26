<template>
  <div class="order-subscription">
    <!-- 申购订单 -->
    <div class="columnFlex" v-if="!billslist">
      <!--    <HeaderBar :currentName="_t18(`pledge_order_record`)"></HeaderBar>-->
      <!-- 申购 / 配销 订单-->
      <Header :currentName="_t18(`pledge_order_record`)" :cuttentRight="{}">
        <template #content>
          <div class="heider-content">
            <van-tabs class="tabs" v-model:active="active" line-width="0" :ellipsis="true" swipeable animated
              @click-tab="topScrollIntoView">
              <van-tab v-for="(item, index) in tabList" :name="item.type" :key="index">
                <template #title>
                  <div class="tab-item " :class="{ atv: item.type == active }">
                    {{ item.name }}
                  </div>
                </template>
              </van-tab>
            </van-tabs>
          </div>
        </template>
      </Header>
    </div>

    <div class="tabs_billslist" v-else>
      <van-tabs v-model:active="active">
        <van-tab v-for="(item, index) in tabList" :name="item.type" :key="index">
          <template #title>
            <div class="tabs_item">{{ item.name }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <!--  订单列表-->
    <div class="recordList">
      <!-- 没有更多数据了 no_more_data 加载中  loading-->
      <van-list v-if="list.length > 0 && !isShow" v-model:loading="loading" :finished="finished"
        :finished-text="_t18(`no_more_data`)" :loading-text="_t18(`loading`)" @load="onLoad">
        <div class="item" v-for="(item, index) in list" :key="index">
          <!-- 订单号 -->
          <div class="everyItem everyItem-top">
            <div class="everyItem-a">
              <div class="everyItem-b">
                <van-icon name="passed" />
              </div>
              {{ active == 2 ? _t18('Placement') : _t18('subscription') }}
            </div>
            <div class="itemRight itemRight-text fw-num">
              <Copy :data="item.orderId" :contentFix="'start'" :fontSize="'16px'">
                <template #copyMsg>
                  <span>{{ item.orderId }}</span>
                </template>
              </Copy>
            </div>
          </div>
          <!-- 币种 -->
          <div class="everyItem">
            <div>{{ _t18('recharge_coin') }}</div>
            <div class="itemRight fw-num" style="color: #8885FB;">
              {{ item.ownCoin }}
            </div>
          </div>
          <!-- 配售数量 -->
          <div class="everyItem" v-if="active == 2">
            <div>{{ _t18('Placement-quantity') }}</div>
            <div class="itemRight fw-num">
              {{ item.number }}
            </div>
          </div>
          <!--中签数量-->
          <div class="everyItem">
            <div>{{ _t18('Number-of-winning-lots') }}</div>
            <div class="itemRight fw-num">
              {{ item.winNumber }}
            </div>
          </div>
          <!-- 预估价格 -->
          <div class="everyItem" v-if="active == 2">
            <div>{{ _t18('Estimated-listing-price') }}</div>
            <div class="itemRight fw-num">
              {{ item.estimatedPrice }}
            </div>
          </div>
          <!-- 销售价格 -->
          <div class="everyItem">
            <div>{{ _t18('price') }}</div>
            <div class="itemRight fw-num">
              {{ item.price }}
            </div>
          </div>
          <!-- 总价 -->
          <div class="everyItem total_price">
            <div>{{ _t18('total_price') }}</div>
            <div class="itemRight fw-num">
              {{ item.amount }}
            </div>
          </div>
          <!-- 认购 -->
          <div class="everyItem" v-if="active == 1 && item.status == 2">
            <div>{{ _t18('Subscription-rj') }}</div>
            <div class="itemRight fw-num">
              <van-button class="itemRight" style="padding: 10px 20px;font-size: 14px" size="small" type="primary"
                @click="rjiao(item)" color="var(--ex-primary-color)">
                {{ _t18('Subscription-rj') }}
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
      <Nodata v-if="list.length === 0 && isShow"></Nodata>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import Copy from '@/components/common/Copy/index.vue'
import { _t18, _timeFormat } from '@/utils/public'
import { getOwnCoinOrder, payForOrder } from '@/api/subscription/index'
import { getownCoinApplyOrder } from '@/api/subscription/subscribe'
import Header from "@/views/subscription/components/Header.vue";

import { useRoute } from 'vue-router'
import { useToast } from '@/hook/useToast'
import Tab from "@/components/Tab/index.vue";
import Mining from "@/views/defic/components/mining.vue";
import { showConfirmDialog, showDialog } from "vant";


const { _showName, _toast } = useToast()
const route = useRoute()
const billslist = inject('billslist')

// 切换  申购/配售 订单
const active = ref(1)
if (route.query.type == 1) {
  active.value = 2
}

const rjiao = (item) => {
  // ${_showName('Winning-the-lottery')}${item.winNumber},
  showConfirmDialog({
    teleport: '.order-subscription',
    title: _showName('Congratulations-on-winning-the-lottery'),
    className: 'rgDialog',
    message: `${_showName('Subscription-rj')} ${item.winNumber * item.price} USDT`,
    cancelButtonColor: 'var(--ex-default-font-color)',
    cancelButtonText: _showName('cancel'),
    confirmButtonText: _showName('confirm'),
  }).then(() => {

    payForOrder(`?id=${item.id}&orderId=${item.orderId}`).then(res => {
      if (res.code == '200') {
        _toast('Purchase_successful')
        topScrollIntoView()
      } else {
        _toast(res.msg)
      }
    })
  });
}
const topScrollIntoView = () => {
  list.value = []
  isShow.value = true
  loading.value = true
  pageNum.value = 1
  onLoad()
}
const tabList = ref([
  {
    name: _t18('Subscription-records'),
    type: 1
  },
  {
    name: _t18('Placement-records'),
    type: 2
  },

])
const list = ref([])
const pageNum = ref(1)
const pageSize = ref(8)
const isShow = ref(false)
const loading = ref(false)
const finished = ref(false)
const total = ref(0)
const onLoad = async () => {
  try {
    const data = await getInit()
    list.value = [...list.value, ...data]
    list.value.length === 0 ? (isShow.value = true) : (isShow.value = false)
    if (list.value.length === total.value) {
      finished.value = true
    }
    pageNum.value++
  } catch (error) {
  } finally {
    loading.value = false
  }
}
const getInit = async () => {
  let params = {}
  // params = {
  //   pageNum: pageNum.value,
  //   pageSize: pageSize.value,
  //   orderByColumn: 'createTime',
  //   isAsc: 'desc'
  // }
  params = `pageNum=${pageNum.value}&pageSize=${pageSize.value}&orderByColumn=createTime&isAsc=desc`
  var res = null
  if (active.value == 1) {
    res = await getownCoinApplyOrder(params)
  } else {
    res = await getOwnCoinOrder(params)
  }

  if (res.code === 200) {
    total.value = res.total
    return res.rows
  } else {
    finished.value = true
  }
}
onMounted(() => {
  onLoad()
})
</script>
<style lang="scss" scoped>
.order-subscription {

  height: 100vh;
  width: 100vw;
  overflow: auto;

  :deep(.rgDialog) {
    .van-dialog__header {
      font-size: 16px;
    }

    .van-dialog__content {
      div {
        font-size: 14px;
      }

      padding: 20px 0;
    }
  }

}

:deep(.heider-content) {

  display: flex;
  justify-content: center;
  padding: 0 20px;

  .van-tabs {
    overflow: hidden;
    width: 100%;

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

:deep(.tabs_billslist) {
  .van-tab {
    padding-bottom: 6px;
    font-size: 14px;
  }
}

.recordList {
  max-height: 100vh;
  flex: 1;
  overflow: auto;
  padding: 0 15px;
}

:deep(.van-list__finished-text) {
  height: 79px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--ex-passive-font-color);
}

.item {
  width: 100%;
  background: var(--ex-financial-card-bg-color);
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 10px;

  .everyItem {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: var(--ex-passive-font-color);

    &.everyItem-top {
      border-bottom: 1px solid rgba(171, 171, 171, 0.10);

      .everyItem-a {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: var(--ex-default-font-color);

        .everyItem-b {
          width: 22px;
          height: 22px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          // background: var(--ex-home-box-border-color);
          font-size: 14px;
          margin-right: 4px;
        }
      }

      .itemRight-text {
        span {
          font-size: 16px;
        }

        color: var(--ex-default-font-color);
      }
    }

    &.total_price {
      .itemRight {
        color: #10F4B1;
      }
    }


    .itemRight {
      font-size: 14px;
      color: var(--ex-default-font-color);

    }

  }
}
</style>
