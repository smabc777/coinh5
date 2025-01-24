<template>
<!--  币币交易-主页面-->
  <div id="tradeBB">
    <BBTrading></BBTrading>
  </div>
</template>
<script setup>
import BBTrading from './components/BBTrading/index.vue'

</script>
<script>
export default {
  name:'TradeBB'
}
</script>
<style scoped lang="scss">
#tradeBB {
  padding: 0 16px;
  //padding-top: 20px;
  padding-bottom: 94px;
}

</style>
