<template>
  <div class="strategy">
    <div class="strategy-item" v-for="i in 4" :key="i">
      <div class="strategy-item-header">
        <img class="strategy-item-header-avatar" src="@/assets/download/d1.png" alt="">
        <div class="strategy-item-header-right">
          <div class="strategy-item-header-right-name">中村達也</div>
          <div class="strategy-item-header-right-job">テクニカル分析のリーダー</div>
        </div>
      </div>
      <div class="strategy-item-center">
        <div class="strategy-item-center-left">
          <div class="strategy-item-center-left-title">平均年收入</div>
          <div class="strategy-item-center-left-per">+4%</div>
        </div>
        <div class="strategy-item-center-right">
          <SmoothLineChart :dataPoints="dataPoints" />
          <!-- <img src="@/assets/financial/WaveLine.png" class="strategy-item-center-right-img" /> -->
        </div>
      </div>

      <div class="strategy-item-bottom">
        <div class="strategy-item-bottom-item">
          <div class="strategy-item-bottom-item-title">跟投人数</div>
          <div class="strategy-item-bottom-item-number">29292</div>
        </div>
        <div class="strategy-item-bottom-item">
          <div class="strategy-item-bottom-item-title">回报率</div>
          <div class="strategy-item-bottom-item-per">+52%</div>
        </div>
        <div class="strategy-item-bottom-item">
          <div class="strategy-item-bottom-item-title">跟投金额</div>
          <div class="strategy-item-bottom-item-per">+52%</div>
        </div>
      </div>

    </div>

  </div>

  <!-- <div class="StrategyCardList" v-for="item in itemObj" @click="handleCardClick(item)">
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
  </div> -->
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router'
import { _t18 } from '@/utils/public'
import SmoothLineChart from './SmoothLineChart.vue'
const router = useRouter()
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})

const dataPoints = ref([30, 20, 80, 40, 60, 20, 70, 90])

const handleCardClick = (item) => {
  router.push('/financialList')
}
</script>
<style lang="scss" scoped>
.strategy {
  width: 100%;
  &-item {
    border-radius: 10px;
    background-color: var(--ex-backup--background-color);
    border: 1px solid var(--ex-border-color11);
    padding: 20px 15px;
    box-sizing: border-box;
    margin-bottom: 10px;
    &-header {
      display: flex;
      align-items: center;
      &-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin-right: 10px;
      }
      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 42px;
        &-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--ex-default-font-color);
        }
        &-job {
          font-weight: 400;
          font-size: 12px;
          color: var(--ex-font-color32);
        }
      }
    }

    &-center {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      &-left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 36px;
        &-title {
          font-weight: 600;
          color: var(--ex-default-font-color);
          font-size: 14px;
        }
        &-per {
          color: var(--ex-border-color12);
          font-weight: 400;
          font-size: 14px;
        }
      }
      &-right {
        width: 130px;
        height: 36px;
        &-img {
          width: 100%;
          height: 100%;
        }
      }
    }

    &-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
      &-item {
        font-weight: 600;
        font-size: 14px;
        color: var(--ex-default-font-color);
        text-align: center;
        &-title {
          margin-bottom: 5px;
        }
        &-number {
          font-weight: 400;
        }
        &-per {
          color: var(--ex-border-color12);
        }
      }
    }

  }
}

// .StrategyCardList {
//   width: 100%;
//   margin: 20px auto;
//   border: 1px solid rgba(43, 44, 88, 1);
//   border-radius: 10px;
//   height: 170px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   padding: 3px;

//   > div {
//     height: calc(100% / 3);
//     display: flex;
//     align-items: center;
//     padding-left: 0.5rem;
//     font-size: 14px;

//     > div {
//       height: 100%;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//     }
//   }

//   .cardHeader {
//     > div:nth-child(2) {
//       margin-left: 10px;
//     }
//   }

//   .cardBody {
//     justify-content: space-between;
//     padding-right: 20px;

//     p:nth-child(2) {
//       color: green;
//     }
//   }

//   .cardFooter {
//     font-size: 14px;
//     justify-content: space-between;

//     div {
//       justify-content: space-around;
//     }

//     div:nth-child(2) > p:nth-child(2) {
//       color: green;
//     }

//     div:nth-child(3) > p:nth-child(2) {
//       color: green;
//     }
//   }
// }
</style>
