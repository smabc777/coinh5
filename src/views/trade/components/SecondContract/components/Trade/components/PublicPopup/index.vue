<template>
<!-- 70% -->
  <van-popup v-model:show="SecondTradeData.show" position="bottom" round teleport="#app" safe-area-inset-top
    safe-area-inset-bottom :style="{ position: 'absolute', height: '75%', maxWidth: 'var(--ex-max-width)' }">

    <div class="popup-content">

      <div class="top-content">
        <div class="top">
          <div class="titleLeft">
            <!-- customizeFlag   1否 2是 -->
            <div class="fw-bold" v-if="coinInfo.coin === 'btc' && ['moonex'].includes(_getConfig('_APP_ENV'))">
              {{
    coinInfo.symbolUpperCase
  }}
            </div>
            <div class="fw-bold" v-else>
              {{
      coinInfo.customizeFlag === 2
        ? matchText(coinInfo.showSymbol, '/USDT')
        : coinInfo.coin.toUpperCase()
    }}
            </div>
            <!-- formData.betContent 买涨 1  买跌 0 -->
            <div class="titleName" :class="{ titleColor: !formData.betContent }">
              {{ formData.betContent ? _t18(`option_buy_up`, ['moonex']) : _t18(`option_buy_short`, ['moonex']) }}
            </div>
          </div>

          <div class="titleRight" @click="SecondTradeData.show = false">
            <van-icon name="close" size="24" color="#333" />
          </div>
        </div>

        <div class="content">

          <div class="item"
            v-if="['trustdefi', 'dev_dark', 'dev', 'zhilian_dark', 'zhilian_light', 'test_light', 'test_dark'].includes(_getConfig('_APP_ENV'))">

            <!-- 下单类型 -->
            <div class="firstHeader fw-bold">{{ _t18('OrderType') }}</div>

            <div>
              <van-radio-group v-model="formData.status" direction="horizontal">
                <van-radio :name="0">{{ _t18('OrderNow') }}</van-radio>
                <van-radio :name="4">{{ _t18('placeAnOrder') }}</van-radio>
              </van-radio-group>
            </div>

            <div class="inputQuantityBox inputDataTop" v-if="formData.status">

              <van-field autocomplete="off" label-width="0" :clickable="false" class="inputQuantity"
                v-model="currentText" is-link readonly name="datePicker" :placeholder="_t18('appointmentTime')"
                @click="flagShowPicker = true" />
              <van-popup v-model:show="flagShowPicker" class="inputDataPopup" position="bottom" round teleport="#trade"
                :style="{ position: 'absolute', maxWidth: 'var(--ex-max-width)' }">
                <van-picker-group :next-step-text="_t18('next_step')" :tabs="[_t18('SelectDate'), _t18('SelectTime')]"
                  :confirm-button-text="_t18('btnConfirm')" :cancel-button-text="_t18('cancel')"
                  @confirm="onConfirmFlag" @cancel="flagShowPicker = false">
                  <van-date-picker :min-date="minDate" :max-date="maxDate" v-model="currentDate" />
                  <van-time-picker v-model="currentTime" />
                </van-picker-group>
              </van-popup>
            </div>

          </div>

          <div class="item">
            <!-- 选择周期 -->
            <div class="firstHeader fw-bold">{{ _t18(`select_cycle`, ['moonex']) }}</div>

            <!-- <van-tabs v-model="cycleIndex" color="transparent" shrink swipeable :swipe-threshold="2" :line-width="0">
              <van-tab v-for="(item, index) in cycleList" :key="index">
                <template #title>
                  <div class="firstItem fw-num" @click="chooseCycle(index, item)"
                    :class="{ hightColor: cycleIndex === index }">
                    <div class="van-tab-item">
                      <div class="item-atv" :class="{ active: cycleIndex == index }">
                        <svg-load name="first-atv"></svg-load>
                      </div>
                      <div class="item-time">{{ formatSeconds(item.period) }}</div>
                      <div class="item-price" :class="{ 'Sell-bg-color': !formData.betContent }">
                        {{ _mul(item.odds, 100) }}%
                      </div>
                    </div>
                  </div>
                </template>
              </van-tab>
            </van-tabs> -->
            <div class="bbbbbb" >
                  <div class="firstItem fw-num" v-for="(item, index) in cycleList" :key="index" @click="chooseCycle(index, item)"
                    :class="{ hightColor: cycleIndex === index }">
                    <div class="van-tab-item">
                      <div class="item-atv" :class="{ active: cycleIndex == index }">
                        <svg-load name="first-atv"></svg-load>
                      </div>
                      <!--                  <div class="item-text ff-num">{{ _t18(`select_cycle`) }}</div>-->
                      <div class="item-time">{{ formatSeconds(item.period) }}</div>
                      <div class="item-price" :class="{ 'Sell-bg-color': !formData.betContent }">
                        {{ _mul(item.odds, 100) }}%
                      </div>
                    </div>
                  </div>
              </div>
          </div>

          <div class="item">
            <!-- 买入量 -->
            <div class="firstHeader fw-bold">{{ _t18(`buying_volume`, ['vitc', 'moonex']) }}</div>
            <div class="inputQuantityBox">
              <van-field autocomplete="off" label-width="0" class="inputQuantity" v-model="formData.betAmount"
                type="number"
                :placeholder="`${_t18(`least`, ['vitc', 'moonex'])} ${cycleObj?.minAmount || 0} ${'USDT'}`" />
              <!--            <p v-if="DIFF_SECOND_FAST.includes(_getConfig('_APP_ENV'))" @click="chooseAll">-->
              <!--              {{ _t18(`all`) }}-->
              <!--            </p>-->
            </div>

            <!--金额快捷选择-->
            <div class="quantityList">
              <div v-show="item.show" class="item fw-num" :class="{
    hightColor:
      (selectAll && item.key === 'all') ||
      Number(formData.betAmount) === Number(item.name)
  }" v-for="(item, index) in quantityList" :key="index" @click="chooseNums(item)">
                <div class="item-atv">
                  <svg-load name="first-atv"></svg-load>
                </div>
                <span>
                  {{ item.name }}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="button">
        <div class="balance mrt10">
          <!-- 可用余额： -->
          <div>{{ _t18(`exchange_balance`) }}：</div>
          <div class="fw-num">{{ availableBalance }} USDT</div>
        </div>
        <!-- 确定 -->
        <van-button type="primary" @click="determine" :color="!formData.betContent ? 'var(--ex-trade-Sell-bg-color)' : 'var(--ex-trade-buy-bg-color)'
    ">
          {{ _t18(`btnConfirm`) }}
        </van-button>
      </div>
    </div>

  </van-popup>
