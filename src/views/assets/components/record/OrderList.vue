<template>
  <div @click="toDetail(dataValue)" class="record-card">
    <div class="header-record">
      <image-load filePath="deposit.png" class="left-icon"></image-load>
      <div class="right-status">
        <!-- 充提币 -->
        <p class="tips" v-if="router.currentRoute.value.name == 'RechargOrder'">{{ _t18('recharge') }}</p>
        <p class="tips" v-if="router.currentRoute.value.name == 'WithdrawOrder'">{{ _t18('asset_withdraw') }}</p>

        <p class="status0" v-if="dataValue.status == 0">{{ _t18('recharge_waiting') }}</p>
        <p class="status1" v-if="dataValue.status == 1">{{ _t18('recharge_tab_success') }}</p>
        <p class="status2" v-if="dataValue.status == 2">{{ _t18('recharge_tab_error') }}</p>
      </div>
    </div>
    <div class="message">
      <div>
        <p class="left">{{ _t18('recharge_coin') }}</p>
        <p class="right coin">{{ dataValue.type }}</p>
      </div>

      <div>
        <!-- 金额 -->
        <p class="left">
          {{
    ['paxpay', 'aams', 'bydfe'].includes(_getConfig('_APP_ENV'))
      ? _t18('withdraw_money')
      : _t18('recharge_amount')
  }}
        </p>
        <p class="right amount">{{ priceFormat(dataValue.amount) }}</p>
      </div>

      <div v-if="['paxpay', 'coolcoinex', 'dev', 'bydfe', 'smartfund'].includes(_getConfig('_APP_ENV'))">
        <!-- 实际到账金额 -->
        <p class="left">{{ _t18('Actual_amount_received') }}</p>
        <p class="right amount">{{ priceFormat(dataValue.realAmount) }}</p>
      </div>
      <div v-if="['paxpay', 'bydfe'].includes(_getConfig('_APP_ENV'))">
        <!-- 手续费 -->
        <p class="left">{{ _t18('Deduction_fee') }}</p>
        <p class="right">{{ dataValue.fee }}</p>
      </div>

      <div>
        <!-- 时间 -->
        <p class="left">{{ _t18('recharge_time') }}</p>
        <p class="right">{{ _timeFormat(dataValue.params?.createTime) }}</p>
      </div>
      <div v-if="dataValue.rechargeRemark">
        <!-- 备注 -->
        <p class="left">{{ _t18('kind_tips', ['vitc']) }}</p>
        <p class="right">{{ dataValue.rechargeRemark }}</p>
      </div>
      <div v-if="dataValue.withDrawRemark">
        <!-- 备注 -->
        <p class="left">{{ _t18('kind_tips') }}</p>
        <p class="right">{{ dataValue.withDrawRemark }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _getConfig, _t18, _timeFormat } from '@/utils/public'
import { priceFormat } from '@/utils/decimal'

const router = useRouter()
const props = defineProps({
  data: {
    type: Object,
    default: {}
  }
})
const dataValue = computed(() => {
  return props.data
})
const toDetail = (data) => {
  // 充值0 提现1
  // console.log(router.currentRoute.value.name=='RechargOrder')
  // if (data.type == '0') {
  if (router.currentRoute.value.name == 'RechargOrder') {
    router.push({
      path: '/recharge-detail',
      // query: { data:encodeURI(JSON.stringify(data)) }
      query: { id: data.id }
    })
  } else if (router.currentRoute.value.name == 'WithdrawOrder') {
    router.push({
      path: '/withdraw-detail',
      query: { id: data.id }
    })
  }
}
console.log(dataValue)
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.record-card {
  background: var(--ex-financial-card-bg-color);
  border-radius: 10px;
  padding: 14px 14px 16px;

  .header-record {
    display: flex;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--ex-select-border-btmcolor);

    .left-icon {
      width: 28px;
      height: 28px;
    }

    .right-status {
      margin-left: 6px;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .status0 {
        color: var(--ex-font-color29);
      }

      .status1 {
        color: var(--ex-assets--record-font-color);
      }

      .status2 {
        color: var(--ex-font-color30);
      }
    }
  }
}

div {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;

    .left {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 500;

      .usdt {
        font-size: 24px;
        margin-right: 10px;
      }
    }

    p {
      color: var(--ex-font-color9);
    }

    .jiantou {
      font-size: 10px;
    }
  }

  .message {
    &>div {
      padding: 16px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        font-size: 14px;
        margin-right: 10px;
        color: var(--ex-passive-font-color);
      }

      .right {
        word-break: break-word;
      }

      .coin {
        color: var(--ex-text-color);
      }

      .amount {
        color: var(--ex-font-color4);
      }

      .amount-received {
        color: var(--ex-font-color9);
      }

      .fontBold {
        font-weight: bold;
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
    }
  }
}
</style>
