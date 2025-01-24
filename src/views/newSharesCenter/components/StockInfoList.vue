<!-- 首页 -->
<script setup>
import { ref, toRefs, defineProps, toRef } from 'vue'

import { _toFixed } from '@/utils/decimal'
const props = defineProps({
  //子组件接收父组件传递过来的值
  stockList: {
    type: Object,
    default: {}
  },
  infoFlag: {
    type: Boolean,
    default: true
  },
  oldPrice: {
    type: Boolean,
    default: true
  },
  hasLine: {
    type: Boolean,
    default: true
  },
  newRight: {
    type: Boolean,
    default: false
  },
  tagInfo: {
    type: Object,
    default: {}
  }

  // codeColor: {
  //   type: String,
  //   default: '#000'
  // },
  // valueColor: {
  //   type: String,
  //   default: '#000'
  // }
})
</script>

<template>
  <div class="stock-item">
    <div class="item-text flex-ct">
      <div :class="hasLine ? 'info-l' : ''">
        <div class="text-ellipsis">{{ stockList.name }}</div>

        <div class="flex-row align-center">
          <van-tag
            class="tag"
            v-if="tagInfo.text"
            :color="tagInfo.color"
            :text-color="tagInfo.textColor"
            >{{ tagInfo.text }}</van-tag
          >
          <div>{{ stockList.gid }}</div>
        </div>
      </div>
      <div class="info-c">
        <div :class="stockList.hcrate < 0 ? 'gree' : 'redd'">
          {{ _toFixed(stockList.nowPrice || 0, 2) }}
        </div>
        <!-- <div v-if="infoFlag && oldPrice" :style="{color:valueColor}">{{ _toFixed(stockList.open_px, 2) }}</div> -->
      </div>
      <div class="info-r" v-if="newRight">
        <div class="gree">
          {{ stockList.nowPrice1 }}
        </div>
      </div>
      <div class="info-r" v-else>
        <div :class="stockList.hcrate < 0 ? 'gree' : 'redd'">
          {{ stockList.hcrate > 0 ? '+' + stockList.hcrateRate : stockList.hcrateRate }}%
        </div>
        <div :class="stockList.hcrate < 0 ? 'gree' : 'redd'" v-if="infoFlag">
          {{ stockList.hcrate > 0 ? '+' + stockList.hcrate : stockList.hcrate }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.stock-item {
  width: 100%;
  padding-left: 6px;
  position: relative;
  margin-top: 16px;
  align-items: center;

  .item-text {
    .tag {
      padding: 0 5px;
      margin-right: 4px;
      margin-top: 6px;

      height: 12px;
    }

    > div {
      width: 33.3%;

      div:nth-child(2) {
        margin-top: 6px;
        font-size: 12px;
      }
    }

    div {
      font-weight: 500;
      font-size: 14px;
    }

    .info-r {
      text-align: right;
    }

    .info-c {
      width: 30%;
      text-align: center;
    }

    .info-l {
      width: 40%;

      div:nth-child(1) {
        font-size: 15px;
      }

      div:nth-child(1)::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 0;
        width: 2px;
        height: 15px;
        background: var(--stock-left) !important;
      }
    }
  }
}

.public-item:nth-child(1) {
  margin-top: 0;
}
</style>
