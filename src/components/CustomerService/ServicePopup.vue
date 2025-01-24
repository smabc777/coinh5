<template>
  <div>
    <van-popup v-model:show="show" @close="close" position="bottom">
      <div class="popup-content">
        <div class="title">
          <!-- 在线客服 -->
          {{ _t18('home_service') }}
        </div>
        <div class="scroll-container">
          <div class="item-list">
            <div class="item" v-for="(item, index) in data" :key="index" @click="toWin(item.url)">
              <image-load :filePath="item.imgUrl" class="img" alt="Customer Service"/>
            </div>
          </div>
        </div>
        <div class="cancel" @click="close">
          <!-- 取消 -->
          {{ _t18('cancel') }}
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup>
import {_t18} from '@/utils/public'
import {useRouter} from 'vue-router'
import {useMainStore} from "@/store";

const router = useRouter()
const mainStroe = useMainStore()

//数据
const show = ref(false)
const data = computed(() => mainStroe.getCustomerServiceList)

//显示客服弹窗
const SetServicePopup = () => {
  show.value = true
}
defineExpose({SetServicePopup})
/**
 * 跳转客服页面
 * @param {*} href
 */
const toWin = (href) => {
  if (href) {
    /* if (['gmmoin', 'rxce', 'coinsexpto'].includes(__config._APP_ENV)) {
      location.href = href
    } else {
      router.push(`/service?url=${encodeURIComponent(href)}`)
    } */
    location.href = href
  }
}
const close = () => {
  show.value = false
}
</script>
<style lang="scss" scoped>
:deep(.van-popup) {
  width: 100%;
  background: var(--ex-default-background-color);
  border-radius: 10px 10px 0px 0px;
  padding: 20px 0 10px;

  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 18px;
      color: var(--ex-default-font-color);
      text-align: center;
    }

    .scroll-container {
      margin: 20px 0;
      width: 100%;
      overflow-x: auto;
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      &::-webkit-scrollbar {
        display: none;
      }

      .item-list {
        padding: 0 20px;
        display: flex;
        gap: 20px;
      }

      .item {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        background-color: var(--ex-div-bgColor28);

        .img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
    }

    .cancel {
      height: 50px;
      border-top: 1px solid var(--ex-input-boder-bgColor);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }
}
</style>
