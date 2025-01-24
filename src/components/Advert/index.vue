<template>
  <!-- 合作伙伴 partner -->
  <div class="partner">
    <div class="tit fw-bold">{{ _t18('defi_ho_tit7') }}</div>
    <div class="imgs">
      <p v-for="(item, index) in imgList" :key="index">
        <image-load :filePath="`defi/${item.name}.png`" name="defi"></image-load>
      </p>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
const imgList = computed(() => {
  let tempList = [
    { name: 'trustwallet' },
    { name: 'imtoken' },
    { name: 'metamask' },
    { name: 'tokenpocket' },
    { name: 'defibox' },
    { name: 'coinbase' },
    { name: 'gate' },
    { name: 'bitkeep' },
    { name: 'debank' },
    { name: 'crypto' },
    { name: 'binance' },
    { name: 'bifrost' }
  ]

  return tempList
})
</script>

<style lang="scss" scoped>
.partner {
  .fw-bold {
    font-size: 16px;
  }
  .imgs {
    margin: 15px 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    p {
      padding: 5px 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--ex-div-bgColor17);
      border-radius: 3px;
      margin-bottom: 15px;
      img {
        height: 28px;
        width: auto;
      }
    }
    & > p:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
