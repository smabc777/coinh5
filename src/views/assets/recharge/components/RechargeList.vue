<!-- 充值币种列表 -->
<template>
  <div class="content">
    <div class="list">
      <div class="listCoin" v-for="(item, index) in props.data" :key="index" @click="toClick(item)">
        <div class="left">
          <svg-load :name="item.icon" class="coin"></svg-load>
          <span>{{ item.title }}</span>
        </div>
        <div class="right">
          <van-icon name="arrow" size="16" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { _t18 } from '@/utils/public'

import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  data: {
    type: Array,
    default: []
  }
})

const flag = ref(true)
console.log(props)
const toClick = (item) => {
  // cred添加银行卡充值  跳转客服
  console.log(item,'.....')
  // return
  if (item.isMCS == true) {
    if(item.icon == 'card'){
      router.push(`/recharge-apply?type=${item.title}&coin=${item.icon}&isMCS=${item.isMCS}`)
    }else{
      router.push(`/recharge-thb?type=${item.title}&coin=${item.icon}&isMCS=${item.isMCS}`)
    }
  } else{
    router.push(`/recharge-apply?type=${item.title}&coin=${item.icon}`)
  }

  // if (item.isMCS == true) {
  //     router.push(`/recharge-apply?type=${item.title}&coin=${item.icon}&isMCS=${item.isMCS}`)
  // } else{
  //   if(item.icon == 'thb'){
  //     router.push(`/recharge-thb?type=${item.title}&coin=${item.icon}`)
  //   }else{
  //     router.push(`/recharge-apply?type=${item.title}&coin=${item.icon}`)
  //   }
  // }

}
</script>

<style lang="scss" scoped>
* {
  font-size: 14px;
  color: var(--ex-default-font-color);
}

.content {
  padding: 15px 16px 0;

  p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: left;
  }

  .list {
    .listCoin {
      margin-bottom: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left,
      .right {
        display: flex;
        align-items: center;

        .coin {
          font-size: 28px;
          margin-right: 8px;
        }

        span {
          font-size: 15px;
        }

        .jiantou {
          // font-size: 10px;
        }
      }
    }
  }
}
</style>