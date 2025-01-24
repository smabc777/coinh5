<template>
  <HeaderBar :currentName="_t18('stock3')" :border_bottom="false" :cuttentRight="cuttentRight"></HeaderBar>
  <div class="container">
    <div class="form">
      <div class="container-title">{{ _t18('stock29') }}</div>
      <div class="tit">BRL</div>
      <van-field v-model="orderPricebrl" type="number" :placeholder="_t18('stock30')"></van-field>
      <div class="tit">USD</div>
      <van-field v-model="orderPriceusd" type="number" :placeholder="_t18('stock30')"></van-field>

      <!-- <div class="amount-list">
        <div class="amount-list-item" @click="clickTab(i)" :class="[formData.orderNum == i ? 'active' : '']"
          v-for="i in amountList" :key="i">
          {{ i }}
        </div>
      </div> -->
      <van-button type="primary" :disabled="isDisabled" @click="submit" color="var(--ex-primary-color)"> {{
    _t18('stock31') }} </van-button>
      <div class="form-tips">
        <div class="form-tips-icon"></div>
        <div class="form-tips-text">{{ _t18('stock32') }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useToast } from '@/hook/useToast'
import { _t18, _getConfig, _timeFormat } from '@/utils/public'
import { subdaytrading } from '@/api/trade/index'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const { _toast, _showName } = useToast()
const cuttentRight = reactive({
  iconRight: [{ name: _showName('stock33'), clickTo: '/stockRechargeoreder' }]
})
const amountList = ref([10, 20, 50, 100, 500, 1000, 2000])
const formData = ref({
  orderPrice: undefined,
  status: 0,
  currencyType: undefined,
  stockType: undefined
})
const orderPricebrl = ref(undefined)
const orderPriceusd = ref(undefined)

// 切换金额
const clickTab = (i) => {
  formData.value.orderNum = i
}
const isDisabled = ref(false)
const code = ref('')
const msg = ref(undefined)
// 买入
const submit = async () => {
  if (!orderPricebrl.value && !orderPriceusd.value) return _toast('stock30')
  isDisabled.value = true
  if (orderPricebrl.value > 0 && orderPriceusd.value > 0) {
    await submitbrl(orderPricebrl.value, 'BRL', 'BR')
    await submitusd(orderPriceusd.value, 'USD', 'US')
    fn()
    return
  }
  if (orderPricebrl.value > 0) {
    await submitbrl(orderPricebrl.value, 'BRL', 'BR')
  }
  if (orderPriceusd.value > 0) {
    await submitusd(orderPriceusd.value, 'USD', 'US')
  }
  await fn()

}

const submitbrl = async (val, type, la) => {
  formData.value.orderPrice = val
  formData.value.currencyType = type
  formData.value.stockType = la
  const res = await subdaytrading(formData.value, { loading: true })
  code.value = res.code
  msg.value = res.msg
}
const submitusd = async (val, type, la) => {
  formData.value.orderPrice = val
  formData.value.currencyType = type
  formData.value.stockType = la
  const res = await subdaytrading(formData.value, { loading: true })
  code.value = res.code
  msg.value = res.msg
}
const fn = async () => {
  if (code.value != 200) {
    _toast(msg.value)
    isDisabled.value = false

    return
  }
  _toast('Purchase_successful')
  router.push('/stockRechargeoreder')
  isDisabled.value = false
}
</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}

.container {
  padding: 0 15px 15px;

  &-title {
    align-self: flex-start;
    position: relative;
    font-weight: 600;
    line-height: 20px;
    padding-left: 28px;
    z-index: 0;

    &::before {
      content: '';
      position: absolute;
      width: 9px;
      height: 9px;
      top: 3px;
      left: 0;
      background-color: var(--ex-copy-font-color);
      z-index: 0;
    }

    &::after {
      content: '';
      position: absolute;
      width: 9px;
      height: 9px;
      top: 8px;
      left: 5px;
      background-color: var(--ex-div-bgColor35);
      z-index: -1;
    }
  }

  .form {
    padding: 20px 15px;
    border-radius: 10px;
    background-color: var(--ex-backup--background-color);

    :deep(.van-field) {
      margin: 10px 0 15px 0;
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
          color: var(--ex-default-font-color);
        }
      }
    }

    .amount-list {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      flex-wrap: wrap;

      &-item {
        width: 72px;
        height: 40px;
        font-size: 12px;
        border-radius: 8px;
        background-color: var(--ex--backup-background-color-2);
        border: 1px solid var(--ex--backup-background-color-2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.active {
          border: 1px solid var(--ex-copy-font-color);
          background: var(--ex-div-bgColor36);
        }
      }
    }

    :deep(.van-button) {
      width: 100%;
      height: 46px;
      border-radius: 8px;
      margin-top: 30px;
    }

    &-tips {
      margin-top: 13px;
      display: flex;
      align-items: flex-start;

      &-icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        margin-right: 10px;
        background: linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%);
      }

      &-text {
        flex: 1;
        min-width: 0;
        font-size: 12px;
        color: var(--ex-default-font-color2);
      }
    }
  }
}

.container-title {
  margin-bottom: 20px;
}
</style>
