<!-- Defi挖矿 -->
<template>
  <HeaderBar
    :currentName="_t18('AI GPTFollow the inv')"
    :border_bottom="false"
    :cuttentRight="cuttentRight"
  ></HeaderBar>
  <div class="container">
    <!-- shrink -->
    <van-tabs
      shrink
      swipeable
      border
      lazy-render
      title-inactive-color="#fff"
      v-model:active="currentIndex"
    >
      <van-tab v-for="(item, index) in headerList" :key="index" :title="item.title"></van-tab>
    </van-tabs>

    <div class="card-list">
      <div class="card-list-item" v-for="i in 8" :key="i">
        <div class="card-list-item-left">
          <img class="card-list-item-left-img" src="@/assets/download/d1.png" alt="" />
          <div class="card-list-item-left-content">
            <div class="card-list-item-left-content-title">AI GPT</div>
            <div class="card-list-item-left-content-info">GPT product portfolio</div>
            <div class="card-list-item-left-content-per">
              Average Annual Income <span>48%</span>
            </div>
          </div>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>
<script setup>
const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})

const currentIndex = ref(0)
const headerList = ref([
  { title: 'All' },
  { title: 'AI GPT' },
  { title: 'Investment Companies' },
  { title: 'Well-W' },
  { title: 'Investment Companies' },
  { title: 'Well-W' }
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
    // margin-top: 10px;
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
      background-color: var(--ex-font-color33);
    }
  }

  .card-list {
    width: 100%;
    &-item {
      margin-top: 15px;
      background: var(--ex-backup--background-color);
      border-radius: 10px;
      padding: 17px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left {
        display: flex;
        align-items: center;
        &-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin-right: 15px;
        }
        &-content {
          &-info {
            color: var(--ex--home-grid-text-color);
            font-size: 12px;
            margin: 5px 0;
          }
          &-per {
            font-size: 12px;
            span {
              color: var(--ex-font-color33);
              margin-left: 5px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
