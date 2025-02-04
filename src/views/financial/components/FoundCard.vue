<template>
  <div class="item">
    <div class="item-header">
      <div class="header-top">
        <div class="top-info">
          <img src="@/assets/financial/coin.png" class="coinImg" />
          <div class="title">{{ itemObj.title }}</div>
          <!-- 普通和增值没有 -->
          <div class="vip" v-if="itemObj.classify !== '0' && itemObj.classify !== '2'">
            VIP{{ itemObj.level }}
          </div>
        </div>
        <div class="join" @click="$router.push(`/financialDetails/${itemObj.id}`)">
          {{ _t18(`vote_now`) }}
        </div>
      </div>
      <div class="header-bottom">
        <div class="income-item">
          <div>{{ _t18('defi_rule_fzywk_tab3') }}</div>
          <div>{{ itemObj.avgRate }}%</div>
        </div>
        <img src="@/assets/financial/WaveLine.png" class="rightImg" />
      </div>
    </div>

    <div class="item-body">
      <!-- 起投金额 -->
      <div class="row-item">
        <div class="row-label">{{ _t18(`starting-amount`) }}：</div>
        <div class="row-value">
          {{ itemObj.limitMin }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
        </div>
      </div>
      <!-- 限投金额： -->
      <div class="row-item">
        <div class="row-label">{{ _t18(`Investment_Limit`) }}：</div>
        <div class="row-value">
          {{ itemObj.limitMax }} {{ itemObj.coin ? itemObj.coin.toUpperCase() : '' }}
        </div>
      </div>
      <!-- 锁仓天数： -->
      <div class="row-item">
        <div class="row-label">{{ _t18(`Lock-up_days`) }}：</div>
        <div class="num">{{ itemObj.days }}</div>
      </div>
      <div class="line">
        <div class="hight" :style="{ width: `${itemObj.process}%` }"></div>
      </div>
      <div class="row-item">
        <div class="row-label">{{ _t18(`project_progress`) }}：</div>
        <div class="row-value">{{ itemObj.process }}%</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
</script>
<style lang="scss" scoped>
.item {
  border-radius: 5px;
  // background: var(--ex--home-grid-bg);
  margin-bottom: 22px;
  padding: 20px 14px;
  box-sizing: border-box;
  border:1px solid var(--ex--backup-background-color-2);
  box-shadow:0px 0.08rem 0.16rem 0.026667rem var(--ex-box-shadow);
  .item-header {
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .top-info {
        display: flex;
        align-items: center;
        .coinImg {
          width: 35px;
          height: 35px;
        }
        .title {
          font-weight: 500;
          font-size: 15px;
          margin: 0 6px 0 8px;
        }
        .vip {
          padding: 2px 4px;
          background: var(--ex-financial-vip-bg-color);
          color: var(--ex-financial-vip-font-bg-color);
          font-size: 12px;
          border-radius: 4px;
          opacity: 0.5;
        }
      }
      .join {
        margin-left: 5px;
        padding: 8px;
        min-width: 76px;
        background: var(--ex-primary-color);
        border-radius: 8px;
        color: var(--ex-font-color);
        font-size: 12px;
        text-align: center;
      }
    }
    .header-bottom {
      margin: 24px 0 14px 0;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--ex-border-line);
      .income-item {
        :nth-child(1) {
          font-weight: 500;
          font-size: 13px;
          color: var(--ex-passive-font-color);
        }
        :nth-child(2) {
          font-weight: 600;
          font-size: 17px;
          margin-top: 4px;
          color: var(--ex-financial-adorn-bg-color);
        }
      }
      .rightImg {
        width: 101px;
        height: 24px;
        height: 50px;
      }
    }
  }
  .item-body {
    .row-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      .row-label {
        color: var(--ex-passive-font-color);
        display: flex;
        font-size: 13px;
      }
      :nth-child(2) {
        font-size: 14px;
        font-weight: 400;
      }
      .row-value {
        color: #000;
      }
      // .num {
      //   color: var(--ex-financial-num-bg-color);
      // }
    }
    .line {
      margin-top: 14px;
      height: 6px;
      // background: var(--ex-div-bgColor3);

      background: var(--ex-card-deep-bg-color);
      border-radius: 5px;
      .hight {
        height: 4px;
        background: var(--ex-financial-adorn-bg-color);
        border-radius: 5px;
      }
    }
  }
}
</style>
