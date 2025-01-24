<template>
  <!-- 首页通知栏 -->
  <div class="notice">
    <div class="itemNo">
      <svg-load name="notice" class="noticeImg"></svg-load>
      <van-notice-bar
          :color="textColor"
          class="currentNotice"
          :text="text"
      />
    </div>
  </div>
</template>

<script setup>
import {useMainStore} from '@/store/index'

const mainStore = useMainStore()
const isActivated = ref(false)

//返回公告数据
const text = computed(() => mainStore.settingNotice.ROLL_NOTICE?.[0]?.noticeContent)
const textColor = computed(() => mainStore.settingNotice.ROLL_NOTICE?.[0]?.remark)


// onMounted(()=>{
//   isActivated.value = true
//   //获取公告
//   mainStore.getSettingNotice()
// })

//每次进入缓存页面获取数据
onActivated(()=>{
  // if (isActivated.value){
  console.log('获取公告')
    //获取公告
    mainStore.getSettingNotice()
  // }
})
</script>

<style scoped lang="scss">

.notice {
  margin-top: 16px;
  padding: 0 16px;

  .itemNo {
    display: flex;
    padding: 2px 16px;
    align-items: center;
    background: var(--ex-home-notice-bgcolor);
    border-radius: 12px;

    .noticeImg {
      width: 20px;
      height: 20px;
    }

    :deep(.van-notice-bar) {
      font-size: 13px;
    }

    .currentNotice {
      flex: 1;
      border-radius: 20px 20px 20px 20px;
      font-size: 14px;
      padding-right: 0;
      color: var(--ex-home-notice-color);
      background: var(--ex-home-notice-bgcolor);
    }
  }
}
</style>
