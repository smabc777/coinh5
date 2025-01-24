<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('AI Follow')" :border_bottom="false"></HeaderBar>
  <div class="follow">
        <div class="viewHeader">
            <span>Aiの総収入</span>
            <span>1.693297 USD </span>
        </div>
        <div class="viewContent">
            <p> 
              <span>USDT数量</span><span>取引日</span><span>所得</span>
            </p>
            <p v-for="item  in 12"> 
              <span>1.98919</span><span>09:00:00</span><span>0.369496</span>
            </p>
        </div>
  </div>
</template>
<script setup>


</script>
<style lang="scss" scoped>
.follow {
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 10px;

  > div {
    width: 96%;
    margin: 0 auto;
  }
  .viewHeader{
    display: flex;
    flex-direction: column;
    text-align: center;
    span{
         font-size:16px;
         margin-top:15px;
    }
    >span:nth-child(1){

      color: #B9C1D9;
   
    }

  }
  .viewContent{
    background-color:rgba(22, 26, 51, 1);
    margin: 20px auto;
    width:90%;
    border-radius:15px;
    min-height: 300px;
    padding: 10px 0 20px  0;
    >p{
      font-size:15px;
      display: flex;
      justify-content: space-around;
      align-content: center;
      text-align: center;
      margin-top: 15px;
      span{
        display: block;
        width:33%;
      }
    }
     >p:nth-child(1){
      margin-top: 20px;
    }
  }


}

</style>
