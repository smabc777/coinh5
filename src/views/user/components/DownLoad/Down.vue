<template>
  <div class="content">
    <div class="laod-header">
      <div class="flex-st">
        <Logo></Logo>
        <div class="sub-title">
          {{ _getConfig('_APP_EXCHANGE_NAME').toUpperCase() }} {{ _t18('wallet') }}
        </div>
      </div>
      <div class="title">
        {{ _t18('The safest, fastest and most stable exchange in the world') }} 
      </div>

      <!-- <div class="tips">{{ _t18('The safest, fastest and most stable exchange in the world') }}</div> -->
      <!-- <div class="flex-st tipsdet">
        <van-icon name="success" size="18" color="var(--ex-font-color)" />
        <div>{{ _t18('wallet_tip1') }}</div>
      </div>
      <div class="flex-st tipsdet">
        <van-icon name="success" size="18" color="var(--ex-font-color)" />
        <div>{{ _t18('wallet_tip2') }}</div>
      </div>
      <div class="flex-st tipsdet">
        <van-icon name="success" size="18" color="var(--ex-font-color)" />
        <div>
          {{ _t18('wallet_tip3') }} {{ _getConfig('_APP_EXCHANGE_NAME') }} {{ _t18('wallet_tip4') }}
        </div>
      </div> -->

      <image-load filePath="liccessfu.png" class="liccessfu"></image-load>
      <!-- <div class="btn-list" v-if="downLoadList.length">
        <image-load
          v-for="item in downLoadList"
          :key="item.path"
          :filePath="item.icon"
          class="btn-img"
          @click="tohref(item.path)"
        ></image-load>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store'
import { useRoute } from 'vue-router'
import { _t18, _getConfig } from '@/utils/public'
const mainStore = useMainStore()
/**
 * 下载列表
 */
const downLoadList = computed(() => {
  let data = []
  if (mainStore.getDownLoadList.length) {
    data = mainStore.getDownLoadList
      .map((item) => {
        return { icon: `${item.name}.png`, path: item.url, isOpen: item.isOpen }
      })
      .filter((item) => item.isOpen == 'true')
  }
  return data
})
const route = useRoute()
const showFlag = ref(route.query.flag)
const tohref = (url) => {
  if (url !== 'noJump') {
    if (!['smartfund'].includes(__config._APP_ENV)) {
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-image: url('@/assets/download/banner.png');
  background-size: cover;

  .laod-header {
    padding: 15px;
    color: var(--ex-font-color);
    .sub-title {
      font-size: 24px;
      margin-left: 10px;
      font-weight: 600;
    }
    .title {
      font-weight: 600;
      font-size: 30px;
      text-align: center;
      margin: 50px auto 50px;
      
     
    }
    .tips {
      text-align: center;
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 20px;
    }
    .tipsdet {
      padding: 2px 5px;
      font-weight: 700;
      font-size: 14px;
      > :last-child {
        margin-left: 15px;
      }
    }
    .liccessfu {
      width: 276px;
      height: 328px;
      display: block;
      margin: 50px auto;
    }
    .btn-list {
      padding: 0 20px;
      display: flex;
      justify-content: center;
      .btn-img {
        width: 116px;
        height: 35px;
        margin: 0 7px;
      }
    }
  }
}
.logo {
  width: 45px;
  height: 45px;
  border-radius: 10px;
}
</style>