</template>
<script setup>
import { _getConfig, _getDateD, _isRFD, _t18 } from '@/utils/public'
import { countdownNum, matchText } from '@/utils/filters'
import { _mul } from '@/utils/decimal'
import { createSecondContractOrder, getPeriodList } from '@/api/trade'
import { useUserStore } from '@/store/user'
import { useToast } from '@/hook/useToast'
import { ref } from 'vue'
import { showToast } from 'vant'
import dayjs from 'dayjs'
import { useTradeStore } from '@/store/trade'

const tradeStore = useTradeStore()
const userStore = useUserStore()
const { _toast, _showName } = useToast()

//弹窗show
const SecondTradeData = tradeStore.SecondTradeData

// 当前币种数据
const coinInfo = inject('coinInfo')

// 币种价格详情
const coinPriceInfo = computed(() => tradeStore.allCoinPriceInfo[coinInfo.value.coin])

//当前余额 type  3  合约资产
const availableBalance = computed(() => {
  let availableAmount = 0
  userStore.asset.forEach((item) => {
    if (item.type == 1 && item.symbol == 'usdt') {
      availableAmount += item.availableAmount
    }
  })
  return availableAmount
})

//获取周期
const cycleList = ref([])
const cycleObj = ref({})
const getCycleList = async () => {
  const res = await getPeriodList({ secondId: coinInfo.value.id })
  if (res.code === 200) {
    // tradeStore.setTradeData(res.data)
    cycleList.value = res.data
    cycleObj.value = cycleList.value[0]
  }
}
getCycleList()

