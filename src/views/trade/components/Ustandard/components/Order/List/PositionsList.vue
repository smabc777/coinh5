<template>
  <div class="content">
    <van-loading v-if="loading"></van-loading>
    <van-list v-if="dataNewList?.length > 0" :finished="finished"
      :finished-text="dataNewList?.length ? _t18(`no_more_data`) : ''" :loading-text="_t18(`loading`)" @load="onLoad"
      :immediate-check="false" v-model:loading="loading">
      <van-cell v-for="(item, index) in dataNewList" :key="index">
        <div class="hisToryList">
          <div class="header">
            <div class="headerLeft">
              <!-- !item.type ? '做多' : '开空'  -->
              <div class="name" :class="!item?.type ? 'bgcBlue' : 'bgcRed'">
                {{ !item?.type ? _t18(`going_long`) : _t18(`open_short`) }}
              </div>
              <div class="fw-bold">
                {{ item?.showCoin ? item?.showCoin : item?.symbol.toUpperCase() + '/USDT' }}
              </div>
              <div class="ff-num headerLeftIcon">{{ item.leverage }}x</div>
            </div>
          </div>
          <div class="list">
            <!-- 持仓量 -->
            <div class="item">
              <div>{{ _t18(`open_interest`, ['smartfund']) }}</div>
              <div class="fw-num numItem">
                {{ item.openNum }}
                {{
      item.showCoin ? matchText(item?.showCoin, '/USDT') : item?.symbol.toUpperCase()
    }}
              </div>
            </div>
            <!-- 持仓担保资产 -->
            <!--            <div class="item">-->
            <!--              <div>{{ _t18(`position_collateral_assets`, ['rxce']) }}</div>-->
            <!--              <div class="fw-num numItem">{{ adjustAmountPrice(item) }} USDT</div>-->
            <!--            </div>-->
            <!-- 持仓保证金 -->
            <div class="item" v-if="['rxce'].includes(_getConfig('_APP_ENV'))">
              <div>{{ _t18(`Position_margin`) }}</div>
              <div class="fw-num numItem">{{ item.remainMargin }} USDT</div>
            </div>
            <!-- 担保资产率 -->
            <!--            <div class="item">-->
            <!--              <div>{{ _t18(`guaranteed_asset_ratio`) }}</div>-->
            <!--              <div class="fw-num numItem">{{ guaranteePrice(item) }}%</div>-->
            <!--            </div>-->
            <!-- 开仓均价 -->
            <div class="item">
              <div>{{ _t18(`average_opening_price`) }}</div>
              <div class="fw-num numItem">{{ item.openPrice }} USDT</div>
            </div>
            <!-- 最新价 -->
            <div class="item">
              <div>{{ _t18(`home_newPrice`) }}</div>
              <div class="fw-num numItem">{{ coinPriceInfo(item) }} USDT</div>
            </div>
            <!-- 预计强平价 -->
            <div class="item" v-if="!['rxce'].includes(_getConfig('_APP_ENV'))">
              <div>{{ _t18(`expected_strong_parity`) }}</div>
              <div class="fw-num numItem">
                {{ item.closePrice <= 0 ? '--' : item.closePrice }}USDT </div>
              </div>

              <div v-if="['cmmetrics'].includes(_getConfig('_APP_ENV'))">

                <!--保证金 1-->
                <div class="item">
                  <div>{{ _t18(`cash_deposit`) }}</div>
                  <div class="fw-num numItem">{{ item.amount }} USDT</div>
                </div>
                <!--开仓手续费 -->
                <div class="item">
                  <div>{{ _t18(`Opening-fees`) }}</div>
                  <div class="fw-num numItem">{{ item.openFee || 0 }} USDT</div>
                </div>
                <!--平仓手续费 -->
                <div class="item">
                  <div>{{ _t18(`Closing-fees`) }}</div>
                  <div class="fw-num numItem">{{ item.sellFee || 0 }} USDT</div>
                </div>
                <!--杠杆倍数 -->
                <div class="item">
                  <div>{{ _t18(`Leverage-ratio`) }}</div>
                  <div class="fw-num numItem">
                    {{ item.leverage }}
                  </div>
                </div>
              </div>

              <!-- 收益率 -->
              <div class="item">
                <div>{{ _t18(`yield_rate`, ['rxce']) }}</div>
                <div :class="[_isRFDE(yieldValue(item)), 'fw-num numItem ']">
                  {{ yieldValue(item) }}%
                </div>
              </div>
              <!-- 收益 -->
              <div class="item">
                <div>{{ _t18(`income`, ['smartfund']) }}</div>
                <div :class="[_isRFDE(incomeValue(item)), 'fw-num numItem ']">
                  {{ incomeValue(item) }} USDT
                </div>
              </div>
              <!-- 建仓时间 -->
              <div class="item" v-if="['bitbyex', 'dev', 'mx'].includes(_getConfig('_APP_ENV'))">
                <div>{{ _t18(`openingTime`) }}</div>
                <div class="fw-num numItem">
                  {{ _timeFormat(item.params?.createTime, 'HH:mm MM/DD', true) }}
                </div>
              </div>
              <!-- 倒计时subTime -->
              <div class="item" v-if="['rxce', 'dev'].includes(_getConfig('_APP_ENV')) && item.params.deliveryDays > 0
      ">
                <div>{{ _t18(`option_countdown`) }}</div>
                <van-count-down class="fw-num numItem count_down"
                  :format="`DD ${_t18('day')} HH ${_t18('hour')} mm ${_t18('minute', ['rxce'])}`"
                  :time="item.params.deliveryDays" />
              </div>
            </div>
            <div class="bottomList">
              <div class="itemBotton" v-for="(items, index) in bottomList" :key="index" @click="showPopup(index, item)">
                {{ items.name }}
              </div>
            </div>
          </div>
      </van-cell>
    </van-list>
    <Nodata v-if="loading == false && dataNewList?.length <= 0"></Nodata>

    <!-- 调整保证金 -->
    <MarginPopup ref="MarginPopupRef"></MarginPopup>
    <!-- 止盈止损 -->
    <TerminationPopup ref="TerminationPopupRef"></TerminationPopup>
    <!-- 追加合约保证金 -->
    <ContractOnePopup ref="ContractOnePopupRef"></ContractOnePopup>
    <!-- 追加合约本金 -->
    <ContractTwoPopup ref="ContractTwoPopupRef"></ContractTwoPopup>
  </div>
