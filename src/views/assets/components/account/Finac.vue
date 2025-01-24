<template>
  <div class="account-content">
    <Amount
      :amount="showNum ? amountSum : _hide(amountSum)"
      @handleYanjin="handleYanjin"
      @handleShuaxin="handleShuaxin"
      :keyStr="keyStr"
      :showicon="showNum ? 'yanjin-k' : 'yanjin-g'"
    ></Amount>
    <!-- 理财 -->
    <div class="account-list">
      <Detail :assetDetails="assetDetails" :showNum="showNum"></Detail>

    </div>
  </div>
</template>

<script setup>
import { _hide } from '@/utils/public.js'
import Amount from './Amount.vue'
import Detail from './AmountDetail.vue'
const props = defineProps({
  assetDetails: {
    type: Object
  },
  amountSum: {
    type: String
  },
  showNum: {
    type: Boolean
  },
  keyStr: {
    type: String
  }
})
// 点击小眼睛
const emit = defineEmits(['handleYanjin', 'handleShuaxin'])
const handleYanjin = () => {
  emit('handleYanjin')
}
const handleShuaxin = () => {
  emit('handleShuaxin')
}
</script>

<style lang="scss" scoped>
.account-content{
  min-height:calc(100vh - 70px);
  overflow: auto;
  display: flex;
  flex-direction: column;

  .account-list{
    flex-grow: 1;
    padding-bottom: 70px;
    background: var(--ex-financial-card-bg-color);
  }
}
</style>