// 选择周期
const cycleIndex = ref(0)
const chooseCycle = (index, item) => {
  cycleIndex.value = index
  cycleObj.value = item
}


//时间选择弹窗
// const dateTime = new Date().getFullYear();
// const minDate = ref(dayjs().tz(mainStore.timezone).$d)
// const maxDate = ref(dayjs(new Date().setFullYear(dateTime + 1)).tz(mainStore.timezone).$d)
const minDate = ref(_getDateD())
const maxDate = ref(_getDateD(new Date(), 1))

console.log('时间选择', minDate, maxDate)

const currentDate = ref([]);
const currentTime = ref([]);
const currentText = ref('');
const flagShowPicker = ref(false)
const onConfirmFlag = () => {
  currentText.value = currentDate.value.join('/') + ' ' + currentTime.value.join(':')

  flagShowPicker.value = false;
}

//表单数据
const formData = ref({
  betContent: SecondTradeData.key, // 1看涨 0看跌
  betAmount: '', // 输入数量
  openPrice: coinPriceInfo.value?.close || '', //币种价格
  openTime: new Date().getTime(), //当前时间/定时下单时间
  symbol: coinInfo.value.symbol, //币种名称
  coinSymbol: coinInfo.value.coin, // 币种
  baseSymbol: 'usdt', //目标币种
  periodId: '', //周期ID
  minAmount: '', //周期最小金额
  status: 0,//0立即下单 4定时下单
})

// 重置表单
const resetFormDada = () => {
  cycleIndex.value = 0
  formData.value.betAmount = ''
  formData.value.openPrice = coinPriceInfo.value?.close || ''
  formData.value.symbol = coinInfo.value.symbol || ''
  formData.value.coinSymbol = coinInfo.value.coin || ''
  formData.value.periodId = ''
  formData.value.minAmount = ''
  formData.value.status = 0
}

//看涨 1  看跌0
const setPublicPopupShow = (key) => {
  SecondTradeData.show = true
  formData.value.betContent = SecondTradeData.key
  // 重置
  resetFormDada()
}
defineExpose({ setPublicPopupShow })

watch(() => SecondTradeData.show,
  () => {
    formData.value.betContent = SecondTradeData.key
  }
)

//金额快捷选择数据
const quantityList = computed(() => {
  let tempList = []
  if (['gridai'].includes(__config._APP_ENV)) {
    if (cycleObj.value.period == 30) {
      tempList = ['500', '1000', '2000', '3000', '50000', '10000', '20000', 'all']
    } else if (cycleObj.value.period == 60) {
      tempList = ['1000', '2000', '3000', '5000', '10000', '20000', '30000', 'all']
    } else if (cycleObj.value.period == 120) {
      tempList = ['3000', '5000', '10000', '20000', '30000', '50000', '100000', 'all']
    } else if (cycleObj.value.period == 180) {
      tempList = ['5000', '10000', '20000', '30000', '500000', '100000', '150000', 'all']
    } else {
      tempList = ['500', '1000', '2000', '3000', '50000', '10000', '20000', 'all']
    }

  }
  // let tempList = ['10', '20', '50', '100', '500', '1000', '2000', 'all']

  if (['trustdefi'].includes(__config._APP_ENV)) {
    tempList = ['100', '500', '1000', '5000', '10000', '20000', '50000', 'all']
  } else if (['moonex'].includes(__config._APP_ENV)) {
    tempList = ['500', '1000', '2000', '3000', '50000', '10000', '20000', 'all']
  }

  tempList.forEach((elem, index) => {
    if (elem == 'all') {
      // 全部
      tempList[index] = { name: _showName(`all`), key: elem, show: true }
    } else {
      tempList[index] = { name: elem, key: elem, show: true }
    }
  })
  return tempList
})

//快捷金额设置
const selectAll = ref(false)
const chooseNums = (item) => {
  if (item.key === 'all') {
    formData.value.betAmount = availableBalance.value
    selectAll.value = true
  } else {
    formData.value.betAmount = +item.name
    selectAll.value = false
  }
}

