<template>
  <div class="content_right">
    <!-- 市价/限价委托   -->
    <div class="rightFirst">
      <div class="left firstItem">
        <van-popover v-model:show="showPopover" :show-arrow="false">
          <div class="rightScondList">
            <div class="rightScondListItem" v-for="(item, index) in delegateTypeList" :key="index"
              :class="{ hightBlue: item.value == formData.delegateType }" @click="checkedDelegateType(item)">
              {{ item.label }}
            </div>
          </div>
          <template #reference>
            <div class="entrustSelect left">
              <!--formData.delegateType 1'市价委托'  0 '限价委托'  -->
              <div>
                {{ delegateTypeList[(formData.delegateType == 1 ? 0 : 1)].label }}
              </div>
              <van-icon name="arrow-down" size="12" color="var(--ex-default-font-color)" />
            </div>
          </template>
        </van-popover>
      </div>

      <!--杠杆倍数-->
      <div class="right firstItem">
        <van-popover v-model:show="showPopoverNum" :show-arrow="false">
          <div class="rightScondListNum">
            <div v-for="item in numList" :key="item.id" class="rightScondListItem"
              :class="{ hightBlue: item.name === formData.leverage }" @click="selectNum(item)">
              {{ item.name }}
            </div>
          </div>
          <template #reference>
            <div class="entrustSelect right">
              <div class="fw-num">{{ formData.leverage }}</div>
              <van-icon name="arrow-down" size="12" color="var(--ex-default-font-color)" />
            </div>
          </template>
        </van-popover>
      </div>
    </div>

    <!-- 市价占位 -->
    <div class="rightThird" v-if="formData.delegateType">{{ _t18(`market_price`) }}</div>


    <!-- 限价委托：价格 -->
    <van-field autocomplete="off" v-if="!formData.delegateType" class="rightFifth" type="number"
      v-model="formData.delegatePrice" :placeholder="_t18(`price`)" />

    <!-- 通用：数量(手lots/张lots2) -->
    <van-field autocomplete="off" class="rightFifth" type="number" v-model="formData.delegateTotal"
      :placeholder="!['smartfund'].includes(_getConfig('_APP_ENV')) ? `${_t18(`metastaking_bb_count`, 'smartfund')}` : `${_t18(`metastaking_bb_count`)}(${_t18(`lots`)})`" />

    <!-- 滑块部分 -->
    <div class="rightFourth">
      <div class="lineBg">
        <div class="lineBg-active" :style="{ width: formData.slider + '%' }"></div>
        <div class="lineBg-inactive"></div>
        <div class="node" :class="{ active: index * 25 < formData.slider }" v-for="(item, index) in 5" :key="index"
          @click="formData.slider = index * 25"></div>
      </div>
      <van-slider v-model="formData.slider" active-color="none" inactive-color="none">
        <template #button>
          <div class="init">
            <div :class="{ marl: formData.slider <= 3, marr: formData.slider > 98 }">
              <div class="initimg"></div>
              <div class="initNum ff-num">{{ formData.slider }}%</div>
            </div>
          </div>
        </template>
      </van-slider>

    </div>
    <!-- 滑块固定值按钮 -->
    <div class="slider-but" v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">
      <div v-for="(item, index) in sliderButList" :key="index" class=" number" @click="formData.slider = item"
        :class="{ atv: formData.slider == item }">
        <span>{{ item }}%</span>
      </div>
    </div>

    <!-- 可用余额 -->
    <div class="nineSix">
      <div>{{ _t18(`account_available`) }}</div>
      <div class="number fw-num">{{ availableBalance || 0 }} USDT</div>
    </div>
    <!-- 手续费 -->
     <div class="nineSix" v-if="handlingFee != null">
      <div>{{ _t18(`withdraw_commission`) }}</div>
      <div class="number fw-num">{{ handlingFee }} USDT</div>
    </div>


    <!-- 买入(做多)按钮 -->
    <div class="rightSeven">
      <div class="maybutton" @click="buyOrSell(0)">
        {{ _t18(`purchase`) }} ({{ _t18(`going_long`) }})
      </div>
    </div>

    <!-- 可开空-->
    <div class="nineSix">
      <p>{{ _t18(`can_do_more`) }}</p>
      <div class="number fw-num">
        {{ bearableValue ? _toFixed(bearableValue, 4) : 0 }}
        {{
          coinInfo.customizeFlag === 2
            ? matchText(coinInfo.showSymbol, '/USDT')
            : coinInfo.coin?.toUpperCase()
        }}
      </div>
    </div>

    <!-- 保证金 -->
    <div class="nineSix">
      <div>{{ _t18(`cash_deposit`) }}</div>
      <div class="number fw-num">{{ _toFixed(marginValue, 4) }} USDT</div>
    </div>

    <!-- 合约面值 das特殊-->
    <div class="nineSix">
      <div>{{ _t18(`contract_face_value`, ['aams', 'smartfund']) }}</div>
      <div class="number fw-num">
        {{ coinInfo.shareNumber }}
        <span v-if="['das'].includes(_getConfig('_APP_ENV'))">
          {{ coinInfo.customizeFlag === 2 ? matchText(coinInfo.showSymbol, '/USDT') : 'USDT' }}
        </span>
        <span v-else>
          {{
          coinInfo.customizeFlag === 2
            ? matchText(coinInfo.showSymbol, '/USDT')
            : coinInfo.coin?.toUpperCase()
        }}
        </span>
        /{{ _t18(`lots`, ['smartfund']) }}
      </div>
    </div>

    <!-- 卖出(开空)按钮 -->
    <div class="rightSeven">
      <div class="maybutton hightColorRed" @click="buyOrSell(1)">
        {{ _t18(`bb_sell1`) }} ({{ _t18(`open_short`) }})
      </div>
    </div>

    <!-- 可开空 paxpay特殊-->
    <div class="nineSix">
      <p v-if="['paxpay'].includes(_getConfig('_APP_ENV'))">
        {{ _t18(`openable_less`, ['paxpay']) }}
      </p>
      <p v-else>{{ _t18(`openable`, ['aams', 'smartfund']) }}</p>
      <div class="number fw-num">
        {{ bearableValue ? _toFixed(bearableValue, 4) : 0 }}
        {{
          coinInfo.customizeFlag === 2
            ? matchText(coinInfo.showSymbol, '/USDT')
            : coinInfo.coin?.toUpperCase()
        }}
      </div>
    </div>

    <!-- 保证金 -->
    <div class="nineSix">
      <div>{{ _t18(`cash_deposit`) }}</div>
      <div class="number fw-num">{{ _toFixed(marginValue, 4) }} USDT</div>
    </div>

    <!-- 合约面值 das特殊 -->
    <div class="nineSix">
      <div>{{ _t18(`contract_face_value`, ['smartfund']) }}</div>
      <div class="number fw-num">
        {{ coinInfo.shareNumber }}
        <span v-if="['dev'].includes(_getConfig('_APP_ENV'))">
          {{ coinInfo.customizeFlag === 2 ? matchText(coinInfo.showSymbol, '/USDT') : 'USDT' }}
        </span>
        <span v-else>
          {{
          coinInfo.customizeFlag === 2
            ? matchText(coinInfo.showSymbol, '/USDT')
            : coinInfo.coin?.toUpperCase()
        }}
        </span>
        /{{ _t18('lots', ['smartfund']) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { provide, inject, ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { _mul, _div, _toFixed } from '@/utils/decimal'
import { DIFF_ISFREEZE, DIFF_ISFREEZE_RXCE } from '@/config/index'
import { useFreeze } from '@/hook/useFreeze'

const { _isFreeze } = useFreeze()
import { _getConfig, _t18 } from '@/utils/public'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { useToast } from '@/hook/useToast'
import { submitUcontract } from '@/api/trade/index'
import { socketDict } from '@/config/dict'
import PubSub from 'pubsub-js'
import { useTradeStore } from '@/store/trade'
import { useMainStore } from '@/store/index'
import { useUserStore } from '@/store/user'

const { _toast, _showName } = useToast()
const mainStore = useMainStore()
const tradeStore = useTradeStore()
const userStore = useUserStore()
const { asset } = storeToRefs(userStore)


//订单刷新
const OrderRefresh = inject('OrderRefresh')

//当前币种信息
const coinInfo = inject('coinInfo')

//可用余额
const availableBalance = inject('availableBalance')

//币种信息
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[coinInfo.value.coin] || {}
})

//保证金
const marginValue = ref('0')


//表单数据
const formData = ref({
  symbol: coinInfo.value.coin, //币种
  leverage: '', //杠杆倍数
  delegatePrice: '', //价格
  delegateTotal: '', //数量
  type: 0, //0买入 1卖出
  delegateType: 1,//委托类型1市价 0限价
  slider: 0 // 滑块
})

//重置表单数据
const resetFromData = () => {
  formData.value.delegateType = 1
  formData.value.delegateTotal = ''
  formData.value.delegatePrice = ''
  formData.value.slider = 0
  formData.value.leverage = numList.value[0]?.name || ''

}

// 手续费
const handlingFee = ref(null)

// 价格百分比固定按钮
const sliderButList = ref([
  0, 25, 50, 75, 100
])

// 市价 限价 数据
const delegateTypeList = computed(() => [
  { label: _showName(`bb_market_order`), placeholder: _showName(`market_price`), value: 1 },
  { label: _showName(`bb_Limit_order`), placeholder: _showName(`limit_price`), value: 0 }
])

// 限价/市价选择控件
// 切换限价/市价
const showPopover = ref(false) // 委托类型
const checkedDelegateType = (item) => {
  showPopover.value = false
  //清理数据
  resetFromData()
  formData.value.delegateType = item.value
}

// 限价委托：设置交易价格
const setTradePrice = (val = '') => {
  formData.value.delegatePrice = !formData.value.delegateType ? val : ''
}

// 币种对象
const contractObj = ref({})
//杠杆倍数数据
const showPopoverNum = ref(false) //弹窗
const numList = computed(() => {
  let arr = []
  tradeStore.contractCoinList.forEach((element) => {
    if (element.coin === coinInfo.value.coin) {
      contractObj.value = element
      if (element.leverage) {
        element.leverage.split(',').forEach((element) => {
          arr.push({
            name: element + 'X',
            id: element
          })
        })
      }
    }
  })

  //设置倍数默认值
  formData.value.leverage = arr[0]?.name

  return arr
})

// 切换杠杆倍数
const selectNum = (item) => {
  formData.value.leverage = item.name
  showPopoverNum.value = false
}


// 切换币种：重置价格、数量，杠杆变化
watch(
  () => coinInfo.value.coin,
  (n) => {
    // 清理数据
    resetFromData()
    // 设置价格
    setTradePrice()
  }
)

// 监听滑块，修改数量（手）
watch(
  () => formData.value.slider,
  (n) => {
    let priceNew
    if (formData.value.delegateType) {
      // 市价委托
      priceNew = coinPriceInfo.value?.close
    } else {
      // 限价委托
      priceNew = formData.value.delegatePrice
    }
    if (!priceNew) {
      return (formData.value.slider = 0)
    }
    // shareNumber 没值
    if (!coinInfo.value?.shareNumber) return false

    let numberSlider

    if (['das'].includes(__config._APP_ENV)) {
      // 可用余额/合约面值
      // availableBalance/shareNumber
      numberSlider = _div(availableBalance.value, coinInfo.value?.shareNumber || '')
    } else {
      // 可用余额*杠杆倍数/可用余额市价或输入价格/合约面值
      // availableBalance*transactionNum/priceNew/shareNumber
      numberSlider = _div(
        _div(
          _mul(
            availableBalance.value,
            formData.value.leverage?.substr(0, formData.value.leverage.length - 1)
          ),
          priceNew
        ),
        coinInfo.value?.shareNumber || ''
      )
    }
    // 向下取整
    formData.value.delegateTotal = Math.floor(_mul(numberSlider, _div(n, 100)))
  }
)

//监听数量，计算保证金
watch(
  () => formData.value.delegateTotal,
  (n) => {
    if (!n) return (marginValue.value = '0')
    // const regex = /^[1-9]\d*$/
    // 数量只能输入整数
    // if (!regex.test(n)) return _toast('quantitycan_onlyenter_integers')

    // shareNumber 没值
    if (!coinInfo.value?.shareNumber) return false

    var typeId = ''
    numList.value.forEach((element) => {
      if (element.name === formData.value.leverage) {
        return (typeId = element.id)
      }
    })

    // coinpark台子
    // 计算手续费 = (((价格*数量)*合约面值)/杠杆倍数)*开仓手续
    if (['cmmetrics'].includes(__config._APP_ENV)) {
      handlingFee.value = _toFixed(
        _mul(
          _div(
            _mul(
              _mul(coinPriceInfo.value.close, n),
              contractObj.value?.shareNumber
            ),
            typeId
          ),
          contractObj.value.openFee || 0
        ),
        6
      )
    }


    if (['das'].includes(__config._APP_ENV)) {
      // das平台：保证金=手*合约面值
      // formData.value.delegateTotal*contractObj.value.shareNumber
      marginValue.value = _mul(formData.value.delegateTotal, contractObj.value?.shareNumber || '')
    } else {
      //保证金=价格*数量*合约面值/杠杆倍数
      // coinPriceInfo.value.close*n*contractObj.value.shareNumber/typeId
      marginValue.value =
        _toFixed(
          _div(
            _mul(
              _mul(
                coinPriceInfo.value.close,
                n
              ),
              contractObj.value?.shareNumber || ''
            ),
            typeId
          ),
          6
        )
    }
  }, { immediate: false }
)
// 监听价格
watch(
  () => formData.value.delegatePrice,
  (n) => {
    if (n) {
      if (!/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(n) || Number(n) === 0) {
        // 请输入最多保留6位小数的大于0的价格
        return _toast('Please_entera_price_greater')
      }
    } else {
      formData.value.slider = 0
      formData.value.delegateTotal = ''
    }
  }
)
// 监听杠杆倍数
watch(
  () => formData.value.leverage,
  (n) => {
    const CurN = n?.substr(0, n.length - 1)

    let priceNew
    if (formData.value.delegateType) {
      priceNew = coinPriceInfo.value?.close
    } else {
      priceNew = formData.value.delegatePrice
    }
    if (!priceNew) {
      formData.value.slider = 0
      return
    }
    // shareNumber 没值
    if (!coinInfo.value?.shareNumber) return false


    let numberSlider = _div(
      _div(_mul(availableBalance.value, CurN), priceNew),
      coinInfo.value?.shareNumber || ''
    )
    // 向下取整
    if (!['das'].includes(__config._APP_ENV)) {
      formData.value.delegateTotal = Math.floor(_mul(numberSlider, _div(formData.value.slider, 100)))
    }
  }
)

// 可开空=可用/价格*杠杆倍数
// das可开空=合约面值*手/价格*杠杆
const bearableValue = computed(() => {
  let price = formData.value.delegateType ? coinPriceInfo.value.close : formData.value.delegatePrice
  if (price) {
    var typeId = ''
    numList.value.forEach((element) => {
      if (element.name === formData.value.leverage) {
        return (typeId = element.id)
      }
    })
    let result
    if (['das'].includes(__config._APP_ENV)) {
      result = _mul(_div(_mul(formData.value.delegateTotal, contractObj.value.shareNumber), price), typeId)
    } else {
      result = _mul(_div(availableBalance.value, price), typeId)
    }
    return result
  } else {
    return 0
  }
})


/**
 * 买入/卖出按钮
 * type 1买入 2 卖出
 */

const buyOrSellForm = (type) => {
  // 杠杆倍数
  var typeId = ''
  numList.value.forEach((element) => {
    if (element.name === formData.value.leverage) {
      return (typeId = element.id)
    }
  })
  let data = {
    symbol: coinInfo.value.coin, //币种
    leverage: typeId, //杠杆倍数
    delegatePrice: formData.value.delegateType ? coinPriceInfo.value.close : formData.value.delegatePrice, //价格
    delegateTotal: formData.value.delegateTotal, //数量
    type: type, //0买入 1卖出
    delegateType: formData.value.delegateType //委托类型0市价 1限价
  }

  if (
    !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(data.delegatePrice) ||
    Number(data.delegatePrice) === 0
  ) {
    // 请输入最多保留6位小数的大于0的价格
    return _toast('Please_entera_price_greater')
  }
  if (!/^[1-9]\d*$/.test(data.delegateTotal)) {
    // 数量只能输入整数
    return _toast('quantitycan_onlyenter_integers')
  }
  try {
    // showLoadingToast({
    //   forbidClick: true,
    //   duration: 0
    // })
    submitUcontract(data, { loading: true }).then(async (res) => {
      if (res.code === 200) {
        // !type ? '买入' : '卖出'}成功`
        _toast('quote_addSuccess')
        // 刷新订单
        await nextTick()
        OrderRefresh()
      } else {
        closeToast()
        showToast(res.msg)
      }
    })
  } catch (error) {
    closeToast()
  }
}
const buyOrSell = (type) => {
  if (!_isFreeze(DIFF_ISFREEZE, 'FINANCIAL')) return
  buyOrSellForm(type)
  // if (DIFF_ISFREEZE.includes(__config._APP_ENV) || DIFF_ISFREEZE_RXCE.includes(__config._APP_ENV)) {
  //   if (_isFreeze(DIFF_ISFREEZE) && _isFreeze(DIFF_ISFREEZE_RXCE)) {
  //     buyOrSellForm(type)
  //   }
  // } else {
  //   buyOrSellForm(type)
  // }
}


/**
 * 订单模块
 */

/**
 * 订单结算，更新订单和用户信息
 */
const coinOverKey = ref('')
const settlementKey = ref('')

const coinOverNotification = () => {
  /**
   * rxce平台周期改变通知
   */
  coinOverKey.value = PubSub.subscribe(socketDict.POSITION, async (key, data) => {
    const { position } = JSON.parse(data.date.message)
    if (position) {
      await nextTick()
      OrderRefresh()
    }
  })
  /**
   * 结算改变通知
   */
  settlementKey.value = PubSub.subscribe(socketDict.SETTLEMENT, async (key, data) => {
    const { type } = JSON.parse(data.date.message)
    if (type == 2) {
      await nextTick()
      OrderRefresh()
    }
  })
}
onMounted(() => {
  coinOverNotification()
})

onUnmounted(() => {
  settlementKey && PubSub.unsubscribe(settlementKey)
  coinOverKey && PubSub.unsubscribe(coinOverKey)
})
</script>

<style scoped lang="scss">
.content_right {
  //padding-right:  14px;
  flex-grow: 1;
  overflow: hidden;

  .slider-but {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    width: 100%;
    margin-top: 6px;

    div {
      border-radius: 4px;
      padding: 4px 2px;
      min-width: 28px;
      text-align: center;
      background: var(--ex--backup-background-color-2);

      span {
        display: inline-block;
        color: var(--ex-default-font-color);

        font-size: 12px;
        transform: scale(0.8333);
      }

      &.atv {
        span {
          color: var(--ex-two-level-theme-color);
        }
      }
    }
  }

  .rightFirst {
    height: 33px;
    font-size: 12px;
    display: flex;

    //justify-content: space-between;
    .firstItem {
      background: var(--ex-default-background-color);
      border-radius: 6px;
      overflow: hidden;
    }

    .left {
      width: 96px;
      margin-right: 6px;
    }

    .right {
      flex-grow: 1;
    }

    :deep(.van-popover__wrapper) {
      width: 100%;

    }

    .entrustSelect {
      height: 32px;
      background: var(--ex--backup-background-color-2);
      padding: 0 10px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      color: var(--ex-default-font-color);

    }

    .entrustSelect2 {
      justify-content: center;
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


  .rightFourth {
    height: 10px;
    margin-top: 36px;
    position: relative;
    display: flex;

    .lineBg {
      position: absolute;
      top: 6px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      //z-index: 2;

      .node {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        background: #B9C1D9;
        border: 2px solid rgba(255, 255, 255, 0.24);
        margin-top: -2px;
      }

      .active {
        background: var(--ex-trade-buy-bg-color);
        border: 2px solid rgba(0, 226, 145, 0.44);
        z-index: 2;
      }

      .lineBg-inactive {
        position: absolute;
        background: #d9d9d9;
        height: 1px;
        width: 100%;
        top: 0;
      }

      .lineBg-active {
        position: absolute;
        background: var(--ex-trade-buy-bg-color);
        height: 1px;
        z-index: 1;
        top: 0;
      }
    }

    .init {


      .initimg {
        width: 8px;
        height: 8px;
        background: var(--ex-trade-buy-bg-color);
        border-radius: 100%;
        position: relative;
        transform: scaleY(0.5);
      }

      .initNum {
        transform: scaleY(0.5);
        margin-top: 6px;
        font-size: 12px;
        color: var(--ex-font-color);
        padding: 2px 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ex-trade-buy-bg-color);
        border-radius: 1px;
        position: absolute;
        top: -20px;
        left: -10px;
      }

      .marl {
        .initNum {
          left: 0;
          right: -26px;
        }
      }

      .marr {
        .initNum {
          left: -26px;
          right: 0;
        }
      }
    }

    :deep(.van-slider) {
      position: absolute;
      top: 6px;
      z-index: 3;
      left: 4px;
      width: calc(100% - 6.9px);
    }
  }

  .rightSix0 {
    margin-top: 25px;
    flex: 1;
    width: 100%;
    display: flex;

    p {
      flex: 1;
      text-align: center;
      border: 1px solid var(--ex-div-bgColor5);
      color: var(--ex-font-color1);
      margin: 0 1px;
      padding: 5px 0;
      border-radius: 2px;
    }

    p:first-child {
      margin-left: 0;
    }

    p:last-child {
      margin-right: 0;
    }

    p.active {
      background: var(--ex-div-bgColor1);
      color: var(--ex-font-color);
      border: 1px solid var(--ex-div-bgColor1);
    }
  }

  .rightSix {
    margin-top: 25px;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 10px;
    white-space: nowrap;
    color: var(--ex-passive-font-color);

    .number {
      color: var(--ex-default-font-color);
    }
  }

  .handlingFee {
    margin-top: 10px;
    // width: 100%;
    display: flex;
    justify-content: space-around;
    // align-items: center;
    // font-size: 10px;
    // white-space: nowrap;
    color: var(--ex-passive-font-color);

    .number {
      color: var(--ex-default-font-color);
    }
  }

  .rightSeven {
    margin-top: 16px;

    .maybutton {
      height: 40px;
      background: var(--ex-trade-buy-bg-color);
      border-radius: 6px;
      font-size: 14px;
      color: #ffff;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hightColorRed {
      background: var(--ex-trade-Sell-bg-color);
    }
  }

  .nineSix {
    margin-top: 15px;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--ex-passive-font-color);

    .number {
      text-align: right;
      color: var(--ex-default-font-color);
    }
  }
}

// 市价/限价下拉框
.rightScondList {
  width: 104px;
  // margin-top: 3px;
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

.rightScondListNum {
  width: 66px;
  // margin-top: 3px;
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

:deep(.van-slider) {
  z-index: 2;
  height: 1px;
  top: -1px;

  .van-slider__bar {
    transform: scaleY(2);
  }
}

.line {
  height: 5px;
  background: var(--ex-div-bgColor10);
}

.entrust {
  position: relative;
}

:deep(.van-tabs__nav) {
  padding-right: 80px;
}

.entrustR {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #fff;
  padding: 15px 5px;

  .entrustRImg {
    padding: 0 8px;
    font-size: 12px;
  }
}
</style>
