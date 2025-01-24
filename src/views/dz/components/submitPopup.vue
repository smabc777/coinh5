<template>
  <van-popup v-model:show="submitOrderShow" position="bottom" round closeable
    :style="{ height: ['cmmetrics'].includes(_getConfig('_APP_ENV')) ? '64%' : '77%' }" @close="close">
    <div class="submit-page">
      <div class="submit-page-title">{{ _t18('stock4') }}</div>

      <div class="item">
        <div class="item-left">{{ _t18('stock5') }}</div>
        <div class="item-right">
          {{
            _numberWithCommas(
              ['cmmetrics'].includes(_getConfig('_APP_ENV')) ? stockData.vipPrice : stockData.price,
              2
            )
          }}
          {{ stockData.stockType == 'BR' ? ' BRL' : 'USD' }}
        </div>
      </div>
      <div v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))">
        <div class="item">
          <div class="item-left">{{ _t18('stock14') }}</div>
          <div class="item-right">{{ stockData.list[0].discount * 100 }}%</div>
        </div>
        <div class="item">
          <div class="item-left">{{ _t18('stock68') }}</div>
          <div class="item-right">
            <span>{{ _numberWithCommas(stockData.price * (1 - stockData.list[0].discount), 2) }}
              {{ stockData.stockType == 'BR' ? ' BRL' : 'USD' }}</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-left">{{ _t18('stock69') }}</div>
        <div class="item-right">{{ stockData.stockNum }}</div>
      </div>

      <van-field v-model="formData.num" type="text" @input="limitDecimalPlaces" :placeholder="_t18('stock71')">
      </van-field>
      <div class="item-flex" style="padding: 0" v-if="stockData.stockType == 'BR'">
        <div class="item-flex-title">{{ _t18('stock40') }}：</div>
        <div v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))" class="item-flex-value">
          {{
            _numberWithCommas(
              (stockData.price * stockData.list[0].discount * formData.num) /
              tradeStore.rateinfo.brlRate,
              2
            )
          }}
          BRL
        </div>
        <div v-else class="item-flex-value">
          {{ _numberWithCommas(stockData.vipPrice * formData.num, 2) }} BRL
        </div>
      </div>
      <div class="item-flex" style="padding: 0" v-else>
        <div class="item-flex-title">{{ _t18('stock40') }}：</div>
        <div v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))" class="item-flex-value">
          {{ _numberWithCommas(stockData.price * stockData.list[0].discount * formData.num, 2) }}
          USD
        </div>
        <div v-else class="item-flex-value">
          {{ _numberWithCommas(stockData.vipPrice * formData.num, 2) }} USD
        </div>
      </div>
      <div class="item-flex" v-if="stockData.stockType == 'BR'">
        <div class="item-flex-title">{{ _t18('exchange_balance') }}：</div>
        <div class="item-flex-value">
          {{ _numberWithCommas(availableBalance * tradeStore.rateinfo.brlRate, 2) }} BRL
        </div>
      </div>
      <div class="item-flex" v-else>
        <div class="item-flex-title">{{ _t18('exchange_balance') }}：</div>
        <div class="item-flex-value">{{ _numberWithCommas(availableBalance, 2) }} USD</div>
      </div>
      <div class="btn">
        <van-button type="primary" color="var(--ex-trade-Sell-bg-color)" @click="close">{{
          _t18('cancel')
        }}</van-button>
        <van-button type="primary" color="var(--ex-trade-buy-bg-color)" :disabled="isDisabled" @click="submit">{{
          _t18('stock47') }}</van-button>
      </div>
    </div>
  </van-popup>
</template>
<script setup>
import { ref } from 'vue'
import { _div, _mul, _toFixed, _sub, _formattedAmount } from '@/utils/decimal'
import { showToast } from 'vant'
import { buyStockDzApi } from '@/api/trade/index'
import { onMounted } from 'vue'
import { useToast } from '@/hook/useToast'
import { _t18, _getConfig, _timeFormat, _numberWithCommas } from '@/utils/public'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user/index'
import { useTradeStore } from '@/store/trade'
const tradeStore = useTradeStore()

const userStore = useUserStore()

const { _toast, _showName } = useToast()
const router = useRouter()
const props = defineProps({
  stockData: {
    type: Object,
    default: {}
  },
  password: {
    type: String
  }
})

