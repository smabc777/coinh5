<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { subscribeCenterPage } from '@/api/trade/index'
import { _timeFormat, _t18, _getConfig } from '@/utils/public'
import { useUserStore } from '@/store/user/index'
import { subscribeCreate } from '@/api/trade/index'
import { stockSubscribePage, stockSubmit } from '@/api/subscription/index'
import { debounce } from '@/utils/public'

import { _toFixed, _formattedAmount } from '@/utils/decimal'
import { useToast } from '@/hook/useToast'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()

const { _toast, _st18 } = useToast()
const userStore = useUserStore()
const { asset } = storeToRefs(userStore)

const emit = defineEmits(['goOrder'])

const router = useRouter()

let active = ref(1)
const headerList = ref([
  {
    status: 1,
    title: _st18('stock51')
  },
  {
    status: 0,
    title: _st18('stock50')
  }

  // {
  //   status: 2,
  //   title: _st18('stock52'),
  // },
  // {
  //   status: 3,
  //   title: _st18('stock53'),
  // }
])
let dataList = ref([])

let loading = ref(false)
const finished = ref(false)
const pageSize = ref(8)
const pageNo = ref(1)
// 上拉加载分页
const onLoad = () => {
  loading.value = true
  switch (active.value) {
    case 0:
      stockSubscribePageFn()
      break
    case 1:
      getList('INIT')
      break
    case 2:
      getList('UNLISTED')
      break
    case 3:
      getList('LISTED')
      break
  }
}

function clickTab(e) {
  console.log(e.name)

  active.value = e.name
  pageNo.value = 1
  finished.value = false
  dataList.value = []
  switch (Number(active.value)) {
    case 0:
      stockSubscribePageFn()
      break
    case 1:
      getList('INIT')
      break
    case 2:
      getList('UNLISTED')
      break
    case 3:
      getList('LISTED')
      break
  }
  // getUserAccountFn()
}

async function stockSubscribePageFn() {
  loading.value = true
  let params = {
    pageSize: pageSize.value,
    pageNo: pageNo.value,
    userAccount: 'USDT'
  }
  const res = await stockSubscribePage(params)

  if (res.code == 200) {
    res.data.list.forEach((element) => {
      // 1、已认购，2、未中签，3、已中签，4、已缴纳 5.已转持仓
      switch (element.status) {
        case 1:
          element.statusText = _st18('stock54')
          break
        case 2:
          element.statusText = _st18('stock55')
          break
        case 3:
          element.statusText = _st18('stock56')
          break
        case 4:
          element.statusText = _st18('stock57')
          break
        case 5:
          element.statusText = _st18('stock58')
          break
      }
      // 1 新股 2配售 3顶额配售
      switch (element.newType) {
        case 1:
          element.newTypeText = _st18('stock59')
          break
        case 2:
          element.newTypeText = _st18('stock60')
          break
        case 3:
          element.newTypeText = _st18('stock61')
          break
      }
    })
    pageNo.value++
    if (res.data.total <= 0) {
      dataList.value = []
      finished.value = true
      loading.value = false
      return
    }
    dataList.value.push(...res.data.list)
    if (dataList.value.length >= res.data.total || res.data.list.length == 0) {
      finished.value = true // 结束加载状态
    }
  }
  loading.value = false
}
async function getList(centerType) {
  loading.value = true
  let params = {
    pageSize: pageSize.value,
    pageNo: pageNo.value,
    centerType: centerType
  }
  const res = await subscribeCenterPage(params)
  if (res.code == 500) return
  pageNo.value++
  if (res.data.total <= 0) {
    dataList.value = []
    finished.value = true
    loading.value = false
    return
  }
  dataList.value.push(...res.data.list)
  if (dataList.value.length >= res.data.total || res.data.list.length == 0) {
    finished.value = true // 结束加载状态
  }
  loading.value = false
}
// 点击详情
let clickItem = ref([])
let settingDialog = ref(false)
let sgNum = ref(0)

