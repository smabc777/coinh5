<!-- 平台Logo -->
<script setup name="img-load">
import { computed } from 'vue'
import { _toView } from '@/utils/public.js'
import { useMainStore } from '@/store/index'
const mainStroe = useMainStore()


const props = defineProps({
  /**
   * 是否跳转首页
   */
  openTo: {type: Boolean, default: true},

})

const toView = (path) => {
  props.openTo && _toView(path)
}

/**
 * Logo
 */
const path = computed(() => {
  let tempPath = mainStroe.getLogoList?.logo || mainStroe.getLogoList?.logoD
  if (!tempPath) {
      tempPath = `/platform/${__config._APP_ENV}/logo.png?${_APP_VERSION}`
  }
  return tempPath
})
</script>
<template>
  <img :src="path" loading="lazy" class="logo" @click="toView('/home')" />
</template>
<style lang="scss" scoped>
.logo {
  width: 30px;
  height: 30px;
}
</style>