//确认提交
const setOverlayPulic = inject('setOverlayPulic')
const determine = async () => {
  if (Number(formData.value.betAmount) < cycleObj.value?.minAmount) {
    // 最少输入
    return showToast(`${_showName(`minimum_input`, ['moonex'])} ${cycleObj?.value.minAmount} USDT`)
  }

  if (Number(formData.value.betAmount) > cycleObj.value?.maxAmount) {
    // 最多输入
    return showToast(`${_showName(`Maximum_input`)} ${cycleObj.value?.maxAmount} USDT`)
  }

  if (Number(formData.value.betAmount) > availableBalance.value) {
    // 输入量超出可用余额
    return _toast('Input_amount_exceeds')
  }

  // 更新币种价格
  formData.value.openPrice = coinPriceInfo.value?.close

  // 更新币种数据
  formData.value.symbol = coinInfo.value.symbol || ''
  formData.value.coinSymbol = coinInfo.value.coin || ''

  //更新当前时间
  formData.value.openTime = new Date(_getDateD()).getTime()
  let openDate = new Date(currentText.value).getTime()

  console.log('当前下单时间', _getDateD())
  console.log('预约时间', currentText.value)
  //有预约时间
  if (formData.value.status == 4) {
    if (!openDate || (formData.value.openTime > openDate)) {
      return (_toast('greaterThanCurrentTime'))
    }
    formData.value.openTime = openDate
  }

  // 周期id
  formData.value.periodId = cycleObj.value.id

  console.log(formData.value)
  const res = await createSecondContractOrder(formData.value, { loading: true })
  if (res.code === 200) {
    SecondTradeData.show = false

    if (formData.value.status == 4) {
      return (_toast('AppointmentSuccessful'))
    }
    //显示订单倒计时
    setOverlayPulic({
      orderId: res.data.id,
      ...formData.value,
      ...cycleObj.value,
      buyPrice: res.data.openPrice
    })
  } else {
    showToast(res.msg)
  }
}

// 周期运算
const formatSeconds = (seconds) => {
  if (seconds >= 3600 && seconds % 3600 === 0) {
    return `${Math.floor(seconds / 3600)}h`
  } else {
    return `${seconds}s`
  }
}
</script>

