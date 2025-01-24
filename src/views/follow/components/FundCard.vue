<template>
  <div class="income-rank">
    <div class="income-rank-header">
      <div class="income-rank-header-title">产品名称</div>
      <div class="income-rank-header-title">策略员</div>
      <div class="income-rank-header-title">交易盈利</div>
    </div>

    <div class="income-rank-item" v-for="p in 4" :key="p">
      <div class="income-rank-item-left">
        <img src="@/assets/download/d1.png" alt="" />
        <div class="income-rank-item-left-name">GASO</div>
      </div>
      <div class="income-rank-item-center">Catherine…</div>
      <div class="income-rank-item-right">63.00USD</div>
    </div>

  </div>
  <!-- <div class="followItemContert">
    <div class="followItemContertList">
      <P>产品名称</P>
      <P>策略员</P>
      <P>盈利</P>
    </div>
    <div class="followItemContertList" v-for="item in itemObj">
      <div>
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="cover"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </div>
      <div>{{ item.userName }}</div>
      <div class="followItemContertListTips">
        <span> {{ item.grandTotalProfitRate }}USD</span>
      </div>
    </div>
  </div> -->
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.income-rank {
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid var(--ex-div-bgColor33);
    font-size: 14px;
    font-weight: 400;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid var(--ex-div-bgColor33);
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    &-left {
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-bottom: 4px;
      }
    }
  }
}
</style>
