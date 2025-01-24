<template>
  <div class="container">
    <div class="title" v-if="['gridai'].includes(_getConfig('_APP_ENV'))" style="text-align:center">
      <div class="left" >AIartificial intelligence</div>
    </div>
    <div class="title" v-else>
      <div class="left" >{{ _getConfig('_APP_ENV').toUpperCase() }}</div>
      <div class="right">DeFi</div>
    </div>
    <div class="sub_title" v-if="['gridai'].includes(_getConfig('_APP_ENV'))">{{_t18('defi_info')}}</div>
    <div class="sub_title" v-else>Ultra high yield One click DeFi</div>
    <div class="introduce" v-if="['gridai'].includes(_getConfig('_APP_ENV'))">
      {{_t18('defi_info2')}}
    </div>
    <div class="introduce" v-else>
      {{ _getConfig('_APP_ENV').toUpperCase() }} provides comprehensive digital assets A global user ecosystem based on decentralization
      Smart contract technology
    </div>
    <div class="banner">
      <image-load filePath="defi/defibg.png" name="defi"></image-load>
    </div>
  </div>
</template>

<script setup>
console.log(['gridai'].includes(_getConfig('_APP_ENV')));
import {_getConfig} from "@/utils/public";
</script>

<style lang="scss" scoped>
.container{
  .title{
    font-size: 37px;
    font-weight: 600;
    color: var(--ex-font-color);
    line-height: 47px;
    display: flex;
    justify-content: center;
    .right{
      margin-left: 15px;
      color: var(--ex-primary-color);
    }
  }
  .sub_title{
    font-size: 24px;
    font-weight: 500;
    color: var(--ex-font-color);
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
  }
  .banner {
    margin-top: 30px;
    padding: 0 15px;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
