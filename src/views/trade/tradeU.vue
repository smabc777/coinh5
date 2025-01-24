<template>
  <!--  U本位-主页面-->
  <div id="tradeU">
    <!-- :currentName="_t18('trade_tab5',['bydfe','smartfund','vitc'])" -->

    <HeaderBar
      :currentName="_t18('stock102')"

      :cuttentRight="cuttentRight"
      @showPopup="showPopup"
  ></HeaderBar>
    <!--  U本位  -->
    <Ustandard></Ustandard>
  </div>
</template>

<script setup>
  import Ustandard from './components/Ustandard/index.vue'
  localStorage.setItem('tradeKey','Ustandard')
</script>
<script>
export default {
  name:'Trade_tab5'
}
</script>


<style lang="scss" scoped>
#tradeU {
  //padding: 0 16px;
  //padding-top: 20px;
  //padding-bottom: 10px;
}

</style>
