<template>
  <div class="loan-detail">
    <div class="header-record">
      <!-- <image-load filePath="deposit.png" class="left-icon"></image-load> -->
      <div class="right-status">
        <p class="tips">{{ _t18('loan_records_key') }}</p>
        <p :class="'status' + props.dataList.status">{{ status }}</p>
      </div>
    </div>
    <div class="message">
      <div class="item">
      <!-- 借款金额 -->
      <div class="left">{{ _t18('loan_amount') }}</div>
      <div class="right">{{ props.dataList.amount }}</div>
    </div>
   
      <div class="item" v-if="props.dataList.disburseAmount!=null">
        <!-- 审批金额 -->
        <div class="left">{{ _t18('loan_amount') }}</div>
        <div class="right">{{ props.dataList.disburseAmount }}</div>
      </div>
      <div class="item">
        <!-- 还款周期 -->
        <div class="left">{{ _t18('loan_cycle') }}</div>
        <div class="right">{{ props.dataList.cycleType }}</div>
      </div>
      <div class="item">
        <!-- 日利率 -->
        <div class="left">{{ _t18('loan_rateDay') }}</div>
        <div class="right">{{ props.dataList.rate }}%</div>
      </div>
      <div class="item">
        <!-- 利息 -->
        <div class="left">{{ _t18('loan_interest') }}</div>
        <div class="right">
          {{ dataList.interest }}
        </div>
      </div>
      <div class="item">
        <!-- 还款方式 -->
        <div class="left">{{ _t18('loan_repayType') }}</div>
        <div class="right">{{ dataList?.repayTypeLabel ||
          (['cmmetrics'].includes(_getConfig('_APP_ENV')) ? _t18('Cryptocurrency', ['vitc']) : '') }}</div>
      </div>
      <div class="item" v-if="!(dataList.status === 0 || dataList.status === 2)">
        <!-- 还款时间 -->
        <div class="left">{{ _t18('loan_time') }}</div>
        <div class="right">
          {{ _timeFormat(dataList.params?.finalRepayTime, 'HH:mm MM/DD', true) }}
        </div>
      </div>
      <div class="item">
        <!-- 借款机构 -->
        <div class="left">{{ _t18('loan_repayOrg') }}</div>
        <div class="right">{{ dataList.tloadProduct?.repayOrg }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { _getConfig, _t18 } from '@/utils/public'
import { onMounted } from 'vue'
import { _mul } from '@/utils/decimal'

const props = defineProps({
  dataList: {
    type: Object,
    default: {}
  }
})
const status = computed(() => {
  // 待审核，审核通过，审核失败，已结清，已逾期
  let temp = ''
  if (props.dataList.status == 0) {
    temp = _t18('loan_apply_wait')
  } else if (props.dataList.status == 1) {
    temp = _t18('loan_apply_success')
  } else if (props.dataList.status == 2) {
    temp = _t18('loan_apply_err')
  } else if (props.dataList.status == 3) {
    temp = _t18('loan_apply_complete')
  } else if (props.dataList.status == 4) {
    temp = _t18('loan_apply_overdue')
  }
  return temp
})
onMounted(() => {
  console.log(props.dataList, 'dataListdataListdataList')
})
</script>
<style lang="scss" scoped>
.loan-detail {
  background: var(--ex-financial-card-bg-color);
  border-radius: 10px;
  padding: 14px 14px 2px;

  .header-record {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--ex-select-border-btmcolor);

    .left-icon {
      width: 28px;
      height: 28px;

      .tips {
        font-size: 16px;
      }
    }

    .right-status {
      margin-left: 6px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        font-size: 14px;
      }

      .status0 {
        color: var(--ex-font-color29);
      }

      .status1 {
        color: var(--ex-assets--record-font-color);
      }

      .status2 {
        color: var(--ex-font-color30);
      }

      .status3 {
        color: var(--ex-assets--record-card-color);
      }

      .status4 {
        color: var(--ex-font-color10);
      }
    }
  }

  .message {
    padding: 16px 0 0;

    .item {
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        font-size: 14px;
        color: var(--ex-passive-font-color);
        white-space: nowrap;
      }

      .right {
        font-size: 14px;
        color: var(--ex-default-font-color);
        text-align: right;
width: 80%;
      }
    }
  }
}
</style>
