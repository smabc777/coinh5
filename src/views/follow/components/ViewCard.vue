<template>
  <div class="cardBox">
    <p class="cardTitle textCenter">多维度的投资和交易策略</p>
    <p class="cardContent textCenter">允许交易者在几秒钟内通过多个外汇交易系统同时买入和卖出。 我们将所有广泛使用的外汇交易集中在一个网站上，Al GPT 7*24小时自动高频交易，订单以最优惠的价格快速买入和卖出。 </p>
    <p class="cardTitle textCenter"> 彻底改变人工智能后续交易 </p>
    <p class="subtitle textCenter"> 比手动交易赚取更多利润</p>
    <div>
      <div>
        <p>63092</p>
        <p>参与者</p>
      </div>
      <div>
        <p>$263,902,231</p>
        <p>用户利益</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})

</script>
<style lang="scss" scoped>
.cardTitle {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--ex-default-font-color);
  margin-top: 15px;
}
.cardContent {
  text-indent: 2em;
  font-weight: 400;
  font-size: 12px;
  color: var(--ex-font-color32);
  line-height: 20px;
  margin-top: 10px;
}
.subtitle {
  font-weight: 400;
  font-size: 12px;
  margin-top: 10px;
  color: var(--ex-text-color);
}
.cardBox {
  > div {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;

    > div {
      margin-top: 15px;
      width: 48%;
      height: 80px;
      border-radius: 10px; // 添加圆角
      position: relative; // 设置定位为相对定位
      overflow: hidden; // 隐藏超出容器的内容
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background-color: transparent; // 设置背景色为透明
      box-shadow: inset 0 0 0 1px var(--ex-border-color12), inset 0 0 0 2px var(--ex-border-color13); // 使用内阴影模拟渐变边框

      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        z-index: -1;
        border-radius: 10px;
        background: transparent;
        box-shadow: 0 0 0 1px var(--ex-border-color12), 0 0 0 2px var(--ex-border-color13); // 使用外阴影为边框添加一层渐变色
      }
    }
  }
}

.textCenter {
  text-align: center;
}
</style>
