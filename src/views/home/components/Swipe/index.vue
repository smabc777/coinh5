<template>
  <!--  首页轮播图  -->
  <div class="swipe" v-if="bannerList.length">
    <van-swipe indicator-color="#fff" :autoplay="3000" lazy-render :loop="true">
      <van-swipe-item v-for="item in bannerList" :key="item.url">
        <image-load  :filePath="item.imgUrl" :lazy="false"  />
      </van-swipe-item>
      <template #indicator="{ active, total }">
        <div class="custom-indicator">
          <p v-for="(item,index) in total" :class="{active:index==active}" :key="index"></p>
        </div>
      </template>
    </van-swipe>
  </div>
</template>

<script setup>

// 获取轮播图数据
import {publiceNotice} from "@/api/common";

const bannerList = ref([])
const isActivated = ref(false)

// 轮播图数据请求
const getBannerList = async () => {
  isActivated.value = true
  const result = await publiceNotice('ACTIVITY_NOTICE', 'HOME_ACTIVITY')
  if (result.code === 200) {
    bannerList.value = result.data?.filter(item=>item.status=='0')
  }

}
// getBannerList()

//每次进入缓存页面获取数据
onActivated(()=>{
  // if (isActivated.value){
    getBannerList()
  // }
})

</script>

<style scoped lang="scss">
.swipe {
  padding: 0 16px;

  :deep(.van-swipe) {

    .custom-indicator {
      margin-top: 10px;
      display: flex;
      justify-content: center;

      p {
        margin: 0 2px;
        width: 10px;
        height: 2px;
        border-radius: 1px;
        background: var(--ex--home-swipe-indicator-bg);

        &.active {
          background: var(--ex--home-swipe-indicator-color);
        }
      }

    }
    .van-swipe-item{
      display: flex;
      align-items: center;
      justify-content: center;
    }

    img{
      width: 100%;
      height: 100%;
    }

  }
}


</style>
