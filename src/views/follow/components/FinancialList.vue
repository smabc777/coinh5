<template>
  <div class="cardList">
    <div class="cardItem" v-for="item in itemObj" @click="handleCardClick(item)">
      <!-- <image-load class="follow-item-img" filePath="{{item.coin}}"></image-load> -->
      <van-image width="1rem" height="1rem" fit="cover" :src="item.icon" />
      <div class="cardItem-textBox">
        <span>{{ item.title }}</span>
        <span>{{ item.problem }}</span>
        <span>{{ item.prodectIntroduction }}</span>
      </div>
      <span class="quick-trade-item" filePath="next.png"> <van-icon name="arrow" /></span>
    </div>
  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  }
})
const handleCardClick = (item) => {
  let id = item.id
  router.push(`/financialView?id=${id}`)
}
</script>
<style lang="scss" scoped>
.cardItem {
  height: 110px;
  display: flex;
  align-items: center;
  background-color: #252a4d;
  box-sizing: border-box;
  border-radius: 15px;
  margin-top: 0.5rem;
}

.cardItem-textBox {
  margin-left: 10px;
  display: flex;
  height: calc(100% - 20px);
  width: calc(100% - 80px);
  flex-direction: column;
  justify-content: space-around;

  span {
    font-size: 12px;
  }
}

.quick-trade-item {
  width: 33px;
  height: 33px;
  text-align: center;
  line-height: 33px;
}

.cardItem-textBox span:nth-child(12) {
  font-size: 14px;
}

.cardItem-textBox span:nth-child(2) {
  color: #b9c1d9;
}

.follow-item-img {
  width: 58px;
  height: 60px;
  margin: 0 10px 0 10px;
}

.cardList {
  padding: 0.2rem 0.4rem;
}
</style>
