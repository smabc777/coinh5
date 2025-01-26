<template>
  <div class="container">
    <!-- <div class="title"  style="text-align:center">
      <div class="left">{{ _t18('pledge_title',['gridai']) }}</div>
    </div> -->
    <!-- <div class="title" v-else>
      <div class="left">{{ _getConfig('_APP_META_TITLE').toUpperCase() }}</div>
      <div class="middle">Pledge</div>
      <div class="right">Mining</div>
    </div> -->
    <!-- <div class="sub_title" v-if="['gridai'].includes(_getConfig('_APP_META_TITLE'))" style="text-align:center">{{ _t18('pledge_info',['gridai']) }}</div>
    <div class="sub_title" v-else>Ultra high yield One click DeFi</div> -->
    <div class="introduce" v-if="['gridai'].includes(_getConfig('_APP_META_TITLE'))">
      {{_t18('pledge_content',['gridai'])}}
    </div>
    <div class="introduce" v-else>
      {{ _getConfig('_APP_META_TITLE').toUpperCase() }} provides comprehensive digital assets A global user ecosystem based on decentralization
      Smart contract technology
    </div>
  </div>
</template>

<script setup>

import {_getConfig} from "@/utils/public";
</script>

<style lang="scss" scoped>
.container{
  .title{
    font-size: 31px;
    font-weight: 600;
    color: var(--ex--home-grid-text-color);
    line-height: 47px;
    display: flex;
    justify-content: center;
    .middle{
      margin: 0 15px;
      color: var(--ex-primary-color);
    }
  }
  .sub_title{
    font-size: 24px;
    font-weight: 500;
    color: var(--ex--home-grid-text-color);
    line-height: 36px;
    display: flex;
    justify-content: center;
  }
  .introduce{
    font-size: 13px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: var(--ex--home-grid-text-color);
    line-height: 18px;
    padding: 0 15px;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