</template>
<script setup>
import MarginPopup from '../Popup/MarginPopup.vue'
import TerminationPopup from '../Popup/TerminationPopup.vue'
import ContractOnePopup from '../Popup/ContractOnePopup.vue'
import ContractTwoPopup from '../Popup/ContractTwoPopup.vue'

import { contractHistoryList, stopOrder, stopPosition } from '@/api/trade'
import { formatCurrentcurrency, matchText } from '@/utils/filters'
import { _getConfig, _isRFDE, _t18, _timeFormat } from '@/utils/public'
import { useTradeStore } from '@/store/trade'
import { computed, inject, nextTick, ref } from 'vue'
import { closeToast, showLoadingToast, showToast } from 'vant'
import { _add, _div, _mul, _sub, _toFixed, priceFormat } from '@/utils/decimal'
import { useToast } from '@/hook/useToast'

const { _showName } = useToast()
const tradeStore = useTradeStore()

// 数据列表
const coinInfo = inject('coinInfo')
// 切换眼睛（隐藏其他交易数据）
const showEye = inject('currentEye')
// 合约可用余额
const availableBalance = inject('availableBalance')

const MarginPopupRef = ref(null) //调整保证金
const TerminationPopupRef = ref(null) //止盈止损
const ContractOnePopupRef = ref(null) //追加合约保证金
const ContractTwoPopupRef = ref(null) //追加合约本金
const loading = ref(false)
const finished = ref(false)
const pageSize = ref(10)
const pageNum = ref(1)
const dataList = ref([])
const dataNewList = ref([])

//弹窗按钮-> 极速平仓 调整保证金 止盈 止损
const isRxce = !['rxce'].includes(_getConfig('_APP_ENV'))
const bottomList = computed(() => {
  let list = []
  if (isRxce) {
    list = [
      {
        name: _showName(`quick_close`, ['latcoin', 'aams', 'smartfund'])
      },
      {
        name: _showName(`adjustment_margin`, ['smartfund'])
      },
      {
        name: _showName(`stop_profit`, ['aams', 'smartfund'])
      },
      {
        name: _showName(`stop_loss`, ['smartfund'])
      }
    ]
  } else {
    list = [
      {
        name: _t18(`Close_position`, ['rxce'])
      },
      {
        name: _t18(`Additional_margin2`)
      }
    ]
  }
  return list
})

// 上拉加载分页
const onLoad = () => {
  loading.value = true
  getOrderList()
}
//刷新订单
const refreshOrder = () => {
  dataList.value = []
  dataNewList.value = []
  pageNum.value = 1
  finished.value = false
  onLoad()
}
provide('refreshOrder', refreshOrder)

