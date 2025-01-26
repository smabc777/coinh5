<!-- Defi挖矿 -->
<template>
  <HeaderBar
    :currentName="_t18('AI Follow')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="follow">
    <div class="follow-title">智能AI 交易，高回报助力</div>
    <div class="follow-subtitle"> AI交易，智能预测市场，助您获得更高回报。利用先进的深度学习技术，AI 分析数据，提供精准的交易策略。无论股票、外汇还是加密货币，信任AI交易，实现智能投资，稳定增长财富。开启智能交易新纪元，迎接成功的投资未来。 </div>

    <div class="stat-info">
      <div class="stat-info-top">
        <div class="stat-info-top-header">
          <div class="stat-info-top-header-title">快速统计信息</div>
          <div class="stat-info-top-header-per">
            <img src="/resource/images/follow/arrow-green.png" alt="">
            <div>14.5%</div>
          </div>
        </div>
        <div class="stat-info-top-date">2024---05---26</div>
      </div>

      <Graph></Graph>

    </div>


    <div class="cardTitle margin40">AI合约市场</div>
    <StrategyCard :itemObj="traderList"></StrategyCard>

    <div class="cardTitle margin40">排行榜</div>
    <div class="follow-ranking">
      <div class="follow-ranking-title">前3名投资者</div>
      <div class="follow-ranking-list">
        <div class="follow-ranking-list-item" v-for="i in 3" :key="i">
          <div class="follow-ranking-list-item-name">Warren E. Buffett</div>
          <img class="follow-ranking-list-item-avatar" src="@/assets/download/d1.png" alt="">
          <div class="follow-ranking-list-item-name">586,480USD</div>
          <div class="follow-ranking-list-item-per">17680%</div>
        </div>
      </div>

      <!-- <div class="follow-ranking-list" v-for="item in rankUserList">
        <span>{{ item.userName.split('-')[0] }}</span>
        <span>{{ item.userName.split('-')[1] }}</span>
        <van-image round width="1.5rem" height="1.5rem" fit="cover" :src="item.avatar" />
        <span> {{ item.earn }} </span>
        <span>{{ item.grandTotalProfitRate }}</span>
      </div> -->
    </div>
    <!-- 投资人 -->
    <PersonList :itemObj="rankUserLastList"></PersonList>

    <!-- <div class="gpt-desc">
      <div class="gpt-desc-title">AI交易智能操作</div>
      <div class="gpt-desc-info">  人工智能操作，热门经理人，智能助手引领投资决策，抓住市场机会。利用自然语言处理技术，分析海量数据，深入挖掘潜在趋势，提供精准投资建议。无论是股票、外汇、期货还是加密货币，操作揭示独到市场见解，助您获取更高回报。 </div>
      <div class="gpt-desc-info">   它不受情绪波动影响，始终冷静客观，以数据为依据作出理性决策。通过持续学习和优化，GPT操作不断提升预测准确性，为您创造稳定增长的财富 </div>
      <img class="gpt-desc-img" src="/resource/images/headimg/code.gif" alt="">
    </div> -->
    
    <div class="cardTitle marginTop15">收益产出</div>
    <FundCard :itemObj="rankList"></FundCard>
  </div>
</template>
<script setup>
import {
  getFollowTrader,
  getFollowOrder,
  getFollowDetail,
  getFollowRank,
  getUserData,
  getPositionRank
} from '@/api/followOrder/index'
import { _getDateD } from '@/utils/public'
import { showToast } from 'vant'
import FundCard from './components/FundCard.vue'
import ViewCard from './components/ViewCard.vue'
import StrategyCard from './components/StrategyCard.vue'
import PersonList from './components/PersonList.vue'

import Graph from '@/components/Echarts/Graph.vue'

const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})

// 初始化时间
let currentDate = new Date()
let isoString = currentDate.toISOString()
let formattedDate = isoString.substring(0, 10)

//获取跟单员
const traderList = ref([])
const getFollowTraderAction = async () => {
  let res = await getFollowTrader()
  if (res.code == 200) {
    // traderList.value = res.rows
    console.log(traderList, '333')
  } else {
    showToast(res.msg)
  }
}

const getFollowOrderAction = async () => {
  let followType = 1
  let res = await getFollowOrder(followType)
  if (res.code == 200) {
    return res.rows
  } else {
    showToast(res.msg)
  }
}

