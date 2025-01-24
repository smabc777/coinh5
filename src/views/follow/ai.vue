<!-- Defi挖矿 -->
<template>
  <div class="follow">
    <HeaderBar :currentName="_t18('follow_order')" :border_bottom="false"></HeaderBar>
    <FundCard> </FundCard>
  </div>
</template>
<script setup>
import FundCard from '../follow copy/components/FundCard.vue'
</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
}
</style>
