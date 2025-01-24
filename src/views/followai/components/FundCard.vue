<template>
  <div class="followItemContert">
    <div class="followItemContertList">
      <P>产品名称</P>
      <P>策略员</P>
      <P>盈利</P>

    </div>
    <div class="followItemContertList" v-for="item in itemObj">
      <div>
        <van-image round width="1rem" height="1rem" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg" />
      </div>
      <div>{{item.userName}}</div>
      <div class="followItemContertListTips">
        <span>
        {{ item.grandTotalProfitRate }}USD</span>
      
      
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
.followItemContertList {
  width: 96%;
  margin: 0 auto;
  border-bottom: 1px solid #D0DAD5;
  height: 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.followItemContertListTips {
  text-align: center;
  display: flex;
  flex-direction: column;
}

.followItemContert>div:last-child {
  border: 0;
}
</style>
