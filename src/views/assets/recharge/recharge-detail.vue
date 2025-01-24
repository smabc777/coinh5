<!-- 充值详情 -->
<template>
  <HeaderBar :currentName="_t18('recharge_detail')" :cuttentRight="cuttentRight"></HeaderBar>
  <OrderAmount :data="data"></OrderAmount>
  <RechargeInfo :data="data"></RechargeInfo>
</template>
  
  <script setup>
import { _t18 } from '@/utils/public'
import { getRechargeDetail } from '@/api/account'
import OrderAmount from '../components/record/OrderAmount.vue'
import RechargeInfo from './components/RechargeInfo.vue'

const route = useRoute()
const cuttentRight = reactive({
  iconRight: [{ iconName: 'kefu', clickTo: 'event_serviceChange' }]
})
const data = ref({})
const id = route.query.id
const getDetail = () => {
  getRechargeDetail(id).then((res) => {
    if (res.code == '200') {
      data.value = res.data
    }
  })
}
getDetail()
</script>
  
  <style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}
</style>
  