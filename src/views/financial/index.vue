<!-- 理财 -->
<template>

  <div class="financial">
    <HeaderBar v-if="$route.query.menu" :currentName="_t18('stock84')" :border_bottom="false"></HeaderBar>
    <LogoHeader v-else></LogoHeader>
    <Header></Header>
    <FundList></FundList>
  </div>
  <!-- 左侧菜单弹窗 -->
  <SideBar></SideBar>
</template>
<script setup>
import LogoHeader from '@/components/LogoHeader/index.vue'
import SideBar from '@/views/home/components/Sidebar/index.vue'
import Header from './components/Header.vue'
import FundList from './components/FundList.vue'
// 左侧菜单弹出
const sidebarShow = ref(false)
const setSidebarShow = () => {
  sidebarShow.value = true
}
// 暴露到子孙组件
provide('sidebarShow', sidebarShow)
provide('setSidebarShow', setSidebarShow)
</script>

<script>
//页面缓存需要name
export default {
  name: 'Financial',
}
</script>
<style lang="scss" scoped>
.financial {
  height: 100vh;
  overflow-y: scroll;
}
</style>
