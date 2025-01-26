<template>
  <div class="detail">
    <!-- 项目名称 -->
    <div class="item">
      <div>{{ _t18(`product-details`) }}</div>
      <div class="itemName">{{ proDetail.title }}</div>
    </div>
    <!-- 项目进度 -->
    <div class="item">
      <div>{{ _t18(`project_progress`) }}</div>
      <div class="itemName ff-num">{{ proDetail.process }}%</div>
    </div>
    <!-- 项目总额 -->
    <div class="item">
      <div>{{ _t18(`total_project`) }}</div>
      <div class="itemName ff-num">{{ proDetail.totalInvestAmount }}&nbsp;{{ proDetail.coin }}</div>
    </div>
    <!-- 剩余金额 -->
    <div class="item">
      <div>{{ _t18(`balance`) }}</div>
      <div class="itemName ff-num">{{ proDetail.remainAmount }}&nbsp;{{ proDetail.coin }}</div>
    </div>
    <!-- 限投次数 -->
    <div class="item">
      <div>{{ _t18(`limit_number`) }}</div>
      <div class="itemName fw-num">
        <!-- 不存在则不限购 -->
        {{ Number(proDetail.timeLimit) ? Number(proDetail.timeLimit) : _t18(`unlimited_purchase`) }}
      </div>
    </div>
    <!-- 平均日收益 -->
    <div class="item">
      <div>{{ _t18(`average_daily_income`) }}</div>
      <div
        class="itemName fw-num hightColor"
        v-if="['gmtoin2', 'ciehskt', 'gomhskt'].includes(_getConfig('_APP_ENV'))"
      >
        {{ _div(proDetail?.avgRate || 0, 100) }}
      </div>
      <div class="itemName fw-num hightColor" v-else>{{ proDetail.avgRate }}%</div>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import { _div } from '@/utils/decimal'
const props = defineProps({
  proDetail: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.detail {
  padding: 20px 15px 0;
  // background: var(--ex--home-grid-bg);
  border-radius: 8px;
  border:1px solid var(--ex--backup-background-color-2);

  .title {
    color: var(--ex-default-font-color);
    font-size: 16px;
  }
  .item {
    padding-bottom: 20px;
    color: var(--ex-passive-font-color);
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .itemName {
      color: var(--ex-default-font-color);
    }
    .hightColor {
      color: var(--ex-font-color3);
    }
  }
}
</style>
