<!-- 首页 -->
<script setup>
import { ref, toRefs, defineProps, toRef } from 'vue'
import { showConfirmDialog } from 'vant'
import { useToast } from '@/hook/useToast'

const { _toast, _st18 } = useToast()
import { _toFixed } from '@/utils/decimal'
import { _t18, _getConfig } from '@/utils/public'

const emit = defineEmits(['closingPosition'])

const props = defineProps({
  //子组件接收父组件传递过来的值
  stockList: {
    type: Object,
    default: {}
  }
})
function clickButton(item) {
  showConfirmDialog({
    title: _st18('position_translate50'),
    message: _st18('position_translate51'),
    confirmButtonText: _st18('position_translate52'),
    cancelButtonText: _st18('position_translate53')
  })
    .then(() => {
      // 平仓按钮
      emit('closingPosition', item)

    })
    .catch(() => { })
}
</script>

<template>
  <div class="page-border">
    <div class="Micorfhg flex-ct">
      <div>{{ stockList.stockName }}<span>{{ stockList.stockCode }}</span></div>
      <div style="color: #45b369; font-size: 18px">{{ _toFixed(stockList.nowPrice, 2) }} {{ _getConfig('_APP_CURRENCY')
        }}
      </div>
    </div>
    <div class="flex-ct">
      <div>{{ _t18('trade_16') }} {{ _timeFormat(stockList.buyOrderTime) }}</div>
      <div class="price-coler">{{ _t18('trade_17') }}</div>
    </div>
    <div class="line"></div>
    <div class="flex-ct">
      <div>{{ _t18('trade_18') }}</div>
      <div class="">{{ stockList.orderNum }}</div>
    </div>
    <div class="flex-ct">
      <div>{{ _t18('trade_19') }}</div>
      <div>{{ _toFixed(stockList.orderTotalPrice / stockList.orderNum, 2) }}</div>
    </div>
    <div class="flex-ct">
      <div>{{ _t18('trade_20') }}</div>
      <div>{{ _toFixed(stockList.allProfitAndLose, 2) }}</div>
    </div>
    <!--    <div class="flex-ct">-->
    <!--      <div>{{ _t18('trade_21') }}</div>-->
    <!--      <div>{{_toFixed( stockList.profitAndLose,2) }}</div>-->
    <!--    </div>-->
    <!-- <div class="flex-ct">
      <div>交易状态</div>
      <div :class="交易中 ? 'text-color' : ''">进行中</div>
    </div> -->
    <div class="flex-ct">
      <!--      <div>-->
      <!--        <p>{{ _t18('trade_16') }}</p>-->
      <!--        <p>{{ _timeFormat(stockList.buyOrderTime) }}</p>-->
      <!--      </div>-->
      <van-button @click="clickButton(stockList)">{{ _t18('trade_22') }}</van-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-border {
  border-radius: 10px;
  background: var(--ex-default-bgcolor);
  border: 1px solid var(--ex-box-border2);
  margin-top: 16px;
  padding: 15px;
  font-size: 12px;

  .line {
    background: var(--ex-box-border2);
    margin-top: 16px;
    margin-bottom: 12px;
    width: 100%;
    height: 1px;
  }

  >div {
    margin-bottom: 10px;
  }

  .Micorfhg {
    font-family: Poppins;
    font-size: 14px;
    font-weight: 700;
    color: #111827;

    span {
      font-size: 12px;
      font-weight: 700;
      margin-left: 10px;
    }
  }

  .price-coler {
    color: var(--ex-tip-font-color2);
  }

  .text-color {
    color: var(--ex-tip-font-color3);
  }
}
</style>
