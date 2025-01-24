<!-- 规则弹窗 -->
<script setup>
import Nodata from '@/components/Nodata/index.vue'
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  close: {
    type: Boolean,
    default: true
  },
  title: {
    type: String
  },
  content: {
    type: Object
  },
  direction: {
    type: String,
    default: 'center'
  }
})

let emit = defineEmits(['handelClose'])
const handelClose = () => {
  emit('handelClose', false)
}
</script>

<template>
  <div>
    <van-popup
      v-model:show="props.show"
      round
      :closeable="close"
      :transition-appear="true"
      @click-overlay="handelClose"
      :position="direction"
      @close="handelClose"
    >
      <div class="popup">
        <!-- 标题 -->
        <p class="popupTitle">{{ title }}</p>
        <!-- 关闭按钮 -->
        <!-- <svg-load class="closeSvg" name="guanbi" v-if="close" @click="handelClose"></svg-load> -->
        <!-- 内容 仅适用于规则/说明-->
        <div v-if="content.length && content[0].isShow != 2">
          <div class="popupContent">
            <div v-html="content[0].content" class="content1"></div>
          </div>
        </div>
        <Nodata v-else></Nodata>
      </div>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  display: flex;
  width: 100%;
  flex-direction: column;
  position: relative;
  background: var(--ex-default-background-color);
  > * {
    font-size: 14px;
  }
  & > p {
    font-size: 18px;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
  .closeSvg {
    font-size: 24px;
    position: absolute;
    top: 15px;
    right: 20px;
  }
  .popupTitle {
    color: var(--ex-default-font-color);
  }
  & > div {
    padding-top: 50px;
  }
  .popupContent {
    padding: 10px 15px;
    .content1 {
      font-size: 12px;
      padding: 10px 15px;
      color: var(--ex-default-font-color);
      line-height: 24px;
      word-wrap: break-word;
    }
  }
}
:deep(.van-popup--bottom) {
  max-width: var(--ex-max-width);
  max-height: 80%;
  margin: auto;
  left: 0;
  right: 0;
}
:deep(.van-popup) {
  max-width: var(--ex-max-width);
}
</style>
<style>
.content1 p span {
  color: var(--ex-default-font-color) !important;
}
</style>
