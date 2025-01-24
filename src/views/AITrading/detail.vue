<template>
  <HeaderBar :currentName="_t18('AI Trading', ['aams', 'vitc', 'robinhood2', 'aug'])"></HeaderBar>
  <div class="container">
    <div class="tabs-box">
      <van-tabs
        v-model:active="active"
        @change="onchange"
        line-width="0"
        :ellipsis="false"
        swipeable
        animated
      >
        <van-tab v-for="(item, index) in tabList" :key="index" :name="item.id">
          <template #title>
            <div class="tab-item" :class="{ atv: item.id == active }">{{ item.title }}</div>
          </template>
        </van-tab>
      </van-tabs>
    </div>

    <div class="list">
      <div class="list-item" v-for="i in 4" :key="i">
        <div class="list-item-header">
          <img src="@/assets/download/d1.png" alt="" />
          <div class="list-item-header-right">
            <div class="list-item-header-right-title">TradeBot</div>
            <div class="list-item-header-right-text">ロボットID：AI-20</div>
          </div>
        </div>

        <div class="list-item-info">
          <div class="list-item-info-left">注文番号</div>
          <div class="list-item-info-right">20240526163534539723</div>
        </div>

        <div class="list-item-info">
          <div class="list-item-info-left">本日の収益</div>
          <div class="list-item-info-right">111USD</div>
        </div>
        <div class="list-item-info">
          <div class="list-item-info-left">本日の収益</div>
          <div class="list-item-info-right">111USD</div>
        </div>
        <div class="list-item-info">
          <div class="list-item-info-left">本日の収益</div>
          <div class="list-item-info-right">111USD</div>
        </div>

        <van-button type="primary" plain>利益詳細</van-button>
      </div>
    </div>
  </div>
</template>
<script setup>
const active = ref(0)

const tabList = ref([
  {
    id: 1,
    title: '进行中'
  },
  {
    id: 2,
    title: '已完成'
  }
])

const onchange = (e) => {
  console.log(e)
}
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
  .tabs-box {
    padding: 0 50px;
    :deep(.van-tabs) {
      overflow: hidden;

      .van-tabs__nav {
        border-radius: 10px;
        padding: 0;
        background: var(--ex-home-tabs-bg-color);
      }

      .tab-item {
        padding: 12px 0;
        width: 100%;
        font-size: 14px;
        color: var(--ex-home-tabs-text-color);

        &.atv {
          font-size: 15px;
          color: var(--ex-home-tabs-text-atv-color);
        }
      }

      .van-tab--active {
        background: var(--ex-home-tabs-bg-atv-color);
        color: var(--ex-home-tabs-text-atv-color);
        border-radius: 10px;
      }
    }
  }

  .list {
    margin-top: 15px;
    &-item {
      width: 100%;
      border-radius: 10px;
      background-color: var(--ex-backup--background-color);
      margin-bottom: 15px;
      padding: 20px 15px;
      &:last-child {
        margin-bottom: 0;
      }
      &-header {
        display: flex;
        align-items: center;
        img {
          width: 44px;
          height: 44px;
          margin-right: 15px;
        }
        &-right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          &-title {
            font-weight: 500;
          }
          &-text {
            margin-top: 4px;
            color: var(--ex--home-grid-text-color);
          }
        }
      }

      &-info {
        margin: 20px 0 15px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-left {
          font-size: 12px;
          color: var(--ex--home-grid-text-color);
        }
        &-right {
          font-size: 12px;
        }
      }

      :deep(.van-button) {
        width: 165px;
        height: 40px;
        border-radius: 27px;
        border: 1px solid var(--ex-input-boder-bgColor);
        background-color: transparent;
        color: var(--ex-default-font-color);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
      }
    }
  }
}
</style>
