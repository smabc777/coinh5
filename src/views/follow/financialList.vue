<!-- Defi挖矿 -->
<template>
  <div class="follow">
    <HeaderBar :currentName="_t18('follow_order')" :border_bottom="false"></HeaderBar>
    <FinancialList :itemObj="resData"> </FinancialList>
  </div>
</template>
<script setup>
import FinancialList from './components/FinancialList.vue'
import { getFinancialList } from '@/api/followOrder/index'

const resData = ref([])
const getFinancialListAction = async () => {
  let res = await getFinancialList()
  if (res.code == 200) {
    resData.value = res.rows
  } else {
    showToast(res.msg)
  }
}
onMounted(() => {
  getFinancialListAction()
})
</script>

<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
}
</style>
