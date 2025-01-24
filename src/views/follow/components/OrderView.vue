<template>
  <div class="viewBox" v-for="item in itemObj">
    <div class="viewHeader">
      <span>Order No:&nbsp;{{ item.orderNo }}</span
      ><span>{{ item.status === 0 ? 'in Progress' : 'completed' }}</span>
    </div>
    <div class="viewBody">
      <p class="bodyTitle">
        <!-- <span> Amount (JPY) </span> -->
        <span> Amount (JPY) </span>
        <span>Profit</span>
        <span>Duration Period</span>
      </p>
      <p>
        <span> {{ item.orderAmount }} </span><span>1.5%-2%</span><span>{{ item.days }}</span>
      </p>
      <p class="bodyTitle">
        <span class="multiline-text">
          <span> Estimated</span>
          <span> Profit(JPY)</span>
        </span>
        <span>Total Profit </span>
        <span>Duration Period </span>
      </p>
      <p>
        <span> {{ item.avgRate }} </span>
        <span>{{ item.accumulaEarn }}</span>
        <span
          ><van-count-down :time="getTimeDiff(item.endTime)" class="downBox">
            <template v-slot="timeData">
              <span class="item">{{ timeData.days }}</span>
              <span class="item">{{ timeData.hours }}</span>
              <span class="item">{{ timeData.minutes }}</span>
            </template>
          </van-count-down></span
        >
        <!-- <span
          ><van-count-down
            :time="getTimeDifferenceInMillis(item.endTime)"
            format="DD 天 HH 时 mm 分 ss 秒"
        /></span> -->
      </p>
    </div>
    <div class="viewFooter">
      <span>Purchase Date: {{ item.createTime }}</span>
      <van-button type="info" color="rgba(97, 58, 241, 1)">Details</van-button>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
const getTimeDiff = (givenTime) => {
  console.log(givenTime, 'tttt')
  const givenDate = new Date(givenTime)
  const currentDate = new Date()
  const timeDifference = givenDate - currentDate
  // 返回毫秒差
  console.log(timeDifference, 'vvvtttt')
  return timeDifference
}
</script>
<style lang="scss" scoped>
.viewBox {
  width: 92%;
  margin: 20px auto;
  background: rgba(22, 26, 51, 1);
  border-bottom: 1px solid rgba(22, 26, 51, 1);
  border-radius: 15px;

  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  > div {
    width: 100%;
    padding: 0 10px 0 10px;
  }
  .viewHeader {
    height: 15%;
    border-bottom: 1px solid rgba(14, 19, 39, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    > span:nth-child(2) {
      color: rgba(97, 58, 241, 1);
    }
  }
  .viewBody {
    height: 70%;
    border-bottom: 1px solid rgba(14, 19, 39, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > p {
      display: flex;
      justify-content: space-around;
      font-size: 12px;
      align-items: center;
    }
    span {
      width: 33%;
    }
    .bodyTitle {
      color: rgba(185, 193, 217, 1);
      font-size: 14px;
      .multiline-text {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .viewFooter {
    height: 15%;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > button {
      height: 60%;
    }
  }
}
.downBox {
  width: 100%;
  .item {
    display: inline-block;
    width: 26% !important;
    color: #fff;
    font-size: 12px;
    margin-right: 5px;
    text-align: center;
    border: 1px dashed #fff; /* 白色虚线边框 */
    background-color: inherit; /* 背景颜色继承自父级 */
  }
}

span {
  text-align: center;
}
</style>
