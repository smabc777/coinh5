<template>
  <!-- 调整保证金 -->
  <PublicPopup :show="showMargin"
               teleport="#app"
               position="absolute"
               :direction="`bottom`"
               :width="'var(--ex-max-width)'"
               @handelClose="showMarginClose">
    <template #titleCustomize>
      <div></div>
      <!-- 调整保证金 -->
      <div class="popupTitle">{{ _t18(`adjustment_margin`) }}</div>
    </template>
    <template #contentCustomize>
      <div class="popupSelect">
        <!-- 追加保证金 -->
        <div class="selectItem" :class="margin ? '' : 'selectHight'" @click="selcetItem">
          {{ _t18(`margin_call`) }}
        </div>
        <!-- 减少保证金 -->
        <div class="selectItem" :class="margin ? 'selectHight' : ''" @click="selcetItem">
          {{ _t18(`margin_reduction`) }}
        </div>
      </div>
      <div class="popupInput">
        <!-- 请输入 -->
        <input
            type="number"
            class="input"
            v-model.trim="money"
            :placeholder="_t18(`exchange.input`)"
        />
        <div>USDT</div>
      </div>
      <div class="rightFourth">
        <div class="lineBg">
          <div
              :class="sliderValue === 0 ? 'node' : index * 25 > sliderValue ? 'node' : 'node active'"
              v-for="(item, index) in 5"
              :key="index"
          ></div>
        </div>
        <div class="numList">
          <div v-for="(item, index) in 5" :key="index" class="nodeNuber fw-num">
            {{ index * 25 }}%
          </div>
        </div>
        <van-slider v-model="sliderValue" active-color="#515151" inactive-color="#d9d9d9">
          <template #button>
            <div class="init">
              <div class="initimg"></div>
            </div>
          </template>
        </van-slider>
      </div>
      <!-- 最多增加 最多减少 -->
      <div class="popupLr">
        <div>{{ !margin ? _t18(`increase_most`) : _t18(`reduce_most`) }}：</div>
        <div class="fw-num popupLrNum">{{ atMostValue }} USDT</div>
      </div>
      <div class="popupLr popMargin">
        <!-- 追加/减少的后强平价格： -->
        <div>{{ !margin ? _t18(`after_price`) : _t18(`sub_price`) }}：</div>
        <div class="fw-num popupLrNum">{{ qiangpingPrice }} USDT</div>
      </div>
      <div class="determine">
        <!-- 确定 -->
        <div class="determinebtn" @click="adjustMargin">{{ _t18(`btnConfirm`, ['bitmake']) }}</div>
      </div>
    </template>
  </PublicPopup>

</template>
<script setup>
import PublicPopup from '@/components/Popup/public.vue'
import {_t18} from "@/utils/public";
import {computed, watch, ref, inject} from "vue";
import {_add, _div, _mul, _sub, _toFixed} from "@/utils/decimal";
import {adjustAmount} from "@/api/trade";
import {showToast} from "vant";
import {useTradeStore} from "@/store/trade";

const tradeStore = useTradeStore()

//更新tab角标数量
const getOrderListNumber = inject('getOrderListNumber')
//刷新父订单
const refreshOrder = inject('refreshOrder')
//数据
const showMargin = ref(false)
const recordListItem = ref({})
const availableBalance = ref(0)
const sliderValue = ref(0)
const money = ref('') // 调整金额

//初始化
const MarginPopupInit = (item, availableBalances) => {
  margin.value = false
  sliderValue.value = 0
  money.value = ''
  recordListItem.value = item
  availableBalance.value = availableBalances
  showMargin.value = true
}
defineExpose({
  MarginPopupInit
})

// 添加/减少切换
const margin = ref(false)
const showMarginClose = () => {
  showMargin.value = false
}
const selcetItem = () => {
  margin.value = !margin.value
  sliderValue.value = 0
  money.value = ''
}

