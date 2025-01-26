<template>
  <!--  首页宫格区-->
  <div class="grid">
    <van-grid :column-num="4">
      <van-grid-item class="grid-item" v-for="(item, index) in menuList" :key="index"
        @click="routeLink(item.linkUrl, item)">
        <image-load :filePath="item.imgUrl" :name="item.img" class="grid-img" />
        <p class="grid-text" v-if="['Defi', 'defi_host_lockup', 'host_non-collateralized_mining'].includes(item.key)">
          {{ _t18(`${item.key}`, ['moonex']) }}
        </p>
        <p class="grid-text" v-else-if="['promotion_center'].includes(item.key)">
          {{ _t18(`${item.key}`, ['moonex', 'strike']) }}
        </p>
        <p class="grid-text" v-else>
          {{ _t18(`${item.key}`) }}
        </p>

      </van-grid-item>
    </van-grid>
  </div>

  <div class="quick-trade">
    <!--    充值    -->
    <div class="quick-trade-item" @click="_toView('/recharge')">
      <image-load class="quick-trade-item-img" filePath="recharge.png"></image-load>
      <span class="quick-trade-item-span"> {{ _t18(`quick_recharge`, ['smartfund', 'vitc', 'moonex']) }} </span>
      <image-load ref="itemNext" class="quick-trade-item-img2" filePath="next.png"></image-load>
    </div>
    <!--    提现    -->
    <div class="quick-trade-item" @click="_toView('/withdraw')">
      <image-load class="quick-trade-item-img" filePath="withdraw.png"></image-load>
      <span class="quick-trade-item-span"> {{ _t18(`quick_withdrawal`, ['smartfund', 'vitc', 'moonex']) }} </span>
      <image-load ref="itemNext" class="quick-trade-item-img2" filePath="next.png"></image-load>
    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store/index'
import { useRouter } from 'vue-router'
import { _t18, _toView, _getConfig } from '@/utils/public'
import { gsap } from 'gsap'
import { dispatchCustomEvent } from '@/utils';
import { onMounted } from 'vue';
import { useUserStore } from '@/store/user/index.js'

const userStore = useUserStore()
const mainStore = useMainStore()
const $router = useRouter()


onMounted(() => {
  // 宫格动画
  gsap.from('.grid-item', {
    opacity: 0, //透明度
    scale: 0.1, //缩放大小
    stagger: 0.1, //执行间隔
    duration: 0.22, //执行时间
    ease: 'power1.inOut' //流畅显示类型
  })
  //快捷充值/提币动画
  //箭头图标
  gsap.from('.quick-trade-item-img2', {
    xPercent: -300,
    opacity: 0.5,
    duration: 1,
    ease: 'power1.inOut'
  })
  //文字
  gsap.from('.quick-trade-item-span', {
    yPercent: 300,
    opacity: 0.5,
    duration: 1,
    ease: 'power1.inOut'
  })
})

//宫格数据
// DeFi挖矿 质押挖矿 助力货 闪兑 下载中心 推广中心 秒合约 理财 申购 直播 福利活动
const menuList = computed(() => mainStore.getJinGangList.filter((item) => item.isOpen == true))
// 宫格跳转
const routeLink = (link, item) => {
  if (['cmmetrics'].includes(_getConfig('_APP_ENV'))) {
    if (item.name == "在线客服") {
      location.href = userStore.service.url
      return
    }
  }

  // 直播弹窗
  if (link === 'live') {
    // ....
  } else if (link === '/trade') {
    // 跳转交易
    mainStore.setTradeStatus(Number(0))
    $router.push(link)
  } else if (link.includes('http')) {
    // 跳转外链
    location.href = link
  } else if (link == 'customer_service') {
    //触发客服弹窗
    dispatchCustomEvent('event_serviceChange')
  } else {
    console.log('121212','1212',link);
    
    // 跳转页面
    $router.push(link)
  }
}
onMounted(() => {
})
</script>

<style scoped lang="scss">
.quick-trade {
  margin-top: 8px;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  overflow: hidden;

  .quick-trade-item {
    position: relative;
    width: 167px;
    background: var(--ex--home-grid-bg);
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 14px;

    span {
      color: var(--ex--home-grid-text-color);
      font-size: 15px;

    }

    .quick-trade-item-img {
      width: 48px;
      height: 50px;
      margin-right: 10px;
    }

    .quick-trade-item-img2 {
      width: 22px;
      height: 22px;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.grid {
  padding: 0 10px;
  padding-top: 24px;

  :deep(.van-hairline--top:after) {
    border: none;
    content: none;
  }

  :deep(.grid-item) {
    .van-grid-item__content {
      padding-bottom: 16px;
      padding-top: 0;
      justify-content: flex-start;
    }

    .van-grid-item__content:after {
      content: none;
    }

    .grid-img {
      width: 26px;
      height: 26px;
      margin-bottom: 14px;
    }

    .grid-text {
      text-align: center;
      font-size: 13px;
      word-break: break-word;
      color: var(--ex--home-grid-text-color);
    }
  }
}
</style>
