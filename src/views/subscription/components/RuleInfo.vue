<template>
  <!-- 预约规则 -->
  <div>
    <p class="title fw-bold">{{ _t18('product_rules') }}</p>
    <div class="info">
      <p>{{ _t18('Reservation_limit') }}</p>
      <p>{{ purchaseLimit || 0 }}</p>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  purchaseLimit: {
    type: Number
  }
})
</script>

<style lang="scss" scoped>
* {
  color: var(--ex-home-list-ftcolor2);
}
.title {
  font-size: 16px;
  color: var(--ex-default-font-color);
}
.info {
  margin-top: 20px;
  border-radius: 5px;
  background: var(--ex-financial-card-bg-color);
  padding: 20px 14px;
  box-sizing: border-box;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  :nth-child(2) {
    color: var(--ex-default-font-color);
  }
}
</style>
