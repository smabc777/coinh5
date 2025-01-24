<template>
  <div class="followItemContertList" v-for="item in itemObj" @click="handleCardClick(item)">
    <div>
      <van-image
        round
        width="1rem"
        height="1rem"
        fit="cover"
        src="https://img.yzcdn.cn/vant/cat.jpeg"
      />
    </div>
    <div>KMDKTYN</div>
    <div class="followItemContertListTips">
      <p>48%</p>
      <p>{{ item.prodectIntroduction }}</p>
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
.followItemContertList {
  width: 100%;
  margin: 0 auto;
  border-bottom: 1px solid #d0dad5;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.followItemContertListTips {
  text-align: center;
}

.followItemContert > div:last-child {
  border: 0;
}
</style>
