<!-- AI GPT -->
<template>
  <HeaderBar
    :currentName="_t18('AI GPT')"
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
      <div class="container-title">Investment Information</div>
      <div class="gpt-box-card">
        <div class="gpt-box-card-item" v-for="item in 3">
          <div class="gpt-box-card-item-label">The Annual Average</div>
          <div class="gpt-box-card-item-value">48%</div>
        </div>
      </div>
    </div>
    <div class="gpt-list">
      <div class="gpt-list-title">
        <div class="container-title">Investment Information</div>
      </div>
      <div class="gpt-list-content" v-for="i in 3" :key="i">
        <div class="gpt-list-content-left">
          <img class="gpt-list-content-left-img" src="@/assets/download/d1.png" alt="" />
          <div class="gpt-list-content-left-name">KMDKTYN</div>
        </div>
        <div class="gpt-list-content-right">
          <div class="gpt-list-content-right-per">48%</div>
          <div class="gpt-list-content-right-text">highest annualized</div>
        </div>
      </div>
    </div>

    <div class="gpt-list-title">
      <div class="container-title">Investment Information</div>
    </div>
    <div class="gpt-bottom-content">
      After running the above analysis, AI GPT scores each stock on a scale of 1-100. Then invest in
      the top 10-12 stocks and hold them for about two weeks. After two weeks, rerun the analysis
      and start the process again.
    </div>

    <div class="btn-box">
      <van-button type="primary" color="var(--ex-primary-color)" @click="handleOpen"> Follow the investmen </van-button>
    </div>

    <!-- 提交订单弹窗 -->
     <submit-order-popup ref="SubmitOrderPopupRef"></submit-order-popup>

  </div>

  <!-- <div class="follow">
    <HeaderBar :currentName="_t18('AI GPT')" :border_bottom="false"></HeaderBar>
    <div class="followItemBox">
      <div class="followItemBoxImg">
        <van-image
          round
          width="3rem"
          height="3rem"
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <span>
        We use AI GPT for technical analysis, advanced sentiment analysis analyzing recent financial
        statements and studying recent news headlines to select a portfolio of 10-12 stocks. The
        portfolio has gained 60.2% since its inception.
      </span>
      <p class="cardTitle">Investment Information</p>
      <div class="followItemView">
        <div class="followItemViewText">
          <p>The Annual Average</p>
          <p>{{ financialView.grandTotalProfitRate }}%</p>
        </div>
        <div class="followItemViewText">
          <p>Last Year</p>
          <p>{{ financialView.yearWinRate }}%</p>
        </div>
        <div class="followItemViewText">
          <p>Profit Probability</p>
          <p>{{ financialView.fee }}%</p>
        </div>
      </div>
    </div>
    <div class="followItemContert">
      <p class="cardTitle">Investment Information</p>
      <FinancialViewList :itemObj="resData"></FinancialViewList>
    </div>
    <p class="cardTitle">Where do we get these stocks from?</p>
    <div class="followItemContertText">
      After running the above analysis, AI GPT scores each stock on a scale of 1-100. Then invest in
      the top 10-12 stocks and hold them for about two weeks. After two weeks, rerun the analysis
      and start the process again.
    </div>
    <div class="proDetail"></div>
    <van-button type="info" color="#613AF1" block class="followButton" @click="submitFollow()"
      >Follow the investment</van-button
    >
  </div>
  <van-popup v-model:show="buyShow">
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
        <input v-model="money" :placeholder="_t18('exchange.input')" />
        <div class="proDetail">
          <FinancialDetail :proDetail="proDetail"></FinancialDetail>
        </div>
        <div class="buyBtn" @click="payNow">{{ _t18('to pay') }}</div>
      </div>
    </div>
  </van-popup> -->
</template>
<script setup>
import SubmitOrderPopup from './components/SubmitOrderPopup.vue'
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

