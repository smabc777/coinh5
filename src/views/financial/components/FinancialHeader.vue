<template>
  <div class="financia-header">
    <div class="header">
      <img src="@/assets/financial/coin.png" class="itemImg" />
      <div class="fw-bold">{{ headerObj.title }}</div>
    </div>
    <div class="headerList">
      <div class="item">
        <div
          class="itemNum fw-num"
          :style="headerObj.leftColor ? `color: ${headerObj.leftColor}` : ''"
        >
          {{ headerObj.leftNum }}
        </div>
        <div class="itemName">{{ headerObj.leftName }}</div>
      </div>
      <div class="item">
        <div class="itemNum fw-num">{{ headerObj.centerNum }}</div>
        <div class="itemName">{{ headerObj.centerName }}</div>
      </div>
      <div class="item">
        <div class="itemNum fw-num">{{ headerObj.rightNum }}</div>
        <div class="itemName">{{ headerObj.rightName }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  headerObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.financia-header {
  background: var(--ex-financial-card-bg-color);
  border-radius: 8px;
  .header {
    padding: 10px 17px;
    font-size: 15px;
    color: var(--ex-default-font-color);
    background: #252a4d;
    border-radius: 8px;
    display: flex;
    .itemImg {
      width: 26px;
      height: 19px;
      object-fit: cover;
      margin-right: 10px;
    }
  }
  .headerList {
    padding: 10px 15px 20px;
    display: flex;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column-reverse;
      .itemNum {
        font-size: 16px;
        color: var(--ex-default-font-color);
      }
      .itemName {
        margin-top: 10px;
        font-size: 12px;
        color: var(--ex-passive-font-color);
      }
    }
    .item:nth-child(1) {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .item:nth-child(2) {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .item:nth-child(3) {
      text-align: right;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
}
</style>
