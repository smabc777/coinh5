<template>
  <div class="followItemContertList" v-for="item in itemObj">
    <div>
      <van-image round width="1.5rem" height="1.5rem" fit="cover" :src="item.avatar" />
    </div>
    <div>{{item.userName}}</div>
    <div class="followItemContertListTips">
       <p> {{ item.buyAmount }} </p>
            <p>{{ (item.profitRate.toFixed(2) * 100) }}%</p>
      
    </div>

  </div>
</template>
<script setup>
import { _t18 } from '@/utils/public'
const props = defineProps({
  itemObj: {
    type: Object,
    default: {}
  },
  personType: {
    type: Boolean,
    default:true
  }
})

</script>
<style lang="scss" scoped>
.followItemContertList {
  width: 100%;
  margin: 10px auto;
  border: 1px solid rgba(43, 44, 88, 1);
  background: rgba(22, 26, 51, 1);
  border-radius: 10px;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;

}
  .followItemContertList>div:nth-child(2){

    width:30%;
    overflow: hidden;
  }
  .followItemContertList>div:nth-child(3){
    width:50%;
  }

.followItemContertListTips {
  text-align: center;

}
.followItemContertListTips>P:last-child {
  color: green;
}
</style>
