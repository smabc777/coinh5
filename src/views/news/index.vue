<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('miraeasset_activity')" :border_bottom="false" :cuttentRight="cuttentRight"></HeaderBar>
  <div class="container">
    <div class="banner">
      <img src="/resource/images/follow/news-banner.png" alt="" />
    </div>

    <div class="news-desc">
      <div class="news-desc-title">免责声明：</div>
      <div class="news-desc-content">
        本平台包含第三方内容,我们不为其内容背书.数字资产价格波动剧烈,投资前请做好研究.
        在此处查看完整条款.
      </div>
    </div>

    <van-tabs swipeable border lazy-render title-inactive-color="var(--ex-default-font-color)"
      v-model:active="currentIndex" @click-tab="clickTab">
      <van-tab v-for="(item, index) in headerList" :key="index" :title="item.name"></van-tab>
    </van-tabs>

    <div class="news-list-loading" v-if="loading">
      <van-loading size="24px" color="var(--ex-default-font-color)">加载中...</van-loading>
    </div>

    <div class="news-list" v-if="listData.length > 0">
      <div class="news-list-item" v-for="(item, index) in listData" :key="index" @click="handleDetail(item)">
        <div class="news-list-item-title">
          {{ item.title }}
        </div>
        <div class="news-list-item-date">{{ item.creatTime }}</div>
        <!-- <img
          class="news-list-item-cover"
          src="https://lanhu-dds-backend.oss-cn-beijing.aliyuncs.com/merge_image/imgs/8e27fa1efd1d4ed7a4133b5db6d22c89_mergeImage.png"
          alt=""
        /> -->
        <view class="news-list-item-bottom">
          <van-icon name="like"
            :color="item.isLike ? 'var(--ex-three-level-theme-color)' : 'var(--ex-default-font-color)'" size="18px"
            @click.stop="handleLike(item)" />
          <view class="news-list-item-bottom-views">已读：{{ item.likeTotal }}人</view>
        </view>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getNewsTabs, getJPNewsList } from '@/api/news/index'

const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})

const Router = useRouter()
const currentIndex = ref(0)
const headerList = ref([])
const listData = ref([])
const loading = ref(true)

// 获取新闻tab
const getNewsTabsList = async () => {
  let res = await getNewsTabs()
  if (res.code === 200 && res.data.length > 0) {
    headerList.value = res.data
    getNewsList()
  }
}

// 获取新闻列表
const getNewsList = async () => {
  loading.value = true
  let list = await getJPNewsList({ type: headerList.value[currentIndex.value].keyStr })
  loading.value = false
  if (list.code === 200) {
    listData.value = list.data
    listData.value.forEach((item) => {
      item.isLike = false
      item.likeTotal = Math.floor(Math.random() * (5000 - 300 + 1)) + 300
    })
  }
}

const clickTab = (e) => {
  listData.value = []
  currentIndex.value = e.name
  getNewsList()
}

// 喜欢切换
const handleLike = (item) => {
  item.isLike = !item.isLike
}

// 新闻详情
const handleDetail = (item) => {
  Router.push({ path: '/newsDetail', query: { urlRoad: item.urlRoad } })
}

onMounted(() => {
  getNewsTabsList()
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
  padding: 0 15px 15px 15px;
  box-sizing: border-box;

  .news-list-loading {
    width: 100%;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .banner {
    width: 100%;
    height: 134px;
    border-radius: 10px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }

  .news-desc {
    background: var(--ex-backup--background-color);
    border-radius: 10px;
    border: 1px solid var(--ex-border-color11);
    padding: 12px 15px;
    margin-top: 15px;

    &-content {
      font-size: 12px;
      margin-top: 10px;
      line-height: 20px;
    }
  }

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

  .news-list {
    width: 100%;

    &-item {
      margin-top: 15px;
      background: var(--ex-backup--background-color);
      border-radius: 10px;
      border: 1px solid var(--ex-border-color11);
      padding: 18px 15px;
      line-height: 20px;

      &-date {
        color: var(--ex-font-color32);
        margin-top: 8px;
      }

      &-cover {
        width: 100%;
        height: 128px;
        margin-top: 10px;
      }

      &-bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 20px;

        &-views {
          color: var(--ex-font-color32);
        }
      }
    }
  }
}
</style>