// 强平价格
const qiangpingPrice = computed(() => {
  var price
  var closeFee = 0
  if (tradeStore.contractCoinList.length > 0) {
    tradeStore.contractCoinList.forEach((element) => {
      if (element.coin === recordListItem.value.symbol) {
        closeFee = element.closeFee
      }
    })
  }
  // adjustAmount + 当前输入的值   ） / 持仓数量（openNum）
  let position
  if (!margin.value) {
    position = _div(
        _add(recordListItem.value.adjustAmount, money.value ? money.value : 0),
        recordListItem.value.openNum
    )
  } else {
    position = _div(
        _sub(recordListItem.value.adjustAmount, money.value ? money.value : 0),
        recordListItem.value.openNum
    )
  }
  // 手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
  let commission = _mul(
      _add(recordListItem.value.adjustAmount, money.value ? money.value : 0),
      closeFee
  )
  // 判断type 0  1
  if (recordListItem.value.type === 0) {
    // 开盘价（openPrice） - （adjustAmount + 当前输入的值   ） / 持仓数量（openNum） + 手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
    price = _add(_sub(recordListItem.value.openPrice, position), commission)
  } else if (recordListItem.value.type === 1) {
    // （adjustAmount + 当前输入的值   ） / 持仓数量（openNum）  +   开盘价（openPrice）   -  手续费（（adjustAmount + 当前输入的值   ） * closeFee ）
    price = _sub(_add(position, recordListItem.value.openPrice), commission)
  }


  price = price <= 0 ? 0 : price
  return _toFixed(price, 2)
})

// 最多/最少增加
const atMostValue = computed(() => {
  let price
  // 最多增加
  if (!margin.value) {
    // type  0 买入 1 卖出
    if (recordListItem.value.type) {
      // openPrice   + adjustAmount / openNum  卖出
      price = _add(
          recordListItem.value.openPrice,
          _div(recordListItem.value.adjustAmount, recordListItem.value.openNum)
      )
      price = price > 0 ? price : 0
    } else {
      price = _sub(
          recordListItem.value.openPrice,
          _div(recordListItem.value.adjustAmount, recordListItem.value.openNum)
      )
      price = price > 0 ? price : 0
    }
  } else {
    // 最多减少
    // adjustAmount -amount   >  adjustAmount -amount  : 0
    price = _sub(recordListItem.value.adjustAmount, recordListItem.value.amount)
    price = price > 0 ? price : 0
  }

  return price
})

// 调整保证金确认
const adjustMargin = () => {
  let data = {
    id: recordListItem.value.id,
    money: money.value,
    // 0 增加保证金 1 减少保证金
    flag: margin.value ? 1 : 0
  }
  if (Number(money.value)) {
    adjustAmount(data, {loading: true}).then((res) => {
      if (res.code === 200) {
        // data.flag 追加成功 : 减少成功
        // showToast(`${!data.flag ? _showName(`additional_success`) : _showName(`reduce_success`)}`)
        showToast(res.msg)
        showMargin.value = false
        refreshOrder()
        getOrderListNumber()
      } else {
        showToast(res.msg)
      }
    })
  }
}
/** 监听输入框赋最大值 */
watch(
    () => money.value,
    (n) => {
      if (n) {
        if (n >= availableBalance.value) {
          money.value = availableBalance.value
        }
      } else {
        money.value = ''
      }
    }
)
watch(
    () => sliderValue.value,
    (n) => {
      if (n) {
        let rate = _div(n, 100)
        money.value = _mul(availableBalance.value, rate)
      } else {
        money.value = ''
      }
    }
)

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
  //height: 36px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: var(--ex-passive-font-color);

  .selectItem {
    //flex: 1;
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

  input::-webkit-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-moz-input-placeholder {
    color: var(--ex-font-color1);
  }

  input::-ms-input-placeholder {
    color: var(--ex-font-color1);
  }
}

.rightFourth {
  margin-top: 20px;
  height: 20px;
  width: 100%;
  position: relative;
  border-radius: 6px;

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
      transform: scaleY(1) rotate(45deg) !important;
      position: relative;
    }
  }

  :deep(.van-slider) {
    position: absolute;
    top: 0;
    z-index: 2;
    left: 6px;
    width: calc(100% - 10px);
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
  margin: 50px 0 30px;

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
  border-radius: 6px;
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
