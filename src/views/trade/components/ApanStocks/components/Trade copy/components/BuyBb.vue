<template>
  <div class="buy-content">
    <!-- 市价/限价 -->
    <div class="rightScond" ref="rightScond">
      <van-popover v-model:show="showPopover" :teleport="rightScond">
        <div class="rightScondList">
          <div class="rightScondListItem" v-for="(item, index) in delegateTypeList" :key="index"
            :class="{ hightBlue: form.delegateType == item.value }" @click="checkedDelegateType(item)">
            {{ item.label }}
          </div>
        </div>
        <template #reference>
          <div class="entrustSelect">
            <div class="ScondListItem">{{ delegateTypeList[form.delegateType].label }}</div>
            <van-icon name="arrow-down" size="12" color="var(--ex-default-font-color)" />
          </div>
        </template>
      </van-popover>
    </div>

    <!--市价标题 -->
    <div class="rightThird" v-if="form.delegateType == 0">
      {{ delegateTypeList[form.delegateType].placeholder }}
    </div>

    <!-- 限价 -->
    <div v-else>
      <!-- 限价价格-->
      <van-field autocomplete="off" class="rightFifth" type="number" v-model="form.price"
        :placeholder="`${_t18(`price`)} (${stockInfo.baseCoin})`" @input="priceChange" />
    </div>

    <!-- 数量-->
    <van-field autocomplete="off" class="rightFifth" type="digit" v-model="form.count"
      :placeholder="`${_t18(`metastaking_bb_count`)}(${stockInfoCoin})`" @input="countChange" />

    <!-- 滑块部分 -->
    <div class="rightFourth">
      <div class="slider-t">
        <div class="item" v-for="(item, index) in 4" :key="index">
          <div class="hightItem" :class="{ hightColorRed: form.type == 1 }" :style="{
            width: `${form.slider >= (index + 1) * 25
              ? '100%'
              : form.slider < (index + 1) * 25 && form.slider >= index * 25
                ? (form.slider / 25 - index) * 100 + '%'
                : '0%'
              }`
          }"></div>
        </div>
      </div>
      <div class="slider-name ff-num">
        <div class="item" :class="form.slider >= (index + 1) * 25 ? 'itemHight' : ''" v-for="(item, index) in 4"
          :key="index" @click="sliderChange(item * 25)">
          {{ 25 * (index + 1) }}
        </div>
      </div>
      <!-- <van-slider
        v-model="form.slider"
        @change="sliderChange"
        active-color="var(&#45;&#45;ex-div-bgColor1)"
        inactive-color="var(&#45;&#45;ex-div-bgColor)"
        button-size="16"
      ></van-slider> -->
    </div>

    <!-- 限价>买入，成交金额 -->
    <van-field autocomplete="off" class="rightFifth" type="number" readonly v-model="form.turnover" :placeholder="`${_showName(
      ['rxce'].includes(_getConfig('_APP_ENV')) ? `pledge_purchasing_price` : `bb_turnover`
    )} (${stockInfo.baseCoin})`" @input="turnoverChange" />

    <!-- 数量 (rxce特殊需求：增加展示usdt价格折合成当前币种)-->
    <div class="rightSix" v-if="['rxce', 'dev'].includes(_getConfig('_APP_ENV'))">
      <div>{{ _t18(`metastaking_bb_count`) }}</div>
      <div class="number fw-num">
        {{ priceFormat(_div(form.turnover, stockInfo.amount)) }}
        {{ stockInfoCoin }}
      </div>
    </div>

    <!-- 可用 -->
    <div class="rightSix">
      <div>{{ _t18(`account_available`) }}</div>
      <div class="number fw-num">{{ _numberWithCommas(availableBalance) }} USDT</div>
    </div>

    <!-- 买入/ 卖出按钮：自定义币种 (coinInfo.customizeFlag == 2),非自定义币种 -->
    <van-button type="primary" class="button" color="var(--ex-trade-buy-bg-color)" :disabled="isDisabled"
      @click="submit">{{
        _t18('purchase') }}</van-button>

  </div>
</template>

<script setup>
import { DIFF_ISFREEZE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()

import { ref, computed, watch, inject, nextTick } from 'vue'
import { _getConfig, _t18 } from '@/utils/public'
import { _div, _mul, _toFixed, priceFormat } from '@/utils/decimal'
import { showToast } from 'vant'
import { submitOrderStock } from '@/api/stock'
import { useToast } from '@/hook/useToast'
import { matchText } from '@/utils/filters'

import { getBuyBusinessApi } from "@/api/trade"
import { useRouter } from 'vue-router'


const router = useRouter()

const { _toast, _showName } = useToast()

import { useUserStore } from '@/store/user/index'

const userStore = useUserStore()
const { asset } = storeToRefs(userStore)

// 父数据 股票数据
const stockInfo = inject('stockInfo')

// 自定义币种
const stockInfoCoin = computed(() =>
  stockInfo.value.coin?.toUpperCase()
)

// 账户余额
const availableBalance = computed(() => {
  let tempValue = 0
  if (asset.value.length) {
    tempValue = asset.value.filter((item) => item.type === 9)[0]?.availableAmount - asset.value.filter((item) => item.type === 9)[0]?.occupiedAmount || 0
  }
  return tempValue
})

// 币种开盘价等
// const coinPriceInfo = computed(() => {
//   return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
// })

// 表单数据
const form = ref({
  type: 0,
  delegateType: 0,
  price: '', // 价格
  count: '', // 数量
  turnover: '', // 成交金额
  slider: 0 // 滑块
})

// 清除输入
const restForm = () => {
  form.value.type = 0
  form.value.delegateType = 0
  form.value.price = ''
  form.value.count = ''
  form.value.turnover = ''
  form.value.slider = 0
}

/**
 * 市价 限价
 */
const delegateTypeList = computed(() => [
  { label: _showName(`bb_market_order`), placeholder: _showName(`market_price`), value: 0 },
  { label: _showName(`bb_Limit_order`), placeholder: _showName(`limit_price`), value: 1 }
])

// 限价/市价选择控件
// 切换限价/市价
const rightScond = ref()
const showPopover = ref(false)
const checkedDelegateType = (item) => {
  item.value !== form.value.delegateType && restForm()
  form.value.delegateType = item.value
  showPopover.value = false
  if (form.value.delegateType == 1) {
    form.value.price = stockInfo.value.amount
  }
}

//订单刷新
const OrderRefresh = inject('OrderRefresh')
const isDisabled = ref(false)

//提交表单
const submit = async () => {


  let msg = false
  isDisabled.value = true
  if (!_isFreeze(DIFF_ISFREEZE, 'FINANCIAL')) return
  // (市价&&买入)||(限价&&买入)
  if (!form.value.count) {
    msg = _showName('please_enter_quantity') // 请输入金额
  } else if (form.value.turnover <= 0) {
    msg = _showName('amount_incorrect') //金额不正确
  } else if (form.value.turnover > availableBalance.value) {
    msg = _showName('Insufficient_funds_available') // 可用金额不足
  }
  if (msg) {
    showToast(msg)
    return
  }
  // buyType: form.value.type.toString() == 0 ? 1 : 2, //（1买入2卖出）
  //   businessType: form.value.delegateType == 0 ? 2 : 1, // 委托类型（1限价2市价）
  //   stockGid: StockInfoList.value.stockGid,
  //   nowPrice: form.value.delegateType == 0 ? coinPriceInfo.value.amount : form.value.price,
  //   buyNum: form.value.buyNum,
  //   lever: 1
  let params = {
    buyType: form.value.type.toString() == 0 ? 1 : 2, //（0买入1卖出）
    businessType: form.value.delegateType == 1 ? 1 : 2, // 委托类型（0限价1市价）
    // symbol: stockInfo.value.coin, // 股票编码 交易币种(e.g btc)
    buyNum: form.value.count, // 委托总量
    nowPrice: form.value.price, // 委托价格
    // market: stockInfo.value.market, // 交易所(股票市场)
    stockGid: stockInfo.value.symbolGid,
    lever: 1

    // coin: coinInfo.value.baseCoin, //结算币种(usdt)
    // delegateValue: form.value.turnover //委托价值
  }

  const res = await getBuyBusinessApi(params, { loading: true })
  // 购买成功
  if (res.code == 200) {
    _toast('successful_operation')



    restForm()
    if (params.businessType == 2) {
      isDisabled.value = false
      router.push("/assets?name=股票资产")
      return
    }
    // 刷新
    OrderRefresh()

  } else {
    showToast(res.msg)
  }
  isDisabled.value = false
}

/**
 * 数量监听
 */
const countChange = () => {
  let val = form.value.count || 0
  console.log(val)
  if (form.value.delegateType == 1) {
    // (限价&&卖出)||(限价&&买入)
    // 根据数量、价格form.price计算成交额
    form.value.turnover = _toFixed(_mul(form.value.price, val))
  } else {
    // 市价&&买入 根据数量、价格计算成交额
    console.log(stockInfo.value.amount, 'nnnnnnnn');

    form.value.turnover = _toFixed(_mul(stockInfo.value.amount, val))
  }
}

/**
 * 价格监听
 */
const priceChange = () => {
  let val = form.value.price
  if (form.value.delegateType == 1) {
    // 限价
    console.log(val, form.value.delegateType)
    // 根据数量、价格计算成交额
    form.value.turnover = _toFixed(_mul(form.value.count, val))
  }
  // 市价忽略
}

/**
 * 成交金额监听
 */
const turnoverChange = () => {
  let val = form.value.turnover
  if (Number(val) > Number(availableBalance.value)) {
    // 输入金额大于可用余额
    form.value.turnover = availableBalance.value
    val = availableBalance.value
  }
  let tempPrice = 0
  if (form.value.delegateType == 0) {
    // 市价
    tempPrice = stockInfo.value.amount
  } else if (form.value.delegateType == 1) {
    // 限价
    tempPrice = form.value.price
  }
  // 根据成交额 价格 计算数量
  if (Number(tempPrice)) {
    form.value.count = parseInt(_div(val, tempPrice))
    form.value.slider = parseInt(_mul(_div(val, availableBalance.value), 100))
  }
}
/**
 * 滑块监听
 */
const sliderChange = (val) => {
  form.value.slider = val
  val = val / 100
  let tempPrice = 0
  if (form.value.delegateType == 0) {
    // 市价
    tempPrice = stockInfo.value.amount
  } else {
    tempPrice = form.value.price
  }
  if (Number(tempPrice)) {
    // (市价&&买入)||(限价&&买入)
    form.value.count = parseInt(_mul(_div(availableBalance.value, tempPrice), val))
    form.value.turnover = _toFixed(_mul(form.value.count, tempPrice))
  }
}

//触发更改限价->价格
const setTradePrice = (val) => {
  if (form.value.delegateType == 1) {
    // 限价触发
    form.value.price = priceFormat(val)
    priceChange()
  }
}
defineExpose({ setTradePrice })

// 切换币种，重置表单
watch(
  () => stockInfo.value,
  (n) => {
    restForm()
  },
  {
    deep: true
  }
)
</script>

<style scoped lang="scss">
.buy-content {
  flex-grow: 1;
  position: relative;
  padding-bottom: 50px;

  .rightScond {
    margin-top: 10px;

    :deep(.van-popover__wrapper) {
      width: 100%;
    }

    // 市价/限价下拉框
    .rightScondList {
      width: 140px;
      background-color: var(--ex--backup-background-color-2);
      padding: 5px 0;
      font-size: 12px;
      color: var(--ex-passive-font-color);

      .rightScondListItem {
        padding: 10px 0;
        text-align: center;

        &.hightBlue {
          color: var(--ex-trade-buy-bg-color);
        }
      }
    }

    .entrustSelect {
      line-height: normal;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      background: var(--ex--backup-background-color-2);
      padding: 0 10px;
      border-radius: 6px;
      font-size: 12px;
      color: var(--ex-passive-font-color);

      .ScondListItem {
        flex-grow: 1;
        text-align: center;
      }
    }
  }

  .rightThird {
    margin-top: 10px;
    height: 33px;
    background: var(--ex--backup-background-color-2);
    border-radius: 6px;
    font-size: 12px;
    color: var(--ex-passive-font-color);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rightFourth {
    margin: 14px 0;

    .slider-t {
      display: flex;
      justify-content: space-between;

      .item {
        width: 24%;
        height: 7px;
        background: var(--ex--backup-background-color-2);
        border-radius: 1px 1px 1px 1px;

        .hightItem {
          width: 100%;
          height: 100%;
          border-radius: 1px 1px 1px 1px;
          background: var(--ex-trade-buy-bg-color);
          //transition: 0.5s;
        }
      }
    }

    .slider-name {
      margin-top: 5px;
      margin-bottom: 1px;
      display: flex;
      justify-content: space-between;

      .item {
        width: 42px;
        height: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: var(--ex-passive-font-color);
      }

      .itemHight {
        color: var(--ex-default-font-color) !important;
      }
    }
  }

  :deep(.rightFifth) {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 33px;
    border-radius: 6px;
    font-size: 12px;
    text-align: center;
    padding: 0 23px;
    background: var(--ex--backup-background-color-2);
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

    .van-field__control {
      text-align: center;
      color: var(--ex-default-font-color);
    }

    &.van-cell:after {
      border: none;
    }
  }

  .rightSix {
    flex: 1;
    width: 100%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);

    .number {
      margin-left: 4px;
      text-align: end;
      color: var(--ex-default-font-color);
    }
  }

  .rightSeat {
    height: 43px;
  }

  .rightSeven {
    width: 100%;
    position: absolute;
    bottom: 0;

    .maybutton {
      height: 40px;
      background: var(--ex-trade-buy-bg-color);
      border-radius: 6px;
      font-size: 14px;
      color:#fff;

      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .van-slider__bar {
    background: var(--ex-div-bgColor1) !important;
  }

  :deep(.van-slider__button) {
    border: 1px solid #396fee;
  }

  :deep(.van-slider) {
    z-index: 2;
    height: 1px;
    top: -1px;
    display: none;
  }

  .hightColor {
    color: var(--ex-font-color) !important;
    background-color: var(--ex-div-bgColor1) !important;
  }

  .hightColorRed {
    color: var(--ex-font-color) !important;
    background-color: var(--ex-div-bgColor7) !important;
  }
}

.button {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  margin-top: 20px;
  position: absolute;
  bottom: 0;
}
</style>