<style scoped lang="scss">
.popup-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;


  .top-content {
    overflow-y: auto;
    flex-grow: .6;

    .top {
      flex-grow: 1;
      width: 100%;
      padding: 18px 20px;
      // background-color: var(--ex-primary-color);
      display: flex;
      justify-content: space-between;
      border-bottom:1px solid var(--ex--backup-background-color-2);

      .titleLeft {
        font-size: 16px;
        color: var(--ex-default-font-color);
        display: flex;
        align-items: center;

        .titleName {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ex-trade-buy-bg-color);
          padding: 2px 4px;
          font-size: 12px;
          margin-left: 8px;
          border-radius: 4px;
          color:#fff;
        }

        .titleColor {
          background: var(--ex-trade-Sell-bg-color);
        }
      }
    }

    .content {
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      background: var(--ex-backup--background-color);
      padding: 0 16px;


      .item {
        .firstHeader {
          padding-top: 20px;
          padding-bottom: 16px;
          font-size: 12px;
          color: var(--ex-default-font-color);
        }

        :deep(.van-tabs) {
          .van-tabs__wrap {
            padding: 0 !important;
            margin: 0 !important;
          }

          .van-tab--line {
            padding: 0;
            margin-right: 10px;
          }


          .firstItem {
            min-width: 78px;
            min-height: 90px;
            background: var(--ex--backup-background-color-2);
            border: 1px solid var(--ex--backup-background-color-2);
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            color: var(--ex-default-font-color);
            display: flex;
            align-items: center;
            justify-content: center;

            .van-tab-item {

              .item-text {
                font-size: 12px;
                margin-top: 16px;
              }

              .item-time {
                margin-top: 8px;
                color: #333;
                font-size: 18px;
              }

              .item-price {
                margin-top: 6px;
                color: var(--ex-trade-buy-bg-color);
                font-size: 12px;
              }

              .item-atv {
                position: absolute;
                top: -1px;
                right: 0;
                display: none;

                img {
                  width: 33px;
                  height: 33px;
                }
              }
            }

            &.hightColor {
              background: rgb(162 241 208 / 11%);
              border: 1px solid var(--ex-trade-buy-bg-color);

              .item-atv {
                display: block;
              }
            }

            .firstItemTop {
              line-height: 38px;
            }
          }
        }

        //输入量
        :deep(.inputQuantityBox) {
          overflow: hidden;
          border-radius: 8px;
          display: flex;
          align-items: center;
          border: 1px solid var(--ex-border-color2);

          /* 焦点状态样式 */
          &:hover {
            border: 1px solid var(--ex-input-focus-color);
            outline: none;

            /* 防止点击时出现默认的浏览器外观 */
            input::placeholder {
              color: var(--ex-white);
            }
          }

          &.inputDataTop {
            margin-top: 16px;
          }

        }


        .quantityList {
          margin-top: 16px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: flex-start;

          .item {
            width: calc(25% - 7.5px);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 44px;
            background:transparent;
            border: 1px solid var(--ex--backup-background-color-2);
            color: var(--ex-font-color8);
            border-radius: 10px;
            font-size: 12px;
            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;

            &:nth-child(4n) {
              margin-right: 0;
            }

            .item-atv {
              position: absolute;
              top: 0;
              right: 0;
              display: none;

              img {
                width: 33px;
                height: 33px;
              }
            }

            &.hightColor {
              background: rgba(97, 58, 241, 0.11);
              border: 1px solid #613af1;
              color: var(--ex-default-font-color);

              .item-atv {
                display: block;
              }
            }
          }
        }
      }


      .buy-bg-color {
        color: var(--ex-trade-buy-bg-color) !important;
      }

      .Sell-bg-color {
        color: var(--ex-trade-Sell-bg-color) !important;
      }

      .balance {
        font-size: 14px;
        color: var(--ex-default-font-color);
        display: flex;
      }

      .mrt10 {
        margin-top: 10px;
      }
    }

  }


  .button {
    width: 100%;
    padding: 10px 16px 0;
    background: var(--ex-backup--background-color);
    border-top: 1px solid var(--ex-border-line);

    .balance {
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      margin-bottom: 15px;
    }

    .van-button {
      height: 50px;
      width: 100%;
    }
  }
}


.inputDataPopup {
  :deep(.van-tabs) {
    margin-top: 10px;

    .van-tabs__line {
      display: none;
    }

    .van-tab {
      padding: 6px 8px;
      background: var(--ex--backup-background-color-2);
      border: 1px solid var(--ex--backup-background-color-2);
      text-align: center;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .van-tab--active {
      background: rgba(97, 58, 241, 0.11);
      color: var(--ex-home-tabs-text-atv-color);
      border-radius: 8px;
      border: 1px solid #613af1;
    }
  }

  :deep(.van-picker__frame) {}
}
.bbbbbb{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  .firstItem:nth-child(1),.firstItem:nth-child(2),.firstItem:nth-child(3){
    margin-bottom:16px;
  }
  .firstItem {
  position: relative;

            width:30%;
            background: var(--ex--backup-background-color-2);
            border: 1px solid var(--ex--backup-background-color-2);
            border-radius: 10px;
            text-align: center;
            font-size: 14px;
            color: var(--ex-default-font-color);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 0;

            .van-tab-item {

              .item-text {
                font-size: 12px;
                margin-top: 16px;
              }

              .item-time {
                margin-top: 8px;
                color: #333;
                font-size: 18px;
              }

              .item-price {
                margin-top: 6px;
                color: var(--ex-trade-buy-bg-color);
                font-size: 12px;
              }

              .item-atv {
                position: absolute;
                top: -1px;
                right: 0;
                display: none;

                img {
                  width: 33px;
                  height: 33px;
                }
              }
            }

            &.hightColor {
              background: rgb(162 241 208 / 11%);
              border: 1px solid var(--ex-trade-buy-bg-color);

              .item-atv {
                display: block;
              }
            }

            .firstItemTop {
              line-height: 38px;
            }
          }
}
</style>