// 账户余额
const availableBalance = computed(() => {
  let tempValue = 0
  if (asset.value.length) {
    tempValue = asset.value.filter((item) => item.type === 9)[0]?.availableAmount - asset.value.filter((item) => item.type === 9)[0]?.occupiedAmount || 0
  }
  return tempValue
})
// ipo输入框状态
const ipoFlag = ref(undefined)
async function clickDetailFn(item) {
  clickItem.value = item
  // getUserAccountFn()

  // enableAmt.value = userStore.getEnableAmtByAccountType(item.currencyType)
  if (clickItem.value.newType == 3 || clickItem.value.newType == 2) {
    ipoFlag.value = true
    sgNum.value = clickItem.value.orderNumber
  } else if (clickItem.value.newType == 1) {
    ipoFlag.value = true
    if (item.stockType == 'US') {
      // 换算美股可购买股数
      sgNum.value =
        Math.floor(availableBalance.value / item.price) > item.orderNumber
          ? item.orderNumber
          : Math.floor(availableBalance.value / item.price)
    } else {
      // 换算巴西股可购买股数
      sgNum.value =
        Math.floor((availableBalance.value * tradeStore.rateinfo.brlRate) / item.price) >
          item.orderNumber
          ? item.orderNumber
          : Math.floor((availableBalance.value * tradeStore.rateinfo.brlRate) / item.price)
    }
  } else if (clickItem.value.newType == 4) {
    ipoFlag.value = false
    // ipo多配
    sgNum.value = clickItem.value.minNumber
  }
  settingDialog.value = true
}
// 新股认购
const isDisabled = ref(false)

