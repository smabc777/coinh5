<template>
  <!-- 首页头部   -->
  <div class="NavBar">

    <!-- logo  -->
    <div class="NavBar-left" @click="setSidebarShow">
      <div class="menu" v-if="['cmmetrics', 'smartfund'].includes(_getConfig('_APP_ENV'))">
        <svg-load name="menu"></svg-load>
      </div>
      <!-- 侧边栏菜单 -->
      <Logo v-else></Logo>
    </div>

    <div class="NavBar-center" v-if="_getConfig('_APP_ENV').includes('smartfund')">
      <img :src="`/resource/images/defi/smartfund.png?${_APP_VERSION}`" loading="lazy" class="" />
    </div>

    <div class="NavBar-right">
      <!-- 客服 -->
      <div v-if="!['smartfund'].includes(_getConfig('_APP_ENV'))" class="news"
        @click="dispatchCustomEvent('event_serviceChange')">
        <svg-load :name="['cmmetrics'].includes(_getConfig('_APP_ENV')) ? 'news' : 'news2'">
        </svg-load>
        <div v-if="!_getConfig('_APP_ENV').includes('cmmetrics')" class="mark"></div>
      </div>

      <div class="menu" v-else @click="supportShow">
        <van-icon size="24" name="envelop-o" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import Logo from '@/components/common/Logo/index.vue'
import { dispatchCustomEvent } from "@/utils";
import { _getConfig } from "@/utils/public";
import { showDialog } from "vant";
import { useToast } from "@/hook/useToast";

const { _showName } = useToast()
const _APP_ENV = __config._APP_ENV?.toUpperCase()

// 弹出菜单
const setSidebarShow = inject('setSidebarShow')

const supportShow = () => {
  showDialog({
    teleport: '#app',
    className: 'support',
    allowHtml: true,
    confirmButtonText: _showName('btnConfirm'),
    message: `<p>support@eu-smartfund.com </p>
              <p>service@eu-smartfund.com</p>
              <p>ai-center@eu-smartfund.com</p>
              <p>business@eu-smartfund.com</p>
              <p>finances@eu-smartfund.com</p>
              `,
  }).then(() => {
    // on close
  })
}
</script>

<style scoped lang="scss">
.NavBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  // width: 100vw;
  max-width: var(--ex-max-width);

  .NavBar-content {
    img {
      width: 75px;
      height: 26px;
    }
  }

  .NavBar-left {
    position: relative;
    display: flex;

    .menu {
      transform: rotate(180deg);
      margin-right: 6px;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }

  .NavBar-center {
    //position: relative;
    //left: -33%;

    img {
      height: 30px;
      -o-object-fit: contain;
      object-fit: contain;
      display: flex;
      animation-name: mymove;
      animation-direction: alternate;
      animation-timing-function: ease-in-out;
      animation-delay: 0s;
      animation-iteration-count: infinite;
      animation-duration: 1.5s;

      @keyframes mymove {
        from {
          width: 110px
        }

        to {
          width: 120px;
        }
      }

      @-webkit-keyframes mymove

      /* Safari and Chrome */
        {
        from {
          width: 110px
        }

        to {
          width: 120px;
        }
      }
    }
  }

  .NavBar-right {
    display: flex;

    .news {
      //margin-right: 14px;
      position: relative;

      .mark {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #FF6058;
      }
    }

    .menu {
      color: var(--ex-default-font-color);
      ;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
