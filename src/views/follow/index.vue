<!-- Defi挖矿 -->
<template>
  <HeaderBar
    :currentName="_t18('AI Follow')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="follow">
    <div class="follow-title">分析超过7，000家公司</div>
    <div class="follow-subtitle">关注Al GPT探索价格、新闻一切都在这</div>
    <img class="follow-img" src="/resource/images/follow/follow.png" alt="">
    <!-- <FollowBox></FollowBox> -->
    <!-- 文字展示 -->
    <ViewCard></ViewCard>

    <div class="cardTitle margin40">策略</div>
    <StrategyCard :itemObj="traderList"></StrategyCard>

    <div class="cardTitle margin40">跟投排行榜</div>
    <div class="follow-ranking">
      <div class="follow-ranking-title">前2名投资者</div>
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

    <div class="gpt-desc margin40">
      <div class="gpt-desc-title">Al GPT 的运营</div>
      <div class="gpt-desc-info">Al GPT 将您的策略转换为您的经纪公司理解的订单。与直接将订单输入您的经纪软件相比，这可以节省您的时间并避免人为错误。他利用经纪公司提供的实时市场数据更快、更高效地实施您的期权投资策略 甚至比最聪明的人脑还要聪明。 </div>
      <div class="gpt-desc-info"> 因此，当您使用Al GPT的操作时，请考虑一下它为您节省了多少时间。为了展示这款智能软件的强大功能，我们整理了一些快速统计数据。 </div>
    </div>

    <div class="income-box">
      <div class="cardTitle">累计收入</div>
      <img src="@/assets/download/banner.png" alt="">
    </div>

    <div class="stat-box">
      <div class="stat-box-title">快速统信计</div>
      <div class="stat-box-date">2024-05-20今天</div>
      <div class="stat-box-line"></div>
      <div class="stat-box-subtitle">放动资金:1890951USD</div>
      <div class="stat-box-subtitle">用户收入:1890951USD</div>
      <div class="stat-box-subtitle">回银率:48%</div>
    </div>

    <!-- <div class="followViewBox">
      <div>
        <p>快速统信计</p>
        <p>{{ formattedDate }} &nbsp;今天</p>
      </div>
      <div>
        <p>放动资金: {{ parseFloat(rankResult.circulationAmt).toFixed(2) }}</p>
        <p>用户收入: {{ parseFloat(rankResult.userProfit).toFixed(2) }}</p>
        <p>回银率: {{ (rankResult.userProfit / rankResult.circulationAmt).toFixed(2) * 100 }}%</p>
      </div>
    </div> -->
    <div class="cardTitle">收益产出</div>
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
import FollowBox from './components/FollowBox.vue'

import GraphMin from '@/components/Echarts/GraphMin.vue'

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
    margin: 40px 0 15px 0;
  }
  &-title {
    font-weight: 600;
    color: var(--ex-default-font-color);
    font-size: 18px;
  }
  &-subtitle {
    color: var(--ex-font-color32);
    font-size: 14px;
    font-weight: 400;
    margin: 15px 0;
  }
  &-img {
    width: 100%;
    height: 265px;
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
}

.income-box {
  margin-top: 25px;
  img {
    margin-top: 15px;
    width: 100%;
    height: 280px;
  }
}

.stat-box {
  background: var(--ex-backup--background-color);
  border-radius: 10px;
  border: 1px solid var(--ex-border-color11);
  padding: 20px 0;
  box-sizing: border-box;
  color: var(--ex-default-font-color);
  font-weight: 600;
  font-size: 14px;
  margin-top: 40px;
  margin-bottom: 40px;
  &-title {
    padding: 0 15px;
  }
  &-date {
    margin: 15px 0;
    padding: 0 15px;
  }
  &-line {
    width: 100%;
    height: 1px;
    background: var(--ex-div-bgColor33);
  }
  &-subtitle {
    font-weight: 400;
    margin-top: 15px;
    padding: 0 15px;
  }
}

.cardTitle {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--ex-default-font-color);
}

</style>
