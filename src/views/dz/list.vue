<template>
  <HeaderBar
    :currentName="_t18('stock1')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="container">
    <!-- 添加 tabs 切换 -->
    <van-tabs
      @click-tab="onTabChange"
      v-model="activeTab"
      lazy-render
      title-active-color="var(--ex-primary-color)"
      title-inactive-color="var(--ex-default-font-color)"
    >
      <van-tab
        v-for="item in headerList"
        :key="item.status"
        :name="item.status"
        :title="item.title"
      ></van-tab>
    </van-tabs>

    <van-list
      :finished="finished"
      :finished-text="dataList?.length ? _t18(`no_more_data`) : ''"
      :loading-text="_t18(`loading`)"
      @load="onLoad"
      :immediate-check="false"
      v-model:loading="loading"
    >
      <div class="list" v-if="dataList.length > 0">
        <div class="list-item" v-for="(item, index) in dataList" :key="index">
          <div class="list-item-top">
            <div class="list-item-top-left left">
              <div class="list-item-top-left-content text-ellipsis">
                <div class="list-item-top-left-content-title">{{ item.stockName }}</div>
                <div class="list-item-top-left-content-subtitle">{{ item.stockCode }}</div>
              </div>
            </div>
            <div class="list-item-top-right">
              <!-- <van-icon name="fire-o" size="24" @click="handleDetail(item)" /> -->
              <van-button
                type="primary"
                color="var(--ex-primary-color)"
                @click="handleOpen(item)"
                >{{ _t18('stock4') }}</van-button
              >
            </div>
          </div>
          <div class="list-item-bottom">
            <div class="list-item-bottom-title">{{ _t18('stock5') }}</div>
            <div class="list-item-bottom-price">
              {{
                _numberWithCommas(
                  ['cmmetrics'].includes(_getConfig('_APP_ENV')) ? item.vipPrice : item.price,
                  2
                )
              }}
              {{ item.stockType == 'BR' ? 'BRL' : 'USD' }}
            </div>
          </div>
        </div>
      </div>
    </van-list>
    <Nodata v-if="loading == false && dataList?.length <= 0"></Nodata>

    <van-popup
      v-model:show="showPass"
      position="bottom"
      round
      closeable
      :style="{ height: '35%' }"
      @close="close"
    >
      <div class="submit-page">
        <div class="submit-page-title">{{ _t18('stock66') }}</div>
        <van-field v-model="password" type="password" :placeholder="_t18('stock67')"> </van-field>
        <div class="btn">
          <van-button
            type="primary"
            color="var(--ex-trade-buy-bg-color)"
            :disabled="isDisabled"
            @click="getVipList"
            >{{ _t18('stock47') }}</van-button
          >
        </div>
      </div>
    </van-popup>

    <!-- 弹窗 -->
    <SubmitPopup ref="SubmitPopupRef" :password="password" :stock-data="stockData"></SubmitPopup>
  </div>
</template>
<script setup>
import SubmitPopup from './components/submitPopup.vue'
import { dzPage, buyStockDzApi } from '@/api/trade/index'
import { useToast } from '@/hook/useToast'
import { _t18, _getConfig, _timeFormat, _numberWithCommas } from '@/utils/public'
import { _div, _mul, _toFixed, _sub, _formattedAmount } from '@/utils/decimal'
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user/index'
const userStore = useUserStore()
const headerList = ref([
  {
    status: 0,
    title: _t18('shares')
  },
  {
    status: 1,
    title: _t18('repay_type_label')
  }
])
const { _toast, _showName } = useToast()
const Router = useRouter()

const cuttentRight = reactive({
  iconRight: [{ name: _showName('stock6'), clickTo: '/orderList' }]
})
const stockData = ref({})
// 密钥弹窗
const showPass = ref(false)
// 密钥
const password = ref('')

const SubmitPopupRef = ref(null)
// 打开弹窗
const handleOpen = (item) => {
  // console.log(item, '12212');
  // num.value = item.stockNum
  // console.log(item.list[0], 'item.list[0].password');
  stockData.value = item

  if (!item.list[0].password) {
    // getVipList()
    SubmitPopupRef.value.init()
  } else {
    showPass.value = true
  }
}
// 密钥确认
async function getVipList() {
  var result = stockData.value.list.find((item) => {
    return item.password == password.value
  })
  if (typeof result == 'undefined') return _toast('stock74')
  showPass.value = false
  SubmitPopupRef.value.init()
}

// 查看K线图
// const handleDetail = (row) => {
//   Router.push({ path: '/trade', query: { tradeKey: 'ApanStocks', symbol: row.stockCode } })
// }

// tab列表数据
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(20)
const pageNum = ref(1)
const dataList = ref([])

const activeTab = ref(0)
const onTabChange = (index) => {
  // console.log(index.name)
  activeTab.value = index.name
  pageNum.value = 1
  dataList.value = []
  finished.value = false
  getList()
}
async function getList() {
  loading.value = true
  // let stockType = activeTab.value === 0 ? 'stock' : 'crypto' // 根据 tab 切换类型
  let params = {
    pageNo: pageNum.value,
    pageSize: pageSize.value,
    type: activeTab.value,
    // stockType: null
  }
  const res = await dzPage(params)

  pageNum.value++
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
}

// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getList()
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
* {
  font-size: 13px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}
:deep(.van-tabs) {
  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;
  }

  .van-tabs__wrap {
    height: 36px;
    margin-bottom: 10px;
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
.container {
  padding: 15px;
  padding-top: 0;
  .list {
    &-item {
      padding: 15px;
      border-radius: 10px;
      background-color: var(--ex-backup--background-color);
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      &-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;

        &-left {
          display: flex;
          align-items: center;

          &-img {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            margin-right: 10px;
          }

          &-content {
            &-subtitle {
              margin-top: 5px;
            }
          }
        }

        &-right {
          display: flex;
          align-items: center;

          :deep(.van-button) {
            height: 26px;
            border-radius: 4px;
            margin-left: 20px;
          }
        }
      }

      &-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 15px;
        border-top: 1px solid var(--ex-border-color16);
      }
    }
  }
}

:deep(.van-popover__content .popover-content) {
  padding: 5px 10px;
}

.submit-page {
  padding: 0 15px 15px 15px;
  box-sizing: border-box;

  &-title {
    font-size: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--ex-border-color16);
  }

  .stock-info {
    display: flex;
    align-items: center;
    padding: 25px 0 10px 0;

    &-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &-content {
      &-subtitle {
        margin-top: 5px;
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;

    &-left {
      display: flex;
      align-items: center;

      &-arrow {
        width: 14px;
        height: 10px;
        margin-left: 8px;
      }
    }

    &-right {
      display: flex;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }

  .item-flex {
    display: flex;
    align-items: center;
    padding: 15px 0;

    &-value {
      margin-left: 8px;
    }
  }

  .input-title {
    display: flex;
    align-items: center;
    margin-top: 15px;

    &::before {
      content: '*';
      color: var(--ex-tip-font-color);
      margin-right: 4px;
    }
  }

  :deep(.van-field) {
    margin: 15px 0;
    padding: 10px 14px;
    border-radius: 8px;
    background: var(--ex--backup-background-color-2);
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0);

    /* 焦点状态样式 */
    &:hover {
      border: 1px solid var(--ex-input-focus-color);
      outline: none;

      /* 防止点击时出现默认的浏览器外观 */
      input::placeholder {
        color: var(--ex-white);
      }
    }
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    :deep(.van-button) {
      flex: 1;
      height: 46px;
      border-radius: 8px;
      margin-top: 20px;
    }
  }
}

.left {
  width: 70%;
}
</style>