// status =  0 当前持仓
//获取列表
const getOrderList = async () => {
  let data = {
    status: 0,
    pageSize: pageSize.value,
    pageNum: pageNum.value
  }
  const res = await contractHistoryList(data)
  loading.value = false
  // finished.value = true

  if (res?.total == undefined || res?.total <= dataList.value.length) {
    return (finished.value = true)
  }

  if (res.code == 200) {
    dataList.value = [...dataList.value, ...res.rows]
    pageNum.value++
  }

  filterEyes()
}

//查询是否关闭
const coinPriceInfo = (item) => {
  return tradeStore.allCoinPriceInfo[item.symbol]?.close || ''
}
/**
 * 预计强平价
 * bydfe台子=开仓价item.openPrice -（本金item.adjustAmount/持仓量item.openNum）
 * bydfe台子新=可用合约资产availableBalance.value/持仓量item.openNum-开仓价item.openPrice
 */
const expectedForcedPrice = (item) => {
  let template = item.closePrice <= 0 ? '--' : item.closePrice
  if (['cmmetrics'].includes(__config._APP_ENV)) {
    // 开仓资金百分比=开仓资金item.adjustAmount/合约账户总资产availableBalance.value*100
    let openPosition = _mul(_div(item.adjustAmount, availableBalance.value), 100)
    if (!item.type) {//买入做多
      // 做多强平价=开仓价格item.openPrice-开仓价格item.openPrice*100/杠杆倍数item.leverage*1/开仓资金百分比openPosition/100
      template = _sub(item.openPrice, _div(_div(_div(_mul(item.openPrice, 100), item.leverage), openPosition), 100))
    } else {//卖出开空
      // 做空强平价=开仓价格item.openPrice+开仓价格item.openPrice*100/杠杆倍数item.leverage*1/开仓资金百分比openPosition/100
      template = _add(item.openPrice, _div(_div(_div(_mul(item.openPrice, 100), item.leverage), openPosition), 100))
    }
  }
  return priceFormat(template)
}
/**
 * 收益率
 */
const yieldValue = (item) => {
  let price = null
  const coinPriceInfoClose = coinPriceInfo(item)
  if (coinPriceInfoClose) {
    if (!item.type) {
      // 开多收益率 =（平仓价格-开仓价格）/ 开仓价格 * 杠杆
      price =
        _mul(
          _mul(
            _div(
              _sub(coinPriceInfoClose, item.openPrice),
              item.openPrice
            ),
            item.leverage
          ),
          100
        )
    } else {
      // 开空收益率 =（开仓价格 - 平仓价格）/ 开仓价格 * 杠杆
      price =
        _mul(
          _mul(
            _div(
              _sub(item.openPrice, coinPriceInfoClose
              ),
              item.openPrice
            ),
            item.leverage
          ),
          100
        )
    }
  }

  return price != null ? _toFixed(price, 4) : ''
}

/**
 * 收益
 */
const incomeValue = (item) => {
  var price = null
  const coinPriceInfoClose = coinPriceInfo(item)
  if (coinPriceInfoClose) {
    // 收益=（平仓-开仓）/开仓*杠杆*保证金
    if (!item.type) {
      price =
        _mul(
          _mul(
            _div(
              _sub(coinPriceInfoClose, item.openPrice),
              item.openPrice
            ),
            item.amount
          ),
          item.leverage
        )
    } else {
      // 卖出  开仓-最新 ）/开仓*杠杆*保证金
      price =
        _mul(
          _mul(
            _div(
              _sub(item.openPrice, coinPriceInfoClose),
              item.openPrice
            ),
            item.amount
          ),
          item.leverage
        )
    }
  }
  return price != null ? _toFixed(price, 4) : ''
}

/**
 * 持仓资产
 */
const adjustAmountPrice = (item) => {
  let tempPrice = item.adjustAmount
  if (['rxce'].includes(__config._APP_ENV)) {
    // 持仓资产=持仓资产*杠杆
    tempPrice = priceFormat(_mul(item.adjustAmount, item.leverage))
  }
  return tempPrice || ''
}

// (现金+信用账户内证券市值)/(融资买入金额+融券卖出证券数量*市价+利息及费用)
// （账户余额+ （当前价*数量openNum） ） / （购买金额（adjustAmount）+ 数量openNum*当前+  利息openFee  ）
const guaranteePrice = (item) => {
  let price = ''
  const coinPriceInfoClose = coinPriceInfo(item)
  if (coinPriceInfoClose) {
    price = _div(
      _add(availableBalance.value, _mul(coinPriceInfoClose, item.openNum)),
      _add(_add(item.adjustAmount, _mul(item.openNum, coinPriceInfoClose)), item.openFee)
    )
  }
  return price ? _toFixed(price) : price
}

