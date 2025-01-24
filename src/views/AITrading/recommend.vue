<!-- AI GPT -->
<template>
  <HeaderBar
    :currentName="_t18('AI取引')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="container">
    <div class="gpt-box">
      <img class="gpt-box-img" src="@/assets/download/d1.png" alt="" />
      <div class="gpt-box-content">
        We use AI GPT for technical analysis, advanced sentiment analysis analyzing recent financial
        statements and studying recent news headlines to select a portfolio of 10-12 stocks. The
        portfolio has gained 60.2% since its inception.
      </div>
      <div class="container-title">投资信息</div>
      <div class="gpt-box-card">
        <div class="gpt-box-card-item" v-for="item in 3" :key="item">
          <div class="gpt-box-card-item-label">最高日收益</div>
          <div class="gpt-box-card-item-value">48%</div>
        </div>
      </div>
    </div>
    <div class="gpt-list">
      <div class="gpt-list-title">
        <div class="container-title">推荐股票</div>
      </div>
      <div class="gpt-list-content" v-for="i in 3" :key="i">
        <div class="gpt-list-content-left">
          <img class="gpt-list-content-left-img" src="@/assets/download/d1.png" alt="" />
          <div class="gpt-list-content-left-name">KMDKTYN</div>
        </div>
        <div class="gpt-list-content-right">
          <div class="gpt-list-content-right-per"> ¥ 12,650 </div>
          <div class="gpt-list-content-right-text">-180</div>
        </div>
      </div>
    </div>

    <div class="btn-box">
      <van-button type="primary" color="var(--ex-primary-color)"> 買い </van-button>
    </div>

  </div>

  
</template>
<script setup>
import {
  getFinancialList,
  getFollowDetail,
  financialDetail,
  financialSubmit
} from '@/api/followOrder/index'
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { _t18 } from '@/utils/public'
import {showToast} from "vant"


const route = useRoute()
const resData = ref([])
const financialView = ref([''])
const buyShow = ref(false)
const id = ref('')
const fundIntroduction = ref('') // 基金介绍
const proDetail = ref({}) // 产品详情
const proRules = ref('') // 产品规则
const minNum = ref(0) // 最小输入
const maxNum = ref(0) // 最大输入
const coninName = ref('') //最少购买
const money = ref('') // 额度
const dayNum = ref('') // 额度
const headerObj = ref({
  leftName: _t18('average_income'),
  leftColor: '#DF163D',
  centerName: `${_t18('project_cycle')}(${_t18('ldgpt_host_day')})`,
  rightName: _t18(`starting-amount`)
})

const cuttentRight = reactive({
  iconRight: [{ name: 'Order', clickTo: '/home' }]
})

const getFinancialListAction = async () => {
  const params = {
    isHot: 1
  }
  let res = await getFinancialList(params)
  if (res.code == 200) {
    resData.value = res.rows
  } else {
    showToast(res.msg)
  }
}

const getFinancialViewAction = async () => {
  let item = route.query.id
  let res = await financialDetail(item)
  if (res.code == 200) {
    console.log(res.data, 'reeeessss')
    const { title, icon, avgRate, days, limitMin, coin, prodectIntroduction, problem } = res.data
    dayNum.value = +days
    console.log(days.value, 'dddd')
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
  } else {
    showToast(res.msg)
  }
}

const submitFollow = () => {
  buyShow.value = true
}

const handelClose = () => {
  buyShow.value = false
}

const payNow = async () => {
  let planId = id.value
  let res = await financialSubmit(planId, money.value, dayNum.value)
  if (money.value !== '') {
    if (res.code === 200) {
      showToast(res.msg)
      handelClose()
    } else {
      showToast(res.msg)
    }
  }
}

onMounted(() => {
  id.value = route.query.id
  // getFinancialListAction()
  // getFinancialViewAction(id)
})
</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}

.container {
  padding: 56px 15px 15px;
  .gpt-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 10px;
    background-color: var(--ex-backup--background-color);
    border-radius: 10px;
    margin-bottom: 15px;
    &-img {
      position: absolute;
      top: -37px;
      width: 74px;
      height: 74px;
      border-radius: 50%;
    }
    &-content {
      font-size: 14px;
      color: var(--ex--home-grid-text-color);
      line-height: 20px;
      text-align: center;
      text-indent: 2em;
      margin: 30px 0 24px;
    }
    &-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 15px;
      background-color: var(--ex-default-background-color);
      border-radius: 10px;
      margin-top: 20px;
      &-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-label {
          color: var(--ex-assets--font-card-color);
          line-height: 20px;
          text-align: center;
        }
        &-value {
          color: var(--ex-font-color33);
          line-height: 20px;
          margin-top: 10px;
        }
      }
    }
  }

  .gpt-list-title {
    padding: 20px 15px 15px;
  }

  .gpt-list {
    background-color: var(--ex-backup--background-color);
    border-radius: 10px;
    &-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid var(--ex-border-color16);
      &:last-child {
        border-bottom: none;
      }
      &-left {
        display: flex;
        align-items: center;
        margin-left: 15px;
        &-img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
      &-right {
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        &-name {
          font-weight: 600;
          color: var(--ex-font-color33);
        }
        &-per {
          font-weight: 500;
          color: var(--ex-font-color33);
        }
        &-text {
          margin-top: 5px;
          font-size: 12px;
          color: var(--ex-font-color32);
        }
      }
    }
  }


  .btn-box {
    width: 100%;
    margin-top: 20px;
    :deep(.van-button) {
      width: 100%;
      height: 46px;
      border-radius: 8px;
    }
  }

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
}
</style>
