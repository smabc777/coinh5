<template>
  <div>
<!--福利活动-->
    <HeaderBar :currentName="currentName" />
    <div class="itemDetailObj" v-html="currentHtml"></div>
    <Nodata v-if="!currentHtml"></Nodata>
  </div>
</template>

<script setup>
import { publiceNotice } from '@/api/common/index'
import { _t18 } from '@/utils/public'
import { rulesList } from '@/api/common/index'
import { onMounted } from 'vue'
const currentHtml = ref(null)
const currentName =ref(['miraeasset'].includes(__config._APP_ENV)?_t18('miraeasset_activity'):_t18('activity'))
const getList = async (type) => {
  try {
    const res = await publiceNotice('REGISTER_WELFARE','REGISTER_WELFARE_NOTICE')
    if (res.code === 200) {
      currentHtml.value = res.data[0].noticeContent
      currentName.value = res.data[0].noticeTitle
    }
  } catch (error) {}
}
onMounted(()=>{
  getList()
})
</script>

<style lang="scss" scoped>
.itemDetailObj{
  padding: 0 16px;
  font-size: 14px;
  color: var(--ex-default-font-color);

}
</style>
