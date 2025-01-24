<script setup>
import SimulateBar from '@/components/SimulateBar/index.vue'
import { storeToRefs } from 'pinia'
import {useUserStore} from "@/store/user";
import {computed} from "vue";
import { priceFormat} from "@/utils/decimal";
import { _t18, _numberWithCommas} from '@/utils/public.js'
const userStore = useUserStore()
// 用户余额信息
const { asset } = storeToRefs(userStore)
// 计算账户余额
const amountSum = computed(() => {
  let sum = 0
  for (let i = 0; i < asset.value.length; i++) {
    sum += Number(priceFormat(asset.value[i].exchageAmount))
  }
  return priceFormat(sum)
})
</script>

<template>
  <!--  模拟交易-->
  <SimulateBar></SimulateBar>
  <div class="summary">
    <div class="unit_name">
      <div class="name">{{ _t18('simulated_asset') }}</div>
      <div class="unit">
        USDT
<!--        <svg-load name="jiantou10x5-x" class="img"></svg-load>-->
      </div>
    </div>
    <div class="numerical">{{_numberWithCommas(amountSum)}}</div>
  </div>
</template>

<style scoped lang="scss">
.summary{
  height: 92px;
  margin: 6px 15px 15px 15px;
  background-color: var(--ex--backup-background-color-2);
  border-radius: 5px;
  padding:10px;
  .unit_name{
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .name{
      font-size: 14px;
      color: var(--ex-default-font-color-light);
    }
    .unit{
      font-size: 16px;
      color: var(--ex-default-font-color-light);
      .img{
        width: 10px;
        height: 5px;
        margin-left: 5px;
      }
    }
  }
  .numerical{
    font-size: 22px;
    font-weight: 700;
    color: var(--ex-default-font-color-light);
    font-family: "DINOT-Medium";
  }
}
</style>
