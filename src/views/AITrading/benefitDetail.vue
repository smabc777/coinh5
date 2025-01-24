<template>
  <HeaderBar :currentName="_t18('benefit', ['aams', 'vitc', 'robinhood2', 'aug'])"></HeaderBar>
  <div class="container">
    <div class="header">
      <div class="header-title">Aiの総収入</div>
      <div class="header-money">1.693297 USD</div>
    </div>
    <div class="benefit-detail">
      <div class="benefit-detail-item" v-for="item in 3">
        <div class="benefit-detail-item-money">
          <div class="benefit-detail-item-money-left">所得：</div>
          <div class="benefit-detail-item-money-right"><span>1.693297</span>USD</div>
        </div>
        <div class="benefit-detail-item-time">
          <div class="benefit-detail-item-time-left">2024-05-26</div>
          <div class="benefit-detail-item-time-right">
            <span>詳細を見る</span>
            <van-icon name="arrow" color="var(--ex-primary-color)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}
.container {
  padding: 20px 15px;
  .header {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-title {
      font-size: 16px;
      color: var(--ex--home-grid-text-color);
      margin-bottom: 15px;
    }
    &-money {
      font-size: 16px;
      color: var(--ex-default-font-color);
      line-height: 22px;
      margin-bottom: 15px;
    }
  }
  .benefit-detail {
    &-item {
      padding: 20px 15px;
      background-color: var(--ex-input-background-color);
      border-radius: 10px;
      line-height: 20px;
      color: var(--ex-default-font-color);
      margin-bottom: 15px;
      &-money {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        &-right {
          span {
            color: var(--ex-font-color33);
            margin-right: 4px;
          }
        }
      }
      &-time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-right {
          span {
            color: var(--ex-primary-color);
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>