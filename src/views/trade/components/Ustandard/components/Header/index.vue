<template>
  <div>
    <div class="top">
      <div class="first">
        <!-- 打开弹窗 -->
        <div class="firLeft" @click="QuoteSidebarRef.setQuoteSidebarData(3,false)">
          <svg-load name="cebian17x14" class="firLeftImg"></svg-load>
          <div class="fw-bold">{{ coinInfo.showSymbol }}</div>
        </div>
        <!-- U本位规则-->
        <div class="first">
          <svg-load name="k-xian" class="senLeftImg"
            @click="$router.push(`/tradeDetail?symbol=${coinInfo.coin}&type=3`)"></svg-load>
          <svg-load v-if="!['cmmetrics'].includes(_getConfig('_APP_ENV'))" name="guize" class="senLeftImg"
            @click="_toView('/tradingRules?type=3')"></svg-load>
        </div>
      </div>
    </div>

    <!--侧边栏 当前行情-->
    <QuoteSidebar ref="QuoteSidebarRef"></QuoteSidebar>
  </div>
</template>
<script setup>

import QuoteSidebar from '@/views/trade/components/Common/QuoteSidebar/index.vue'
import { useMainStore } from '@/store/index.js'
import { _toView } from "@/utils/public";

const mainStore = useMainStore()

//当前币种数据
const coinInfo = inject('coinInfo')

//行情侧边栏
const QuoteSidebarRef = ref(null)

</script>
<style lang="scss" scoped>
.top {
  padding: 8px 14px;
  z-index: 9;
  background: var(--ex--backup-background-color-2);
  border-radius: 8px;

  .first {
    display: flex;
    justify-content: space-between;

    .firLeft {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: var(--ex-default-font-color);

      div {
        line-height: normal;
        display: flex;
        align-items: center;
      }

      .firLeftImg {
        width: 17px;
        height: 14px;
        margin-right: 10px;
      }

      .firNum {
        font-size: 14px;
        margin-left: 10px;
      }
    }

    .senLeftImg {
      margin-left: 10px;
      display: block;
      width: 24px;
      height: 24px;
    }
  }

  .second {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 10px;

    .secondLeft {
      font-size: 36px;
      font-weight: bold;
      color: var(--ex-font-color10);

      >* {
        transition: 0.3s;
      }

      .secondLeftB {
        font-size: 14px;
        margin-top: 5px;
      }
    }

    .secondRight {
      .secondItem {
        display: flex;
        align-items: center;
        padding: 6px 0;
        font-size: 14px;
        justify-content: space-between;

        .itemL {
          color: var(--ex-passive-font-color);
          margin-right: 10px;
        }

        .itemR {
          color: var(--ex-default-font-color);
        }
      }
    }
  }

  .third {
    margin-top: 20px;

    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .thirdLeft {
        display: flex;
        font-size: 14px;
        color: var(--ex-default-font-color);

        .item {
          margin-right: 30px;
        }
      }

      .thirdRight {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: var(--ex-font-color9);

        .thirdRightImg {
          width: 10px;
          height: 6px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
