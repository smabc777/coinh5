<template>
  <div class="placeholder" v-if="topHeight"></div>
  <van-sticky>
    <header
      :class="[border_bottom ? 'border_bottom' : '']"
      :style="{ 'background-color': bgColor }"
    >
      <div class="left">
        <!--左侧返回-->
        <van-icon
          name="arrow-left"
          color="var(--ex-default-font)"
          class="leftImg fw-bold"
          size="20"
          @click="toUrl"
        />
        <!--标题-->
        <slot name="titleName"></slot>
      </div>
      <div  class="content">
        <!--标题-->
        <slot name="content"></slot>
      </div>
      <div class="right" >
        <div class="rightBtn" v-if="JSON.stringify(cuttentRight) !== '{}'">
          <div v-if="cuttentRight.name" @click="linkTo">
            {{ cuttentRight.name }}
          </div>
          <image-load
            v-if="cuttentRight.icon"
            :filePath="cuttentRight.icon"
            class="rightBtnImg"
            @click="linkTo"
          />

          <div
            class="iconRightList"
            v-show="cuttentRight.iconRight"
            v-for="(item, index) in cuttentRight.iconRight"
            :key="index"
          >
            <svg-load
              v-if="item.iconName"
              :name="item.iconName"
              class="rightIcon"
              @click="handelClick(item.clickTo)"
              :style="{ fontSize: item.iconSize }"
            ></svg-load>
            <span v-if="item.name" class="name" @click="handelClick(item.clickTo)">{{
              item.name
            }}</span>
          </div>
        </div>
        <slot name="footer"></slot>
      </div>
    </header>
  </van-sticky>
</template>
<script setup>
import { dispatchCustomEvent } from '@/utils'
import { useRouter } from 'vue-router'
import { _back } from '@/utils/public'

const router = useRouter()
const props = defineProps({
  backTo: {
    type: String
  },
  //子组件接收父组件传递过来的值
  backwardNum: {
    type: Number,
    default: -1
  },
  currentName: {
    type: String,
    default: ''
  },
  cuttentRight: {
    type: Object,
    default: {}
  },
  border_bottom: {
    type: Boolean,
    default: false
  },
  topHeight: {
    type: Boolean,
    default: true
  },
  bgColor: {
    type: String,
    default: 'var(--ex-default-background-color)'
  },
  isCenter: {
    type: Boolean,
    default: false
  }
})
// 自定义返回跳转
const toUrl = () => {
  if (props.backTo) {
    return router.push(props.backTo)
  }
  if (props.backwardNum != -1) {
    return router.go(props.backwardNum)
  }
  _back()
}

const emit = defineEmits(['linkTo', 'showPopup', 'del'])
const linkTo = () => {
  emit('linkTo')
}
const showPopup = () => {
  emit('showPopup')
}
let handelClick = (item) => {
  if (item == 'event_serviceChange') {
    dispatchCustomEvent('event_serviceChange')
  } else if (item == 'del') {
    emit('del')
  } else if (item) {
    router.push(item)
  } else {
    showPopup()
  }
}
</script>
<style lang="scss" scoped>
.placeholder {
  height: 61px;
}

header.border_bottom {
  border-bottom: 1px solid var(--ex-border-color);
}

header {
  position: fixed;
  top: 0;
  width: 100%;
  max-width: var(--ex-max-width);
  display: flex;
  height: 60px;
  padding: 0 15px;
  align-items: center;
  background-color: var(--ex-default-background-color);
  // border-bottom:1px solid var(--ex-home-top-border-color) !important;
  z-index: 99;

  justify-content: space-between;
  .left {
    min-width:30px;

    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: normal;
    color: var(--ex-default-font-color);
    div {
      font-size: 16px;
    }

    .leftImg {
      margin-right: 15px;
    }
  }

  .content{
    flex: 1;
    justify-content: center;
    overflow: hidden;


  }
  .right {
    min-width: 30px;

    .rightBtn {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: var(--ex-font-color9);
      font-size: 14px;
      .iconRightList {
        line-height: normal;
        display: flex;
        align-items: center;
      }

      .rightBtnImg {
        width: 28px;
        height: 28px;
      }

      .rightIcon {
        margin-left: 20px;
        font-size: 16px;
      }

      .name {
        margin-left: 4px;
        font-size: 14px;
        color: var(--ex-text-color);
      }
    }
  }
}

.centerStyle {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
