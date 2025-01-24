<template>
  <div class="recordItem">
    <!-- 基金名称 -->
    <div class="item">
      <div>{{ _t18(`fund_name`) }}</div>
      <div class="itemRight">{{ itemObj.planTitle }}</div>
    </div>
    <!-- 锁仓天数 -->
    <div class="item">
      <div>{{ _t18(`Lock-up_days`) }}</div>
      <div class="itemRight fw-num">{{ itemObj.days }}</div>
    </div>
    <!-- 日收益率 -->
    <div class="item">
      <div>{{ _t18(`host_dailyrateof_return`) }}</div>
      <div class="itemRight fw-num" v-if="['gmtoin2', 'ciehskt', 'gomhskt'].includes(_getConfig('_APP_ENV'))">
        {{ _div(itemObj?.avgRate, 100) || 0 }}
      </div>
      <div class="itemRight fw-num" v-else>{{ itemObj.avgRate }}%</div>
    </div>
    <!-- 投入金额 -->
    <div class="item">
      <div>{{ _t18(`investment_amount`) }}</div>
      <div class="itemRight fw-num">
        {{ itemObj.amount }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
      </div>
    </div>
    <!-- 总收益 -->
    <div class="item" v-if="itemObj.status == 1 || itemObj.status == 2">
      <div>{{ _t18(`stock97`) }}</div>
      <div class="itemRight fw-num">
        {{
          priceFormat(itemObj.accumulaEarn) || 0
        }}
        {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
      </div>
    </div>
    <!-- 预估收益 -->
    <div class="item" v-if="itemObj.status == 0">
      <div>{{ _t18(`Estimated income`) }}</div>
      <div class="itemRight fw-num">
        {{
          priceFormat(_div(_mul(_mul(itemObj?.amount, itemObj?.days), itemObj?.avgRate), 100)) || 0
        }}
        {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
      </div>
    </div>


    <!-- {{ (itemObj.accumulaEarn -
      (itemObj.amount + itemObj.accumulaEarn) * (itemObj.defaultOdds / 100) *
      time(itemObj.endTime)) /
      itemObj.amount * 100 }} -->


    <!-- 总收益率 -->
    <div class="item" v-if="itemObj.status == 2">
      <div>{{ _t18(`stock98`) }}</div>
      <div class="itemRight fw-num">{{ _toFixed(_div(
        _sub(itemObj.accumulaEarn,
          (_add(itemObj.amount, itemObj.accumulaEarn)
            * (itemObj.defaultOdds / 100) *
            time(itemObj.endTime))), itemObj.amount) * 100, 2) }}%
      </div>
    </div>
    <div class="item" v-else>
      <div>{{ _t18(`stock98`) }}</div>
      <div class="itemRight fw-num">{{ _toFixed(_div(itemObj.accumulaEarn, itemObj.amount) * 100, 2) }}%</div>
    </div>

    <!-- 持仓时间 -->
    <div class="item">
      <div>{{ _t18(`stock99`) }}</div>
      <div class="itemRight fw-num">
        {{ _timeFormat(itemObj.createTime) }}
      </div>
    </div>
    <!-- 到账时间 -->
    <!-- <div class="item">
      <div>{{ _t18(`Arrival_time`) }}</div>
      <div class="itemRight fw-num">
        {{ timeOfreceipt(itemObj.settlementType, itemObj.days, itemObj.params.createTime) }}
      </div>
    </div> -->

    <!-- 结束时间 -->
    <div class="item">
      <div>{{ _t18(`stock100`) }}</div>
      <div class="itemRight fw-num">
        {{ _timeFormat(itemObj.endTime) }}
      </div>
    </div>

    <!-- 状态 -->
    <div class="item">
      <div>{{ _t18(`mining_status`) }}</div>
      <div class="itemRight fw-num" :style="{ color: investmentStatus(itemObj.status).color }">
        {{ investmentStatus(itemObj.status).name }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { timeOfreceipt, investmentStatus } from '@/utils/filters'
// import { priceFormat } from '@/utils/decimal'
import { _t18, _timeFormat } from '@/utils/public'
import { _div, _mul, priceFormat, _toFixed, _sub, _add } from '@/utils/decimal'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})

const time = (time) => {
  var dateBegin = new Date(time);
  var date = new Date(); //获取当前时间
  var result = date.getTime() - dateBegin.getTime();
  var joinTime = Math.floor(result / (24 * 3600 * 1000));

  return joinTime
}
</script>
<style lang="scss" scoped>
.recordItem {
  padding: 0 14px 16px;
  border-radius: 5px;
  background: var(--ex-financial-card-bg-color);
  margin-bottom: 22px;

  .item {
    padding: 15px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--ex-passive-font-color);

    .itemRight {
      font-weight: 500;
      color: var(--ex-default-font-color);
      text-align: right;
      white-space: nowrap;
    }
  }
}
</style>
