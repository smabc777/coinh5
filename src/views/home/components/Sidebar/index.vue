<template>
  <!-- 左侧弹出菜单 -->
  <van-popup v-model:show="sidebarShow" teleport="#app" position="left" safe-area-inset-top safe-area-inset-bottom
    lock-scroll lazy-render close-on-popstate :style="{ position: 'absolute', width: '64%', height: '100vh' }">
    <div class="home-sidebar">

      <div class="Sidebar-content">
        <!-- 当前用户/登录/注册按钮 -->
        <User></User>
        <!-- 菜单列表 -->
        <List></List>
      </div>
    </div>

  </van-popup>

  <div class="home-sidebar-loginOut"></div>
</template>

<script setup>
import { inject } from "vue";
import User from "./components/User.vue";
import List from "./components/List.vue";
import PublicPopup from "@/components/Popup/public.vue";
//菜单show数据
const sidebarShow = inject('sidebarShow')
</script>

<style lang="scss" scoped>
.van-popup {
  &:after {
    position: absolute;
    top: 40%;
    content: ' ';
    width: 100%;
    height: 309px;
    background: linear-gradient(39deg, #CB4EE8 0%, #10F4B1 100%);
    opacity: 0.14;
    filter: blur(33px);
  }

  .home-sidebar {
    height: 100%;
    padding-top: 84px;
    // background: var(--ex-default-background-color);

    .Sidebar-content {
      position: relative;
      z-index: 1;
    }
  }


}

.home-sidebar-loginOut {
  :deep(.loginOut-dialog) {

    //.van-dialog__cancel{
    //background: var(--ex-div-bgColor);
    //}
    .van-dialog__message {
      color: var(--ex-default-font-color);
    }

    .van-button__text {
      color: var(--ex-font-color);
    }

  }

}
</style>
