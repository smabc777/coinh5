<template>
  <HeaderBar
    :currentName="_t18('OrderRecord')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="container">
    <van-tabs
      border
      lazy-render
      title-active-color="var(--ex-primary-color)"
      title-inactive-color="var(--ex-default-font-color)"
      v-model:active="currentIndex"
    >
      <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title"></van-tab>
    </van-tabs>

    <div class="list">
      <div class="list-item" v-for="i in 5" :key="i">
        <div class="list-item-header">
          <div class="list-item-header-no">Order Number: 123844</div>
          <div class="list-item-header-status">in Progress</div>
        </div>
        <div class="list-item-content">
          <div class="list-item-content-item">
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Amount (JPY)</div>
              <div class="list-item-content-item-info-value">1114</div>
            </div>
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Profit</div>
              <div class="list-item-content-item-info-value">1.5%-2%</div>
            </div>
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Duration Period</div>
              <div class="list-item-content-item-info-value">3d</div>
            </div>
          </div>
          <div class="list-item-content-item">
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Estimated Profit(JPY)</div>
              <div class="list-item-content-item-info-value">22.22</div>
            </div>
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Total Profit</div>
              <div class="list-item-content-item-info-value">0</div>
            </div>
            <div class="list-item-content-item-info">
              <div class="list-item-content-item-info-title">Duration Period</div>
              <div class="list-item-content-item-info-value">
                <span>71</span>:<span>56</span>:<span>21</span>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item-bottom">
          <div class="list-item-bottom-date">Purchase Date: 2024-05-23 08:56:21</div>
          <van-button type="primary" color="var(--ex-primary-color)">Details</van-button>
        </div>
      </div>

    </div>

  </div>
</template>
<script setup>

const cuttentRight = reactive({
  iconRight: [{ name: 'Order', clickTo: '/home' }]
})

const currentIndex = ref(0)
const headerList = ref([
  { title: 'All Orders' },
  { title: 'In Progress' },
  { title: 'Completed' }
])

</script>
<style lang="scss" scoped>
* {
  font-size: 14px;
  font-weight: 400;
  color: var(--ex-default-font-color);
  box-sizing: border-box;
}
.container {
  padding: 0 15px 15px 15px;
  :deep(.van-tabs) {
    margin-top: 10px;
    .van-tabs__nav {
      padding-left: 0;
      padding-right: 0;
    }

    .van-tabs__wrap {
      height: 36px;

      &:after {
        border-bottom: 1px solid var(--ex-border-color14);
        border-top: none;
        opacity: 0.4;
      }
    }

    .van-tab {
      // padding: 0 12px;
      font-size: 14px;
    }

    .van-tabs__line {
      height: 2px;
      background-color: var(--ex-primary-color);
    }
  }

  .list {
    margin-top: 10px;
    &-item {
      background: var(--ex-backup--background-color);
      border-radius: 10px;
      margin-bottom: 15px;
      &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
        border-bottom: 1px solid var(--ex-border-color16);
        font-weight: 600;
        font-size: 12px;
        &-no {
          margin-left: 15px;
        }
        &-status {
          color: var(--ex-copy-font-color);
          margin-right: 15px;
        }
      }
      &-content {
        padding: 15px;
        &-item {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:last-child {
            margin-bottom: 0;
          }
          &-info {
            width: 33.33%;
            word-wrap: break-word;
            text-align: center;
            &-title {
              color: var(--ex--home-grid-text-color);
              margin-bottom: 10px;
            }
            &-value {
              font-size: 12px;
              span {
                background-color: var(--ex-default-background-color);
                border-radius: 4px;
                padding: 4px;
                margin: 0 4px;
              }
            }
          }
        }
      }
      &-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 0;
        border-top: 1px solid var(--ex-border-color16);
        &-date {
          font-size: 12px;
          margin-left: 15px;
        }
        :deep(.van-button) {
          height: 26px;
          border-radius: 4px;
          margin-right: 15px;
        }
      }
    }
  }

}
</style>