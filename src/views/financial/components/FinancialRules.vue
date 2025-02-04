<template>
  <div class="rules">
    <div class="item">{{ proRules ? proRules : _t18(`No_introductionyet`) }}</div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  proRules: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.rules {
  padding: 20px 15px;
  background: var(--ex-financial-card-bg-color);
  border-radius: 8px;
  border-bottom:1px solid var(--ex--backup-background-color-2);


  .item {
    font-size: 12px;
    color: var(--ex-passive-font-color);
  }
}
</style>
