<script setup>
import Download from './components/DownLoad/Down.vue'
import rxceDownload from './components/DownLoad/Rxec.vue'

// 切换组件
const currentComponent = computed(() => {
  if (['rxce'].includes(__config._APP_ENV)) {
    return rxceDownload
  } else {
    return Download
  }
})
</script>
<template>
  <!--下载中心-->
  <component :is="currentComponent"></component>
</template>

<style lang="scss" scoped></style>