const isDisabled = ref(false)

const { asset } = storeToRefs(userStore)
const formData = ref({
  stockGid: '',
  password: '',
  num: ''
})
const showPopover = ref(false)
const submitOrderShow = ref(false)

// 账户余额
const availableBalance = computed(() => {

  let tempValue = 0
  if (asset.value.length) {
    if (props.stockData.stockType == 'US' || props.stockData.stockType == 'BR') {
      tempValue = asset.value.filter((item) => item.type === 9)[0]?.availableAmount - asset.value.filter((item) => item.type === 9)[0]?.occupiedAmount || 0

    } else {
      tempValue =
        asset.value.filter((item) => item.type === 1 && item.symbol == 'usdt')[0]?.availableAmount ||
        0
    }
  }
  return tempValue
})

const init = () => {
  submitOrderShow.value = true

  setTimeout(() => {
    formData.value.num = props.stockData?.stockNum
    console.log(formData.value.num)
  }, 10)
}

const close = () => {
  formData.value = {
    stockGid: '',
    password: '',
    num: ''
  }
  submitOrderShow.value = false
}
const limitDecimalPlaces = (event) => {
  let value = event.target.value
  // 正则匹配，允许输入最多 6 位小数
  const regex = /^\d*\.?\d{0,6}$/

  // 如果输入符合要求，则更新数据，否则保持原值
  if (regex.test(value)) {
    formData.value.num = value
  } else {
    // 如果不符合要求，则截断到符合要求的格式
    const match = value.match(/^\d*\.?\d{0,6}/)
    formData.value.num = match ? match[0] : ''
  }

  // 直接更新输入框的值以反映正确的格式
  event.target.value = formData.value.num
}

const mn = ref(null)
// 买入提交
const submit = async () => {
  if (formData.value.num < props.stockData.stockNum) {
    return _toast(_showName('stock72') + props.stockData.stockNum)
  }
  let mn = null
  if (!['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    mn = props.stockData.price * props.stockData.list[0].discount * formData.value.num
  } else {
    mn = props.stockData.vipPrice * formData.value.num
  }
  // 根据当前股票汇率转换
  let amount =
    props.stockData.stockType == 'BR'
      ? availableBalance.value * tradeStore.rateinfo.brlRate
      : availableBalance.value

  if (mn > amount) {
    return _toast('Insufficient_balance')
  }
  formData.value.stockGid = props.stockData.stockGid
  formData.value.password = props.password
  isDisabled.value = true
  const data = await buyStockDzApi(formData.value, { loading: true })
  if (data.code == 200) {
    _toast('stock73')
    router.push('/orderList')
  } else {
    _toast(data.msg)
  }
  isDisabled.value = false
}

defineExpose({
  init
})
onMounted(async () => { })
</script>
<style lang="scss" scoped>
:deep(.van-popover__content .popover-content) {
  padding: 5px 10px;
}

.submit-page {
  padding: 0 15px 15px 15px;
  box-sizing: border-box;

  .submit-page-title {
    margin-bottom: 15px;
  }

  &-title {
    font-size: 16px;
    padding: 16px 0;
    border-bottom: 1px solid var(--ex-border-color16);
  }

  .stock-info {
    display: flex;
    align-items: center;
    padding: 25px 0 10px 0;

    &-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    &-content {
      &-subtitle {
        margin-top: 5px;
      }
    }
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;

    &-left {
      display: flex;
      align-items: center;

      &-arrow {
        width: 14px;
        height: 10px;
        margin-left: 8px;
      }
    }

    &-right {
      display: flex;
      align-items: center;

      img {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }
    }
  }

  .item-flex {
    display: flex;
    align-items: center;
    padding: 15px 0;

    &-value {
      margin-left: 8px;
    }
  }

  .input-title {
    display: flex;
    align-items: center;
    margin-top: 15px;

    &::before {
      content: '*';
      color: var(--ex-tip-font-color);
      margin-right: 4px;
    }
  }

  :deep(.van-field) {
    margin: 15px 0;
    padding: 10px 14px;
    border-radius: 8px;
    background: var(--ex--backup-background-color-2);
    box-sizing: border-box;
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
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;

    :deep(.van-button) {
      width: 45%;
      height: 46px;
      border-radius: 8px;
      margin-top: 50px;
    }
  }
}
</style>
