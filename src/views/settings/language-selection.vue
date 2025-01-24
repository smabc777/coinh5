<template>
  <div class="bind-card">
    <!-- 导航条 -->
    <HeaderBar :currentName="_t18('sidebar_language')" :cuttentRight="cuttentRight"></HeaderBar>
    <!--内容-->
    <div class="content">
      <!-- 选择语言 -->
      <!-- <div>{{$t('sidebar_language_title')}}</div> -->
      <!-- <div>{{ _t18('sidebar_language') }}</div> -->
      <van-radio-group v-model="language">
        <van-radio
          shape="square"
          v-for="(item, index) in languageList"
          :name="item.dictValue"
          :key="index"
          label-position="left"
          checked-color="var(--van-primary-color)"
          @click="mainStore.setLanguage(item.dictValue)"
        >
          <image-load :filePath="item.imgUrl" alt="" width="20" class="nation" v-if="item.imgUrl" />
          <svg-load v-else :name="item.dictValue" class="nation"></svg-load>
          {{ item.remark }}
          <template #icon="props">
            <svg-load :name="props.checked ? 'gou-yuyan' : 'gou-yuyanno'"></svg-load>
          </template>
        </van-radio>
      </van-radio-group>
    </div>
  </div>
</template>
<script setup>
import { useMainStore } from '@/store/index'
import { computed } from 'vue'
import { _t18 } from '@/utils/public'

const mainStore = useMainStore()

//导航
const cuttentRight = { iconRight: [{ iconName: 'kefu',iconSize:'20px',  clickTo: 'event_serviceChange' }] }

//当前语言
const language = computed(() => mainStore.language)
const languageList = computed(() => mainStore.languageList)
console.log(languageList)
</script>
<style lang="scss" scoped>
* {
  color: var(--ex-default-font-color);
}
.content {
  padding: 15px;
  text-align: left;
  & > div {
    font-size: 16px;
  }
  .van-radio {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 10px 0;
    :deep(.van-radio__label) {
      font-size: 14px;
      color: var(--ex-default-font-color);
    }
  }
  .nation {
    font-size: 24px;
    margin-right: 20px;
  }
}
</style>
