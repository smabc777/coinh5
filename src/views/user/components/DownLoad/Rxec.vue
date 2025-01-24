<template>
  <div class="container content-box">
    <div class="laod-header">
      <HeaderBar
        :currentName="_t18('download_center')"
        v-if="showFlag"
        :bgColor="'rgb(255 255 255 / 0%)'"
      ></HeaderBar>

      <div class="sub-title">{{ _getConfig('_APP_ENV').toUpperCase() }} {{ _t18('dev-platform','smartfund') }}</div>
      <div class="erweima-info">
        <div class="erweima">
          <QRCode :address="address"></QRCode>
        </div>
        <div class="info">{{ _t18('scan_qrcode_download') }}</div>
      </div>
    </div>
    <div class="btn-list" v-if="downLoadList.length">
      <image-load
        v-for="item in downLoadList"
        :key="item.path"
        :filePath="item.icon"
        class="btn-img"
        @click="handleClick(item.path)"
      ></image-load>
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
import { onMounted } from 'vue'
import QRCode from '@/components/common/QRCode/index.vue'
import { useMainStore } from '@/store'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getPlatform } from '@/utils/index'
import { _t18 } from '@/utils/public'
import HeaderBar from '@/components/HeaderBar/index.vue'

const mainStore = useMainStore()
/**
 * 下载列表
 */
const downLoadList = computed(() => {
  let data = []
  if (mainStore.getDownLoadList.length) {
    data = mainStore.getDownLoadList
        .map((item) => {
          return {
            icon: `${item.name}.png`,
            path: item.url,
            isOpen: item.isOpen,
            name: item.name,
            label: item.name === 'android' ? `${_t18('android_download')}` : `${_t18('ios_download')}`
          }
        })
        .filter((item) => item.isOpen == 'true')
  }
  return data
})
const route = useRoute()
const showFlag = ref(route.query.flag)

/**
 * 下载地址
 */
const address = ref('')
const handleClick = (url) => {
  address.value = url
  if(!['smartfund'].includes(__config._APP_ENV)){
    window.open(url)
  }
}

onMounted(() => {
  const platform = getPlatform()
  let downloadUrl = downLoadList.value?.find((item) => item.name === 'android')?.path
  if (platform === 'IOS') {
    downloadUrl = downLoadList.value?.find((item) => item.name === 'apple')?.path
  }
  address.value = downloadUrl
})
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .laod-header {
    background-image: url('@/assets/download/banner.png');
    height: 390px;
    background-size: contain;
    color: var(--ex-home-tabs-text-atv-color);
    .sub-title {
      color: var(--ex-home-tabs-text-atv-color);
      text-align: center;
      font-size: 40px;
      margin: 80px 0 0;
    }
    .erweima-info {
      margin-top: 30px;
      .erweima {
        padding: 10px;
        background: transparent;
        margin: 0 auto;
      }
      .info {
        font-size: 14px;
        margin: 20px 0;
        text-align: center;
      }
    }
  }
  .btn-list {
    padding: 0 20px;
    margin-top: 100px;
    display: flex;
    justify-content: space-between;
    .btn-img {
      width: 142px;
      height: 50px;
    }
  }
  .load-section {
    padding: 30px 15px;
    .title {
      text-align: center;
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 28px;
    }
    .item-body {
      display: grid;
      grid-template-columns: 166px 166px;
      grid-column-gap: 11px;
      grid-row-gap: 11px;
      .row-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 18px 0;
        background: #161a33;
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
      width: 344px;
      height: 77px;
    }
  }
}
</style>
