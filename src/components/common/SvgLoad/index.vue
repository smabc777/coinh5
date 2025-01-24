<!-- 加载 svg-->
<script setup name="svg-load">
const props = defineProps({
  /**
   * 名称
   */
  name: {type: String, default: ''},
  /**
   * 定制平台
   */
  platform: {type: Array, default: () => []}
})
/**
 * 是否 平台定制
 */
const isCustomized = computed(() => props.platform.includes(__config._APP_ENV))
/**
 * 资源路径
 */
const path = computed(() => {
  let tempPath = ''

  if (props?.name == null) return ''

  if (props.name.includes('http')) {
    tempPath = `${props.name}?${_APP_VERSION}`
    // tempPath = `${props.name?.replace(
    //     'https://echo-res.oss-cn-hongkong.aliyuncs.com',
    //     __config._STATIC_API
    // )}?${_APP_VERSION}`

  } else if (props.name) {
    if (isCustomized.value) {
      tempPath = `/resource/svg/${__theme}/${__config._APP_ENV}/${props.name}.svg?${_APP_VERSION}`
    } else {
      tempPath = `/resource/svg/${__theme}/${props.name}.svg?${_APP_VERSION}`
    }
  }
  return tempPath
})
</script>
<template>
  <img :src="path" class="icon"/>
</template>
<style lang="scss" scoped>
img{
  width: 1em;
  height: 1em;
}
</style>