const SubmitOrderPopupRef = ref(null)
const handleOpen = () => {
  SubmitOrderPopupRef.value.init()
}

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
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
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
  getFinancialListAction()
  getFinancialViewAction(id)
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
        align-items: center;
        &-per {
          font-weight: 500;
          color: var(--ex-font-color33);
        }
        &-text {
          color: var(--ex-font-color32);
        }
      }
    }
  }

  .gpt-bottom-content {
    color: var(--ex--home-grid-text-color);
    line-height: 20px;
    text-align: center;
    text-indent: 2em;
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

// .popup-box {
//   width: 343px;
//   padding: 21px 17px;
//   background: var(--ex-financial-card-bg-color);
//   .head {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     margin-bottom: 24px;
//     .header-left {
//       font-size: 15px;
//       color: var(--ex-default-font-color);
//       display: flex;
//       .itemImg {
//         width: 26px;
//         height: 19px;
//         object-fit: cover;
//         margin-right: 10px;
//       }
//     }

//     .header-right {
//       .closeSvg {
//         width: 16px;
//         height: 16px;
//       }
//     }
//   }
//   .buy-conter {
//     input {
//       width: 100%;
//       height: 54px;
//       font-size: 14px;
//       border-radius: 8px;
//       text-indent: 14px;
//       background: var(--ex-input-background-color);
//       border: 1px solid var(--ex-border-line);
//       &::placeholder {
//         color: var(--ex-input-font-color);
//         font-size: 14px;
//       }
//       &:focus {
//         border: 1px solid var(--ex-text-color);
//       }
//     }
//   }
//   .van-field {
//     border: 1px solid var(-ex-financial-line-bg-color) !important;
//     border-radius: 4px !important;
//   }
//   .buyBtn {
//     height: 44px;
//     background: var(--ex-primary-color);
//     border-radius: 8px;
//     font-size: 15px;
//     color: var(--ex-font-color);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// }
// .follow {
//   height: 100vh;
//   overflow-y: scroll;
//   padding-bottom: 10px;
// }

// .followItemBox,
// .followItemContert,
// .followItemContertText {
//   width: calc(100% - 20px);
//   padding-bottom: 10px;
//   border: 1px solid rgba(22, 26, 51, 1);
//   background-color: rgba(22, 26, 51, 1);
//   border-radius: 15px;
//   margin: 80px auto;
//   position: relative;
//   height: auto;
//   margin-bottom: 15px;
// }

// .followItemContertText {
//   color: #b9c1d9;
//   font-size: 14px;
//   margin: 5px auto;
//   background-color: transparent;
//   text-align: center;
//   border: 0;
// }

// .followItemContert {
//   margin-top: 5px;
// }

// .followItemBox span:nth-child(2) {
//   color: #b9c1d9;
//   margin-top: 1.8rem;
//   font-size: 0.347rem;
//   display: block;
//   text-align: center;
// }

// .followItemBoxImg {
//   position: absolute;
//   left: 50%;
//   transform: translate(-50%, -50%);
// }

// .cardTitle {
//   margin: 10px auto;
//   display: block;
//   text-indent: 2em;
//   height: 18px;
//   font-size: 16px;
// }

// .followItemView {
//   height: 100px;
//   width: calc(100% - 30px);
//   background: rgba(14, 19, 39, 1);
//   margin: 10px auto;
//   border-radius: 15px;
//   display: flex;
//   justify-content: space-around;
// }

// .followItemViewText {
//   width: calc(90% / 3);
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-around;
// }

// .followItemViewText P {
//   display: block;
//   font-size: 14px;
//   text-align: center;
// }

// .followItemViewText P:nth-child(1) {
//   color: #b9c1d9;
// }

// .followItemViewText P:nth-child(2) {
//   color: #25a750;
// }

// .followButton {
//   width: 96%;
//   margin: 10px auto;
//   font-size: 18px;
//   height: 54px;
//   border-radius: 10px;
// }
</style>
