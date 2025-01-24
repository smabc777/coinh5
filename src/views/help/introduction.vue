<template>
  <!-- 交易所简介 -->
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar
      :currentName="
        ['gridai','smartfund'].includes(_getConfig('_APP_ENV'))
          ? _t18(`sidebar_regulatory_certificate`,'smartfund')
          : _t18(`sidebar_introduction`)
      "
      :cuttentRight="cuttentRight"
      :border_bottom="true"
    ></HeaderBar>
    <!--内容-->
    <div class="itemDetailObj" v-html="currentHtml"></div>
    <Nodata v-if="!currentHtml"></Nodata>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'

const cuttentRight = {
  iconRight: [{ iconName: 'kefu', iconSize: '20px', clickTo: 'event_serviceChange' }]
}
import { rulesList } from '@/api/common/index'

const currentHtml = ref(null)
onMounted(async () => {
  try {
    const res = await rulesList('EXCHANGE_INTRODUCTION')
    if (res.code === 200) {
      currentHtml.value = res.data[0].content
    }
  } catch (error) {}
})
</script>
<style>
.itemDetailObj {
  font-size: 12px;
  padding: 10px 15px;
  color: var(--ex-default-font-color);
  line-height: 24px;
  word-wrap: break-word;
}

.itemDetailObj img {
  width: 100%;
}
</style>
<style>
.itemDetailObj p span {
  color: var(--ex-default-font-color) !important;
}
</style>