//打开输入弹窗
const showPopup = async (index, item) => {
  await nextTick()
  //极速平仓
  // !isRxce  => 特殊平台配置
  if (isRxce) {
    //0 极速平仓 1 调整保证金 2止盈 3止损
    index == 1 && MarginPopupRef.value.MarginPopupInit(item, availableBalance.value)
      ; (index == 2 || index == 3) &&
        TerminationPopupRef.value.TerminationPopupInit(item, availableBalance.value, index)
    if (index == 0) {
      showLoadingToast({
        forbidClick: true,
        duration: 0
      })

      stopOrder({
        id: item.id
      }).then((res) => {
        if (res.code === 200) {
          // 平仓成功
          // _toast('successfully_closed')
          showToast(res.msg)
          onFinish(item)
        } else {
          showToast(res.msg)
        }
      })

      setTimeout(() => {
        closeToast()
      }, 100)
    }
  } else {
    //0 极速平仓 1 追加合约保证金 2追加金额
    index == 1 && ContractOnePopupRef.value.ContractOnePopupInit(item, availableBalance.value)
    index == 2 && ContractTwoPopupRef.value.ContractTwoPopupInit(item, availableBalance.value)
    if (index == 0) {
      showLoadingToast({
        forbidClick: true,
        duration: 0
      })
      stopPosition({
        id: item.id
      }).then((res) => {
        if (res.code === 200) {
          // 平仓成功
          _toast('successfully_closed')
          onFinish(item)
        } else {
          showToast(res.msg)
        }
      })

      setTimeout(() => {
        closeToast()
      }, 100)
    }
  }
}

//处理订单数据 -> 过滤当前币种订单
const filterEyes = () => {
  if (!showEye.value) {
    dataNewList.value = formatCurrentcurrency(dataList.value, coinInfo.value.coin)
  } else {
    dataNewList.value = dataList.value
  }
}

//删除当前订单
const getOrderListNumber = inject('getOrderListNumber')
const onFinish = (item) => {
  // 删除当前订单
  dataNewList.value.forEach((items, index) => {
    if (item.id == items.id) {
      dataNewList.value.splice(index, 1)
    }
  })
  // 更新tab角标数量
  getOrderListNumber()
}

defineExpose({
  refreshOrder,
  filterEyes
})
</script>
<style scoped lang="scss">
.content {
  text-align: center;
  min-height: 240px;

  :deep(.van-cell) {
    padding: 0;
  }

  .btn {
    font-size: 12px;
    padding: 2px 10px;
    border: 1px solid var(--ex-primary-color);
    border-radius: 5px;
  }

  .colorBlue {
    color: var(--ex-font-color2) !important;
  }

  .colorRed {
    color: var(--ex-font-color15) !important;
  }

  .bgcBlue {
    background-color: var(--ex-rfd-rise) !important;
  }

  .bgcRed {
    background-color: var(--ex-rfd-fall) !important;
  }

  .colorBlue {
    color: var(--ex-font-color9) !important;
  }

  .hisToryList {
    padding: 20px 15px 0;
    // border-bottom: 1px solid var(--ex-border-color);

    .header {
      padding-bottom: 10px;
      font-size: 14px;
      color: var(--ex-default-font-color);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .headerLeft {
        display: flex;
        align-items: center;

        .name {
          padding: 2px 5px;
          font-size: 12px;
          border-radius: 4px;
          margin-right: 10px;
          color: var(--ex-font-color);
        }

        .headerLeftIcon {
          margin-left: 10px;
          font-size: 12px;
          padding: 0 5px;
          border: 1px solid var(--ex-primary-color);
          border-radius: 5px;
        }
      }

      .headerRight {
        padding: 0 6px;
        background: var(--ex-default-background-color);
        border-radius: 4px;
        opacity: 1;
        border: 1px solid var(--ex-font-color9);
        font-size: 12px;
        color: var(--ex-font-color2);
      }

      .headerRightNobgc {
        font-size: 14px;
        color: var(--ex-font-color9);
      }
    }

    .list {
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: var(--ex-passive-font-color);
        // padding-bottom: 20px;
        padding: 8px 0;

        .numItem {
          color: var(--ex-default-font-color);
        }
      }
    }

    .bottomList {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;

      .itemBotton {
        flex: 1;
        margin-right: 5px;
        padding: 8px 0;
        background: var(--ex--backup-background-color-2);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ex-default-font-color);
        font-size: 12px;
        text-align: center;
      }

      .itemBotton:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
