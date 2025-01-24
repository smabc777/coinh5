<!-- Defi挖矿 -->
<template>
  <HeaderBar :currentName="_t18('AI Follow')" :border_bottom="false"></HeaderBar>
  <div class="follow">
        <div class="viewHeader">
            <span>Aiの総収入</span>
            <span>1.693297 USD </span>
        </div>
        <div class="viewContent">
            <p > 
              <span>所得：</span><span> <span class="amountSpan">1.693297</span> USD </span>
            </p>
            <p>
               <span>2024-05-26</span><span class="viewSpan"> 詳細を見る> </span>
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
    padding: 10px 10px 20px  10px;
    >p{
      font-size:15px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      text-align: center;
      margin-top: 15px;
    }
    .amountSpan{
      color:rgba(37, 167, 80, 1);
    }
    .viewSpan{
      color: rgba(97, 58, 241, 1);
    }
  }


}

</style>
