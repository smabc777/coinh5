<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('AI Follow')" :border_bottom="false"></HeaderBar>
  <div class="follow">
    <van-tabs
      v-model:active="active"
      swipeable
      @change="onTabChange"
      title-active-color="rgba(97, 58, 241, 1)"
      title-inactive-color="white"
      line-width="16%"
      line-height="1.5px"
    >
      <van-tab title="All Orders">
        <OrderView :itemObj="resData"></OrderView>
      </van-tab>
      <van-tab title="In Progress">
        <OrderView :itemObj="resData"></OrderView>
      </van-tab>
      <van-tab title="Completed">
        <OrderView :itemObj="resData"></OrderView>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import OrderView from './components/OrderView.vue'
import { financialOrder } from '@/api/followOrder/index'
import { onMounted } from 'vue'
const active = ref('')
const activeNum = ref('')
const resData = ref([''])

const financialOrderAction = async () => {
  let res = await financialOrder(activeNum.value)
  if (res.code == 200) {
    resData.value = res.rows
    console.log(resData.value, 'wwwwww')
  } else {
    showToast(res.msg)
  }
}
const onTabChange = (name) => {
  console.log(name, 'nmnnn')
  if (name === 0) {
    activeNum.value = '' // All Orders tab
  } else {
    activeNum.value = name - 1
  }
  console.log(activeNum.value, 'acccc')
  financialOrderAction()
}
onMounted(() => {
  financialOrderAction()
})
</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;
}
:deep(.van-tabs__line) {
  padding-top: 2px;
  color: rgba(97, 58, 241, 1) !important;
  background: rgba(97, 58, 241, 1) !important;
}
:deep(.van-tab__text) {
  font-size: 14px;
}
</style>
