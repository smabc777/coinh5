<!-- 首页 -->
<script setup>
import { ref, toRefs, defineProps, defineEmits } from 'vue'
import { _toFixed, _formattedAmount } from '@/utils/decimal'
const emit = defineEmits(['clickEvent'])
import { _t18 } from '@/utils/public'

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
  isShow: {
    type: Number,
    default: 1
  },
  isLock: {
    type: Number,
    default: 1
  }
})
function clickItem() {
  emit('clickEvent', props.stockList)
}
</script>

<template>
  <div class="stock-item" v-if="isShow">
    <div class="item-text flex-ct">
      <div class="info-l">
        <div class="">{{ stockList.originalName }}</div>
        <div>
          <van-tag class="tags">{{ stockList.stockType }}</van-tag>{{ stockList.stockCode }}
        </div>
      </div>
      <div class="info-c">
        <div>
          {{ _formattedAmount(stockList.nowPrice) }}
        </div>
        <div v-if="infoFlag && oldPrice">{{ _toFixed(stockList.open_px, 2) }}</div>
      </div>
      <div class="info-r">
        <div :class="stockList.hcrateRate < 0 ? 'gree' : 'redd'">
          {{ stockList.hcrateRate > 0 ? '+' + stockList.hcrateRate : stockList.hcrateRate }}
        </div>
        <div v-if="infoFlag">{{ _toFixed(stockList.hcrate, 2) }}</div>
      </div>
      <div class="item-btn" v-if="isLock" @click="clickItem()">{{ _t18('tradeIn_1') }}</div>
      <div class="item-btn lock" v-else>{{ _t18('vipFundrgising_3') }}</div>
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
    >div {
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
      width: 10%;
    }

    .info-c {
      width: 10%;
    }

    .info-l {
      width: 45%;

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

      div:nth-child(2) {
        color: #aaaaaa;
      }
    }

    .item-btn {
      padding: 3px 14px;
      border-radius: 3px;
      font-size: 14px;
      color: var(--ex-output-table-font-color);
      background: var(--ex-box-shadow);
    }

    .lock {
      background: #999;
    }
  }
}

.public-item:nth-child(1) {
  margin-top: 0;
}

.tags {
  background: #ef3037;
  margin-right: 4px;
}
</style>
