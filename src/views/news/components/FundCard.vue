<template>
  <div class="cardList">
    <div class="cardItem" v-for=" item in 10">

      <span>美国议员寻求废除SEC的一项加密货币会计准则 料拜登将动用否决权</span>
      <span>2014-05-18 08:00:09</span>
      <div class="imgItem">
        <van-image width="100%" height="100%" fit="fill"
          src="https://img1.baidu.com/it/u=2805082804,1873088762&fm=253&fmt=auto&app=138&f=JPEG?w=1172&h=500" />

      </div>
      <span>
        <span><svg t="1716484280937" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="3272" width="20" height="20">
            <path
              d="M500.736 962.048a21.568 21.568 0 0 1-15.36-6.4l-359.36-364.8C44.736 509.632 0 412.928 0 318.592 0 166.272 101.12 64 251.712 64c129.472 0 180.736 57.536 249.024 137.792C569.024 121.536 620.352 64 749.76 64c150.592 0 251.776 102.336 251.776 254.592 0 94.336-44.8 191.04-126.08 272.384L516.16 955.52a21.632 21.632 0 0 1-15.36 6.464"
              fill="#000000" p-id="3273"></path>
          </svg></span>
        <span>
          已阅读人数
        </span>
      </span>
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
.cardList {
  padding: 0.2rem 0.4rem;
}


.cardItem {
  height: 280px;
  background-color: #252a4d;
  box-sizing: border-box;
  margin-top: 0.5rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px 0 10px;
}



.cardItem>span {
  display: block;
}

.imgItem {
  width: 100%;
  margin: 0 auto;
}

.cardItem span:nth-child(1) {
  height: 50px;
  font-size: 14px;
}

.cardItem span:nth-child(2),
.cardItem span:nth-child(4) {
  font-size: 14px;
  color: #9493AC;
  height: 20px;
}

.cardItem span:nth-child(4) {
  display: flex;
  flex-direction: row;
  margin-top: 15px;
  justify-content: space-between;
}
</style>
