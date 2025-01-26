<template>
  <div class="content content-box">
    <div class="laod-header">
      <HeaderBar
        :currentName="_t18('download_center')"
        v-if="showFlag"
        :bgColor="'rgb(255 255 255 / 0%)'"
      ></HeaderBar>
      <div class="sub-title">{{ _getConfig('_APP_META_TITLE').toUpperCase() }} {{ _t18('dev-platform','smartfund') }}</div>
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
    <div class="load-section">
      <div class="title">{{ _t18('world_product') }}</div>
      <div class="item-body">
        <div class="row-item">
          <img src="@/assets/download/d1.png" class="" />
          <div>{{ _t18('decentralized_operations') }}</div>
        </div>
        <div class="row-item">
          <img src="@/assets/download/d2.png" class="" />
          <div>{{ _t18('data_trustworthy') }}</div>
        </div>
        <div class="row-item">
          <img src="@/assets/download/d3.png" class="" />
          <div>{{ _t18('regulatory_protection') }}</div>
        </div>
        <div class="row-item">
          <img src="@/assets/download/d4.png" class="" />
          <div>{{ _t18('diversified_empowerment') }}</div>
        </div>
      </div>
      <div class="subtitle">{{ _t18('trusted_partners') }}</div>
      <img src="@/assets/download/footer.png" class="footerImg" />
    </div>
  </div>
</template>
<script setup>
import { useMainStore } from '@/store'
import { useRoute } from 'vue-router'
import {_getConfig} from "@/utils/public";
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
  if(url!=='noJump'){
    if (!['smartfund'].includes(__config._APP_ENV)){
      window.open(url)
    }

  }
}
</script>
<style lang="scss" scoped>
.content {
  // min-height: 100vh;
  width: 100%;
  box-sizing: border-box;

  .laod-header {
    // background-image: url('@/assets/download/banner.png');
    //height: 390px;
    padding-bottom: 30px;
    background-size: cover;
    color: var(--ex-home-tabs-text-atv-color);
    .sub-title {
      color: var(--ex-home-tabs-text-atv-color);
      text-align: center;
      font-size: 40px;
      margin: 80px 0 0;
    }
    .btn-list {
      padding: 0 20px;
      margin-top: 126px;
      display: flex;
      justify-content: space-between;
      .btn-img {
        width: 142px;
        height: 50px;
      }
    }
  }
  .load-section {

    padding: 30px 15px;
    padding-top: 0;
    .title {
      text-align: center;
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 28px;
    }
    .item-body {
      display: grid;
      grid-template-columns: 48% 48%;
      grid-column-gap: 4%;
      grid-row-gap: 4%;
      .row-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px 0;
        background: #edeffa;
        border-radius: 10px;
        img {
          width: 40px;
          height: 40px;
        }
        div {
          text-align: center;
          margin-top: 6px;
          font-size: 13px;
        }
      }
    }
    .subtitle {
      font-size: 15px;
      font-weight: 400;
      color: #ffffff;
      margin: 50px 0 30px;
      text-align: center;
    }
    .footerImg {
      height: 77px;
      object-fit: contain;
      width: 100%;
    }
  }
}
</style>
