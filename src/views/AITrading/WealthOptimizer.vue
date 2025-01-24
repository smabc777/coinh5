<template>
  <HeaderBar
    :currentName="_t18('WealthOptimizer')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="container">
    <div class="statistics">
      <div class="statistics-title">申し込まれた金額</div>
      <div class="statistics-money">0USD</div>
      <div class="statistics-box">
        <div class="statistics-box-item">
          <div class="statistics-box-item-title">昨日の収益</div>
          <div class="statistics-box-item-money">1000 USD</div>
        </div>
        <div class="statistics-box-item">
          <div class="statistics-box-item-title">累計収入</div>
          <div class="statistics-box-item-money">1000 USD</div>
        </div>
      </div>
    </div>

    <div class="form">
      <div class="container-title">時間周期</div>
      <van-field
        is-link
        v-model="formData.text"
        readonly
        placeholder="请选择"
        @click="showPicker = true"
      >
      </van-field>
      <div class="container-title">投資金額</div>
      <van-field v-model="formData.text" type="text" placeholder="金額を入力してください">
      </van-field>
      <div class="form-item" v-for="i in 4" :key="i">
        <div class="form-item-title">利用可能：</div>
        <div class="form-item-value">1321182441323.7128US</div>
      </div>
    </div>

    <van-button type="primary" color="var(--ex-primary-color)"> 作成する </van-button>
  </div>
</template>
<script setup>
const cuttentRight = reactive({
  iconRight: [{ name: 'Order', clickTo: '/home' }]
})

const showPicker = ref(false)

const formData = ref({
  text: ''
})
</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}
.container {
  padding: 0 15px 35px 15px;
  &-title {
    align-self: flex-start;
    position: relative;
    font-weight: 600;
    line-height: 20px;
    padding-left: 28px;
    z-index: 0;
    &::before {
      content: '';
      position: absolute;
      width: 9px;
      height: 9px;
      top: 3px;
      left: 0;
      background-color: var(--ex-copy-font-color);
      z-index: 0;
    }
    &::after {
      content: '';
      position: absolute;
      width: 9px;
      height: 9px;
      top: 8px;
      left: 5px;
      background-color: var(--ex-div-bgColor35);
      z-index: -1;
    }
  }
  .statistics {
    margin: 10px 0;
    padding: 20px 15px;
    border-radius: 10px;
    background-color: var(--ex-backup--background-color);
    text-align: center;
    &-title {
      color: var(--ex--home-grid-text-color);
      margin-bottom: 15px;
    }
    &-box {
      margin-top: 15px;
      background-color: var(--ex-home-tabbar-background-color);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
      &-item {
        &-title {
          color: var(--ex--home-grid-text-color);
          margin-bottom: 15px;
        }
        &-money {
          color: var(--ex-font-color33);
          font-weight: 500;
        }
      }
    }
  }

  .form {
    border-radius: 10px;
    background-color: var(--ex-backup--background-color);
    padding: 20px 15px 5px 15px;

    :deep(.van-field) {
      margin: 10px 0 15px 0;
      padding: 10px 14px;
      border-radius: 8px;
      background: var(--ex--backup-background-color-2);
      box-sizing: border-box;
      border: 1px solid rgba(0, 0, 0, 0);
      /* 焦点状态样式 */
      &:hover {
        border: 1px solid var(--ex-input-focus-color);
        outline: none; /* 防止点击时出现默认的浏览器外观 */
        input::placeholder {
          color: var(--ex-white);
        }
      }
    }

    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }

  :deep(.van-button) {
    width: 100%;
    height: 46px;
    border-radius: 8px;
    margin-top: 20px;
  }
}
</style>
