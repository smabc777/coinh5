<template>
  <van-popup
    v-model:show="submitOrderShow"
    position="bottom"
    round
    closeable
    :style="{ height: '70%' }"
    @close="close"
  >
    <div class="submit-page">
      <div class="item">
        <div class="item-left">Select Cycle</div>
        <div class="item-right">Yield</div>
      </div>
      <div class="item">
        <div class="item-left">
          3d
          <img class="item-left-arrow" src="/resource/images/follow/arrow.png" alt="">
        </div>
        <div class="item-right">1.5%-2%</div>
      </div>
      <div class="line"></div>
      <div class="item">
        <div class="item-left">Single Transaction</div>
        <div class="item-right">1000-10000JPY</div>
      </div>
      <div class="item">
        <div class="item-left">Estimated Profit</div>
        <div class="item-right"><span>0.00JPY</span></div>
      </div>
      <div class="item">
        <div class="item-left">Available Balance</div>
        <div class="item-right">0JPY</div>
      </div>

      <input class="amount-input" type="text" placeholder="Please enter the purchase amount">

      <van-button type="primary" color="var(--ex-trade-buy-bg-color)"> Follow the investmaent </van-button>

    </div>
  </van-popup>
</template>
<script setup>

const submitOrderShow = ref(false)

const init = () => {
  submitOrderShow.value = true
  console.log(submitOrderShow.value)
}

const close = () => {
  submitOrderShow.value = false
}

defineExpose({
  init
})
</script>
<style lang="scss" scoped>
.submit-page {
  padding: 40px 15px;
  box-sizing: border-box;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    font-size: 16px;
    &-left {
      display: flex;
      align-items: center;
      &-arrow {
        width: 14px;
        height: 10px;
        margin-left: 8px;
      }
    }
    &-right {
      span {
        color: var(--ex-two-level-theme-color);
        font-size: 14px;
      }
    }
  }

  .amount-input {
    width: 100%;
    height: 46px;
    border-radius: 6px;
    background-color: var(--ex--backup-background-color-2);
    padding: 0 15px;
    &::-webkit-input-placeholder {
      font-weight: 400;
      font-size: 14px;
      color: var(--ex-assets--font-card-color);
    }
  }

  :deep(.van-button) {
    width: 100%;
    height: 46px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: var(--ex-default-font-color);
    opacity: 0.08;
  }
}
</style>

