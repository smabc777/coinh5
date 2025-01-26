<!-- Defi挖矿 -->
<template>
  <HeaderBar
    :currentName="_t18('AI Follow')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="follow">
    <div class="followKline">
      <p class="followIndexTitle">分析超过7，000家公司</p>
      <p class="followIndexTitle followIndexTitle2">关注Al GPT探索价格、新闻一切都在这里</p>
      <div style="height: 330px">
        <!-- 首页动画 -->
        <FollowBox></FollowBox>
      </div>
    </div>
    <div class="viewBox">
      <!-- 文字展示 -->
      <ViewCard></ViewCard>
    </div>
    <div class="strategyBox">
      <p class="cardTitle" style="margin-top: 40px">策略</p>
      <!-- 策略列表 -->
      <StrategyCard :itemObj="traderList"></StrategyCard>
    </div>
    <div class="followPersonListBox">
      <p class="cardTitle">跟投排行榜</p>
      <div class="followPersonFirst">
        <p class="cardTitle">前三名投资者</p>
        <div class="followPersonFirstBox">
          <div v-for="item in rankUserList">
            <span>{{ item.userName.split('-')[0] }}</span>
            <span>{{ item.userName.split('-')[1] }}</span>
            <van-image round width="1.5rem" height="1.5rem" fit="cover" :src="item.avatar" />
            <span> {{ item.earn }} </span>
            <span>{{ item.grandTotalProfitRate }}</span>
          </div>
        </div>
      </div>
      <!-- 投资人 -->
      <PersonList :itemObj="rankUserLastList"></PersonList>
    </div>

    <div class="followViewTextBox">
      <p class="cardTitle">AI交易智能操作</p>
      <div class="cradText">
        人工智能操作，热门经理人，智能助手引领投资决策，抓住市场机会。利用自然语言处理技术，分析海量数据，深入挖掘潜在趋势，提供精准投资建议。无论是股票、外汇、期货还是加密货币，操作揭示独到市场见解，助您获取更高回报。
      </div>
      <div style="margin-top: 20px" class="cardText">
        它不受情绪波动影响，始终冷静客观，以数据为依据作出理性决策。通过持续学习和优化，GPT操作不断提升预测准确性，为您创造稳定增长的财富
      </div>
      <!-- <div class="followKline">
        <div style="height: 300px; margin-top: 30px">
          <van-image width="100%" height="100%" src="/resource/images/headimg/code.gif" />
        </div>
      </div> -->
    </div>

    <div class="followViewBox">
      <div>
        <p>快速统信计</p>
        <p>{{ formattedDate }} &nbsp;今天</p>
      </div>
      <div>
        <p>放动资金: {{ parseFloat(rankResult.circulationAmt).toFixed(2) }}</p>
        <p>用户收入: {{ parseFloat(rankResult.userProfit).toFixed(2) }}</p>
        <p>回银率: {{ (rankResult.userProfit / rankResult.circulationAmt).toFixed(2) * 100 }}%</p>
      </div>
    </div>
    <p class="cardTitle">收益产出</p>
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

// 初始化时间
let currentDate = new Date()
let isoString = currentDate.toISOString()
let formattedDate = isoString.substring(0, 10)

//获取跟单员
const traderList = ref([])
const getFollowTraderAction = async () => {
  let res = await getFollowTrader()
  if (res.code == 200) {
    traderList.value = res.rows
    console.log(traderList, '333')
  } else {
    showToast(res.msg)
  }
}

const cuttentRight = {
  iconRight: [
    { clickTo: '/financialOrder', name: 'Order' }
    //      name: _t18(`pledge_order_record`)
  ]
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
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;

  > div {
    width: 96%;
    margin: 0 auto;
  }
}

.followPersonListBox {
  width: 96%;
  margin: 0 auto;
}

.followPersonFirst {
  p {
    text-align: center;
    margin-top: 20px;
  }

  .followPersonFirstBox {
    height: 300px;
    border: 1px solid rgba(43, 44, 88, 1);
    border-radius: 15px;
    display: flex;
    background: rgba(22, 26, 51, 1);
    justify-content: space-around;
    padding-top: 20%;

    div {
      width: calc(92% / 3);
      height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      border-radius: 10px;
    }

    span {
      text-align: center;
    }

    > div:nth-child(1) {
      background-color: rgba(46, 71, 173, 1);
    }

    > div:nth-child(2) {
      margin-top: -30px;
      background-color: rgba(141, 92, 245, 1);
    }

    > div:nth-child(3) {
      background-color: rgba(55, 103, 222, 1);
    }
  }
}

.followViewBox {
  background-color: #161a33;
  border-bottom: 1px solid #161a33;
  border-radius: 15px;
  height: 200px;
  display: flex;
  width: 96%;
  margin: 0 auto;
  flex-direction: column;
  justify-content: space-around;

  .followViewBox > div:nth-child(1) {
    border-bottom: 1px solid #161a33;
  }

  p {
    padding-left: 1rem;
    font-size: 16px;
    margin-top: 5px;
  }
}

.followViewTextBox {
  width: 94%;
  margin: 0 auto;
  display: flex;

  font-size: 0.4rem;
  color: #ccc;
  flex-direction: column;
  border-radius: 0.16rem;
  border: 0.013rem solid #3c3c3b;
  background: #121212;
  padding: 0.4rem 0.267rem;
  .cardText {
    text-indent: 2em;
  }
}

.cardTitle {
  margin: 10px auto;
  display: block;
  text-indent: 2em;
  height: 18px;
  font-size: 16px;
}

.followIndexTitle,
.followIndexTitle2 {
  margin: 5px auto;
  display: block;
  height: 18px;
  font-size: 18px;
}

.followIndexTitle2 {
  font-size: 16px;
  color: #9493ac;
}
.orderView {
  color: #613af1;
  font-size: 14px;
  position: absolute;
  top: 10px; /* 距离顶部的距离 */
  right: 10px; /* 距离右边的距离 */
}
</style>
