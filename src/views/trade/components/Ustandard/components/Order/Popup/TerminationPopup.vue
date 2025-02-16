<template>
  <!-- 止赢止损 -->
  <PublicPopup :show="showTermination"
               teleport="#app"
               direction="bottom"
               :width="'var(--ex-max-width)'"
               position="absolute"
               @handelClose="showTerminationClose">
    <template #titleCustomize>
      <div></div>
      <!-- !stopName ? '止盈' : '止损' -->
      <div class="popupTitle">{{ !stopName ? _t18(`stop_profit`) : _t18(`stop_loss`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupSelect">
        <!-- 市价 -->
        <div class="selectItem" :class="margin ? '' : 'selectHight'" @click="selcetItem">
          {{ _t18(`market_price`) }}
        </div>
        <!-- 限价 -->
        <div class="selectItem" :class="margin ? 'selectHight' : ''" @click="selcetItem">
          {{ _t18(`limit_price`) }}
        </div>
      </div>
      <!-- 止盈触发价格/止损出发价格 -->
      <div class="popupName">{{ !stopName ? _t18(`profit_price`) : _t18(`loss_price`) }}</div>
      <div class="popupInput marginStop">
        <!-- 止盈触发价格 -->
        <!-- 请输入 -->
        <input
            type="number"
            class="input"
            v-model.trim="earnPriceValue"
            :placeholder="_t18(`swap_input`)"
        />
        <div>USDT</div>
      </div>
      <!-- 止盈委托/止损委托 -->
      <div class="popupName">{{ !stopName ? _t18(`profit_order`) : _t18(`loss_order`) }}</div>
      <!-- 止盈 -->
      <div v-if="!margin" class="popupInput marginStop disableStop">
        <!-- 以当前最优价格交易 -->
        <div class="disableName">{{ _t18(`bb_current_best_price`) }}</div>
        <div>USDT</div>
      </div>
      <!-- 止盈委托价 -->
      <div v-if="margin" class="popupInput marginStop">
        <!-- 请输入 -->
        <input
            v-model.trim="earnDelegatePriceValue"
            type="number"
            class="input"
            :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <!-- 持仓量 -->
      <div class="stopText">
        <div>{{ _t18(`open_interest`,['smartfund']) }}：</div>
        <div class="fw-num popupLrNum">
          {{ recordListItem.openNum }}
          {{
            recordListItem.showCoin
                ? matchText(recordListItem.showCoin, '/USDT')
                : recordListItem.symbol.toUpperCase()
          }}
        </div>
      </div>
      <!-- 平仓均价： -->
      <div class="stopText">
        <div>{{ _t18(`average_closing_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ recordListItem.openPrice }} USDT</div>
      </div>
      <!-- 最新成交价： -->
      <div class="stopText">
        <div>{{ _t18(`latest_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ coinPriceInfo.close }} USDT</div>
      </div>
      <!-- 止盈 -->
      <div class="stopBottom" v-if="!margin">
        <!-- 市场价格至 -->
        {{ _t18(`profit_tips_1`) }}
        <span class="stopBottomSpan fw-num">{{ coinPriceInfo.close }} USDT</span>
        <!-- 时将触发止盈委托，成交后预计盈利 -->
        {{ _t18(`profit_tips_2`) }}
        <span class="stopBottomSpan fw-num">{{ incomeValue }} USDT</span>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="stopWinAndLosing">
          {{ _t18(`btnConfirm`, ['bitmake']) }}
        </div>
      </div>
    </template>
  </PublicPopup>
</template>
<script setup>
import PublicPopup from '@/components/Popup/public.vue'
import {_t18} from "@/utils/public";
import {computed, ref, watch, inject} from "vue";
import {useTradeStore} from "@/store/trade";
import {_mul, _sub, _toFixed} from "@/utils/decimal";
import {settLoss} from "@/api/trade";
import {showToast} from "vant";

const tradeStore = useTradeStore()

//更新tab角标数量
const getOrderListNumber = inject('getOrderListNumber')
//刷新父订单
const refreshOrder = inject('refreshOrder')
//数据
const stopName = ref(0) //0 止盈 1止损
const margin = ref(false) //  市价/限价
const showTermination = ref(false)
const recordListItem = ref({})
const availableBalance = ref(0)
const earnPriceValue = ref('') // 止盈/止损触发价
const earnDelegatePriceValue = ref('') // 止盈/止损委托价
const coinPriceInfo = computed(() => {
  return tradeStore.allCoinPriceInfo[recordListItem.value?.symbol] || {}
})

//持仓数量
const incomeValue = computed(() => {
  if (coinPriceInfo.value.close) {
    // 最新价 当买多时 最新价-开仓价均价（openPrice） * 持仓数量（openNum）
    if (!recordListItem.value.type) {
      var price = _mul(
          _sub(coinPriceInfo.value.close, recordListItem.value.openPrice),
          recordListItem.value.openNum
      )
      return _toFixed(price, 4)
    } else {
      // 卖出  开仓-最新 * 持仓
      var price = _mul(
          _sub(recordListItem.value.openPrice, coinPriceInfo.value.close),
          recordListItem.value.openNum
      )
      return _toFixed(price, 4)
    }
  }
})

//初始化
const TerminationPopupInit = (item, availableBalances, index) => {
  stopName.value = index == 2 ? 0 : 1
  earnPriceValue.value = ''
  earnDelegatePriceValue.value = ''
  recordListItem.value = item
  availableBalance.value = availableBalances
  showTermination.value = true
}

defineExpose({
  TerminationPopupInit
})
const showTerminationClose = () => {
  showTermination.value = false
}

//确定
const stopWinAndLosing = () => {
  var data = {}
  if (!stopName.value) {
    data = {
      positionId: recordListItem.value.id,
      earnPrice: earnPriceValue.value,
      earnNumber: recordListItem.value.openNum,
      // 0 止盈 1止损
      lossType: 0,
      // 委托类型（0 限价 1 市价）
      delegateType: margin.value ? 0 : 1
    }
    if (!data.delegateType) {
      data.earnDelegatePrice = earnDelegatePriceValue.value
    }
  } else {
    data = {
      positionId: recordListItem.value.id,
      losePrice: earnPriceValue.value,
      loseNumber: recordListItem.value.openNum,
      // 0 止盈 1止损
      lossType: 1,
      // 委托类型（0 限价 1 市价）
      delegateType: margin.value ? 0 : 1
    }
    if (!data.delegateType) {
      data.loseDelegatePrice = earnDelegatePriceValue.value
    }
  }
  if (!data.delegateType) {
    if (earnPriceValue.value && earnDelegatePriceValue.value) {
      settLoss(data, {loading: true}).then((res) => {
        if (res.code === 200) {
          showTerminationClose()
          showToast(res.msg)
          refreshOrder()
          getOrderListNumber()
        } else {
          showToast(res.msg)
        }
      })
    }
  } else {
    if (earnPriceValue.value) {
      settLoss(data).then((res) => {
        if (res.code === 200) {
          showTerminationClose()
          showToast(res.msg)
          refreshOrder()
          getOrderListNumber()
        } else {
          showToast(res.msg)
        }
      })
    }
  }
}

const selcetItem = () => {
  margin.value = !margin.value
  earnPriceValue.value = ''
  earnDelegatePriceValue.value = ''
}

</script>
<style scoped lang="scss">

.popupTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  color: var(--ex-default-font-color);
}

.popupSelect {
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: var(--ex-passive-font-color);

  .selectItem {
    width: 49%;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background: var(--ex--backup-background-color-2);
  }

  .selectHight {
    color: var(--ex-font-color);
    background: var(--ex-trade-buy-bg-color);
    border-radius: 6px;
  }
}

.popupInput {
  margin-top: 20px;
  height: 50px;
  background: var(--ex-default-background-color);
  border-radius: 6px;
  border: 1px solid var(--ex-border-color2);
  color: var(--ex-default-font-color);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;

  .input {
    width: 100%;
    color: var(--ex-default-font-color);
    margin-right: 10px;
    background: var(--ex-default-background-color);
  }

  // input::-webkit-input-placeholder {
  //   color: var(--ex-font-color1);
  // }

  // input::-moz-input-placeholder {
  //   color: var(--ex-font-color1);
  // }

  // input::-ms-input-placeholder {
  //   color: var(--ex-font-color1);
  // }
}

.rightFourth {
  margin-top: 20px;
  width: 100%;
  position: relative;

  .lineBg {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .node {
      width: 11px;
      height: 11px;
      background: var(--ex-div-bgColor3);
      margin-top: -5px;
      transform: rotate(45deg);
      position: relative;
    }

    .active {
      background: var(--ex-div-bgColor4);
    }
  }

  .numList {
    position: absolute;
    width: 100%;
    top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nodeNuber {
      display: flex;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 500;
      color: var(--ex-default-font-color);
    }

    .nodeNuber:nth-child(2) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(3) {
      margin-left: 15px;
    }

    .nodeNuber:nth-child(4) {
      margin-left: 15px;
    }
  }

  .init {
    .initimg {
      width: 12px;
      height: 12px;
      background: var(--ex-div-bgColor4);
      transform: scaleY(0.5) rotate(45deg) !important;
      position: relative;
    }
  }
}

.popupLr {
  margin-top: 45px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.popMargin {
  margin-top: 20px;
}

.determine {
  margin: 50px 0 10px;

  .determinebtn {
    height: 50px;
    background: var(--ex-trade-buy-bg-color);
    border-radius: 6px;
    font-size: 16px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.popupName {
  margin-top: 20px;
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.marginStop {
  margin-top: 10px !important;
}

.disableStop {
  background: var(--ex-div-bgColor5);
  border: none;

  .disableName {
    font-size: 14px;
    color: var(--ex-passive-font-color);
  }
}

.stopText {
  margin-top: 10px;
  display: flex;
  font-size: 14px;
  color: var(--ex-passive-font-color);

  .popupLrNum {
    margin-left: 10px;
    color: var(--ex-default-font-color);
  }
}

.stopBottom {
  margin-top: 20px;
  font-size: 12px;
  color: var(--ex-passive-font-color);
  line-height: 20px;

  .stopBottomSpan {
    color: var(--ex-default-font-color);
  }
}

.count_down {
  font-size: 12px;
}
</style>
