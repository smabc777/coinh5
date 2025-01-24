<template>
  <div class="StrategyCardList" v-for="item in itemObj" @click="handleCardClick(item)">
    <div class="cardHeader">
      <div>
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div>
        <p>{{ item.userName }}</p>
        <p>{{ item.followTips }}</p>
      </div>
    </div>
    <div class="cardBody">
      <div>
        <p>平均年收入</p>
        <p>+{{ item.yearWinRate }}%</p>
      </div>
      <div><img src="@/assets/financial/WaveLine.png" class="rightImg" /></div>
    </div>
    <div class="cardFooter">
      <div>
        <p>跟投人数</p>
        <p>{{ item.followPersonTotal }}</p>
      </div>
      <div>
        <p>回报率</p>
        <p>+{{ item.grandTotalProfitRate }}%</p>
      </div>
      <div>
        <p>跟投金额</p>
        <p>{{ item.buyAmount }}&nbsp;USD</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { _t18 } from '@/utils/public'
const router = useRouter()
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})

const handleCardClick = (item) => {
  router.push('/financialList')
}
</script>
<style lang="scss" scoped>
.StrategyCardList {
  width: 100%;
  margin: 20px auto;
  border: 1px solid rgba(43, 44, 88, 1);
  border-radius: 10px;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3px;

  > div {
    height: calc(100% / 3);
    display: flex;
    align-items: center;
    padding-left: 0.5rem;
    font-size: 14px;

    > div {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .cardHeader {
    > div:nth-child(2) {
      margin-left: 10px;
    }
  }

  .cardBody {
    justify-content: space-between;
    padding-right: 20px;

    p:nth-child(2) {
      color: green;
    }
  }

  .cardFooter {
    font-size: 14px;
    justify-content: space-between;

    div {
      justify-content: space-around;
    }

    div:nth-child(2) > p:nth-child(2) {
      color: green;
    }

    div:nth-child(3) > p:nth-child(2) {
      color: green;
    }
  }
}
</style>
