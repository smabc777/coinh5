<template>
  <HeaderBar :currentName="_t18('benefit', ['aams', 'vitc', 'robinhood2', 'aug'])"></HeaderBar>
  <div class="container">
    <div class="header">
      <div class="header-title">Aiの総収入</div>
      <div class="header-money">1.693297 USD</div>
    </div>
    <div class="benefit-detail-table">
      <div class="benefit-detail-table-header">
        <div class="benefit-detail-table-header-item">USDT数量</div>
        <div class="benefit-detail-table-header-item">取引日</div>
        <div class="benefit-detail-table-header-item">所得</div>
      </div>
      <div class="benefit-detail-table-header" v-for="item in 3">
        <div class="benefit-detail-table-header-item">1.98919111111</div>
        <div class="benefit-detail-table-header-item">09:00:00</div>
        <div class="benefit-detail-table-header-item">0.369496111111</div>
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
  .benefit-detail-table {
    padding: 20px 10px;
    background-color: var(--ex-backup--background-color);
    border-radius: 10px;
    line-height: 20px;
    color: var(--ex-default-font-color);
    margin-bottom: 15px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      &:first-child {
        font-weight: 600;
      }
      &-item {
        flex: 1;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
</style>