<script setup>
import { _t18 } from '@/utils/public'
import { onMounted } from 'vue'
let props = defineProps({
  cardData: {
    type: Object
  },
  index: {
    type: Number
  }
})
const dataValue = ref(props.cardData)
const index = ref(null)
onMounted(()=>{
  if(['gridai'].includes(__config._APP_ENV)){
    index.value=`V${props.index}`
  }else{
    index.value=props.index > 9 ? props.index : `0${props.index}`
  }
})
</script>
<template>
  <div class="box">
    <div class="top">
      <div class="top_left">
        <div class="top_left_title">
          <div class="left_content">
            <div class="index">{{ index }}</div>
            <div class="title fw-bold">{{ dataValue.title }}</div>
          </div>
          <div class="right_content">{{ _t18('pledge_Buy', ['aams','vitc', 'aug','gridai']) }}</div>
        </div>
        <div class="odds">
          <div class="odds_left">
            <!-- 收益率 -->
            <p>{{ _t18('pledge_rate_return') }}</p>
            <span class="fw-num rate">{{ dataValue.minOdds }}%~{{ dataValue.maxOdds }}%</span>
          </div>
          <div class="odds_right">
            <svg-load :name="['gridai'].includes(_getConfig('_APP_ENV'))?'usdc':'usdt'" class="usdt2"></svg-load>
            <svg-load name="usdt" class="usdt1"></svg-load>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="content1">
          <!-- 限额 -->
          <p>{{ _t18('pledge_quota') }}</p>
          <span class="fw-num">{{ dataValue.limitMin }}~{{ dataValue.limitMax }}</span>
        </div>
        <div class="content2">
          <!-- 天数 -->
          <p>{{ _t18('pledge_number_days') }}</p>
          <span class="fw-num day">{{ dataValue.days }}</span>
        </div>
        <div class="content3">
          <!-- 可购 -->
          <p>{{ _t18('pledge_available_purchase', ['aams']) }}</p>
          <span class="fw-num" v-if="['dev'].includes(_getConfig('_APP_ENV'))">{{
            `${dataValue.buyPurchase}/${dataValue.timeLimit}`
          }}</span>
          <!-- buyPurchase -->
          <span class="fw-num" v-else>{{ `${dataValue.timeLimit}` }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.box {
  margin-top: 20px;
  cursor: pointer;
  border-radius: 10px;
  font-size: 14px;
  color: var(--ex-passive-font-color);
  background: var(--ex-backup--background-color);
  padding: 20px 14px;
  border:1px solid var(--ex--backup-background-color-2);
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(208,218,213,0.19);
    padding-bottom: 20px;
    .top_left {
      width: 100%;
      .top_left_title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left_content{
          display: flex;
          align-items: center;
        }
        .right_content{
          border-radius: 8px;
          color: var(--ex-font-color);
          background: var(--ex-primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 9px 26px;
          font-size: 12px;
        }
      }
      .index{
        width: 40px;
        height: 40px;
        background: var(--ex-primary-color);
        border-radius: 9px;
        font-size: 15px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .odds{
        margin-top: 21px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .odds_right{
          margin-right: 15px;
          .usdt1{
            width: 38px;
            height: 38px;
            margin-left: -55px;
          }
          .usdt2{
            width: 27px;
            height: 27px;

          }
        }
      }
      .rate{
        color: var(--ex-two-level-theme-color);
        margin-top: 4px;
        font-size: 17px;
      }
      .title {
        font-weight: bold;
        color: var(--ex-default-font-color);
        margin-left: 9px;
      }
      .usdt {
        font-size: 20px;
        margin-right: 10px;
      }
    }
  }
  .content {
    display: flex;
    padding: 20px 10px 0;
    justify-content: space-between;
    .left {
      flex:1;
      display: flex;
      flex-direction: column;
      & > div {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--ex-passive-font-color);
        font-size: 12px;
        p {
          min-width: 36px;
        }
        span {
          margin-left: 20px;
          color: var(--ex-default-font-color);
          font-size: 14px;
          margin-top: 14px;
        }
        span.rate {
          color: var(--ex-font-color9);
        }
        .day{
          color: var(--ex-text-color);
        }
      }
    }
    .right {
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      .zhiyacard {
        width: 100%;
        border-radius: 5px;
      }
    }
  }
}
</style>
