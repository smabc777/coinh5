<template>

  <!--  <div class="upsAndDowns">-->
  <!--    &lt;!&ndash; 看涨 看跌 &ndash;&gt;-->
  <!--    <div class="ups item" @click="setPublicPopupShow(1)">-->
  <!--      {{ _t18(`option_buy_up`) }}-->
  <!--    </div>-->
  <!--    <div class="downs item" @click="setPublicPopupShow(0)">-->
  <!--      {{ _t18(`option_buy_short`) }}-->
  <!--    </div>-->
  <!--  </div>-->

  <!-- 看涨 看跌 弹窗 -->
  <PublicPopups ref="PublicPopupRef"></PublicPopups>

  <!-- 订单倒计时 结算 -->
  <OverlayPulic ref="OverlayPulicRef"></OverlayPulic>
</template>

<script setup>
import { _t18 } from "@/utils/public";
import PublicPopups from "./components/PublicPopup/index.vue";
import OverlayPulic from "./components/OverlayPulic/index.vue";
import { provide } from "vue";
import { useTradeStore } from "@/store/trade";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user";

const tradeStore = useTradeStore()
const $route = useRoute()
const userStore = useUserStore()

//看跌 看跌 弹窗
const PublicPopupRef = ref(null)
//订单倒计时 结算
const OverlayPulicRef = ref(null)
const setOverlayPulic = async (data) => {
  //提交订单成功 -- 数据传输到订单倒计时/订单结算
  await nextTick()
  OverlayPulicRef.value.setOverlayPulicShow(data)
}
provide('setOverlayPulic', setOverlayPulic)

const setPublicPopupShow = (key) => {
  // console.log('---------', PublicPopupRef.value.setPublicPopupShow(key))
  // PublicPopupRef.value?.setPublicPopupShow(key)
}



</script>

<style scoped lang="scss">
.upsAndDowns {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  background: var(--ex-default-background-color);

  .item {
    min-width: 153px;
    padding: 12px 10px;
    font-size: 15px;
    border-radius: 8px;
    text-align: center;
    color: #fff;
  }

  .ups {
    background: var(--ex-trade-buy-bg-color);
  }

  .downs {
    background: var(--ex-trade-Sell-bg-color);

  }
}
</style>
