<template>
  <div class="raking-list">
    <div class="raking-list-item" v-for="j in 4" :key="j">
      <div class="raking-list-item-left">
        <div class="raking-list-item-left-number">{{ j }}</div>
        <img src="@/assets/download/d1.png" alt="" />
        <div class="raking-list-item-left-name">Paul Barron</div>
      </div>
      <div class="raking-list-item-right">
        <div class="raking-list-item-right-money">75,420.00USD</div>
        <div class="raking-list-item-right-per">4800%</div>
      </div>
    </div>
  </div>

  <!-- <div class="followItemContertList" v-for="item in itemObj">
    <div>
      <van-image round width="1.5rem" height="1.5rem" fit="cover" :src="item.avatar" />
    </div>
    <div>{{ item.userName }}</div>
    <div class="followItemContertListTips">
      <p>{{ item.buyAmount }}</p>
      <p>{{ item.profitRate.toFixed(2) * 100 }}%</p>
    </div>
  </div> -->
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  },
  personType: {
    type: Boolean,
    default: true
  }
})
</script>
<style lang="scss" scoped>
.raking-list {
  margin-top: 20px;
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 10px;
    background-color: var(--ex-backup--background-color);
    border-radius: 10px;
    border: 1px solid var(--ex-border-color11);
    margin-bottom: 10px;
    &-left {
      display: flex;
      align-items: center;
      color: var(--ex-default-font-color);
      font-size: 14px;
      img {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        margin: 0 10px;
      }
    }

    &-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 14px;
      color: var(--ex-default-font-color);
      text-align: right;
      &-per {
        color: var(--ex-font-color33);
        margin-top: 5px;
      }
    }

  }
}
</style>