async function changeSg() {
  if (!sgNum.value) {
    _toast('stock62')

    return
  }
  //this.sgNum必须是数字并且不能小于1
  if (sgNum.value < 1) {
    _toast('stock63')

    return
  }
  if (sgNum.value > clickItem.value.orderNumber) {
    _toast(_st18('stock64') + clickItem.value.orderNumber)

    return
  }
  isDisabled.value = true

  let opt = {
    id: clickItem.value.id,
    applyNums: sgNum.value
  }
  let data = await subscribeCreate(opt, { loading: true })
  if (data.code == 200) {
    settingDialog.value = false
    _toast('stock65')
    clickItem.value = []
    active.value = 0
    dataList.value = []
    pageNo.value = 1
    await stockSubscribePageFn()
  } else {
    _toast(data.msg)
  }
  isDisabled.value = false
}
async function clickButton(i) {
  if (i.status == 3) {
    let params = {
      id: i.id
    }
    const data = await stockSubmit(params)
    if (data.code == 0) {
      _toast(data.msg)
      stockSubscribePageFn()
    } else {
      _toast(data.msg)
    }
  }
}
// 去缴纳
async function payFn(item) {
  console.log(item)
  let params = {
    id: item.id
  }
  const data = await stockSubmit(params)
  if (data.code == 0) {
    clickTab()
  } else {
  }
}
onMounted(async () => {
  loading.value = true
  await getList('INIT')
})
</script>
<template>
  <HeaderBar :currentName="_t18('stock2')" :border_bottom="false"></HeaderBar>

  <div class="main">
    <!-- border :swipe-threshold="3" line-width="52" -->

    <van-tabs border lazy-render title-active-color="var(--ex-primary-color)"
      title-inactive-color="var(--ex-default-font-color)" v-model:active="active" @click-tab="clickTab">
      <van-tab v-for="item in headerList" :key="item.status" :name="item.status" :title="item.title"></van-tab>
    </van-tabs>
    <div v-if="active == 0" class="list">
      <van-list :finished="finished" :finished-text="dataList?.length ? _t18(`no_more_data`) : ''"
        :loading-text="_t18(`loading`)" @load="onLoad" :immediate-check="false" v-model:loading="loading">
        <div class="list-item" v-for="(i, index) in dataList" :key="index">
          <div class="list-item-header">
            <div class="list-item-header-left">
              <div class="list-item-top-left-content-title">{{ i.newName }}</div>
            </div>
            <div class="list-item-header-right">
              <van-button type="primary" color="var(--ex-primary-color)" class="buybtn" disabled>
                {{ i.statusText }}</van-button>
            </div>
          </div>
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock17`) }}</div>
            <div class="list-item-info-right">{{ i.applyNums }}</div>
          </div>
          <div class="list-item-info" v-if="i.status != 1">
            <div class="list-item-info-left">{{ _t18(`stock18`) }}</div>
            <div class="list-item-info-right">{{ i.applyNumber }}</div>
          </div>
          <div class="list-item-info" v-if="i.status == 3 || i.status == 4">
            <div class="list-item-info-left">{{ _t18(`stock20`) }}</div>
            <div class="list-item-info-right">
              {{ _numberWithCommas(i.buyPrice, 2) }} {{ i.stockType == 'US' ? 'USD' : 'BRL' }}
            </div>
          </div>
          <div class="list-item-info" v-if="i.status != 1">
            <div class="list-item-info-left">{{ _t18(`stock19`) }}</div>
            <div class="list-item-info-right">
              {{ _numberWithCommas(i.amoundPaid, 2) }} {{ i.stockType == 'US' ? 'USD' : 'BRL' }}
            </div>
          </div>
          <div class="list-item-info"
            v-if="i.status == 3 || (i.status == 5 && i.buyPrice * i.applyNumber - i.amoundPaid > 0)">
            <div class="list-item-info-left">{{ _t18(`stock21`) }}</div>
            <div class="list-item-info-right">
              {{ _numberWithCommas(i.buyPrice * i.applyNumber - i.amoundPaid, 2) }}
              {{ i.stockType == 'US' ? 'USD' : 'BRL' }}
            </div>
          </div>

          <div class="list-item-info" v-if="i.status == 5">
            <div class="list-item-info-left">{{ _t18(`stock22`) }}</div>
            <div class="list-item-info-right">{{ _timeFormat(i.fixTime) }}</div>
          </div>
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock76`) }}</div>
            <div class="list-item-info-right">{{ _timeFormat(i.addTime) }}</div>
          </div>
        </div>
      </van-list>
    </div>

    <div v-if="active == 1" class="list">
      <van-list :finished="finished" :finished-text="dataList?.length ? _t18(`no_more_data`) : ''"
        :loading-text="_t18(`loading`)" @load="onLoad" :immediate-check="false" v-model:loading="loading">
        <div class="list-item" v-for="(item, index) in dataList" :key="index">
          <div class="list-item-header">
            <div class="list-item-header-left">
              <div class="list-item-top-left-content">
                <div class="list-item-top-left-content-title namei">
                  <van-tag color="#EF3037">{{ item.stockType }}</van-tag>{{ item.name }}
                </div>
              </div>
            </div>
            <div class="list-item-header-right">
              <!-- <van-icon name="fire-o" size="24" @click="handleDetail(item)" /> -->
              <van-button type="primary" color="var(--ex-primary-color)" class="buybtn" @click="clickDetailFn(item)">{{
                _t18('Subscription_ren') }}</van-button>
            </div>
          </div>
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock11`) }}</div>
            <div class="list-item-info-right">{{ item.code }}</div>
          </div>
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock23`) }}</div>
            <div class="list-item-info-right">
              {{ _numberWithCommas(item.price, 2) }} {{ item.stockType == 'US' ? 'USD' : 'BRL' }}
            </div>
          </div>
          <!-- <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`Total_issuance`) }}</div>
            <div class="list-item-info-right">{{ item.orderNumber }}</div>
          </div> -->

          <!-- <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock24`) }}</div>
            <div class="list-item-info-right">{{ _numberWithCommas(item.ipoPriceLow * item.minNumber || 0) }} USD</div>
          </div> -->
          <div class="list-item-info">
            <div class="list-item-info-left">{{ _t18(`stock25`) }}</div>
            <div class="list-item-info-right">{{ _timeFormat(item.subscribeTime) }}</div>
          </div>
        </div>
      </van-list>
    </div>

    <div class="container" v-if="active == 2 || active == 3">
      <van-list :finished="finished" :finished-text="dataList?.length ? _t18(`no_more_data`) : ''"
        :loading-text="_t18(`loading`)" @load="onLoad" :immediate-check="false" v-model:loading="loading">
        <div class="list" v-if="dataList.length > 0">
          <div class="list-item" v-for="(i, index) in dataList" :key="index">
            <div class="list-item-info">
              <div class="list-item-info-left">{{ _t18(`stock26`) }}</div>
              <div class="list-item-info-right">{{ i.name }}</div>
            </div>
            <div class="list-item-info">
              <div class="list-item-info-left">{{ _t18(`stock11`) }}</div>
              <div class="list-item-info-right">{{ i.code }}</div>
            </div>
            <div class="list-item-info">
              <div class="list-item-info-left">{{ _t18(`stock27`) }}</div>
              <div class="list-item-info-right">
                {{ i.price }} {{ i.stockType == 'US' ? 'USD' : 'BRL' }}
              </div>
            </div>
            <div class="list-item-info">
              <div class="list-item-info-left">{{ _t18(`stock28`) }}</div>
              <div class="list-item-info-right">
                {{ i.nowPrice }} {{ i.stockType == 'US' ? 'USD' : 'BRL' }}
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <Nodata v-if="loading == false && dataList?.length <= 0"></Nodata>

    <!-- 新股弹窗 -->

    <van-popup @close="close" v-model:show="settingDialog" position="bottom" :style="{ height: '30%' }"
      style="max-width: var(--ex-max-width); left: 50%; translate: -50%">
      <div class="setting_content">
        <div class="old_password" v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))">
          <div class="left_titles">{{ _t18('Subscription_quantity') }}:</div>
          <div class="right_password_input">
            <input type="number" v-model="sgNum" :disabled="ipoFlag" />
          </div>
        </div>
        <van-button type="primary" @click="debounce(changeSg)" color="var(--ex-trade-buy-bg-color)"
          :disabled="isDisabled">{{ _t18('stock47') }}</van-button>
        <div class="shijian">
          <div class="xgsj">
            <div class="sjtlt">{{ _t18('stock77') }}:</div>
            <div class="xgTime" v-if="clickItem.subscribeTime">
              {{ _timeFormat(clickItem.subscribeTime) }}
            </div>
          </div>
          <div class="xgsj">
            <div class="sjtlt">{{ _t18('stock78') }}:</div>
            <div class="xgTime" v-if="clickItem.subscriptionTime">
              {{ _timeFormat(clickItem.subscriptionTime) }}
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<style lang="scss" scoped>
@import './assets/index.scss';

* {
  font-size: 13px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}

.main {
  padding: 0 2px;
}

:deep(.van-tabs__nav) {
  background: var(--ex-tab-background-color2);
}

.title {
  font-size: 18px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 600;
  color: var(--ex-font-color6);
  line-height: 24px;
  margin-bottom: 16px;
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

.container {
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

.stock-main {
  padding-top: 16px;
  background: var(--ex-default-background-color);
  min-height: 90vh;
}

// .list {
//   font-size: 11px;
//   font-family: PingFang-SC, PingFang-SC;
//   font-weight: 500;
//   color: #aaaaaa;
//   line-height: 16px;
//   padding-left: 6px;

//   div:nth-child(1) {
//     width: 40%;
//   }

//   div:nth-child(2),
//   div:nth-child(3) {
//     width: 30%;
//   }
// }

input {
  border: none;
  outline: none;
  /* 去除输入框的轮廓样式（一般是蓝色的轮廓） */
  background: none;
  /* 去除输入框的默认背景 */
}

.setting_content {
  width: 100%;
  height: 180px;
  padding: 10.8px;

  .shijian {
    width: 100%;
    height: 57.6px;
    margin-top: 18px;
    margin-bottom: 18px;
  }

  .xgsj {
    font-size: 13.95px;
    font-weight: 600;
    display: flex;
    height: 50%;
    align-items: center;

    div {
      width: 50%;
    }

    .xgTime {
      text-align: right;
    }
  }

  .sjtlt {
    width: 25%;
  }

  :deep(.van-popup) {
    border-radius: 7.2px 7.2px 0 0;
  }

  .old_password {
    width: 100%;
    height: 48px;
    background: var(--ex--backup-background-color-2);
    border: 1px solid var(--ex-input-focus-color);

    border-radius: 5.4px;
    display: flex;
    margin-top: 28.8px;
    overflow: hidden;

    .left_titles {
      margin-left: 7.2px;
      height: 100%;
      display: flex;
      align-items: center;
      padding-left: 7.2px;
      font-size: 14.31px;

      width: fit-content;
      font-weight: 600;
    }

    .right_password_input {
      height: 100%;
      display: flex;
      align-items: center;
      background: var(--ex--backup-background-color-2);

      input {
        width: 100%;
        height: 100%;
        padding-left: 7.2px;
        border-radius: 0 7.2px 7.2px 0;
        font-size: 14.31px;
        font-weight: 600;
        //文字间距
        letter-spacing: 1.44px;
      }

      /* 防止点击时出现默认的浏览器外观 */
      input::placeholder {
        color: var(--ex-white);
      }
    }
  }

  .btn_setting {
    width: 100%;
    height: 46.8px;
    border-radius: 5.4px;
    background: var(--ex-trade-buy-bg-color);
    color: var(--ex-default-font-color);
    font-size: 16.614px;
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px 0 30px 0;

    span {
      font-weight: 600;
    }
  }
}

:deep(.van-list) {
  .van-list__loading {
    padding-top: 20px;
  }
}

.list-top {
  border-bottom: 1px solid #eee;
  margin-bottom: 16px;
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

.activesty {
  color: var(--ex-active-font-color);
  background: var(--ex-tab-background-color);
}

.tag {
  background: #ffeeee;
  border-radius: 2px;
  font-size: 10px;
  font-family: PingFangSC, PingFang SC;
  font-weight: 400;
  color: #ef3037;
  margin-left: 8px !important;
}

.button_1 {
  background: var(--ex-tab-background-color2) !important;
  color: #000 !important;
}

.button_2 {
  background: var(--ex-tab-background-color2) !important;
  color: #888888 !important;
}

.button_3 {
  background: linear-gradient(180deg, #f71818 0%, #ef5a39 100%) !important;
  color: var(--ex-default-font-color4) !important;
}

.button_4 {
  background: linear-gradient(180deg, #ffa663 0%, #ef8839 100%) !important;
  color: var(--ex-default-font-color4) !important;
}

.button_5 {
  background: linear-gradient(180deg, #38b2ff 0%, #1d9ee9 100%) !important;
  color: var(--ex-default-font-color4) !important;
}

.namei {
  font-size: 16px;

  :deep(.van-tag) {
    margin-right: 12px;
  }
}

.code {
  font-size: 14px;
  margin-top: 14px;
}

.setting_content {
  :deep(.van-button) {
    width: 100%;
    height: 46px;
    border-radius: 8px;
    margin-top: 40px;
  }
}

.list-item-header-right {
  margin-left: 12px;
}

.buybtn {
  height: 26px !important;
  white-space: nowrap;
}

:deep(.van-tab) {
  margin-left: 15px;
}
</style>