// 获取交易员
const rankList = ref([])
const getFollowRankAction = async () => {
  let res = await getFollowRank()
  if (res.code == '200') {
    rankList.value = res.rows
  } else {
    showToast(res.msg)
  }
}

//获取收益信息
const rankResult = ref([])
const getUserDataAction = async () => {
  let res = await getUserData()
  if (res.code == '200') {
    rankResult.value = res.data
  } else {
    showToast(res.msg)
  }
}

//获取投资人
const rankUserList = ref([])
const rankUserLastList = ref([])
const getPositionRankAction = async () => {
  let res = await getPositionRank()
  if (res.code == '200') {
    const data = res.rows.map((user) => {
      const randomIndex = getImageUrl()
      return { ...user, avatar: randomIndex }
    })
    rankUserList.value = data.slice(0, 3)
    rankUserLastList.value = data.slice(3, rankUserLastList.length)
    console.log(rankUserLastList, 'rrr')
  } else {
    showToast(res.msg)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  let num = Math.floor(Math.random() * (max - min)) + min
  return num - 1
}

const imagePaths = [
  '/resource/images/headimg/1.png',
  '/resource/images/headimg/2.png',
  '/resource/images/headimg/3.png',
  '/resource/images/headimg/4.png',
  '/resource/images/headimg/5.png',
  '/resource/images/headimg/6.png',
  '/resource/images/headimg/7.png',
  '/resource/images/headimg/8.png'
]

const getImageUrl = () => {
  return imagePaths[getRandomInt(2, 9) - 1]
}

onMounted(() => {
  getFollowTraderAction()
  getFollowRankAction()
  getFollowOrderAction(1)
  getUserDataAction()
  getPositionRankAction()
})
</script>
<style lang="scss" scoped>
.follow {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  padding: 0 16px 50px 16px;
  .margin40 {
    margin: 15px 0;
  }
  .marginTop15 {
    margin-top: 15px;
  }
  &-title {
    font-weight: 600;
    color: var(--ex-default-font-color);
    font-size: 18px;
    text-align: center;
  }
  &-subtitle {
    color: var(--ex-font-color32);
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    margin: 15px 0;
    text-indent: 2em;
  }
  &-img {
    width: 100%;
    height: 265px;
  }

}

.stat-info {
  border-radius: 14px;
  border: 1px solid var(--ex-border-color11);
  :deep(canvas) {
    border-radius: 0 0 14px 14px;
  }
  &-top {
    background-image: url('/resource/images/follow/follow-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 15px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-title {
        font-weight: 600;
      }
      &-per {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 16px;
        color: var(--ex-font-color34);
        img {
          width: 20px;
          height: 14px;
          margin-right: 5px;
        }
      }
    }
    &-date {
      font-weight: bold;
      font-size: 32px;
      text-align: center;
      margin-top: 20px;
    }
  }
}


.follow-ranking {
  border-radius: 10px;
  border: 1px solid var(--ex-border-color11);
  padding: 20px 16px;
  box-sizing: border-box;
  &-title {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    margin-bottom: 30px;
  }
  &-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
      width: 95px;
      border-radius: 10px;
      background: linear-gradient( 180deg, var(--ex-div-bgColor30) 0%, var(--ex-div-bgColor30) 99%);
      padding: 8px 6px;
      box-sizing: border-box;
      text-align: center;
      font-size: 12px;
      color: #fff;
      overflow-wrap: break-word;
      &:nth-child(2) {
        margin: -20px 14px 0 14px;
        background: linear-gradient( 180deg, var(--ex-div-bgColor31) 0%, var(--ex-div-bgColor31) 100%);
      }
      &:nth-child(3) {
        background: linear-gradient( 180deg, var(--ex-div-bgColor32) 0%, var(--ex-div-bgColor32) 100%);
      }
      &-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 5px 0;
      }
      &-per {
        color: var(--ex-font-color33);
        margin-top: 5px;
      }
    }
  }
}

.gpt-desc {
  margin-top: 30px;
  background: var(--ex-backup--background-color);
  border-radius: 10px;
  border: 1px solid var(--ex-border-color11);
  padding: 20px 15px;
  &-title {
    font-weight: 600;
    color: var(--ex-default-font-color);
    font-size: 16px;
    text-align: center;
    margin-bottom: 15px;
  }
  &-info {
    text-indent: 2em;
    color: var(--ex-font-color32);
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    margin-bottom: 15px;
  }
  &-img {
    width: 100%;
    height: 230px;
  }
}

.cardTitle {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--ex-default-font-color);
}

</style>
