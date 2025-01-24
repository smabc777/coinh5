<template>
  <div class="header">
    <div @click.prevent="openList">
      <!--侧边栏-->
      <Logo :openTo="false" />
    </div>
    <div class="right">
      <svg-load
          name="notify"
          class="rightImg"
          @click="dispatchCustomEvent('event_serviceChange')"
      ></svg-load>
      <svg-load name="search" class="rightImg" @click="$router.push('/quote')"></svg-load>
      <!--      <svg-load name="list" class="rightImg" @click="openList"></svg-load>-->
    </div>
  </div>
</template>
<script setup>
import {inject} from 'vue'
import {dispatchCustomEvent} from '@/utils/index'
import Logo from '@/components/common/Logo/index.vue'

const openList = inject('setSidebarShow')




</script>
<style lang="scss" scoped>
.header {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .leftImg {
    width: 34px;
    height: 33px;
  }

  .right {
    .rightImg {
      width: 36px;
      height: 36px;
      margin-left: 16px;
    }
  }
}
</style>
