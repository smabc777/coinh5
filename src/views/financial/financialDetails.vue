<template>
  <HeaderBar :currentName="_t18(`host.detail`)" />
  <div class="financialDetails">
    <!-- 详情 -->
    <FinancialHeader :headerObj="headerObj"></FinancialHeader>
    <!-- 产品详情 -->
    <div class="subtitle">{{ _t18(`product_details`) }}</div>

    <FinancialDetail :proDetail="proDetail"></FinancialDetail>
    <!-- 基金介绍 -->
    <div class="subtitle">{{ _t18(`Fund_introduction`) }}</div>
    <div class="introduction">
      <div>{{ fundIntroduction ? fundIntroduction : _t18(`No_introductionyet`) }}</div>
    </div>
    <!-- 产品规则 -->
    <div class="subtitle">{{ _t18('product_rules') }}</div>
    <FinancialRules :proRules="proRules"></FinancialRules>
    <div class="buyNow">
      <!-- 立即购买 -->
      <div class="buyBtn" @click="buyNow">{{ _t18(`buy_it_now`) }}</div>
    </div>
    <van-popup v-model:show="buyShow" round>
      <div class="popup-box">
        <div class="head">
          <div class="header-left">
            <img src="@/assets/financial/coin.png" class="itemImg" />
            <div class="fw-bold">{{ headerObj.title }}</div>
          </div>
          <div class="header-right" @click.stop="handelClose">
            <van-icon name="close" size="16" />
          </div>
        </div>
        <div class="buy-conter">
          <input v-model="limit" :placeholder="_t18('exchange.input')" />
          <div class="proDetail">
            <FinancialDetail :proDetail="proDetail"></FinancialDetail>
          </div>
          <div class="buyBtn" @click="payNow">{{ _t18('to pay') }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import { DIFF_ISFREEZE_OTHER, DIFF_ISFREEZE } from '../../config/index'
import { useFreeze } from '@/hook/useFreeze'
const { _isFreeze } = useFreeze()
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import HeaderBar from '@/components/HeaderBar/index.vue'
import FinancialHeader from './components/FinancialHeader.vue' //头
import FinancialDetail from './components/FinancialDetail.vue' // 详情
import FinancialRules from './components/FinancialRules.vue' // 规则
import { financialDetail, financialSubmit } from '@/api/financial/index'
import { _t18 } from '@/utils/public'
import { showToast } from 'vant'
const $router = useRouter()
const Route = useRoute()
const buyShow = ref(false)

// 平均收益 项目周期（天） 起投金额
const headerObj = ref({
  leftName: _t18('average_income'),
  leftColor: '#DF163D',
  centerName: `${_t18('project_cycle')}(${_t18('ldgpt_host_day')})`,
  rightName: _t18(`starting-amount`)
})
const fundIntroduction = ref('') // 基金介绍
const proDetail = ref({}) // 产品详情
const proRules = ref('') // 产品规则
const minNum = ref(0) // 最小输入
const maxNum = ref(0) // 最大输入
const coninName = ref('') //最少购买
const limit = ref('') // 额度
const dayNum = ref('') // 额度
const handelClose = () => {
  buyShow.value = false
}
const buyNow = () => {
  limit.value = ''
  buyShow.value = true
  return
  // if (DIFF_ISFREEZE_OTHER.includes(__config._APP_ENV)) {
  if (_isFreeze(DIFF_ISFREEZE_OTHER, 'FINANCIAL')) {
    $router.push(`/buyFunds/${Route.params.id}`)
  }
  // } else {
  //   $router.push(`/buyFunds/${Route.params.id}`)
  // }
}
// 支付
const payNow = () => {

  if (_isFreeze(DIFF_ISFREEZE, 'FINANCIAL')) {
    if (limit.value !== '') {
      submit()
    }
  }
}
/**立即购买 */
const submit = async () => {
  const res = await financialSubmit(Route.params.id, limit.value, dayNum.value)
  if (res.code === 200) {
    showToast(res.msg)
    handelClose()
  } else {
    showToast(res.msg)
  }
}
/** 获取详情 */
const getDetail = async () => {
  try {
    const res = await financialDetail(Route.params.id)
    if (res.code === 200) {
      const { title, icon, avgRate, days, limitMin, coin, prodectIntroduction, problem } = res.data
      dayNum.value = days
      /**产品介绍 */
      fundIntroduction.value = prodectIntroduction
      headerObj.value = {
        title,
        icon,
        leftNum: avgRate + '%',
        centerNum: days,
        rightNum: limitMin + ' ' + coin.toUpperCase(),
        ...headerObj.value
      }
      /**产品详情 */
      const { process, totalInvestAmount, remainAmount, timeLimit } = res.data
      proDetail.value = {
        title,
        process,
        totalInvestAmount,
        remainAmount,
        timeLimit,
        avgRate,
        coin: coin.toUpperCase()
      }
      /**产品规则 */
      proRules.value = problem
    }
  } catch (error) {}
}
onMounted(() => {
  getDetail()
})
</script>
<style lang="scss" scoped>
.financialDetails {
  padding: 16px;
  .subtitle {
    font-size: 15px;
    font-weight: 400;
    margin: 20px 0 16px;
  }
  .introduction {
    padding: 20px 17px;
    color: var(--ex-passive-font-color);
    font-size: 12px;
    background: var(--ex-financial-card-bg-color);
    border-radius: 8px;
    div {
      color: var(--ex-passive-font-color);
    }
  }
  .buyNow {
    padding: 50px 0;
    .buyBtn {
      height: 50px;
      background: var(--ex-primary-color);
      border-radius: 3px 3px 3px 3px;
      font-size: 16px;
      border-radius: 8px;
      color: var(--ex-font-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.proDetail {
  .detail {
    padding: 20px 1px 0;
  }
}
.popup-box {
  width: 343px;
  padding: 21px 17px;
  background: var(--ex-financial-card-bg-color);
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    .header-left {
      font-size: 15px;
      color: var(--ex-default-font-color);
      display: flex;
      .itemImg {
        width: 26px;
        height: 19px;
        object-fit: cover;
        margin-right: 10px;
      }
    }

    .header-right {
      .closeSvg {
        width: 16px;
        height: 16px;
      }
    }
  }
  .buy-conter {
    input {
      width: 100%;
      height: 54px;
      font-size: 14px;
      border-radius: 8px;
      text-indent: 14px;
      background: var(--ex-input-background-color);
      border: 1px solid var(--ex-border-line);
      &::placeholder {
        color: var(--ex-input-font-color);
        font-size: 14px;
      }
      &:focus {
        border: 1px solid var(--ex-text-color);
      }
    }
  }
  .van-field {
    border: 1px solid var(-ex-financial-line-bg-color) !important;
    border-radius: 4px !important;
  }
  .buyBtn {
    height: 44px;
    background: var(--ex-primary-color);
    border-radius: 8px;
    font-size: 15px;
    color: var(--ex-font-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
